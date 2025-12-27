"""
Authentication utilities for JWT token management and password hashing.

Provides functions for:
- Password hashing and verification (bcrypt)
- JWT access token creation and validation
- JWT refresh token creation and validation
"""

import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt

# JWT Configuration from environment variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: The plain text password to verify
        hashed_password: The bcrypt hashed password to compare against

    Returns:
        True if the password matches, False otherwise
    """
    try:
        password_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: The plain text password to hash

    Returns:
        The bcrypt hashed password
    """
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        data: The payload data to encode in the token (typically {"sub": user_id})
        expires_delta: Optional custom expiration time. Defaults to ACCESS_TOKEN_EXPIRE_MINUTES.

    Returns:
        The encoded JWT access token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.now(timezone.utc)
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """
    Create a JWT refresh token.

    Refresh tokens have a longer expiration than access tokens and are used
    to obtain new access tokens without re-authentication.

    Args:
        data: The payload data to encode in the token (typically {"sub": user_id})

    Returns:
        The encoded JWT refresh token string
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.now(timezone.utc),
        "jti": secrets.token_urlsafe(16)  # Unique token ID for revocation
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT token.

    Args:
        token: The JWT token string to decode

    Returns:
        The decoded payload dict if valid, None if invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_token_hash(token: str) -> str:
    """
    Create a hash of a token for storage/comparison.

    Used for refresh token tracking to enable revocation.
    Uses SHA-256 for tokens (faster than bcrypt, sufficient for random tokens).

    Args:
        token: The token to hash

    Returns:
        A SHA-256 hash of the token
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verify_token_hash(token: str, token_hash: str) -> bool:
    """
    Verify a token against its stored hash.

    Args:
        token: The token to verify
        token_hash: The stored hash to compare against

    Returns:
        True if the token matches the hash, False otherwise
    """
    return secrets.compare_digest(get_token_hash(token), token_hash)
