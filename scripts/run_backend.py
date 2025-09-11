import sys, os, asyncio
from hypercorn.config import Config
from hypercorn.asyncio import serve

# Ensure repo root is in sys.path so `apps.backend` can be imported reliably
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from apps.backend.main import app

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8000"]  # Bind to all network interfaces, not just localhost
    config.workers = 1
    config.loglevel = "debug"
    config.use_reloader = False  # Disable autoreloader completely
    asyncio.run(serve(app, config))