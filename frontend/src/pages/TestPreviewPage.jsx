import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function TestPreviewPage() {
  const navigate =
    useNavigate();


  const [mockTest] =
    useState(() => {

      const savedTest =
        localStorage.getItem(
          "generatedMockTest"
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


  const testSummary =
    useMemo(() => {

      if (!mockTest) {

        return {
          solved: 0,
          unsolved: 0,
          easy: 0,
          medium: 0,
          hard: 0,
        };

      }


      const questions =
        Array.isArray(
          mockTest.questions
        )

          ?

          mockTest.questions

          :

          [];


      return {

        solved:
          questions.filter(
            (question) =>
              question
                .previouslySolved
          ).length,


        unsolved:
          questions.filter(
            (question) =>
              !question
                .previouslySolved
          ).length,


        easy:
          questions.filter(
            (question) =>
              question
                .difficulty
                .toLowerCase()
              ===
              "easy"
          ).length,


        medium:
          questions.filter(
            (question) =>
              question
                .difficulty
                .toLowerCase()
              ===
              "medium"
          ).length,


        hard:
          questions.filter(
            (question) =>
              question
                .difficulty
                .toLowerCase()
              ===
              "hard"
          ).length,

      };

    }, [
      mockTest,
    ]);


  if (!mockTest) {

    return (

      <main
        className={
          "preview-empty-page"
        }
      >

        <div
          className={
            "preview-empty-background"
          }
        />


        <section
          className={
            "preview-empty-card"
          }
        >

          <span
            className={
              "preview-empty-icon"
            }
          >
            !
          </span>


          <span
            className={
              "preview-empty-eyebrow"
            }
          >

            NO GENERATED TEST

          </span>


          <h1>
            Mock test not found
          </h1>


          <p>

            Create a new mock-test
            configuration before
            opening the preview.

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

            Configure New Test

            <span>
              →
            </span>

          </button>

        </section>

      </main>

    );

  }


  const configuration =
    mockTest.configuration
    ||
    {};


  const questions =
    Array.isArray(
      mockTest.questions
    )

      ?

      mockTest.questions

      :

      [];


  const difficultyDistribution =
    configuration
      .difficultyDistribution

    ||

    {};


  const selectedTopics =
    Array.isArray(
      configuration
        .selectedTopics
    )

      ?

      configuration
        .selectedTopics

      :

      [];


  function handleStartTest() {

    const startedAt =
      Date.now();


    const endTime =
      startedAt

      +

      Number(
        configuration.duration
        ||
        60
      )

      *

      60

      *

      1000;


    const activeMockTest = {

      ...mockTest,

      status:
        "in-progress",

      startedAt,

      endTime,

      responses: {},

    };


    localStorage.setItem(

      "activeMockTest",

      JSON.stringify(
        activeMockTest
      )

    );


    navigate(
      "/mock-test"
    );

  }


  return (

    <main
      className={
        "preview-page"
      }
    >

      <div
        className={
          "preview-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "preview-background-grid"
          }
        />


        <div
          className={
            "preview-orb "
            +
            "preview-orb-one"
          }
        />


        <div
          className={
            "preview-orb "
            +
            "preview-orb-two"
          }
        />

      </div>


      <header
        className={
          "preview-navbar"
        }
      >

        <button
          type="button"
          className={
            "preview-brand"
          }
          onClick={
            () =>
              navigate(
                "/dashboard"
              )
          }
        >

          <span
            className={
              "preview-brand-logo"
            }
          >
            P
          </span>


          <span>
            PatternPrep
          </span>

        </button>


        <div
          className={
            "preview-status"
          }
        >

          <span
            className={
              "preview-status-dot"
            }
          />


          <div>

            <small>
              TEST STATUS
            </small>


            <strong>
              Ready to Start
            </strong>

          </div>

        </div>


        <button
          type="button"
          className={
            "preview-back-button"
          }
          onClick={
            () =>
              navigate(
                "/test-configuration"
              )
          }
        >

          ← Edit Configuration

        </button>

      </header>


      <section
        className={
          "preview-hero"
        }
      >

        <div
          className={
            "preview-hero-content"
          }
        >

          <span
            className={
              "preview-eyebrow"
            }
          >

            YOUR TEST IS READY

          </span>


          <h1>

            Review before

            <span>
              you begin.
            </span>

          </h1>


          <p>

            Check the test structure,
            difficulty distribution,
            selected topics, and
            generated questions.
            The timer will begin only
            after you select Start
            Mock Test.

          </p>


          <div
            className={
              "preview-hero-actions"
            }
          >

            <button
              type="button"
              className={
                "preview-start-button"
              }
              onClick={
                handleStartTest
              }
            >

              Start Mock Test

              <span>
                →
              </span>

            </button>


            <button
              type="button"
              className={
                "preview-edit-button"
              }
              onClick={
                () =>
                  navigate(
                    "/test-configuration"
                  )
              }
            >

              Edit Configuration

            </button>

          </div>

        </div>


        <aside
          className={
            "preview-countdown-card"
          }
        >

          <div
            className={
              "preview-countdown-heading"
            }
          >

            <span>
              TEST OVERVIEW
            </span>


            <span
              className={
                "preview-live-dot"
              }
            />

          </div>


          <div
            className={
              "preview-time-display"
            }
          >

            <strong>

              {
                configuration
                  .duration
              }

            </strong>


            <div>

              <span>
                MINUTES
              </span>


              <p>
                total time limit
              </p>

            </div>

          </div>


          <div
            className={
              "preview-overview-grid"
            }
          >

            <div>

              <strong>

                {
                  questions.length
                }

              </strong>


              <span>
                Questions
              </span>

            </div>


            <div>

              <strong>

                {
                  selectedTopics
                    .length
                }

              </strong>


              <span>
                Topics
              </span>

            </div>


            <div>

              <strong>

                {
                  configuration
                    .testMode
                }

              </strong>


              <span>
                Mode
              </span>

            </div>

          </div>

        </aside>

      </section>


      <section
        className={
          "preview-stat-grid"
        }
      >

        <article
          className={
            "preview-stat-card"
          }
        >

          <span
            className={
              "preview-stat-icon"
            }
          >
            ◫
          </span>


          <div>

            <small>
              TOTAL QUESTIONS
            </small>


            <strong>

              {
                questions.length
              }

            </strong>


            <p>
              Generated for this test
            </p>

          </div>

        </article>


        <article
          className={
            "preview-stat-card"
          }
        >

          <span
            className={
              "preview-stat-icon"
            }
          >
            ↻
          </span>


          <div>

            <small>
              PREVIOUSLY SOLVED
            </small>


            <strong>

              {
                testSummary
                  .solved
              }

            </strong>


            <p>
              Revision questions
            </p>

          </div>

        </article>


        <article
          className={
            "preview-stat-card"
          }
        >

          <span
            className={
              "preview-stat-icon"
            }
          >
            ✦
          </span>


          <div>

            <small>
              NEW QUESTIONS
            </small>


            <strong>

              {
                testSummary
                  .unsolved
              }

            </strong>


            <p>
              New challenges
            </p>

          </div>

        </article>


        <article
          className={
            "preview-stat-card"
          }
        >

          <span
            className={
              "preview-stat-icon"
            }
          >
            ◷
          </span>


          <div>

            <small>
              TIME LIMIT
            </small>


            <strong>

              {
                configuration
                  .duration
              }

            </strong>


            <p>
              Minutes available
            </p>

          </div>

        </article>

      </section>


      <section
        className={
          "preview-details-section"
        }
      >

        <div
          className={
            "preview-section-heading"
          }
        >

          <div>

            <span>
              TEST STRUCTURE
            </span>


            <h2>
              Your test at a glance
            </h2>


            <p>

              Review the selected
              mode, difficulty mix,
              and included topics.

            </p>

          </div>


          <span
            className={
              "preview-mode-badge"
            }
          >

            {
              configuration
                .testMode
            }

            {" Mode"}

          </span>

        </div>


        <div
          className={
            "preview-difficulty-grid"
          }
        >

          <article
            className={
              "preview-difficulty-card "
              +
              "preview-easy-card"
            }
          >

            <div>

              <span
                className={
                  "preview-difficulty-dot"
                }
              />


              <div>

                <strong>
                  Easy
                </strong>


                <small>
                  Foundation
                </small>

              </div>

            </div>


            <strong>

              {
                difficultyDistribution
                  .Easy

                ??

                testSummary
                  .easy
              }

            </strong>

          </article>


          <article
            className={
              "preview-difficulty-card "
              +
              "preview-medium-card"
            }
          >

            <div>

              <span
                className={
                  "preview-difficulty-dot"
                }
              />


              <div>

                <strong>
                  Medium
                </strong>


                <small>
                  Interview level
                </small>

              </div>

            </div>


            <strong>

              {
                difficultyDistribution
                  .Medium

                ??

                testSummary
                  .medium
              }

            </strong>

          </article>


          <article
            className={
              "preview-difficulty-card "
              +
              "preview-hard-card"
            }
          >

            <div>

              <span
                className={
                  "preview-difficulty-dot"
                }
              />


              <div>

                <strong>
                  Hard
                </strong>


                <small>
                  Advanced
                </small>

              </div>

            </div>


            <strong>

              {
                difficultyDistribution
                  .Hard

                ??

                testSummary
                  .hard
              }

            </strong>

          </article>

        </div>


        <div
          className={
            "preview-topic-area"
          }
        >

          <span>
            INCLUDED TOPICS
          </span>


          <div
            className={
              "preview-topic-list"
            }
          >

            {
              selectedTopics
                .length
              >
              0

                ?

                selectedTopics.map(
                  (
                    topic,
                    index
                  ) => (

                    <span
                      key={
                        topic
                      }
                      style={{
                        "--preview-topic-delay":
                          `${
                            index
                            *
                            35
                          }ms`,
                      }}
                    >

                      {topic}

                    </span>

                  )
                )

                :

                (

                  <p>

                    No topic
                    information
                    is available.

                  </p>

                )
            }

          </div>

        </div>

      </section>


      <section
        className={
          "preview-question-section"
        }
      >

        <div
          className={
            "preview-section-heading"
          }
        >

          <div>

            <span>
              GENERATED QUESTIONS
            </span>


            <h2>
              Question lineup
            </h2>


            <p>

              The test contains the
              following personalized
              question set.

            </p>

          </div>


          <div
            className={
              "preview-question-count"
            }
          >

            <strong>

              {
                questions.length
              }

            </strong>


            <span>
              questions
            </span>

          </div>

        </div>


        <div
          className={
            "preview-question-list"
          }
        >

          {
            questions.map(
              (
                question,
                index
              ) => (

                <article
                  key={
                    question
                      .titleSlug
                  }
                  className={
                    "preview-question-card"
                  }
                  style={{
                    "--preview-question-delay":
                      `${
                        index
                        *
                        70
                      }ms`,
                  }}
                >

                  <span
                    className={
                      "preview-question-number"
                    }
                  >

                    {
                      String(
                        index + 1
                      )
                      .padStart(
                        2,
                        "0"
                      )
                    }

                  </span>


                  <div
                    className={
                      "preview-question-content"
                    }
                  >

                    <div
                      className={
                        "preview-question-labels"
                      }
                    >

                      <span
                        className={

                          `preview-difficulty-badge
                          preview-difficulty-${
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

                            "preview-history-badge "
                            +
                            "preview-history-solved"

                            :

                            "preview-history-badge "
                            +
                            "preview-history-new"

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

                  </div>


                  <span
                    className={
                      "preview-question-ready"
                    }
                  >
                    ✓
                  </span>

                </article>

              )
            )
          }

        </div>

      </section>


      <section
        className={
          "preview-instructions"
        }
      >

        <div
          className={
            "preview-instruction-heading"
          }
        >

          <span>
            i
          </span>


          <div>

            <h2>
              Before you start
            </h2>


            <p>

              A few things to know
              before beginning your
              mock test.

            </p>

          </div>

        </div>


        <div
          className={
            "preview-instruction-grid"
          }
        >

          <div>

            <strong>
              01
            </strong>


            <p>

              The timer starts
              immediately after you
              click Start Mock Test.

            </p>

          </div>


          <div>

            <strong>
              02
            </strong>


            <p>

              Your test is submitted
              automatically when the
              time limit expires.

            </p>

          </div>


          <div>

            <strong>
              03
            </strong>


            <p>

              Use the LeetCode link
              provided during the
              test to solve each
              question.

            </p>

          </div>


          <div>

            <strong>
              04
            </strong>


            <p>

              Mark every attempted
              question before
              submitting your test.

            </p>

          </div>

        </div>

      </section>


      <footer
        className={
          "preview-action-bar"
        }
      >

        <div
          className={
            "preview-ready-status"
          }
        >

          <span>
            ✓
          </span>


          <div>

            <strong>
              Your mock test is ready
            </strong>


            <p>

              {
                questions.length
              }

              {" questions • "}

              {
                configuration
                  .duration
              }

              {" minutes • "}

              {
                configuration
                  .testMode
              }

              {" mode"}

            </p>

          </div>

        </div>


        <div
          className={
            "preview-footer-actions"
          }
        >

          <button
            type="button"
            className={
              "preview-footer-edit"
            }
            onClick={
              () =>
                navigate(
                  "/test-configuration"
                )
            }
          >

            Edit Test

          </button>


          <button
            type="button"
            className={
              "preview-footer-start"
            }
            onClick={
              handleStartTest
            }
          >

            Start Mock Test

            <span>
              →
            </span>

          </button>

        </div>

      </footer>

    </main>

  );

}


export default TestPreviewPage;