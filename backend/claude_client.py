"""
Claude API Client for Railway Deployment

This module provides a Claude API integration that:
1. Reads API key from Railway environment variables
2. Handles Claude API requests with proper error handling
3. Supports streaming and non-streaming responses
4. Works seamlessly on Railway's free plan

Usage:
    from claude_client import get_claude_response, get_claude_client

    # Simple usage
    response = get_claude_response("What is ROS 2?", context="...")

    # With client directly
    client = get_claude_client()
    message = client.messages.create(...)
"""

import os
import logging
from typing import Optional

import anthropic

logger = logging.getLogger(__name__)

# =============================================================================
# Configuration
# =============================================================================

# Claude model configuration
# Using claude-3-haiku for cost efficiency on free tier
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")
CLAUDE_MAX_TOKENS = int(os.getenv("CLAUDE_MAX_TOKENS", "1024"))

# Singleton client instance
_claude_client: Optional[anthropic.Anthropic] = None


# =============================================================================
# Client Initialization
# =============================================================================


def get_claude_client() -> anthropic.Anthropic:
    """
    Get or initialize Claude client.

    Reads ANTHROPIC_API_KEY or CLAUDE_API_KEY from environment.
    Railway automatically injects environment variables at runtime.

    Returns:
        Initialized Anthropic client

    Raises:
        ValueError: If API key is not configured
    """
    global _claude_client

    if _claude_client is None:
        # Try both common env var names
        api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("CLAUDE_API_KEY")

        if not api_key:
            raise ValueError(
                "Claude API key not configured. "
                "Set ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable in Railway."
            )

        _claude_client = anthropic.Anthropic(api_key=api_key)
        logger.info("Claude client initialized successfully")

    return _claude_client


def is_claude_configured() -> bool:
    """Check if Claude API is configured."""
    api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("CLAUDE_API_KEY")
    return bool(api_key)


# =============================================================================
# Response Generation
# =============================================================================


def get_claude_response(
    query: str,
    context: str = "",
    system_prompt: Optional[str] = None,
    max_tokens: Optional[int] = None,
    temperature: float = 0.3,
) -> str:
    """
    Generate a response using Claude API.

    Args:
        query: User's question
        context: Optional context from RAG retrieval
        system_prompt: Optional custom system prompt
        max_tokens: Max tokens in response (default from env)
        temperature: Response randomness (0-1)

    Returns:
        Claude's response text

    Raises:
        ValueError: If API key not configured
        anthropic.APIError: If API request fails
    """
    client = get_claude_client()

    # Default system prompt for RAG
    if system_prompt is None:
        system_prompt = """You are a helpful assistant answering questions about Physical AI and Humanoid Robotics.

IMPORTANT RULES:
1. Use ONLY the provided context to answer questions
2. If the context doesn't contain relevant information, clearly state that
3. Always cite which source(s) your answer comes from using [1], [2], etc.
4. Be concise and accurate
5. Do not make up information not present in the context"""

    # Build user message with context
    if context:
        user_message = f"Context:\n{context}\n\nQuestion: {query}"
    else:
        user_message = query

    try:
        message = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=max_tokens or CLAUDE_MAX_TOKENS,
            temperature=temperature,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )

        # Extract text from response
        response_text = message.content[0].text
        logger.info(f"Claude response generated: {len(response_text)} chars")

        return response_text

    except anthropic.RateLimitError as e:
        logger.error(f"Claude rate limit exceeded: {e}")
        raise
    except anthropic.APIStatusError as e:
        logger.error(f"Claude API error: {e}")
        raise


async def get_claude_response_async(
    query: str,
    context: str = "",
    system_prompt: Optional[str] = None,
    max_tokens: Optional[int] = None,
    temperature: float = 0.3,
) -> str:
    """
    Async version of get_claude_response.

    Use this in FastAPI async endpoints for better performance.
    """
    client = get_claude_client()

    if system_prompt is None:
        system_prompt = """You are a helpful assistant answering questions about Physical AI and Humanoid Robotics.

IMPORTANT RULES:
1. Use ONLY the provided context to answer questions
2. If the context doesn't contain relevant information, clearly state that
3. Always cite which source(s) your answer comes from using [1], [2], etc.
4. Be concise and accurate
5. Do not make up information not present in the context"""

    if context:
        user_message = f"Context:\n{context}\n\nQuestion: {query}"
    else:
        user_message = query

    # Use async client
    async_client = anthropic.AsyncAnthropic(
        api_key=os.getenv("ANTHROPIC_API_KEY") or os.getenv("CLAUDE_API_KEY")
    )

    message = await async_client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=max_tokens or CLAUDE_MAX_TOKENS,
        temperature=temperature,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )

    return message.content[0].text


# =============================================================================
# Streaming Support
# =============================================================================


def stream_claude_response(
    query: str,
    context: str = "",
    system_prompt: Optional[str] = None,
):
    """
    Stream Claude response for real-time display.

    Yields:
        Text chunks as they are generated
    """
    client = get_claude_client()

    if system_prompt is None:
        system_prompt = "You are a helpful assistant for Physical AI and Humanoid Robotics."

    if context:
        user_message = f"Context:\n{context}\n\nQuestion: {query}"
    else:
        user_message = query

    with client.messages.stream(
        model=CLAUDE_MODEL,
        max_tokens=CLAUDE_MAX_TOKENS,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    ) as stream:
        for text in stream.text_stream:
            yield text
