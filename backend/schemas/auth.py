"""
Pydantic schemas for authentication endpoints.

Defines request and response models for signup, login, token refresh, and user info.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserCreate(BaseModel):
    """Request schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    display_name: Optional[str] = Field(None, max_length=255)


class UserLogin(BaseModel):
    """Request schema for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response schema for successful authentication."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token expiration time in seconds")


class RefreshRequest(BaseModel):
    """Request schema for token refresh."""
    refresh_token: str


class UserResponse(BaseModel):
    """Response schema for user information."""
    id: int
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    oauth_provider: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
