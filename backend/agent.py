"""
RAG Agent Backend

FastAPI-based RAG Agent that exposes a /ask endpoint.
Retrieves context from Qdrant using existing search() function
and generates grounded responses using OpenRouter (Mistral model).

Usage:
    cd backend
    uv run uvicorn agent:app --reload --host 0.0.0.0 --port 8000
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Ensure backend directory is in Python path for submodule imports
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv

# Load environment variables BEFORE other imports that may need them
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field
from starlette.middleware.sessions import SessionMiddleware

from main import search
from database import init_db
from routers.auth import router as auth_router, GOOGLE_OAUTH_ENABLED
from middleware.auth import get_current_user
from models import User


def validate_environment():
    """Validate and log environment configuration on startup."""
    logger.info("=" * 60)
    logger.info("Environment Configuration Check")
    logger.info("=" * 60)

    # Required for auth
    jwt_secret = os.getenv("JWT_SECRET_KEY")
    if not jwt_secret:
        logger.warning("JWT_SECRET_KEY not set - using random secret (tokens will invalidate on restart)")
    elif jwt_secret == "supersecret123":
        logger.warning("JWT_SECRET_KEY is set to default value - please change for production!")
    else:
        logger.info("JWT_SECRET_KEY: configured")

    # Frontend URL
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    logger.info(f"FRONTEND_URL: {frontend_url}")

    # Auth providers
    logger.info("-" * 40)
    logger.info("Authentication Providers:")
    logger.info("  - Email/Password: ENABLED (always available)")
    logger.info(f"  - Google OAuth: {'ENABLED' if GOOGLE_OAUTH_ENABLED else 'DISABLED'}")

    # RAG services (optional warnings)
    logger.info("-" * 40)
    logger.info("RAG Services:")
    if os.getenv("COHERE_API_KEY"):
        logger.info("  - Cohere: configured")
    else:
        logger.warning("  - Cohere: NOT CONFIGURED (embeddings will fail)")

    if os.getenv("QDRANT_URL"):
        logger.info(f"  - Qdrant: {os.getenv('QDRANT_URL')}")
    else:
        logger.warning("  - Qdrant: NOT CONFIGURED (search will fail)")

    if os.getenv("OPENROUTER_API_KEY"):
        logger.info("  - OpenRouter: configured")
    else:
        logger.warning("  - OpenRouter: NOT CONFIGURED (generation will fail)")

    logger.info("=" * 60)


# =============================================================================
# FastAPI Application with Lifespan
# =============================================================================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - initialize database and validate environment on startup."""
    # Startup: Validate environment and initialize database
    validate_environment()
    init_db()
    logger.info("Database initialized successfully")
    logger.info("Server ready to accept connections")
    yield
    # Shutdown: cleanup if needed
    logger.info("Application shutting down")


app = FastAPI(
    title="RAG Agent API",
    description="Question answering API using RAG with Qdrant retrieval and OpenRouter generation",
    version="1.0.0",
    lifespan=lifespan,
)

# Session middleware for OAuth (required by authlib)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET_KEY", "change-this-secret-key"),
)

# CORS configuration for frontend
# Production: GitHub Pages domain
# Development: localhost on common ports
ALLOWED_ORIGINS = [
    # Production domains
    "https://salwagull.github.io",
    # Development domains
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

# Add FRONTEND_URL from env if configured (for custom domains)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Add with and without trailing slash
    clean_url = frontend_url.rstrip("/")
    if clean_url not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(clean_url)

logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],  # Allow all headers for easier debugging
    expose_headers=["*"],
)

# Include authentication router
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# =============================================================================
# OpenRouter Client Initialization
# =============================================================================

# OpenRouter configuration
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "mistralai/devstral-2512:free"

_openrouter_client = None


def get_openrouter_client() -> OpenAI:
    """Get or initialize OpenRouter client (using OpenAI SDK)."""
    global _openrouter_client
    if _openrouter_client is None:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")
        _openrouter_client = OpenAI(
            api_key=api_key,
            base_url=OPENROUTER_BASE_URL,
        )
    return _openrouter_client


# =============================================================================
# Pydantic Models
# =============================================================================


class QueryRequest(BaseModel):
    """Request body for POST /ask endpoint."""

    query: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Natural language question to answer",
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of chunks to retrieve",
    )


class ChunkResult(BaseModel):
    """A single retrieved chunk with metadata."""

    text: str = Field(description="Content of the retrieved chunk")
    url: str = Field(description="Source URL of the original page")
    score: float = Field(description="Similarity score (0-1)")


class QueryResponse(BaseModel):
    """Successful response with answer and sources."""

    query: str = Field(description="Original user query")
    answer: str = Field(description="AI-generated answer grounded in context")
    sources: list[str] = Field(description="List of source URLs used")
    chunks: list[ChunkResult] = Field(description="Retrieved chunks with scores")
    timestamp: str = Field(description="ISO 8601 timestamp of response")


class ErrorResponse(BaseModel):
    """Error response structure."""

    error: str = Field(description="Error type (e.g., ValidationError)")
    detail: str = Field(description="Specific error message")


# =============================================================================
# Conversational Detection
# =============================================================================

# Common greetings and conversational patterns
GREETING_PATTERNS = [
    "hello", "hi", "hey", "greetings", "good morning", "good afternoon",
    "good evening", "howdy", "what's up", "sup", "yo", "hola",
    "how are you", "how's it going", "nice to meet you",
]

CONVERSATIONAL_PATTERNS = [
    "thank you", "thanks", "thx", "appreciate it",
    "bye", "goodbye", "see you", "later",
    "help", "what can you do", "who are you", "what are you",
]


def is_conversational_query(query: str) -> bool:
    """Check if query is a greeting or conversational message."""
    query_lower = query.lower().strip()

    # Check for greetings
    for pattern in GREETING_PATTERNS:
        if query_lower == pattern or query_lower.startswith(pattern + " ") or query_lower.startswith(pattern + "!"):
            return True

    # Check for conversational patterns
    for pattern in CONVERSATIONAL_PATTERNS:
        if pattern in query_lower:
            return True

    # Very short queries (1-2 words) that aren't questions are likely conversational
    words = query_lower.split()
    if len(words) <= 2 and "?" not in query and not any(
        q in query_lower for q in ["what", "how", "why", "when", "where", "which", "explain", "describe"]
    ):
        return True

    return False


def generate_conversational_response(query: str) -> str:
    """Generate a friendly response for conversational queries."""
    query_lower = query.lower().strip()

    # Greetings
    if any(g in query_lower for g in ["hello", "hi", "hey", "howdy", "greetings", "hola", "yo", "sup"]):
        return "Hello! I'm your study assistant for Physical AI & Humanoid Robotics. I can help you understand concepts from the textbook - just ask me about topics like ROS 2, Gazebo simulation, Isaac Sim, VLA systems, or any chapter content. What would you like to learn about?"

    # How are you
    if "how are you" in query_lower or "how's it going" in query_lower:
        return "I'm doing great, thanks for asking! I'm here and ready to help you learn about Physical AI and Humanoid Robotics. What topic would you like to explore?"

    # Thank you
    if any(t in query_lower for t in ["thank", "thanks", "thx", "appreciate"]):
        return "You're welcome! Feel free to ask more questions about Physical AI, robotics, ROS 2, simulation, or any other topic from the textbook. I'm here to help!"

    # Goodbye
    if any(b in query_lower for b in ["bye", "goodbye", "see you", "later"]):
        return "Goodbye! Come back anytime you have questions about the textbook. Happy learning!"

    # Help / What can you do
    if "help" in query_lower or "what can you do" in query_lower or "who are you" in query_lower:
        return "I'm a study assistant for the Physical AI & Humanoid Robotics textbook. I can help you with:\n\n• **ROS 2 concepts** - nodes, topics, services\n• **Simulation** - Gazebo, Isaac Sim, Unity\n• **Perception & Vision** - computer vision, sensors\n• **Control & Planning** - motion planning, navigation\n• **VLA Systems** - vision-language-action models\n• **Capstone projects** - architecture, implementation\n\nJust ask a question about any topic!"

    # Default friendly response
    return "I'm here to help you learn about Physical AI and Humanoid Robotics! Try asking me questions like:\n\n• \"What is ROS 2?\"\n• \"How does Gazebo simulation work?\"\n• \"Explain VLA systems\"\n• \"What are the key concepts in Chapter 5?\"\n\nWhat would you like to know?"


# =============================================================================
# Context Building
# =============================================================================


def build_context(chunks: list[dict]) -> str:
    """
    Format retrieved chunks as numbered context for the LLM.

    Args:
        chunks: List of chunk dicts with text, url, score keys

    Returns:
        Formatted context string with numbered sources
    """
    if not chunks:
        return ""

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(
            f"[{i}] Source: {chunk['url']}\n" f"Content: {chunk['text']}\n"
        )
    return "\n".join(context_parts)


# =============================================================================
# OpenRouter Integration
# =============================================================================


def generate_answer(query: str, context: str) -> str:
    """
    Generate grounded answer using OpenRouter API with Mistral model.

    Args:
        query: User's question
        context: Formatted context from retrieved chunks

    Returns:
        AI-generated answer grounded in the provided context
    """
    system_prompt = """You are a helpful assistant answering questions about Physical AI and Humanoid Robotics.

IMPORTANT RULES:
1. Use ONLY the provided context to answer questions
2. If the context doesn't contain relevant information, clearly state that
3. Always cite which source(s) your answer comes from using [1], [2], etc.
4. Be concise and accurate
5. Do not make up information not present in the context"""

    client = get_openrouter_client()

    response = client.chat.completions.create(
        model=OPENROUTER_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
        ],
        temperature=0.3,
        max_tokens=1000,
    )

    return response.choices[0].message.content


# =============================================================================
# API Endpoints
# =============================================================================


@app.get("/")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/ask", response_model=QueryResponse)
async def ask(request: QueryRequest, current_user: User = Depends(get_current_user)):
    """
    Answer a question using RAG retrieval and OpenAI generation.

    Requires authentication via JWT token in Authorization header.

    1. Check if query is conversational (greeting, thanks, etc.)
    2. Search Qdrant for relevant chunks
    3. Build context from retrieved chunks
    4. Generate answer using OpenAI
    5. Return structured response with answer, sources, and chunks
    """
    # Step 0: Handle conversational queries (greetings, thanks, etc.)
    if is_conversational_query(request.query):
        return QueryResponse(
            query=request.query,
            answer=generate_conversational_response(request.query),
            sources=[],
            chunks=[],
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # Step 1: Retrieve relevant chunks from Qdrant
    try:
        results = search(request.query, top_k=request.top_k)
    except Exception as e:
        error_msg = str(e).lower()
        if "qdrant" in error_msg:
            raise HTTPException(status_code=503, detail="Vector database unavailable")
        if "cohere" in error_msg:
            raise HTTPException(status_code=503, detail="Embedding service unavailable")
        raise HTTPException(status_code=503, detail="Retrieval service unavailable")

    # Step 2: Handle no results case
    if not results:
        # Generate informative response without context
        try:
            client = get_openrouter_client()
            response = client.chat.completions.create(
                model=OPENROUTER_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant. The user asked a question but no relevant information was found in the knowledge base.",
                    },
                    {
                        "role": "user",
                        "content": f"The user asked: '{request.query}'\n\nNo relevant information was found in the knowledge base about Physical AI and Humanoid Robotics. Please provide a brief, helpful response acknowledging this.",
                    },
                ],
                temperature=0.3,
                max_tokens=200,
            )
            answer = response.choices[0].message.content
        except Exception:
            answer = "I couldn't find any relevant information in the knowledge base to answer your question about Physical AI and Humanoid Robotics."

        return QueryResponse(
            query=request.query,
            answer=answer,
            sources=[],
            chunks=[],
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # Step 3: Build context from search results
    context = build_context(results)

    # Step 4: Generate answer using OpenAI
    try:
        answer = generate_answer(request.query, context)
    except ValueError as e:
        # API key not set
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=503, detail="Generation service unavailable")

    # Step 5: Build response
    chunks = [
        ChunkResult(text=r["text"], url=r["url"], score=r["score"]) for r in results
    ]

    # Extract unique source URLs
    sources = list(dict.fromkeys(r["url"] for r in results))

    return QueryResponse(
        query=request.query,
        answer=answer,
        sources=sources,
        chunks=chunks,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
