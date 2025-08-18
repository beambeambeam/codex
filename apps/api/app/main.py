from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.v1 import app_v1_route


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


def main():
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Agentic RAG API and Flows")
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

    uvicorn.run("app.main:app", host=args.host, port=args.port, reload=args.reload)
    print(f"Starting API server on {args.host}:{args.port}")


if __name__ == "__main__":
    main()
