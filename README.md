# Holly v6

This is the starting repo scaffold for Holly AI v6.

## Development Setup

### Pre-commit hooks
This repo uses [pre-commit](https://pre-commit.com/) to enforce code hygiene and prevent committing ignored files.

To set up locally:

```bash
pip install pre-commit
pre-commit install
```

Now hooks will run automatically on `git commit`. To manually run on all files:

```bash
pre-commit run --all-files
```
