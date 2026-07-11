import os

from dotenv import load_dotenv

from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)


import models

from auth import (
    router as auth_router,
)

from database import engine

from progress import (
    router as progress_router,
)


load_dotenv()


models.Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="PatternPrep API",
    version="1.0.0",
)


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


if (
    frontend_url
    not in allowed_origins
):
    allowed_origins.append(
        frontend_url
    )


app.add_middleware(
    CORSMiddleware,

    allow_origins=
        allowed_origins,

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


app.include_router(
    auth_router
)


app.include_router(
    progress_router
)


@app.get("/")
def home():

    return {
        "message":
            "PatternPrep backend "
            "is running"
    }


@app.get("/api/health")
def health_check():

    return {
        "status":
            "healthy",

        "message":
            "Backend connected "
            "successfully",
    }