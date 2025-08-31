import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def list_files():
    return subprocess.check_output(["ls", "-R"], cwd=ROOT).decode()

def main():
    docs_path = ROOT / "docs" / "architecture.md"
    docs_path.parent.mkdir(exist_ok=True)

    # crude scan of repo tree
    repo_tree = list_files()

    content = f"""# Holly v6 – Architecture Map (Auto-Generated)

_Last updated by CI/CD pipeline._

## 📦 Repo Structure
```
{repo_tree}
```

## TODO
- Parse frontend API calls (`fetch`, `axios`) to map expected endpoints.
- Parse backend FastAPI `@app.get`/`@app.post` to map available endpoints.
- Cross-link frontend calls ↔ backend endpoints.
"""
    docs_path.write_text(content)

if __name__ == "__main__":
    main()