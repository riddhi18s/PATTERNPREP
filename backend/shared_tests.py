import json
import secrets
import string

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db

from models import (
    SharedTest,
    User,
)

from schemas import (
    SharedTestCreate,
    SharedTestResponse,
)

from security import (
    get_current_user,
)


router = APIRouter(
    prefix="/shared-tests",
    tags=["Shared Tests"],
)


SHARE_CODE_LENGTH = 6

SHARE_CODE_CHARACTERS = (
    string.ascii_uppercase
    +
    string.digits
)


def generate_share_code(
    db: Session
):
    while True:
        share_code = "".join(
            secrets.choice(
                SHARE_CODE_CHARACTERS
            )

            for _ in range(
                SHARE_CODE_LENGTH
            )
        )

        existing_test = (
            db.query(
                SharedTest
            )
            .filter(
                SharedTest.share_code
                ==
                share_code
            )
            .first()
        )

        if not existing_test:
            return share_code


def convert_shared_test(
    shared_test: SharedTest,
    creator_name: str,
):
    try:
        test_data = json.loads(
            shared_test.test_data
        )

    except (
        TypeError,
        json.JSONDecodeError,
    ):
        test_data = {}

    return {
        "share_code":
            shared_test.share_code,

        "creator_name":
            creator_name,

        "created_at":
            shared_test.created_at,

        "test_data":
            test_data,
    }


@router.post(
    "",
    response_model=(
        SharedTestResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_shared_test(
    shared_test_data:
        SharedTestCreate,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    share_code = (
        generate_share_code(
            db
        )
    )

    serialized_test_data = (
        json.dumps(
            shared_test_data.test_data,
            ensure_ascii=False,
        )
    )

    shared_test = SharedTest(
        creator_id=(
            current_user.id
        ),

        share_code=(
            share_code
        ),

        test_data=(
            serialized_test_data
        ),
    )

    db.add(
        shared_test
    )

    db.commit()

    db.refresh(
        shared_test
    )

    return convert_shared_test(
        shared_test,
        current_user.name,
    )


@router.get(
    "/{share_code}",
    response_model=(
        SharedTestResponse
    ),
)
def get_shared_test(
    share_code: str,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    normalized_share_code = (
        share_code
        .strip()
        .upper()
    )

    shared_test = (
        db.query(
            SharedTest
        )
        .filter(
            SharedTest.share_code
            ==
            normalized_share_code
        )
        .first()
    )

    if not shared_test:
        raise HTTPException(
            status_code=(
                status
                .HTTP_404_NOT_FOUND
            ),

            detail=(
                "Shared test was "
                "not found."
            ),
        )

    creator = (
        db.query(
            User
        )
        .filter(
            User.id
            ==
            shared_test.creator_id
        )
        .first()
    )

    creator_name = (
        creator.name

        if creator

        else

        "PatternPrep User"
    )

    return convert_shared_test(
        shared_test,
        creator_name,
    )