"""
Database configuration for SQLAlchemy with SQLite.

Provides session management and database initialization for the auth system.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL - SQLite file in the backend directory
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./auth.db")

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite with FastAPI
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def init_db():
    """
    Create all database tables.

    Call this on application startup to ensure tables exist.
    """
    from models import User  # Import here to avoid circular imports
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    Dependency for FastAPI routes.

    Yields a database session and ensures it's closed after the request.

    Usage:
        @app.get("/example")
        def example(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
