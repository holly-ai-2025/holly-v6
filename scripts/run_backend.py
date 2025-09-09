import asyncio
from hypercorn.config import Config
from hypercorn.asyncio import serve
from apps.backend.main import app

if __name__ == "__main__":
    config = Config()
    config.bind = ["127.0.0.1:8000"]
    config.workers = 1
    config.loglevel = "debug"
    asyncio.run(serve(app, config))