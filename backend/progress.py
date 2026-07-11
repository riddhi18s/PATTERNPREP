import json
from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db

from models import (
    MockTest,
    SolvedQuestion,
    User,
)

from schemas import (
    MessageResponse,
    MockTestCreate,
    MockTestResponse,
    SolvedQuestionsResponse,
    SolvedQuestionsUpdate,
)

from security import get_current_user


router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)


@router.get(
    "/solved-questions",
    response_model=(
        SolvedQuestionsResponse
    ),
)
def get_solved_questions(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):
    solved_questions = (
        db.query(
            SolvedQuestion
        )
        .filter(
            SolvedQuestion.user_id
            ==
            current_user.id
        )
        .order_by(
            SolvedQuestion.id.asc()
        )
        .all()
    )

    return {
        "question_ids": [
            solved_question.question_id

            for solved_question
            in solved_questions
        ]
    }


@router.put(
    "/solved-questions",
    response_model=(
        SolvedQuestionsResponse
    ),
)
def replace_solved_questions(
    solved_data:
        SolvedQuestionsUpdate,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    normalized_question_ids = sorted(
        {
            str(question_id)

            for question_id
            in solved_data.question_ids
        }
    )

    (
        db.query(
            SolvedQuestion
        )
        .filter(
            SolvedQuestion.user_id
            ==
            current_user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    for question_id in (
        normalized_question_ids
    ):
        solved_question = (
            SolvedQuestion(
                user_id=(
                    current_user.id
                ),
                question_id=(
                    question_id
                ),
            )
        )

        db.add(
            solved_question
        )

    db.commit()

    return {
        "question_ids":
            normalized_question_ids
    }


@router.post(
    "/mock-tests",
    response_model=(
        MockTestResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def save_mock_test(
    test:
        MockTestCreate,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    existing_test = (
        db.query(
            MockTest
        )
        .filter(
            MockTest.user_id
            ==
            current_user.id,

            MockTest.test_id
            ==
            test.test_id,
        )
        .first()
    )

    completed_at = (
        test.completed_at
        or
        datetime.now(
            timezone.utc
        )
    )

    serialized_test_data = (
        json.dumps(
            test.test_data,
            ensure_ascii=False,
        )
    )

    if existing_test:
        existing_test.score = (
            test.score
        )

        existing_test.question_count = (
            test.question_count
        )

        existing_test.time_used = (
            test.time_used
        )

        existing_test.submission_type = (
            test.submission_type
        )

        existing_test.test_data = (
            serialized_test_data
        )

        existing_test.completed_at = (
            completed_at
        )

        saved_test = (
            existing_test
        )

    else:
        saved_test = MockTest(
            user_id=(
                current_user.id
            ),

            test_id=(
                test.test_id
            ),

            score=(
                test.score
            ),

            question_count=(
                test.question_count
            ),

            time_used=(
                test.time_used
            ),

            submission_type=(
                test.submission_type
            ),

            test_data=(
                serialized_test_data
            ),

            completed_at=(
                completed_at
            ),
        )

        db.add(
            saved_test
        )

    db.commit()

    db.refresh(
        saved_test
    )

    return convert_mock_test(
        saved_test
    )


@router.get(
    "/mock-tests",
    response_model=list[
        MockTestResponse
    ],
)
def get_mock_test_history(
    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    saved_tests = (
        db.query(
            MockTest
        )
        .filter(
            MockTest.user_id
            ==
            current_user.id
        )
        .order_by(
            MockTest
            .completed_at
            .desc()
        )
        .all()
    )

    return [
        convert_mock_test(
            saved_test
        )

        for saved_test
        in saved_tests
    ]


@router.get(
    "/mock-tests/{test_id}",
    response_model=(
        MockTestResponse
    ),
)
def get_mock_test(
    test_id: str,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    saved_test = (
        db.query(
            MockTest
        )
        .filter(
            MockTest.user_id
            ==
            current_user.id,

            MockTest.test_id
            ==
            test_id,
        )
        .first()
    )

    if not saved_test:
        raise HTTPException(
            status_code=(
                status
                .HTTP_404_NOT_FOUND
            ),
            detail=(
                "Mock test was "
                "not found."
            ),
        )

    return convert_mock_test(
        saved_test
    )


@router.delete(
    "/mock-tests/{test_id}",
    response_model=(
        MessageResponse
    ),
)
def delete_mock_test(
    test_id: str,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    saved_test = (
        db.query(
            MockTest
        )
        .filter(
            MockTest.user_id
            ==
            current_user.id,

            MockTest.test_id
            ==
            test_id,
        )
        .first()
    )

    if not saved_test:
        raise HTTPException(
            status_code=(
                status
                .HTTP_404_NOT_FOUND
            ),
            detail=(
                "Mock test was "
                "not found."
            ),
        )

    db.delete(
        saved_test
    )

    db.commit()

    return {
        "message":
            "Mock test deleted "
            "successfully."
    }


@router.delete(
    "/mock-tests",
    response_model=(
        MessageResponse
    ),
)
def clear_mock_test_history(
    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    (
        db.query(
            MockTest
        )
        .filter(
            MockTest.user_id
            ==
            current_user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    return {
        "message":
            "Mock-test history "
            "cleared successfully."
    }


def convert_mock_test(
    saved_test: MockTest
):
    try:
        test_data = json.loads(
            saved_test.test_data
        )

    except (
        TypeError,
        json.JSONDecodeError,
    ):
        test_data = {}

    return {
        "id":
            saved_test.id,

        "test_id":
            saved_test.test_id,

        "score":
            saved_test.score,

        "question_count":
            saved_test.question_count,

        "time_used":
            saved_test.time_used,

        "submission_type":
            saved_test
            .submission_type,

        "completed_at":
            saved_test
            .completed_at,

        "test_data":
            test_data,
    }