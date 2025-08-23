from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.v1 import app_v1_route
from scalar_fastapi import get_scalar_api_reference, Theme


app = FastAPI(
    title="The Codex API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(app_v1_route)


@app.get("/documents", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url or "/openapi.json",
        title=app.title,
        theme=Theme.ALTERNATE,
    )


def main():
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Agentic RAG API and Flows")
    parser.add_argument("command", choices=["serve"], help="Command to run.")
    parser.add_argument(
        "--host", type=str, default="127.0.0.1", help="Host for the API server."
    )
    parser.add_argument(
        "--port", type=int, default=3001, help="Port for the API server."
    )
    parser.add_argument(
        "--reload",
        default=True,
        action="store_true",
        help="Enable auto-reloading for development.",
    )

    args = parser.parse_args()

    if args.command == "serve":
        print(f"Starting API server on {args.host}:{args.port}")

        uvicorn.run("app.main:app", host=args.host, port=args.port, reload=args.reload)


if __name__ == "__main__":
    main()
