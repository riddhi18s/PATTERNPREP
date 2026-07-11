from datetime import datetime
from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class UserRegister(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


class UserLogin(BaseModel):
    email: EmailStr

    password: str


class ForgotPasswordRequest(
    BaseModel
):
    email: EmailStr


class ResetPasswordRequest(
    BaseModel
):
    token: str

    new_password: str = Field(
        min_length=8,
        max_length=128
    )


class UserResponse(BaseModel):
    id: int

    name: str

    email: EmailStr

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class SolvedQuestionsUpdate(
    BaseModel
):
    question_ids: list[
        str | int
    ] = Field(
        default_factory=list
    )


class SolvedQuestionsResponse(
    BaseModel
):
    question_ids: list[str]


class MockTestCreate(
    BaseModel
):
    test_id: str = Field(
        min_length=1,
        max_length=200
    )

    score: int = Field(
        ge=0,
        le=100
    )

    question_count: int = Field(
        ge=0
    )

    time_used: int = Field(
        default=0,
        ge=0
    )

    submission_type: str = Field(
        default="manual",
        max_length=50
    )

    completed_at: (
        datetime | None
    ) = None

    test_data: dict[
        str,
        Any
    ]


class MockTestResponse(
    BaseModel
):
    id: int

    test_id: str

    score: int

    question_count: int

    time_used: int

    submission_type: str

    completed_at: datetime

    test_data: dict[
        str,
        Any
    ]


class MessageResponse(
    BaseModel
):
    message: str