from datetime import (
    datetime,
    timedelta,
    timezone,
)

import os

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    OAuth2PasswordBearer,
)

from jose import (
    JWTError,
    jwt,
)

from passlib.context import (
    CryptContext,
)

from sqlalchemy.orm import (
    Session,
)

from database import get_db

from models import User


SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-before-deployment"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

RESET_TOKEN_EXPIRE_MINUTES = 15


password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def hash_password(
    password: str
) -> str:

    return password_context.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return password_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    data: dict
) -> str:

    payload = data.copy()

    expires_at = (
        datetime.now(
            timezone.utc
        )
        +
        timedelta(
            minutes=(
                ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )
    )

    payload.update({
        "exp": expires_at,
        "type": "access"
    })

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_password_reset_token(
    email: str
) -> str:

    expires_at = (
        datetime.now(
            timezone.utc
        )
        +
        timedelta(
            minutes=(
                RESET_TOKEN_EXPIRE_MINUTES
            )
        )
    )

    payload = {
        "sub": email,
        "type": "password_reset",
        "exp": expires_at
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_access_token(
    token: str
) -> dict | None:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )

        if (
            payload.get("type")
            !=
            "access"
        ):

            return None

        return payload

    except JWTError:

        return None


def get_current_user(
    token: str = Depends(
        oauth2_scheme
    ),

    db: Session = Depends(
        get_db
    ),
) -> User:

    credentials_exception = (
        HTTPException(
            status_code=(
                status
                .HTTP_401_UNAUTHORIZED
            ),

            detail=(
                "Invalid or expired "
                "access token"
            ),

            headers={
                "WWW-Authenticate":
                    "Bearer"
            },
        )
    )


    payload = decode_access_token(
        token
    )


    if not payload:

        raise credentials_exception


    user_id = payload.get(
        "sub"
    )


    if not user_id:

        raise credentials_exception


    try:

        user_id = int(
            user_id
        )

    except (
        TypeError,
        ValueError,
    ):

        raise credentials_exception


    user = (
        db.query(
            User
        )
        .filter(
            User.id
            ==
            user_id
        )
        .first()
    )


    if not user:

        raise credentials_exception


    return user


def verify_password_reset_token(
    token: str
) -> str | None:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )


        if (
            payload.get("type")
            !=
            "password_reset"
        ):

            return None


        return payload.get(
            "sub"
        )


    except JWTError:

        return None