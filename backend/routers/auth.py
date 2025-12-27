"""
Authentication router for FastAPI.

Provides endpoints for:
- User registration (signup)
- User login
- Token refresh
- Get current user
- Logout
- OAuth (Google) - optional, gracefully disabled if not configured
"""

import logging
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth, OAuthError

from auth_utils import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_token_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from database import get_db
from middleware.auth import get_current_user
from models import User
from schemas.auth import (
    UserCreate,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    UserResponse,
    MessageResponse,
)

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

# OAuth configuration
oauth = OAuth()

# Frontend URL for redirects
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Track which OAuth providers are enabled
GOOGLE_OAUTH_ENABLED = bool(os.getenv("GOOGLE_CLIENT_ID"))

# Register OAuth providers (only if credentials are configured)
if GOOGLE_OAUTH_ENABLED:
    oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )
    logger.info("Google OAuth enabled")
else:
    logger.info("Google OAuth disabled (GOOGLE_CLIENT_ID not set)")


class AuthProvidersResponse(BaseModel):
    """Response showing available authentication providers."""
    email_password: bool = True
    google: bool = False


def create_tokens_for_user(user: User) -> TokenResponse:
    """Create access and refresh tokens for a user."""
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/providers", response_model=AuthProvidersResponse)
async def get_auth_providers():
    """
    Get available authentication providers.

    Returns which auth methods are enabled (email/password, Google).
    Frontend can use this to show/hide OAuth buttons.
    """
    return AuthProvidersResponse(
        email_password=True,
        google=GOOGLE_OAUTH_ENABLED,
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with email and password.

    Returns access and refresh tokens on successful registration.
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        display_name=user_data.display_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create and return tokens
    return create_tokens_for_user(user)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user with email and password.

    Returns access and refresh tokens on successful authentication.
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Check if user has a password (OAuth-only users don't)
    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account uses OAuth login. Please sign in with Google.",
        )

    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is disabled",
        )

    # Update last login
    user.updated_at = datetime.now(timezone.utc)
    db.commit()

    # Create and return tokens
    return create_tokens_for_user(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshRequest, db: Session = Depends(get_db)):
    """
    Refresh an access token using a refresh token.

    Returns new access and refresh tokens.
    """
    # Decode the refresh token
    payload = decode_token(request.refresh_token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # Verify this is a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    # Get user
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Create new tokens
    return create_tokens_for_user(user)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the current authenticated user's information.
    """
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Logout the current user.

    Invalidates the refresh token by clearing the stored hash.
    """
    current_user.refresh_token_hash = None
    db.commit()

    return MessageResponse(message="Successfully logged out")


# =============================================================================
# OAuth Endpoints
# =============================================================================


@router.get("/google")
async def google_login(request: Request):
    """Initiate Google OAuth login."""
    if not GOOGLE_OAUTH_ENABLED:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "detail": "Google OAuth is not enabled. Please use email/password login.",
                "provider": "google",
                "enabled": False,
            }
        )

    redirect_uri = f"{FRONTEND_URL}/auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback."""
    # Guard: If Google OAuth is not configured, redirect with error
    if not GOOGLE_OAUTH_ENABLED:
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?error=Google OAuth is not configured"
        )

    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?error={str(e)}"
        )

    user_info = token.get("userinfo")
    if not user_info:
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?error=Failed to get user info"
        )

    email = user_info.get("email")
    oauth_id = user_info.get("sub")
    display_name = user_info.get("name")
    avatar_url = user_info.get("picture")

    # Find or create user
    user = db.query(User).filter(
        (User.oauth_provider == "google") & (User.oauth_id == oauth_id)
    ).first()

    if not user:
        # Check if email exists with different auth method
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            # Link OAuth to existing account
            existing_user.oauth_provider = "google"
            existing_user.oauth_id = oauth_id
            existing_user.avatar_url = avatar_url or existing_user.avatar_url
            user = existing_user
        else:
            # Create new user
            user = User(
                email=email,
                oauth_provider="google",
                oauth_id=oauth_id,
                display_name=display_name,
                avatar_url=avatar_url,
            )
            db.add(user)

        db.commit()
        db.refresh(user)

    # Create tokens
    tokens = create_tokens_for_user(user)

    # Redirect to frontend with tokens
    return RedirectResponse(
        url=f"{FRONTEND_URL}/auth/callback?access_token={tokens.access_token}&refresh_token={tokens.refresh_token}"
    )
