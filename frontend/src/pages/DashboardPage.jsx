import {
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function DashboardPage() {
  const navigate =
    useNavigate();


  const accessToken =
    localStorage.getItem(
      "accessToken"
    );


  const storedUser =
    localStorage.getItem(
      "user"
    );


  let user = null;


  try {
    user = storedUser
      ?
      JSON.parse(
        storedUser
      )
      :
      null;
  } catch {
    user = null;
  }


  const dashboardData =
    useMemo(() => {

      let history = [];

      let solvedIds = [];


      try {
        const savedHistory =
          localStorage.getItem(
            "mockTestHistory"
          );

        const parsedHistory =
          savedHistory
            ?
            JSON.parse(
              savedHistory
            )
            :
            [];

        history =
          Array.isArray(
            parsedHistory
          )
            ?
            parsedHistory
            :
            [];

      } catch {
        history = [];
      }


      try {
        const savedSolvedIds =
          localStorage.getItem(
            "solvedQuestionIds"
          );

        const parsedSolvedIds =
          savedSolvedIds
            ?
            JSON.parse(
              savedSolvedIds
            )
            :
            [];

        solvedIds =
          Array.isArray(
            parsedSolvedIds
          )
            ?
            parsedSolvedIds
            :
            [];

      } catch {
        solvedIds = [];
      }


      const sortedHistory = [
        ...history,
      ].sort(
        (
          firstTest,
          secondTest
        ) =>
          Number(
            secondTest
              .submittedAt
          )
          -
          Number(
            firstTest
              .submittedAt
          )
      );


      const scores =
        history.map(
          (test) =>
            Number(
              test
                .resultSummary
                ?.marksOutOf100
              ??
              0
            )
        );


      const latestTest =
        sortedHistory[0]
        ??
        null;


      const latestScore =
        latestTest

          ?
          Number(
            latestTest
              .resultSummary
              ?.marksOutOf100
            ??
            0
          )

          :
          null;


      const bestScore =
        scores.length > 0

          ?
          Math.max(
            ...scores
          )

          :
          null;


      const averageScore =
        scores.length > 0

          ?
          Math.round(
            scores.reduce(
              (
                total,
                score
              ) =>
                total
                +
                score,

              0
            )
            /
            scores.length
          )

          :
          null;


      return {
        history,

        latestTest,

        totalTests:
          history.length,

        solvedQuestions:
          solvedIds.length,

        latestScore,

        bestScore,

        averageScore,
      };

    }, []);


  useEffect(
    () => {

      if (
        !accessToken
        ||
        !user
      ) {
        navigate(
          "/login",
          {
            replace:
              true,
          }
        );
      }

    },
    [
      accessToken,
      user,
      navigate,
    ]
  );


  function handleLogout() {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/",
      {
        replace:
          true,
      }
    );
  }


  function getFirstName() {
    const name =
      user?.name
        ?.trim();

    if (!name) {
      return "Learner";
    }

    return (
      name.split(
        " "
      )[0]
    );
  }


  function getInitial() {
    return (
      getFirstName()
        .charAt(0)
        .toUpperCase()
    );
  }


  if (
    !accessToken
    ||
    !user
  ) {
    return null;
  }


  return (
    <main
      className={
        "dashboard-page"
      }
    >

      <div
        className={
          "dashboard-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "dashboard-orb "
            +
            "dashboard-orb-one"
          }
        />

        <div
          className={
            "dashboard-orb "
            +
            "dashboard-orb-two"
          }
        />

      </div>


      <header
        className={
          "dashboard-navbar"
        }
      >

        <button
          type="button"
          className={
            "dashboard-brand"
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
              "dashboard-brand-logo"
            }
          >
            P
          </span>

          <span>
            PatternPrep
          </span>

        </button>


        <nav
          className={
            "dashboard-nav-links"
          }
        >

          <button
            type="button"
            className={
              "dashboard-nav-active"
            }
          >
            Dashboard
          </button>


          <button
            type="button"
            onClick={
              () =>
                navigate(
                  "/preparation-setup"
                )
            }
          >
            Preparation
          </button>


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

        </nav>


        <div
          className={
            "dashboard-profile"
          }
        >

          <div
            className={
              "dashboard-avatar"
            }
          >
            {getInitial()}
          </div>


          <div
            className={
              "dashboard-user-details"
            }
          >

            <strong>
              {user.name}
            </strong>

            <span>
              {user.email}
            </span>

          </div>


          <button
            type="button"
            className={
              "dashboard-logout"
            }
            onClick={
              handleLogout
            }
          >
            Log Out
          </button>

        </div>

      </header>


      <section
        className={
          "dashboard-hero"
        }
      >

        <div
          className={
            "dashboard-welcome"
          }
        >

          <span
            className={
              "dashboard-eyebrow"
            }
          >
            YOUR PREPARATION
            WORKSPACE
          </span>


          <h1>

            Welcome back,

            <span>
              {getFirstName()}.
            </span>

          </h1>


          <p>

            Continue your DSA
            preparation, create a
            personalized mock test,
            or review your previous
            performance.

          </p>


          <div
            className={
              "dashboard-hero-actions"
            }
          >

            <button
              type="button"
              className={
                "dashboard-primary-action"
              }
              onClick={
                () =>
                  navigate(
                    "/test-configuration"
                  )
              }
            >

              Create Mock Test

              <span>
                →
              </span>

            </button>


            <button
              type="button"
              className={
                "dashboard-secondary-action"
              }
              onClick={
                () =>
                  navigate(
                    "/preparation-setup"
                  )
              }
            >

              Update Preparation

            </button>

          </div>

        </div>


        <div
          className={
            "dashboard-score-card"
          }
        >

          <div
            className={
              "dashboard-score-heading"
            }
          >

            <span>
              LATEST PERFORMANCE
            </span>

            <div
              className={
                "dashboard-live-dot"
              }
            />

          </div>


          <div
            className={
              "dashboard-score-ring"
            }
          >

            <div>

              <strong>

                {
                  dashboardData
                    .latestScore
                  ??
                  "—"
                }

              </strong>

              <span>
                / 100
              </span>

            </div>

          </div>


          <p>

            {
              dashboardData
                .latestScore
              !==
              null

                ?
                (
                  dashboardData
                    .latestScore
                  >=
                  75

                    ?
                    "Strong performance. Keep building consistency."

                    :
                    "Review your attempted questions and try another focused test."
                )

                :
                "Complete your first mock test to generate a performance score."
            }

          </p>


          <button
            type="button"
            onClick={
              () =>
                navigate(
                  dashboardData
                    .totalTests
                  >
                  0

                    ?
                    "/test-history"

                    :
                    "/test-configuration"
                )
            }
          >

            {
              dashboardData
                .totalTests
              >
              0

                ?
                "View Test History"

                :
                "Start First Test"
            }

          </button>

        </div>

      </section>


      <section
        className={
          "dashboard-stat-grid"
        }
      >

        <article
          className={
            "dashboard-stat-card"
          }
        >

          <div
            className={
              "dashboard-stat-icon"
            }
          >
            ✓
          </div>


          <span>
            SOLVED QUESTIONS
          </span>


          <strong>
            {
              dashboardData
                .solvedQuestions
            }
          </strong>


          <p>
            Questions marked as
            completed
          </p>

        </article>


        <article
          className={
            "dashboard-stat-card"
          }
        >

          <div
            className={
              "dashboard-stat-icon"
            }
          >
            ◇
          </div>


          <span>
            TESTS COMPLETED
          </span>


          <strong>
            {
              dashboardData
                .totalTests
            }
          </strong>


          <p>
            Mock tests submitted
          </p>

        </article>


        <article
          className={
            "dashboard-stat-card"
          }
        >

          <div
            className={
              "dashboard-stat-icon"
            }
          >
            ↗
          </div>


          <span>
            BEST SCORE
          </span>


          <strong>

            {
              dashboardData
                .bestScore
              !==
              null

                ?
                `${dashboardData.bestScore}`

                :
                "—"
            }

            <small>
              /100
            </small>

          </strong>


          <p>
            Highest test score
          </p>

        </article>


        <article
          className={
            "dashboard-stat-card"
          }
        >

          <div
            className={
              "dashboard-stat-icon"
            }
          >
            ≈
          </div>


          <span>
            AVERAGE SCORE
          </span>


          <strong>

            {
              dashboardData
                .averageScore
              !==
              null

                ?
                `${dashboardData.averageScore}`

                :
                "—"
            }

            <small>
              /100
            </small>

          </strong>


          <p>
            Average across all
            tests
          </p>

        </article>

      </section>


      <section
        className={
          "dashboard-content-grid"
        }
      >

        <article
          className={
            "dashboard-panel "
            +
            "dashboard-quick-panel"
          }
        >

          <div
            className={
              "dashboard-panel-heading"
            }
          >

            <div>

              <span>
                QUICK ACTIONS
              </span>

              <h2>
                What do you want
                to do?
              </h2>

            </div>

          </div>


          <div
            className={
              "dashboard-action-grid"
            }
          >

            <button
              type="button"
              onClick={
                () =>
                  navigate(
                    "/preparation-setup"
                  )
              }
            >

              <span
                className={
                  "dashboard-action-icon"
                }
              >
                ◎
              </span>


              <div>

                <strong>
                  Preparation Setup
                </strong>

                <p>
                  Select topics and
                  set your current
                  preparation level.
                </p>

              </div>


              <span>
                →
              </span>

            </button>


            <button
              type="button"
              onClick={
                () =>
                  navigate(
                    "/question-selection"
                  )
              }
            >

              <span
                className={
                  "dashboard-action-icon"
                }
              >
                ✓
              </span>


              <div>

                <strong>
                  Solved Questions
                </strong>

                <p>
                  Mark questions you
                  have already
                  completed.
                </p>

              </div>


              <span>
                →
              </span>

            </button>


            <button
              type="button"
              onClick={
                () =>
                  navigate(
                    "/test-configuration"
                  )
              }
            >

              <span
                className={
                  "dashboard-action-icon"
                }
              >
                ◇
              </span>


              <div>

                <strong>
                  Create Mock Test
                </strong>

                <p>
                  Configure topics,
                  difficulty, and
                  test duration.
                </p>

              </div>


              <span>
                →
              </span>

            </button>


            <button
              type="button"
              onClick={
                () =>
                  navigate(
                    "/test-history"
                  )
              }
            >

              <span
                className={
                  "dashboard-action-icon"
                }
              >
                ↗
              </span>


              <div>

                <strong>
                  Test History
                </strong>

                <p>
                  Review scores and
                  attempted
                  questions.
                </p>

              </div>


              <span>
                →
              </span>

            </button>

          </div>

        </article>


        <article
          className={
            "dashboard-panel "
            +
            "dashboard-progress-panel"
          }
        >

          <div
            className={
              "dashboard-panel-heading"
            }
          >

            <div>

              <span>
                PROGRESS
              </span>

              <h2>
                Preparation
                overview
              </h2>

            </div>

          </div>


          <div
            className={
              "dashboard-progress-item"
            }
          >

            <div>

              <span>
                Questions solved
              </span>

              <strong>

                {
                  dashboardData
                    .solvedQuestions
                }

              </strong>

            </div>


            <div
              className={
                "dashboard-progress-track"
              }
            >

              <span
                style={{
                  width:
                    `${Math.min(
                      dashboardData
                        .solvedQuestions,
                      100
                    )}%`,
                }}
              />

            </div>

          </div>


          <div
            className={
              "dashboard-progress-item"
            }
          >

            <div>

              <span>
                Best performance
              </span>

              <strong>

                {
                  dashboardData
                    .bestScore
                  ??
                  0
                }

                %

              </strong>

            </div>


            <div
              className={
                "dashboard-progress-track"
              }
            >

              <span
                style={{
                  width:
                    `${
                      dashboardData
                        .bestScore
                      ??
                      0
                    }%`,
                }}
              />

            </div>

          </div>


          <div
            className={
              "dashboard-progress-message"
            }
          >

            <span>
              ✦
            </span>


            <p>

              {
                dashboardData
                  .totalTests
                >
                0

                  ?
                  "Use your test history to identify weak topics before creating your next mock test."

                  :
                  "Complete your first mock test to start building your performance history."
              }

            </p>

          </div>

        </article>

      </section>

    </main>
  );
}


export default DashboardPage;