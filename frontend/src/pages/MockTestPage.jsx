import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function formatTime(
  milliseconds
) {
  const totalSeconds =
    Math.max(
      0,
      Math.ceil(
        milliseconds / 1000
      )
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (
        totalSeconds % 3600
      )
      /
      60
    );

  const seconds =
    totalSeconds % 60;


  return [
    hours,
    minutes,
    seconds,
  ]
    .map(
      (value) =>
        String(value)
          .padStart(
            2,
            "0"
          )
    )
    .join(":");
}


function MockTestPage() {
  const navigate =
    useNavigate();


  const hasSubmitted =
    useRef(false);


  const [
    activeTest,
  ] = useState(() => {

    const savedTest =
      localStorage.getItem(
        "activeMockTest"
      );


    if (!savedTest) {
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
    responses,
    setResponses,
  ] = useState(() => {

    return (
      activeTest
        ?.responses

      ??

      {}
    );

  });


  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);


  const [
    remainingTime,
    setRemainingTime,
  ] = useState(() => {

    if (
      !activeTest
        ?.endTime
    ) {
      return 0;
    }


    return Math.max(

      0,

      activeTest.endTime
      -
      Date.now()

    );

  });


  const [
    warningMessage,
    setWarningMessage,
  ] = useState("");


  function saveCompletedTest(
    submissionType
  ) {

    if (
      !activeTest
      ||
      hasSubmitted.current
    ) {
      return;
    }


    hasSubmitted.current =
      true;


    const completedTest = {

      ...activeTest,

      responses,

      status:
        "completed",

      submissionType,

      submittedAt:
        Date.now(),

    };


    localStorage.setItem(

      "completedMockTest",

      JSON.stringify(
        completedTest
      )

    );


    localStorage.removeItem(
      "activeMockTest"
    );


    navigate(

      "/test-result",

      {
        replace: true,
      }

    );

  }


  useEffect(() => {

    if (
      !activeTest
        ?.endTime
    ) {
      return;
    }


    function updateTimer() {

      const timeLeft =
        Math.max(

          0,

          activeTest.endTime
          -
          Date.now()

        );


      setRemainingTime(
        timeLeft
      );


      if (
        timeLeft
        <=
        0
      ) {

        setWarningMessage(

          "Time is over. "
          +
          "Your test is being "
          +
          "submitted automatically."

        );


        saveCompletedTest(
          "automatic"
        );


        return;

      }


      if (
        timeLeft
        <=
        60 * 1000
      ) {

        setWarningMessage(
          "Only 1 minute remaining."
        );


        return;

      }


      if (
        timeLeft
        <=
        5 * 60 * 1000
      ) {

        setWarningMessage(
          "Only 5 minutes remaining."
        );


        return;

      }


      if (
        timeLeft
        <=
        10 * 60 * 1000
      ) {

        setWarningMessage(
          "Only 10 minutes remaining."
        );


        return;

      }


      setWarningMessage("");

    }


    updateTimer();


    const timer =
      setInterval(

        updateTimer,

        1000

      );


    return () =>

      clearInterval(
        timer
      );

  }, [
    activeTest,
    responses,
  ]);


  useEffect(() => {

    if (
      !activeTest
      ||
      hasSubmitted.current
    ) {
      return;
    }


    const updatedTest = {

      ...activeTest,

      responses,

    };


    localStorage.setItem(

      "activeMockTest",

      JSON.stringify(
        updatedTest
      )

    );

  }, [
    activeTest,
    responses,
  ]);


  if (
    !activeTest
    ||
    !Array.isArray(
      activeTest.questions
    )
    ||
    activeTest
      .questions
      .length
    ===
    0
  ) {

    return (

      <main
        className={
          "test-empty-page"
        }
      >

        <section
          className={
            "test-empty-card"
          }
        >

          <span
            className={
              "test-empty-icon"
            }
          >
            !
          </span>


          <span
            className={
              "test-empty-label"
            }
          >

            NO ACTIVE TEST

          </span>


          <h1>
            No mock test found
          </h1>


          <p>

            Generate and start a
            mock test before opening
            the test workspace.

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


  const questions =
    activeTest.questions;


  const currentQuestion =
    questions[
      currentQuestionIndex
    ];


  const responseKey =
    String(
      currentQuestion.id
    );


  const currentResponse =
    responses[
      responseKey
    ]

    ??

    {
      result: "",
    };


  const answeredQuestionCount =
    questions.filter(
      (question) => {

        const response =

          responses[
            String(
              question.id
            )
          ];


        return Boolean(
          response
            ?.result
        );

      }
    ).length;


  const progressPercentage =

    questions.length
    >
    0

      ?

      (
        answeredQuestionCount
        /
        questions.length
      )
      *
      100

      :

      0;


  function updateResponse(
    questionId,
    result
  ) {

    if (
      hasSubmitted.current
    ) {
      return;
    }


    const key =
      String(
        questionId
      );


    setResponses(

      (
        currentResponses
      ) => ({

        ...currentResponses,


        [key]: {

          ...(
            currentResponses[
              key
            ]

            ??

            {}
          ),

          result,

        },

      })

    );

  }


  function openQuestion(
    index
  ) {

    setCurrentQuestionIndex(
      index
    );


    window.scrollTo({

      top: 0,

      behavior:
        "smooth",

    });

  }


  function showPreviousQuestion() {

    setCurrentQuestionIndex(

      (
        currentIndex
      ) =>

        Math.max(

          0,

          currentIndex
          -
          1

        )

    );

  }


  function showNextQuestion() {

    setCurrentQuestionIndex(

      (
        currentIndex
      ) =>

        Math.min(

          questions.length
          -
          1,

          currentIndex
          +
          1

        )

    );

  }


  function handleSubmitTest() {

    const unansweredCount =

      questions.length

      -

      answeredQuestionCount;


    const confirmationMessage =

      unansweredCount
      >
      0

        ?

        (
          `You still have ${
            unansweredCount
          } unanswered question${
            unansweredCount
            ===
            1

              ?

              ""

              :

              "s"
          }. Submit the test anyway?`
        )

        :

        (
          "All questions have "
          +
          "been marked. Submit "
          +
          "your mock test?"
        );


    const confirmed =

      window.confirm(
        confirmationMessage
      );


    if (!confirmed) {
      return;
    }


    saveCompletedTest(
      "manual"
    );

  }


  return (

    <main
      className={
        "test-page"
      }
    >

      <div
        className={
          "test-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "test-background-grid"
          }
        />


        <div
          className={
            "test-background-glow"
          }
        />

      </div>


      <header
        className={
          "test-navbar"
        }
      >

        <div
          className={
            "test-brand"
          }
        >

          <span
            className={
              "test-brand-logo"
            }
          >
            P
          </span>


          <div>

            <strong>
              PatternPrep
            </strong>


            <small>
              MOCK TEST
            </small>

          </div>

        </div>


        <div
          className={
            warningMessage

              ?

              "test-timer "
              +
              "test-timer-warning"

              :

              "test-timer"
          }
        >

          <span>
            TIME REMAINING
          </span>


          <strong>

            {
              formatTime(
                remainingTime
              )
            }

          </strong>

        </div>


        <button
          type="button"
          className={
            "test-submit-top"
          }
          onClick={
            handleSubmitTest
          }
        >

          Submit Test

        </button>

      </header>


      {
        warningMessage
        &&
        (

          <div
            className={
              "test-warning"
            }
            role="alert"
          >

            <span>
              !
            </span>


            <strong>

              {
                warningMessage
              }

            </strong>

          </div>

        )
      }


      <section
        className={
          "test-progress-section"
        }
      >

        <div
          className={
            "test-progress-information"
          }
        >

          <div>

            <span>
              TEST PROGRESS
            </span>


            <strong>

              {
                answeredQuestionCount
              }

              {" of "}

              {
                questions.length
              }

              {" questions marked"}

            </strong>

          </div>


          <strong>

            {
              Math.round(
                progressPercentage
              )
            }

            {"%"}

          </strong>

        </div>


        <div
          className={
            "test-progress-track"
          }
        >

          <div

            className={
              "test-progress-fill"
            }

            style={{

              width:

                `${
                  progressPercentage
                }%`,

            }}

          />

        </div>

      </section>


      <div
        className={
          "test-workspace"
        }
      >

        <aside
          className={
            "test-question-sidebar"
          }
        >

          <div
            className={
              "test-sidebar-heading"
            }
          >

            <div>

              <span>
                QUESTIONS
              </span>


              <strong>

                {
                  questions.length
                }

              </strong>

            </div>


            <small>

              {
                answeredQuestionCount
              }

              {" marked"}

            </small>

          </div>


          <div
            className={
              "test-question-grid"
            }
          >

            {
              questions.map(
                (
                  question,
                  index
                ) => {

                  const questionResponse =

                    responses[
                      String(
                        question.id
                      )
                    ];


                  const isAnswered =

                    Boolean(
                      questionResponse
                        ?.result
                    );


                  const isCurrent =

                    index
                    ===
                    currentQuestionIndex;


                  return (

                    <button

                      key={
                        question
                          .titleSlug
                      }

                      type="button"

                      className={

                        `test-question-number
                        ${
                          isCurrent

                            ?

                            "current"

                            :

                            ""
                        }
                        ${
                          isAnswered

                            ?

                            "answered"

                            :

                            ""
                        }`

                      }

                      onClick={
                        () =>
                          openQuestion(
                            index
                          )
                      }

                    >

                      {
                        index + 1
                      }

                    </button>

                  );

                }
              )
            }

          </div>


          <div
            className={
              "test-sidebar-legend"
            }
          >

            <span>

              <i
                className={
                  "current"
                }
              />

              Current

            </span>


            <span>

              <i
                className={
                  "answered"
                }
              />

              Marked

            </span>


            <span>

              <i />

              Unmarked

            </span>

          </div>

        </aside>


        <section
          className={
            "test-question-panel"
          }
          key={
            currentQuestion
              .titleSlug
          }
        >

          <div
            className={
              "test-question-header"
            }
          >

            <div>

              <span
                className={
                  "test-question-label"
                }
              >

                QUESTION

                {" "}

                {
                  currentQuestionIndex
                  +
                  1
                }

                {" OF "}

                {
                  questions.length
                }

              </span>


              <div
                className={
                  "test-question-badges"
                }
              >

                <span

                  className={

                    `test-difficulty
                    test-difficulty-${
                      currentQuestion
                        .difficulty
                        .toLowerCase()
                    }`

                  }

                >

                  {
                    currentQuestion
                      .difficulty
                  }

                </span>


                <span

                  className={

                    currentQuestion
                      .previouslySolved

                      ?

                      "test-history-status "
                      +
                      "solved"

                      :

                      "test-history-status "
                      +
                      "new"

                  }

                >

                  {
                    currentQuestion
                      .previouslySolved

                      ?

                      "Previously Solved"

                      :

                      "New Question"
                  }

                </span>

              </div>

            </div>


            <span
              className={
                "test-question-id"
              }
            >

              #

              {
                currentQuestion.id
              }

            </span>

          </div>


          <div
            className={
              "test-question-title"
            }
          >

            <h1>

              {
                currentQuestion
                  .title
              }

            </h1>


            {
              Array.isArray(
                currentQuestion
                  .topics
              )

              &&

              currentQuestion
                .topics
                .length
              >
              0

              &&

              (

                <div
                  className={
                    "test-topic-list"
                  }
                >

                  {
                    currentQuestion
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
              "test-leetcode-area"
            }
          >

            <div>

              <span
                className={
                  "test-leetcode-icon"
                }
              >
                {"</>"}
              </span>


              <div>

                <strong>

                  Solve this question
                  on LeetCode

                </strong>


                <p>

                  Open the problem in
                  a new tab, solve it,
                  and return here to
                  record your result.

                </p>

              </div>

            </div>


            <a

              href={
                currentQuestion.url
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


          <fieldset
            className={
              "test-result-fieldset"
            }
          >

            <legend>
              How did this attempt go?
            </legend>


            <p>

              Select the result that
              best describes your
              attempt.

            </p>


            <div
              className={
                "test-result-options"
              }
            >

              {

                [

                  [

                    "solved_independently",

                    "Solved Independently",

                    "Completed without "
                    +
                    "using hints or "
                    +
                    "solutions.",

                    "✓",

                  ],


                  [

                    "solved_with_hint",

                    "Solved with Hint",

                    "Completed after "
                    +
                    "using one or "
                    +
                    "more hints.",

                    "✦",

                  ],


                  [

                    "viewed_solution",

                    "Viewed Solution",

                    "Understood the "
                    +
                    "approach after "
                    +
                    "viewing a solution.",

                    "◉",

                  ],


                  [

                    "could_not_solve",

                    "Could Not Solve",

                    "Attempted the "
                    +
                    "question but could "
                    +
                    "not complete it.",

                    "×",

                  ],


                  [

                    "not_attempted",

                    "Not Attempted",

                    "Skipped this "
                    +
                    "question during "
                    +
                    "the test.",

                    "—",

                  ],

                ].map(

                  ([
                    value,
                    label,
                    description,
                    icon,
                  ]) => (

                    <label

                      key={
                        value
                      }

                      className={

                        currentResponse
                          .result
                        ===
                        value

                          ?

                          "test-result-option "
                          +
                          "selected"

                          :

                          "test-result-option"

                      }

                    >

                      <input

                        type="radio"

                        name={
                          `result-${
                            responseKey
                          }`
                        }

                        value={
                          value
                        }

                        checked={

                          currentResponse
                            .result

                          ===

                          value

                        }

                        onChange={
                          () =>
                            updateResponse(

                              currentQuestion
                                .id,

                              value

                            )
                        }

                      />


                      <span
                        className={
                          "test-result-icon"
                        }
                      >

                        {icon}

                      </span>


                      <span
                        className={
                          "test-result-text"
                        }
                      >

                        <strong>

                          {
                            label
                          }

                        </strong>


                        <small>

                          {
                            description
                          }

                        </small>

                      </span>


                      <span
                        className={
                          "test-radio-mark"
                        }
                      />

                    </label>

                  )

                )

              }

            </div>

          </fieldset>


          <footer
            className={
              "test-question-footer"
            }
          >

            <button

              type="button"

              className={
                "test-navigation-button"
              }

              disabled={

                currentQuestionIndex
                ===
                0

              }

              onClick={
                showPreviousQuestion
              }

            >

              ← Previous

            </button>


            <span>

              Question

              {" "}

              {
                currentQuestionIndex
                +
                1
              }

              {" of "}

              {
                questions.length
              }

            </span>


            {

              currentQuestionIndex

              <

              questions.length
              -
              1

                ?

                (

                  <button

                    type="button"

                    className={
                      "test-next-button"
                    }

                    onClick={
                      showNextQuestion
                    }

                  >

                    Next Question

                    <span>
                      →
                    </span>

                  </button>

                )

                :

                (

                  <button

                    type="button"

                    className={
                      "test-finish-button"
                    }

                    onClick={
                      handleSubmitTest
                    }

                  >

                    Finish and Submit

                    <span>
                      ✓
                    </span>

                  </button>

                )

            }

          </footer>

        </section>

      </div>


      <footer
        className={
          "test-bottom-summary"
        }
      >

        <div>

          <strong>

            {
              answeredQuestionCount
            }

          </strong>


          <span>
            Marked
          </span>

        </div>


        <div>

          <strong>

            {
              questions.length

              -

              answeredQuestionCount
            }

          </strong>


          <span>
            Unmarked
          </span>

        </div>


        <div>

          <strong>

            {
              questions.length
            }

          </strong>


          <span>
            Total
          </span>

        </div>


        <button

          type="button"

          onClick={
            handleSubmitTest
          }

        >

          Submit Mock Test

          <span>
            →
          </span>

        </button>

      </footer>

    </main>

  );

}


export default MockTestPage;