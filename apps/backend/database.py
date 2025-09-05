from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.backend.models import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///apps/backend/holly.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables from models.py
Base.metadata.create_all(bind=engine)
