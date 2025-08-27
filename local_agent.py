from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import subprocess
import os
import pathlib
from dotenv import load_dotenv

# --- Load .env if it exists in holly-v6 root ---
load_dotenv()

# --- Security token (separate from Ops Service token) ---
OPS_TOKEN = os.environ.get("LOCAL_AGENT_TOKEN", "changeme")

app = FastAPI(title="Holly Local Agent", version="0.2.0")

# --- Security check ---
async def verify_token(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    token = auth.split(" ", 1)[1]
    if token != OPS_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")

# --- Models ---
class ExecRequest(BaseModel):
    cmd: str

class WriteRequest(BaseModel):
    path: str
    content: str

class CatRequest(BaseModel):
    path: str

# --- Endpoints ---

@app.get("/ls", dependencies=[Depends(verify_token)])
async def list_files(path: str = "."):
    """List files in a directory."""
    try:
        base = pathlib.Path(path).expanduser().resolve()
        return {"ok": True, "files": os.listdir(base)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/cat", dependencies=[Depends(verify_token)])
async def read_file(req: CatRequest):
    """Read the contents of a file."""
    try:
        path = pathlib.Path(req.path).expanduser().resolve()
        with open(path, "r") as f:
            return {"ok": True, "content": f.read()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/write", dependencies=[Depends(verify_token)])
async def write_file(req: WriteRequest):
    """Write content to a file."""
    try:
        path = pathlib.Path(req.path).expanduser().resolve()
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            f.write(req.content)
        return {"ok": True, "message": f"Wrote {len(req.content)} chars to {req.path}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/exec", dependencies=[Depends(verify_token)])
async def exec_command(req: ExecRequest):
    """Execute a whitelisted shell command."""
    try:
        # Whitelist only safe commands
        allowed = ["ls", "cat", "echo", "git", "pip", "pytest", "docker"]
        if not any(req.cmd.strip().startswith(a) for a in allowed):
            raise HTTPException(status_code=403, detail="Command not allowed")
        output = subprocess.check_output(req.cmd, shell=True, cwd=".", stderr=subprocess.STDOUT)
        return {"ok": True, "output": output.decode()}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=400, detail=e.output.decode())

