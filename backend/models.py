from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(
            timezone.utc
        ),
        nullable=False
    )


class SolvedQuestion(Base):
    __tablename__ = "solved_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    question_id = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(
            timezone.utc
        ),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "question_id",
            name=(
                "unique_user_"
                "solved_question"
            )
        ),
    )


class MockTest(Base):
    __tablename__ = "mock_tests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    test_id = Column(
        String,
        nullable=False,
        index=True
    )

    score = Column(
        Integer,
        nullable=False
    )

    question_count = Column(
        Integer,
        nullable=False
    )

    time_used = Column(
        Integer,
        default=0,
        nullable=False
    )

    submission_type = Column(
        String,
        default="manual",
        nullable=False
    )

    test_data = Column(
        Text,
        nullable=False
    )

    completed_at = Column(
        DateTime,
        default=lambda: datetime.now(
            timezone.utc
        ),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "test_id",
            name=(
                "unique_user_"
                "mock_test"
            )
        ),
    )


class SharedTest(Base):
    __tablename__ = "shared_tests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    creator_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    share_code = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    test_data = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(
            timezone.utc
        ),
        nullable=False
    )