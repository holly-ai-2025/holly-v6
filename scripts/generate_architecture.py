import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND_SRC = ROOT / "apps" / "frontend" / "src"
BACKEND_OPS = ROOT / "apps" / "ops"
BACKEND_APP = ROOT / "apps" / "backend"
ROOT_MAIN = ROOT / "main.py"

def list_files():
    return subprocess.check_output(["ls", "-R"], cwd=ROOT).decode()

def parse_frontend_api_calls():
    calls = []
    for path in FRONTEND_SRC.rglob("*.tsx"):
        text = path.read_text(errors="ignore")
        for m in re.finditer(r"fetch\(([^)]+)\)", text):
            calls.append((str(path.relative_to(ROOT)), m.group(1)))
        for m in re.finditer(r"axios\.[a-z]+\(([^)]+)\)", text):
            calls.append((str(path.relative_to(ROOT)), m.group(1)))
    return calls

def parse_backend_endpoints():
    endpoints = []
    # Scan apps/ops and apps/backend
    for path in list(BACKEND_OPS.glob("*.py")) + list(BACKEND_APP.glob("*.py")):
        text = path.read_text(errors="ignore")
        for m in re.finditer(r"@app\.(get|post|put|delete)\(\"([^)]+)\"\)", text):
            endpoints.append((str(path.relative_to(ROOT)), m.group(1).upper(), m.group(2)))
    # Scan root-level main.py (read-only, no edits)
    if ROOT_MAIN.exists():
        text = ROOT_MAIN.read_text(errors="ignore")
        for m in re.finditer(r"@app\.(get|post|put|delete)\(\"([^)]+)\"\)", text):
            endpoints.append((str(ROOT_MAIN.relative_to(ROOT)), m.group(1).upper(), m.group(2)))
    return endpoints

def main():
    docs_path = ROOT / "docs" / "architecture.md"
    docs_path.parent.mkdir(exist_ok=True)

    repo_tree = list_files()
    frontend_calls = parse_frontend_api_calls()
    backend_endpoints = parse_backend_endpoints()

    # Cross-link frontend calls to backend endpoints
    endpoint_paths = {ep[2] for ep in backend_endpoints}
    cross_links = []
    for file, call in frontend_calls:
        found = [ep for ep in backend_endpoints if ep[2] in call]
        if found:
            for ep in found:
                cross_links.append(f"{file}: {call} → {ep[1]} {ep[2]} ({ep[0]})")
        else:
            cross_links.append(f"{file}: {call} → ❌ no backend match")

    content = f"""# Holly v6 – Architecture Map (Auto-Generated)

_Last updated by CI/CD pipeline._

## 📦 Repo Structure
```
{repo_tree}
```

## 🔎 Frontend API Calls
"""
    for file, call in frontend_calls:
        content += f"- {file}: {call}\n"

    content += "\n## ⚙️ Backend Endpoints (FastAPI)\n"
    for file, method, path in backend_endpoints:
        content += f"- {file}: {method} {path}\n"

    content += "\n## 🔗 Cross-link Frontend ↔ Backend\n"
    for link in cross_links:
        content += f"- {link}\n"

    docs_path.write_text(content)

if __name__ == "__main__":
    main()