import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Debug: show what environment is actually set
print("[DB DEBUG] DATABASE_URL env:", os.getenv("DATABASE_URL"))

# Database URL: prefer DATABASE_URL from env, fallback to Postgres
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://holly:holly@localhost:5432/holly"
)

print(f"[DB DEBUG] Final SQLALCHEMY_DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()