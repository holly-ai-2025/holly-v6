import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from apps.backend.database import Base, engine
from apps.backend import models

print(f"🚨 Resetting database schema at: {engine.url}")

# Drop all tables
Base.metadata.drop_all(bind=engine, checkfirst=True)

# Recreate schema
Base.metadata.create_all(bind=engine, checkfirst=False)

print("🎉 Done — database schema reset successfully!")