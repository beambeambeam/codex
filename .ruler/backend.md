# Backend Style Guide (Python/FastAPI)

This document outlines the coding style and conventions for the Python/FastAPI backend.

## Code Formatting & Linting

This project uses [Ruff](https://github.com/astral-sh/ruff) for both code formatting and linting. It is configured to be equivalent to Black and isort, ensuring a consistent and readable codebase.

**To format and lint your code, run:**

```bash
ruff check --fix .
ruff format .
```

- **Configuration**: All Ruff settings are defined in the `pyproject.toml` file.

## Naming Conventions

All Python code should adhere to the `PEP 8` style guide.

- `snake_case` for variables and functions.
- `PascalCase` for classes.
- `UPPER_CASE` for constants.

## FastAPI Best Practices

- **Routers**: Organize your endpoints into separate `APIRouter` instances for each resource or logical group. This keeps the main `app.py` file clean and modular.
- **Dependencies**: Use FastAPI's dependency injection system to manage database connections, authentication, and other shared resources.
- **Schemas**: Define clear Pydantic schemas for all request and response bodies. This ensures data validation and generates accurate OpenAPI documentation. Do not use generic `dict` or `Any` types.
