"""
SQLAlchemy models for user authentication.

Defines the User model with support for both email/password and OAuth authentication.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Boolean, UniqueConstraint
from database import Base


class User(Base):
    """
    User model for authentication.

    Supports both email/password authentication and OAuth providers (Google, GitHub).
    For OAuth-only users, password_hash will be None.
    """
    __tablename__ = "users"

    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Email - required for all users, must be unique
    email = Column(String(255), unique=True, nullable=False, index=True)

    # Password - nullable for OAuth-only users
    password_hash = Column(String(255), nullable=True)

    # OAuth fields
    oauth_provider = Column(String(50), nullable=True)  # 'google', 'github', or None
    oauth_id = Column(String(255), nullable=True)  # Provider's user ID

    # Profile information
    display_name = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Account status
    is_active = Column(Boolean, default=True, nullable=False)

    # Refresh token hash for token invalidation
    refresh_token_hash = Column(String(255), nullable=True)

    # Ensure unique OAuth provider + ID combination
    __table_args__ = (
        UniqueConstraint('oauth_provider', 'oauth_id', name='uix_oauth_provider_id'),
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', provider='{self.oauth_provider}')>"
