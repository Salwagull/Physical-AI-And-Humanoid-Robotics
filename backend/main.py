"""
Embedding Pipeline for RAG-based Retrieval

This module provides a complete pipeline to:
1. Crawl and extract text from a Docusaurus site
2. Generate embeddings using Cohere's API
3. Store embeddings in Qdrant for semantic search

Target URL: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/
"""

import json
import os
import sys
import time
import uuid
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

import cohere
import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

# Load environment variables from .env file
load_dotenv()

# =============================================================================
# Configuration Constants
# =============================================================================

# Docusaurus content selectors (priority order for text extraction)
CONTENT_SELECTORS = [
    "article.markdown",
    "main article",
    ".theme-doc-markdown",
    "main",
]

# Text chunking parameters
CHUNK_SIZE = 500  # characters per chunk
OVERLAP = 50  # overlap between chunks
MIN_CHUNK_SIZE = 50  # minimum characters to keep a chunk

# Qdrant collection configuration
COLLECTION_NAME = "rag_embedding"
VECTOR_SIZE = 1024  # Cohere embed-english-v3.0 output dimensions

# Cohere model configuration
COHERE_MODEL = "embed-english-v3.0"

# Retrieval configuration
TOP_K_DEFAULT = 5  # Default number of search results to return
MIN_SCORE_THRESHOLD = 0.5  # Minimum similarity score for valid results (testing)

# Sample test queries for validation
TEST_QUERIES = [
    "What is humanoid robotics?",
    "How do robots learn to walk?",
    "What sensors are used in robots?",
    "How does physical AI work?",
    "What is reinforcement learning in robotics?",
]

# =============================================================================
# Client Initialization (Lazy Loading)
# =============================================================================

_cohere_client = None
_qdrant_client = None


def get_cohere_client() -> cohere.ClientV2:
    """Get or initialize Cohere client."""
    global _cohere_client
    if _cohere_client is None:
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            raise ValueError("COHERE_API_KEY environment variable is not set")
        _cohere_client = cohere.ClientV2(api_key=api_key)
    return _cohere_client


def get_qdrant_client() -> QdrantClient:
    """Get or initialize Qdrant client."""
    global _qdrant_client
    if _qdrant_client is None:
        url = os.getenv("QDRANT_URL", "http://localhost:6333")
        api_key = os.getenv("QDRANT_API_KEY")
        if api_key:
            _qdrant_client = QdrantClient(url=url, api_key=api_key)
        else:
            _qdrant_client = QdrantClient(url=url)
    return _qdrant_client


# =============================================================================
# Pipeline Functions
# =============================================================================


def get_all_urls(base_url: str) -> list[str]:
    """
    Discover all documentation page URLs from the Docusaurus site.

    Fetches the sitemap.xml and extracts all page URLs.
    Falls back to empty list if sitemap is unavailable.

    Args:
        base_url: The base URL of the Docusaurus site

    Returns:
        List of absolute URLs to documentation pages
    """
    # Construct sitemap URL
    sitemap_url = f"{base_url.rstrip('/')}/sitemap.xml"

    try:
        # Fetch sitemap
        response = httpx.get(sitemap_url, timeout=30.0, follow_redirects=True)
        response.raise_for_status()

        # Parse XML
        root = ET.fromstring(response.text)

        # Extract all <loc> URLs (handle namespace)
        urls = []
        namespace = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        for loc in root.findall(".//ns:loc", namespace):
            url = loc.text
            if url:
                # Filter out non-page URLs (images, assets, etc.)
                if not any(ext in url.lower() for ext in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".css", ".js"]):
                    urls.append(url)

        print(f"[get_all_urls] Found {len(urls)} URLs from sitemap")
        return urls

    except httpx.HTTPStatusError as e:
        print(f"[get_all_urls] HTTP error fetching sitemap: {e}")
        return []
    except ET.ParseError as e:
        print(f"[get_all_urls] Error parsing sitemap XML: {e}")
        return []
    except Exception as e:
        print(f"[get_all_urls] Unexpected error: {e}")
        return []


def extract_text_from_url(url: str) -> str:
    """
    Fetch a page and extract clean text content.

    Targets Docusaurus-specific content areas and removes
    navigation, scripts, and other non-content elements.

    Args:
        url: The URL of the page to extract text from

    Returns:
        Cleaned text content, or empty string on error
    """
    try:
        # Fetch page
        response = httpx.get(url, timeout=30.0, follow_redirects=True)
        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.text, "lxml")

        # Remove unwanted elements
        for tag in soup.find_all(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()

        # Try content selectors in priority order
        content = None
        for selector in CONTENT_SELECTORS:
            content = soup.select_one(selector)
            if content:
                break

        # Fallback to body if no selector matched
        if not content:
            content = soup.find("body")

        if not content:
            return ""

        # Extract and clean text
        text = content.get_text(separator=" ", strip=True)

        # Normalize whitespace
        text = " ".join(text.split())

        return text

    except httpx.HTTPStatusError as e:
        print(f"[extract_text_from_url] HTTP error for {url}: {e}")
        return ""
    except Exception as e:
        print(f"[extract_text_from_url] Error extracting text from {url}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = OVERLAP) -> list[str]:
    """
    Split text into overlapping chunks for embedding.

    Uses a sliding window approach with configurable chunk size and overlap.
    Skips chunks that are too small.

    Args:
        text: The text to chunk
        chunk_size: Maximum characters per chunk (default: 500)
        overlap: Characters to overlap between chunks (default: 50)

    Returns:
        List of text chunks
    """
    if not text:
        return []

    # If text is short enough, return as single chunk
    if len(text) <= chunk_size:
        if len(text) >= MIN_CHUNK_SIZE:
            return [text]
        return []

    chunks = []
    start = 0

    while start < len(text):
        # Get chunk
        end = start + chunk_size
        chunk = text[start:end]

        # Only add if meets minimum size
        if len(chunk) >= MIN_CHUNK_SIZE:
            chunks.append(chunk)

        # Move start position with overlap
        start = end - overlap

        # Prevent infinite loop for edge cases
        if start >= len(text):
            break

    return chunks


def embed(chunks: list[str], input_type: str = "search_document") -> list[list[float]]:
    """
    Generate Cohere embeddings for text chunks.

    Uses Cohere's embed-english-v3.0 model with configurable input type.
    Implements retry logic with exponential backoff for rate limiting.

    Args:
        chunks: List of text chunks to embed
        input_type: Type of input - "search_document" for content storage,
                   "search_query" for retrieval queries (default: "search_document")

    Returns:
        List of 1024-dimensional embedding vectors
    """
    if not chunks:
        return []

    try:
        client = get_cohere_client()

        # Implement retry with exponential backoff
        max_retries = 3
        base_delay = 1.0

        for attempt in range(max_retries):
            try:
                response = client.embed(
                    texts=chunks,
                    model=COHERE_MODEL,
                    input_type=input_type,
                    embedding_types=["float"],
                )

                # Extract embeddings from response
                embeddings = response.embeddings.float_

                print(f"[embed] Generated {len(embeddings)} embeddings")
                return embeddings

            except Exception as e:
                error_str = str(e).lower()
                # Check for rate limiting
                if "rate" in error_str or "429" in error_str or "limit" in error_str:
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)
                        print(f"[embed] Rate limited, retrying in {delay}s...")
                        time.sleep(delay)
                        continue
                raise

    except ValueError as e:
        # API key not set
        print(f"[embed] Configuration error: {e}")
        return []
    except Exception as e:
        print(f"[embed] Error generating embeddings: {e}")
        return []


def create_collection(name: str = COLLECTION_NAME) -> None:
    """
    Create or verify Qdrant collection exists.

    Creates a new collection with appropriate vector configuration
    if it doesn't already exist.

    Args:
        name: Name of the collection (default: "rag_embedding")
    """
    try:
        client = get_qdrant_client()

        # Check if collection exists
        if client.collection_exists(collection_name=name):
            print(f"[create_collection] Collection '{name}' already exists")
            return

        # Create collection with vector configuration
        client.create_collection(
            collection_name=name,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )
        print(f"[create_collection] Created collection '{name}' (size={VECTOR_SIZE}, distance=COSINE)")

    except Exception as e:
        print(f"[create_collection] Error: {e}")
        raise


def save_chunk_to_qdrant(chunk: str, embedding: list[float], url: str, position: int) -> None:
    """
    Upsert a single embedding with metadata to Qdrant.

    Args:
        chunk: The text chunk content
        embedding: The 1024-dimensional embedding vector
        url: Source URL of the page
        position: Position index of chunk within the page
    """
    try:
        client = get_qdrant_client()

        # Generate unique ID for this point
        point_id = str(uuid.uuid4())

        # Create point with vector and payload
        point = PointStruct(
            id=point_id,
            vector=embedding,
            payload={
                "text": chunk,
                "url": url,
                "position": position,
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
        )

        # Upsert to collection
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=[point],
        )

    except Exception as e:
        print(f"[save_chunk_to_qdrant] Error saving chunk: {e}")


def ingest_book(base_url: str) -> None:
    """
    Main orchestration function - run the full pipeline.

    Crawls the Docusaurus site, extracts text, generates embeddings,
    and stores everything in Qdrant.

    Args:
        base_url: The base URL of the Docusaurus site to ingest
    """
    print("=" * 60)
    print("Starting Book Ingestion Pipeline")
    print(f"Target: {base_url}")
    print("=" * 60)

    # Step 1: Ensure collection exists
    print("\n[Step 1] Creating/verifying Qdrant collection...")
    create_collection()

    # Step 2: Discover all pages
    print("\n[Step 2] Discovering pages from sitemap...")
    urls = get_all_urls(base_url)

    if not urls:
        print("ERROR: No URLs found. Aborting.")
        return

    print(f"  Found {len(urls)} pages to process")

    # Step 3: Process each page
    print("\n[Step 3] Processing pages...")
    total_chunks = 0
    successful_pages = 0
    failed_pages = 0

    for i, url in enumerate(urls, 1):
        print(f"\n  Processing {i}/{len(urls)}: {url}")

        # Extract text
        text = extract_text_from_url(url)
        if not text:
            print(f"    SKIP: No text extracted")
            failed_pages += 1
            continue

        print(f"    Extracted {len(text)} characters")

        # Chunk text
        chunks = chunk_text(text)
        if not chunks:
            print(f"    SKIP: No chunks created")
            failed_pages += 1
            continue

        print(f"    Created {len(chunks)} chunks")

        # Generate embeddings
        embeddings = embed(chunks)
        if not embeddings:
            print(f"    SKIP: Failed to generate embeddings")
            failed_pages += 1
            continue

        print(f"    Generated {len(embeddings)} embeddings")

        # Store in Qdrant
        for j, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            save_chunk_to_qdrant(chunk, embedding, url, position=j)
            total_chunks += 1

        print(f"    Saved {len(embeddings)} chunks to Qdrant")
        successful_pages += 1

    # Summary
    print("\n" + "=" * 60)
    print("Ingestion Complete!")
    print("=" * 60)
    print(f"  Pages processed: {successful_pages}/{len(urls)}")
    print(f"  Pages failed: {failed_pages}")
    print(f"  Total chunks stored: {total_chunks}")
    print(f"  Collection: {COLLECTION_NAME}")
    print("=" * 60)


# =============================================================================
# Retrieval Functions
# =============================================================================


def search(query: str, top_k: int = TOP_K_DEFAULT) -> list[dict]:
    """
    Search Qdrant collection for semantically similar chunks.

    Generates a query embedding using Cohere and searches the Qdrant collection
    for the most similar stored chunks.

    Args:
        query: Natural language search query
        top_k: Number of results to return (default: 5)

    Returns:
        List of dicts with keys: text, url, position, score, created_at
        Returns empty list on error or no results
    """
    # Handle empty query
    if not query or not query.strip():
        print("[search] Empty query provided")
        return []

    try:
        # Generate query embedding using search_query input type
        query_embeddings = embed([query], input_type="search_query")

        if not query_embeddings:
            print("[search] Failed to generate query embedding")
            return []

        query_vector = query_embeddings[0]

        # Get Qdrant client and search
        client = get_qdrant_client()

        # Perform vector search using query_points (new API)
        results = client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=top_k,
        )

        # Handle empty results
        if not results.points:
            print(f"[search] No results found for query: {query[:50]}...")
            return []

        # Transform ScoredPoints to list of dicts
        output = []
        for point in results.points:
            result_dict = {
                "text": point.payload.get("text", ""),
                "url": point.payload.get("url", ""),
                "position": point.payload.get("position", 0),
                "score": point.score,
                "created_at": point.payload.get("created_at", ""),
            }
            output.append(result_dict)

        print(f"[search] Found {len(output)} results for query")
        return output

    except Exception as e:
        print(f"[search] Error during search: {e}")
        return []


def format_results_json(
    query: str, results: list[dict], pretty: bool = True
) -> str:
    """
    Format search results as JSON string.

    Creates a structured JSON output with query metadata, results array,
    and timestamp for downstream integration.

    Args:
        query: Original search query
        results: List of result dicts from search()
        pretty: Whether to pretty-print JSON with indentation (default: True)

    Returns:
        JSON string with query metadata and results
    """
    # Build output structure
    output = {
        "query": query,
        "top_k": len(results),
        "collection": COLLECTION_NAME,
        "results": results,
        "result_count": len(results),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Serialize to JSON
    indent = 2 if pretty else None
    return json.dumps(output, indent=indent)


def run_retrieval_tests() -> bool:
    """
    Execute predefined test queries and validate results.

    Runs through TEST_QUERIES list, checking that each query returns
    non-empty results with scores above MIN_SCORE_THRESHOLD.

    Returns:
        True if all tests pass, False otherwise
    """
    print("=" * 60)
    print("Running RAG Retrieval Tests")
    print("=" * 60)

    passed = 0
    failed = 0

    for i, query in enumerate(TEST_QUERIES, 1):
        print(f"\nTest {i}: \"{query}\"")

        # Run search
        results = search(query, top_k=TOP_K_DEFAULT)

        # Check for results
        if not results:
            print(f"  X FAIL: No results returned")
            failed += 1
            continue

        # Check top score
        top_score = results[0]["score"]
        if top_score < MIN_SCORE_THRESHOLD:
            print(f"  X FAIL: Top score {top_score:.2f} below threshold {MIN_SCORE_THRESHOLD}")
            failed += 1
            continue

        # Check metadata completeness
        has_metadata = all(
            r.get("text") and r.get("url") and r.get("created_at") is not None
            for r in results
        )
        if not has_metadata:
            print(f"  X FAIL: Incomplete metadata in results")
            failed += 1
            continue

        # Test passed
        print(f"  [OK] Returned {len(results)} results")
        print(f"  [OK] Top score: {top_score:.2f} (above threshold {MIN_SCORE_THRESHOLD})")
        passed += 1

    # Summary
    print("\n" + "=" * 60)
    print(f"SUMMARY: {passed}/{len(TEST_QUERIES)} tests passed")
    print("=" * 60)

    success = (failed == 0)

    if not success:
        print(f"\nFAILED: {failed} test(s) did not pass")
        sys.exit(1)

    print("\nSUCCESS: All tests passed!")
    return True


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="RAG Embedding Pipeline - Ingest content and search"
    )
    parser.add_argument(
        "--search",
        type=str,
        help="Search query to run against the collection",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=TOP_K_DEFAULT,
        help=f"Number of results to return (default: {TOP_K_DEFAULT})",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run retrieval validation tests",
    )
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Output compact JSON (no indentation)",
    )
    parser.add_argument(
        "--ingest",
        action="store_true",
        help="Run the full ingestion pipeline",
    )

    args = parser.parse_args()

    # Handle different modes
    if args.test:
        # Run test suite
        run_retrieval_tests()
        sys.exit(0)

    elif args.search:
        # Run search query
        results = search(args.search, top_k=args.top_k)
        json_output = format_results_json(
            args.search, results, pretty=not args.compact
        )
        print(json_output)

    elif args.ingest:
        # Run ingestion pipeline
        BASE_URL = "https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/"
        ingest_book(BASE_URL)

    else:
        # Default: show help
        parser.print_help()
