from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    return JSONResponse(content={"status": "ok"}, status_code=200)
