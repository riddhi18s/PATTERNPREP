from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas

from database import get_db

from security import (
    create_access_token,
    create_password_reset_token,
    hash_password,
    verify_password,
    verify_password_reset_token,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: schemas.UserRegister,
    db: Session = Depends(get_db),
):

    existing_user = (
        db.query(models.User)
        .filter(
            models.User.email
            == user_data.email.lower()
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An account with this "
                "email already exists"
            ),
        )

    user = models.User(
        name=user_data.name.strip(),
        email=user_data.email.lower(),
        password_hash=hash_password(
            user_data.password
        ),
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user


@router.post("/login")
def login_user(
    login_data: schemas.UserLogin,
    db: Session = Depends(get_db),
):

    user = (
        db.query(models.User)
        .filter(
            models.User.email
            == login_data.email.lower()
        )
        .first()
    )

    if (
        not user
        or not verify_password(
            login_data.password,
            user.password_hash,
        )
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": (
            schemas.UserResponse
            .model_validate(user)
        ),
    }


@router.post("/forgot-password")
def forgot_password(
    request_data:
        schemas.ForgotPasswordRequest,

    db: Session = Depends(get_db),
):

    user = (
        db.query(models.User)
        .filter(
            models.User.email
            == request_data.email.lower()
        )
        .first()
    )

    if not user:

        return {
            "message": (
                "If an account exists with "
                "this email, reset "
                "instructions have been created."
            )
        }

    reset_token = (
        create_password_reset_token(
            user.email
        )
    )

    return {
        "message": (
            "Password reset token "
            "created successfully."
        ),

        "reset_token": reset_token
    }


@router.post("/reset-password")
def reset_password(
    request_data:
        schemas.ResetPasswordRequest,

    db: Session = Depends(get_db),
):

    email = (
        verify_password_reset_token(
            request_data.token
        )
    )

    if not email:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Invalid or expired "
                "password reset token"
            ),
        )

    user = (
        db.query(models.User)
        .filter(
            models.User.email == email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail="User account not found",
        )

    user.password_hash = hash_password(
        request_data.new_password
    )

    db.commit()

    return {
        "message": (
            "Password reset successfully."
        )
    }