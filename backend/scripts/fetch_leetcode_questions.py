import json
import time
from pathlib import Path

import requests


GRAPHQL_URL = "https://leetcode.com/graphql/"

BATCH_SIZE = 100

REQUEST_DELAY_SECONDS = 0.75


QUERY = """
query problemsetQuestionListV2(
  $filters: QuestionFilterInput
  $limit: Int
  $skip: Int
) {
  problemsetQuestionListV2(
    filters: $filters
    limit: $limit
    skip: $skip
  ) {
    totalLength

    questions {
      questionFrontendId
      title
      titleSlug
      difficulty
      paidOnly
      acRate

      topicTags {
        name
      }
    }
  }
}
"""


def find_project_root():

    script_path = Path(
        __file__
    ).resolve()

    for parent in script_path.parents:

        backend_folder = (
            parent / "backend"
        )

        frontend_folder = (
            parent / "frontend"
        )

        if (
            backend_folder.is_dir()
            and frontend_folder.is_dir()
        ):

            return parent

    raise RuntimeError(
        "PatternPrep project root "
        "could not be found. "
        "Keep this script inside "
        "backend/scripts."
    )


def fetch_batch(
    session,
    skip
):

    payload = {

        "operationName":
            "problemsetQuestionListV2",

        "query":
            QUERY,

        "variables": {

            "skip":
                skip,

            "limit":
                BATCH_SIZE,

            "filters": {

                "filterCombineType":
                    "ALL"
            }
        }
    }

    response = session.post(

        GRAPHQL_URL,

        json=payload,

        timeout=45
    )

    if not response.ok:

        print()

        print(
            "LeetCode returned "
            f"HTTP {response.status_code}."
        )

        print()

        print(
            "Response from LeetCode:"
        )

        print(
            response.text[:5000]
        )

        response.raise_for_status()

    result = response.json()

    if result.get("errors"):

        raise RuntimeError(

            "LeetCode GraphQL error:\n"

            + json.dumps(

                result["errors"],

                indent=2
            )
        )

    question_list = (

        result

        .get(
            "data",
            {}
        )

        .get(
            "problemsetQuestionListV2"
        )
    )

    if question_list is None:

        raise RuntimeError(

            "Question data was missing "
            "from the response:\n"

            + json.dumps(

                result,

                indent=2

            )[:5000]
        )

    return question_list


def normalize_question(
    question
):

    raw_id = question.get(
        "questionFrontendId"
    )

    try:

        question_id = int(
            raw_id
        )

    except (
        TypeError,
        ValueError
    ):

        question_id = raw_id

    acceptance_rate = (
        question.get(
            "acRate"
        )
    )

    if acceptance_rate is not None:

        acceptance_rate = round(

            float(
                acceptance_rate
            ),

            2
        )

    title_slug = question[
        "titleSlug"
    ]

    return {

        "id":
            question_id,

        "title":
            question[
                "title"
            ],

        "titleSlug":
            title_slug,

        "difficulty":
            question[
                "difficulty"
            ],

        "topics": [

            topic[
                "name"
            ]

            for topic in question.get(

                "topicTags",

                []
            )
        ],

        "acceptanceRate":
            acceptance_rate,

        "url": (

            "https://leetcode.com/"

            f"problems/{title_slug}/"
        )
    }


def question_sort_key(
    question
):

    question_id = (
        question["id"]
    )

    if isinstance(
        question_id,
        int
    ):

        return (

            0,

            question_id
        )

    return (

        1,

        str(
            question_id
        )
    )


def main():

    project_root = (
        find_project_root()
    )

    output_path = (

        project_root

        / "frontend"

        / "src"

        / "data"

        / "leetcode_questions.json"
    )

    output_path.parent.mkdir(

        parents=True,

        exist_ok=True
    )

    session = (
        requests.Session()
    )

    session.headers.update({

        "Accept":
            "application/json",

        "Content-Type":
            "application/json",

        "Origin":
            "https://leetcode.com",

        "Referer":
            (
                "https://leetcode.com/"
                "problemset/"
            ),

        "User-Agent":
            (
                "Mozilla/5.0 "
                "PatternPrep "
                "Local Dataset Updater"
            )
    })

    questions_by_slug = {}

    skip = 0

    total = None

    print(
        "Fetching public "
        "LeetCode questions..."
    )

    while (

        total is None

        or skip < total

    ):

        batch = fetch_batch(

            session,

            skip
        )

        total = batch[
            "totalLength"
        ]

        questions = batch[
            "questions"
        ]

        if not questions:

            break

        for question in questions:

            if question.get(
                "paidOnly"
            ):

                continue

            normalized = (
                normalize_question(
                    question
                )
            )

            questions_by_slug[

                normalized[
                    "titleSlug"
                ]

            ] = normalized

        skip += len(
            questions
        )

        print(

            f"Processed "

            f"{min(skip, total)}"

            f"/{total}; "

            f"kept "

            f"{len(questions_by_slug)} "

            f"public questions."
        )

        time.sleep(
            REQUEST_DELAY_SECONDS
        )

    public_questions = sorted(

        questions_by_slug.values(),

        key=question_sort_key
    )

    with output_path.open(

        "w",

        encoding="utf-8"

    ) as json_file:

        json.dump(

            public_questions,

            json_file,

            ensure_ascii=False,

            indent=2
        )

    print()

    print(

        f"Saved "

        f"{len(public_questions)} "

        f"public questions."
    )

    print()

    print(
        "JSON file created at:"
    )

    print(
        output_path
    )


if __name__ == "__main__":

    main()