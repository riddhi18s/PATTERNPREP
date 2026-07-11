import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


const resultDetails = {

  solved_independently: {

    label:
      "Solved Independently",

    shortLabel:
      "Independent",

    score:
      1,

    icon:
      "✓",

  },


  solved_with_hint: {

    label:
      "Solved with Hint",

    shortLabel:
      "With Hint",

    score:
      0.7,

    icon:
      "✦",

  },


  viewed_solution: {

    label:
      "Understood After Viewing Solution",

    shortLabel:
      "Viewed Solution",

    score:
      0.4,

    icon:
      "◉",

  },


  could_not_solve: {

    label:
      "Attempted but Could Not Solve",

    shortLabel:
      "Could Not Solve",

    score:
      0.1,

    icon:
      "×",

  },


  not_attempted: {

    label:
      "Not Attempted",

    shortLabel:
      "Not Attempted",

    score:
      0,

    icon:
      "—",

  },

};


const difficultyWeights = {

  Easy:
    1,

  Medium:
    2,

  Hard:
    3,

};


function formatDuration(
  milliseconds
) {

  const totalSeconds =

    Math.max(

      0,

      Math.floor(

        milliseconds

        /

        1000

      )

    );


  const hours =

    Math.floor(

      totalSeconds

      /

      3600

    );


  const minutes =

    Math.floor(

      (

        totalSeconds

        %

        3600

      )

      /

      60

    );


  const seconds =

    totalSeconds

    %

    60;


  return [

    hours,

    minutes,

    seconds,

  ]

    .map(

      (value) =>

        String(
          value
        )

          .padStart(

            2,

            "0"

          )

    )

    .join(":");

}


function getPerformance(
  score
) {

  if (
    score >= 90
  ) {

    return {

      grade:
        "S",

      title:
        "Exceptional Performance",

      message:

        "Excellent command of the selected "
        +
        "DSA concepts. Keep challenging "
        +
        "yourself with harder problems.",

    };

  }


  if (
    score >= 75
  ) {

    return {

      grade:
        "A",

      title:
        "Strong Performance",

      message:

        "You demonstrated a strong understanding "
        +
        "of the selected topics. Review the few "
        +
        "questions that caused difficulty.",

    };

  }


  if (
    score >= 60
  ) {

    return {

      grade:
        "B",

      title:
        "Good Progress",

      message:

        "Your preparation is moving in the right "
        +
        "direction. Review weaker topics before "
        +
        "attempting another test.",

    };

  }


  if (
    score >= 40
  ) {

    return {

      grade:
        "C",

      title:
        "Developing Foundation",

      message:

        "You understand several concepts, but "
        +
        "some important patterns need additional "
        +
        "practice and revision.",

    };

  }


  return {

    grade:
      "D",

    title:
      "More Practice Recommended",

    message:

      "Review the selected topics and study the "
      +
      "solutions of difficult questions before "
      +
      "creating your next mock test.",

  };

}


function TestResultPage() {

  const navigate =
    useNavigate();


  const [
    completedTest,
  ] = useState(() => {

    const savedTest =

      localStorage.getItem(

        "completedMockTest"

      );


    if (
      !savedTest
    ) {

      return null;

    }


    try {

      return JSON.parse(

        savedTest

      );

    } catch {

      return null;

    }

  });


  const [
    saveStatus,
    setSaveStatus,
  ] = useState(
    "saving"
  );


  const [
    saveMessage,
    setSaveMessage,
  ] = useState("");


  const resultSummary =

    useMemo(() => {

      if (
        !completedTest
      ) {

        return null;

      }


      const counts = {

        solved_independently:
          0,

        solved_with_hint:
          0,

        viewed_solution:
          0,

        could_not_solve:
          0,

        not_attempted:
          0,

      };


      let earnedWeightedScore =
        0;


      let maximumWeightedScore =
        0;


      const questions =

        Array.isArray(

          completedTest
            .questions

        )

          ?

          completedTest
            .questions

          :

          [];


      const questionResults =

        questions.map(

          (
            question,
            index
          ) => {

            const response =

              completedTest
                .responses
                ?.[

                  String(
                    question.id
                  )

                ]

              ??

              {};


            const result =

              response.result

              ||

              "not_attempted";


            const resultInformation =

              resultDetails[
                result
              ]

              ||

              resultDetails
                .not_attempted;


            const difficultyWeight =

              difficultyWeights[

                question
                  .difficulty

              ]

              ||

              1;


            const earnedQuestionWeight =

              resultInformation
                .score

              *

              difficultyWeight;


            if (

              Object.prototype

                .hasOwnProperty

                .call(

                  counts,

                  result

                )

            ) {

              counts[
                result
              ]

              +=

              1;

            } else {

              counts
                .not_attempted

              +=

              1;

            }


            earnedWeightedScore +=

              earnedQuestionWeight;


            maximumWeightedScore +=

              difficultyWeight;


            return {

              ...question,

              position:

                index + 1,

              result,

              resultLabel:

                resultInformation
                  .label,

              resultIcon:

                resultInformation
                  .icon,

              earnedQuestionWeight,

              maximumQuestionWeight:

                difficultyWeight,

            };

          }

        );


      const marksOutOf100 =

        maximumWeightedScore

        >

        0

          ?

          Math.round(

            (

              earnedWeightedScore

              /

              maximumWeightedScore

            )

            *

            100

          )

          :

          0;


      const startedAt =

        Number(

          completedTest
            .startedAt

        )

        ||

        0;


      const submittedAt =

        Number(

          completedTest
            .submittedAt

        )

        ||

        Date.now();


      const timeUsed =

        Math.max(

          0,

          submittedAt

          -

          startedAt

        );


      const attemptedCount =

        questions.length

        -

        counts
          .not_attempted;


      const attemptPercentage =

        questions.length

        >

        0

          ?

          Math.round(

            (

              attemptedCount

              /

              questions.length

            )

            *

            100

          )

          :

          0;


      return {

        counts,

        earnedWeightedScore,

        maximumWeightedScore,

        marksOutOf100,

        timeUsed,

        attemptedCount,

        attemptPercentage,

        questionResults,

      };

    }, [
      completedTest,
    ]);


  const performance =

    useMemo(() => {

      return getPerformance(

        resultSummary
          ?.marksOutOf100

        ??

        0

      );

    }, [
      resultSummary,
    ]);


  useEffect(() => {

    if (

      !completedTest

      ||

      !resultSummary

    ) {

      return;

    }


    const historyRecord = {

      ...completedTest,


      resultSummary: {

        marksOutOf100:

          resultSummary
            .marksOutOf100,

        counts:

          resultSummary
            .counts,

        timeUsed:

          resultSummary
            .timeUsed,

        attemptedCount:

          resultSummary
            .attemptedCount,

        attemptPercentage:

          resultSummary
            .attemptPercentage,

      },

    };


    const savedHistory =

      localStorage.getItem(

        "mockTestHistory"

      );


    let history = [];


    if (
      savedHistory
    ) {

      try {

        const parsedHistory =

          JSON.parse(

            savedHistory

          );


        if (

          Array.isArray(

            parsedHistory

          )

        ) {

          history =

            parsedHistory;

        }

      } catch {

        history = [];

      }

    }


    const alreadySaved =

      history.some(

        (test) =>

          String(
            test.id
          )

          ===

          String(
            completedTest.id
          )

      );


    if (
      !alreadySaved
    ) {

      localStorage.setItem(

        "mockTestHistory",


        JSON.stringify([

          historyRecord,

          ...history,

        ])

      );

    }


    async function
    saveTestToBackend() {

      const accessToken =

        localStorage.getItem(

          "accessToken"

        );


      if (
        !accessToken
      ) {

        setSaveStatus(
          "local"
        );


        setSaveMessage(

          "Result saved on this device."

        );


        return;

      }


      const testId =

        String(

          completedTest.id

          ||

          `test-${
            completedTest
              .submittedAt

            ||

            Date.now()
          }`

        );


      const completedAt =

        new Date(

          Number(

            completedTest
              .submittedAt

          )

          ||

          Date.now()

        )

          .toISOString();


      const requestBody = {

        test_id:

          testId,

        score:

          resultSummary
            .marksOutOf100,

        question_count:

          completedTest
            .questions
            ?.length

          ||

          0,

        time_used:

          resultSummary
            .timeUsed,

        submission_type:

          completedTest
            .submissionType

          ||

          "manual",

        completed_at:

          completedAt,

        test_data:

          historyRecord,

      };


      try {

        const response =

          await fetch(

            `${API_URL}/progress/mock-tests`,

            {

              method:
                "POST",


              headers: {

                "Content-Type":

                  "application/json",

                Authorization:

                  `Bearer ${
                    accessToken
                  }`,

              },


              body:

                JSON.stringify(

                  requestBody

                ),

            }

          );


        if (

          response.status

          ===

          401

        ) {

          setSaveStatus(
            "error"
          );


          setSaveMessage(

            "Your login session expired. "
            +
            "The result remains saved "
            +
            "on this device."

          );


          return;

        }


        if (
          !response.ok
        ) {

          const errorData =

            await response

              .json()

              .catch(

                () => ({})

              );


          throw new Error(

            typeof
            errorData.detail

            ===

            "string"

              ?

              errorData.detail

              :

              "The result could not "
              +
              "be saved to your account."

          );

        }


        setSaveStatus(
          "saved"
        );


        setSaveMessage(

          "Result saved to your "
          +
          "PatternPrep account."

        );

      } catch (
        error
      ) {

        setSaveStatus(
          "error"
        );


        setSaveMessage(

          error.message

          ||

          "The result is saved locally, "
          +
          "but could not be saved "
          +
          "to your account."

        );

      }

    }


    saveTestToBackend();

  }, [
    completedTest,
    resultSummary,
  ]);


  if (

    !completedTest

    ||

    !resultSummary

  ) {

    return (

      <main
        className={
          "result-empty-page"
        }
      >

        <section
          className={
            "result-empty-card"
          }
        >

          <span
            className={
              "result-empty-icon"
            }
          >
            ?
          </span>


          <span
            className={
              "result-eyebrow"
            }
          >

            NO RESULT FOUND

          </span>


          <h1>

            Complete a mock test

          </h1>


          <p>

            Submit a PatternPrep
            mock test to view your
            score and detailed
            performance analysis.

          </p>


          <button

            type="button"

            onClick={
              () =>

                navigate(

                  "/test-configuration"

                )
            }

          >

            Configure Mock Test

            <span>
              →
            </span>

          </button>

        </section>

      </main>

    );

  }


  const totalQuestions =

    resultSummary
      .questionResults
      .length;


  return (

    <main
      className={
        "result-page"
      }
    >

      <div

        className={
          "result-background"
        }

        aria-hidden="true"

      >

        <div
          className={
            "result-background-grid"
          }
        />


        <div
          className={
            "result-background-glow"
          }
        />

      </div>


      <header
        className={
          "result-navbar"
        }
      >

        <button

          type="button"

          className={
            "result-brand"
          }

          onClick={
            () =>

              navigate(
                "/dashboard"
              )
          }

        >

          <span>
            P
          </span>


          <div>

            <strong>
              PatternPrep
            </strong>


            <small>
              TEST ANALYSIS
            </small>

          </div>

        </button>


        <div
          className={
            "result-navbar-actions"
          }
        >

          <button

            type="button"

            onClick={
              () =>

                navigate(

                  "/test-history"

                )
            }

          >

            Test History

          </button>


          <button

            type="button"

            className={
              "result-dashboard-button"
            }

            onClick={
              () =>

                navigate(

                  "/dashboard"

                )
            }

          >

            Dashboard

          </button>

        </div>

      </header>


      <section
        className={
          "result-hero"
        }
      >

        <div
          className={
            "result-score-area"
          }
        >

          <div

            className={
              "result-score-circle"
            }

            style={{

              "--result-score":

                `${
                  resultSummary
                    .marksOutOf100
                }%`,

            }}

          >

            <div>

              <strong>

                {
                  resultSummary
                    .marksOutOf100
                }

              </strong>


              <span>
                / 100
              </span>

            </div>

          </div>


          <span
            className={
              "result-score-label"
            }
          >

            FINAL SCORE

          </span>

        </div>


        <div
          className={
            "result-hero-content"
          }
        >

          <span
            className={
              "result-eyebrow"
            }
          >

            MOCK TEST COMPLETE

          </span>


          <div
            className={
              "result-grade-row"
            }
          >

            <span
              className={
                "result-grade"
              }
            >

              {
                performance
                  .grade
              }

            </span>


            <div>

              <h1>

                {
                  performance
                    .title
                }

              </h1>


              <p>

                {
                  performance
                    .message
                }

              </p>

            </div>

          </div>


          <div
            className={
              "result-quick-stats"
            }
          >

            <div>

              <span>
                TIME USED
              </span>


              <strong>

                {
                  formatDuration(

                    resultSummary
                      .timeUsed

                  )
                }

              </strong>

            </div>


            <div>

              <span>
                ATTEMPTED
              </span>


              <strong>

                {
                  resultSummary
                    .attemptedCount
                }

                {" / "}

                {
                  totalQuestions
                }

              </strong>

            </div>


            <div>

              <span>
                ATTEMPT RATE
              </span>


              <strong>

                {
                  resultSummary
                    .attemptPercentage
                }

                {"%"}

              </strong>

            </div>

          </div>

        </div>

      </section>


      <div

        className={

          `result-save-message
          result-save-${
            saveStatus
          }`

        }

        role={

          saveStatus
          ===
          "error"

            ?

            "alert"

            :

            "status"

        }

      >

        <span>

          {
            saveStatus
            ===
            "saving"

              ?

              "↻"

              :

            saveStatus
            ===
            "saved"

              ?

              "✓"

              :

            saveStatus
            ===
            "local"

              ?

              "◉"

              :

              "!"
          }

        </span>


        <p>

          {
            saveStatus
            ===
            "saving"

              ?

              "Saving result to "
              +
              "your account..."

              :

              saveMessage
          }

        </p>

      </div>


      {

        completedTest
          .submissionType

        ===

        "automatic"

        &&

        (

          <div
            className={
              "result-auto-submit"
            }
            role="alert"
          >

            <span>
              !
            </span>


            <p>

              The timer ended and
              this test was submitted
              automatically.

            </p>

          </div>

        )

      }


      <section
        className={
          "result-summary-section"
        }
      >

        <div
          className={
            "result-section-heading"
          }
        >

          <div>

            <span>
              PERFORMANCE BREAKDOWN
            </span>


            <h2>
              Attempt Summary
            </h2>

          </div>


          <p>

            {
              totalQuestions
            }

            {" questions analyzed"}

          </p>

        </div>


        <div
          className={
            "result-summary-grid"
          }
        >

          {

            Object.entries(

              resultDetails

            ).map(

              ([
                resultKey,
                information,
              ]) => (

                <article

                  key={
                    resultKey
                  }

                  className={

                    `result-summary-card
                    result-card-${
                      resultKey
                    }`

                  }

                >

                  <span
                    className={
                      "result-summary-icon"
                    }
                  >

                    {
                      information
                        .icon
                    }

                  </span>


                  <strong>

                    {
                      resultSummary
                        .counts[
                          resultKey
                        ]
                    }

                  </strong>


                  <p>

                    {
                      information
                        .shortLabel
                    }

                  </p>

                </article>

              )

            )

          }

        </div>

      </section>


      <section
        className={
          "result-review-section"
        }
      >

        <div
          className={
            "result-section-heading"
          }
        >

          <div>

            <span>
              DETAILED ANALYSIS
            </span>


            <h2>
              Question Review
            </h2>

          </div>


          <p>

            Review every question
            and revisit it on
            LeetCode.

          </p>

        </div>


        <div
          className={
            "result-question-list"
          }
        >

          {

            resultSummary
              .questionResults
              .map(

                (
                  question
                ) => (

                  <article

                    key={

                      question
                        .titleSlug

                      ||

                      question.id

                    }

                    className={
                      "result-question-card"
                    }

                  >

                    <div
                      className={
                        "result-question-position"
                      }
                    >

                      <span>
                        QUESTION
                      </span>


                      <strong>

                        {

                          String(

                            question
                              .position

                          )

                            .padStart(

                              2,

                              "0"

                            )

                        }

                      </strong>

                    </div>


                    <div
                      className={
                        "result-question-information"
                      }
                    >

                      <div
                        className={
                          "result-question-meta"
                        }
                      >

                        <span

                          className={

                            `result-difficulty
                            result-difficulty-${
                              question
                                .difficulty
                                .toLowerCase()
                            }`

                          }

                        >

                          {
                            question
                              .difficulty
                          }

                        </span>


                        <span

                          className={

                            question
                              .previouslySolved

                              ?

                              "result-history-badge "
                              +
                              "solved"

                              :

                              "result-history-badge "
                              +
                              "new"

                          }

                        >

                          {

                            question
                              .previouslySolved

                              ?

                              "Previously Solved"

                              :

                              "New Question"

                          }

                        </span>

                      </div>


                      <h3>

                        {
                          question
                            .title
                        }

                      </h3>


                      {

                        Array.isArray(

                          question
                            .topics

                        )

                        &&

                        question
                          .topics
                          .length

                        >

                        0

                        &&

                        (

                          <div
                            className={
                              "result-topic-list"
                            }
                          >

                            {

                              question
                                .topics
                                .map(

                                  (
                                    topic
                                  ) => (

                                    <span
                                      key={
                                        topic
                                      }
                                    >

                                      {
                                        topic
                                      }

                                    </span>

                                  )

                                )

                            }

                          </div>

                        )

                      }

                    </div>


                    <div
                      className={
                        "result-question-outcome"
                      }
                    >

                      <span

                        className={

                          `result-outcome
                          result-outcome-${
                            question
                              .result
                          }`

                        }

                      >

                        <i>

                          {
                            question
                              .resultIcon
                          }

                        </i>


                        {
                          question
                            .resultLabel
                        }

                      </span>


                      <a

                        href={
                          question.url
                        }

                        target="_blank"

                        rel="noreferrer"

                      >

                        Open on LeetCode

                        <span>
                          ↗
                        </span>

                      </a>

                    </div>

                  </article>

                )

              )

          }

        </div>

      </section>


      <section
        className={
          "result-actions"
        }
      >

        <div>

          <span>
            READY FOR ANOTHER ROUND?
          </span>


          <h2>

            Keep building
            your pattern recognition.

          </h2>


          <p>

            Create another personalized
            test or review your previous
            attempts from test history.

          </p>

        </div>


        <div
          className={
            "result-action-buttons"
          }
        >

          <button

            type="button"

            className={
              "result-secondary-action"
            }

            onClick={
              () =>

                navigate(

                  "/test-history"

                )
            }

          >

            View Test History

          </button>


          <button

            type="button"

            className={
              "result-primary-action"
            }

            onClick={
              () =>

                navigate(

                  "/test-configuration"

                )
            }

          >

            Create Another Test

            <span>
              →
            </span>

          </button>

        </div>

      </section>

    </main>

  );

}


export default TestResultPage;