from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas, database
from datetime import datetime
import json, logging, os, sys

app = FastAPI()

# Setup logging with absolute path and flush
log_dir = os.path.abspath("logs")
os.makedirs(log_dir, exist_ok=True)
debug_log_path = os.path.join(log_dir, "debug.log")

logger = logging.getLogger("activity_debug")
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(debug_log_path, mode="a", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Ensure immediate flushing
class FlushFileHandler(logging.FileHandler):
    def emit(self, record):
        super().emit(record)
        self.flush()

logger.handlers.clear()
logger.addHandler(FlushFileHandler(debug_log_path, mode="a", encoding="utf-8"))

# CORS setup to allow frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
        "ngrok-skip-browser-warning"
    ],
)

models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# (rest of file unchanged — CRUD endpoints for tasks, boards, projects, phases, groups, items, activity log)