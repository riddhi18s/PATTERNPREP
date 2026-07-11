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
    label: "Solved Independently",
    shortLabel: "Independent",
    icon: "✓",
  },

  solved_with_hint: {
    label: "Solved with Hint",
    shortLabel: "With Hint",
    icon: "✦",
  },

  viewed_solution: {
    label: "Viewed Solution",
    shortLabel: "Solution",
    icon: "◉",
  },

  could_not_solve: {
    label: "Could Not Solve",
    shortLabel: "Unsolved",
    icon: "×",
  },

  not_attempted: {
    label: "Not Attempted",
    shortLabel: "Skipped",
    icon: "—",
  },
};


function formatDate(
  dateValue
) {
  if (!dateValue) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  const numericDate =
    Number(dateValue);

  const date =
    Number.isNaN(numericDate)
      ? new Date(dateValue)
      : new Date(numericDate);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  return {
    date:
      date.toLocaleDateString(
        undefined,
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

    time:
      date.toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
  };
}


function formatDuration(
  milliseconds
) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        Number(
          milliseconds
        ) / 1000
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
      ) / 60
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


function getGrade(
  score
) {
  if (score >= 90) {
    return "S";
  }

  if (score >= 75) {
    return "A";
  }

  if (score >= 60) {
    return "B";
  }

  if (score >= 40) {
    return "C";
  }

  return "D";
}


function TestHistoryPage() {
  const navigate =
    useNavigate();

  const [
    testHistory,
    setTestHistory,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    deletingTestId,
    setDeletingTestId,
  ] = useState(null);

  const [
    isClearing,
    setIsClearing,
  ] = useState(false);

  const [
    expandedTestId,
    setExpandedTestId,
  ] = useState(null);


  useEffect(() => {
    async function
    loadTestHistory() {
      const accessToken =
        localStorage.getItem(
          "accessToken"
        );

      if (!accessToken) {
        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/progress/mock-tests`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },
            }
          );

        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            "accessToken"
          );

          localStorage.removeItem(
            "user"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            "Could not load your test history."
          );
        }

        const savedTests =
          await response.json();

        const convertedHistory =
          Array.isArray(
            savedTests
          )
            ? savedTests.map(
                (
                  savedTest
                ) => {
                  const testData =
                    savedTest
                      .test_data
                    ?? {};

                  return {
                    ...testData,

                    id:
                      testData.id
                      ??
                      savedTest
                        .test_id,

                    backendTestId:
                      savedTest
                        .test_id,

                    submittedAt:
                      testData
                        .submittedAt
                      ??
                      new Date(
                        savedTest
                          .completed_at
                      )
                        .getTime(),

                    submissionType:
                      testData
                        .submissionType
                      ??
                      savedTest
                        .submission_type,

                    resultSummary: {
                      ...(
                        testData
                          .resultSummary
                        ??
                        {}
                      ),

                      marksOutOf100:
                        testData
                          .resultSummary
                          ?.marksOutOf100
                        ??
                        savedTest
                          .score,

                      timeUsed:
                        testData
                          .resultSummary
                          ?.timeUsed
                        ??
                        savedTest
                          .time_used,
                    },
                  };
                }
              )
            : [];

        setTestHistory(
          convertedHistory
        );

        localStorage.setItem(
          "mockTestHistory",
          JSON.stringify(
            convertedHistory
          )
        );

      } catch (error) {
        const localHistory =
          localStorage.getItem(
            "mockTestHistory"
          );

        if (localHistory) {
          try {
            const parsedHistory =
              JSON.parse(
                localHistory
              );

            if (
              Array.isArray(
                parsedHistory
              )
            ) {
              setTestHistory(
                parsedHistory
              );
            }

          } catch {
            setTestHistory([]);
          }
        }

        setMessage(
          error.message
          ||
          "Backend history could not be loaded."
        );

      } finally {
        setIsLoading(false);
      }
    }

    loadTestHistory();

  }, [
    navigate,
  ]);


  const sortedHistory =
    useMemo(() => {
      return [
        ...testHistory,
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

    }, [
      testHistory,
    ]);


  const historyStatistics =
    useMemo(() => {
      if (
        sortedHistory.length
        === 0
      ) {
        return {
          totalTests: 0,
          latestScore: 0,
          bestScore: 0,
          averageScore: 0,
        };
      }

      const scores =
        sortedHistory.map(
          (test) =>
            Number(
              test
                .resultSummary
                ?.marksOutOf100
              ?? 0
            )
        );

      const totalScore =
        scores.reduce(
          (
            total,
            score
          ) =>
            total + score,
          0
        );

      return {
        totalTests:
          sortedHistory.length,

        latestScore:
          scores[0],

        bestScore:
          Math.max(
            ...scores
          ),

        averageScore:
          Math.round(
            totalScore
            /
            scores.length
          ),
      };

    }, [
      sortedHistory,
    ]);


  function updateLocalHistory(
    updatedHistory
  ) {
    setTestHistory(
      updatedHistory
    );

    localStorage.setItem(
      "mockTestHistory",
      JSON.stringify(
        updatedHistory
      )
    );
  }


  function handleViewResult(
    test
  ) {
    localStorage.setItem(
      "completedMockTest",
      JSON.stringify(test)
    );

    navigate(
      "/test-result"
    );
  }


  function toggleTestDetails(
    testId
  ) {
    setExpandedTestId(
      (currentId) =>
        currentId === testId
          ? null
          : testId
    );
  }


  async function
  handleDeleteTest(
    test
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this test from your history?"
      );

    if (!confirmed) {
      return;
    }

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const testId =
      String(
        test.backendTestId
        ??
        test.id
      );

    setDeletingTestId(
      testId
    );

    setMessage("");

    try {
      const response =
        await fetch(
          `${API_URL}/progress/mock-tests/${
            encodeURIComponent(
              testId
            )
          }`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "user"
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(
              () => ({})
            );

        throw new Error(
          errorData.detail
          ||
          "The test could not be deleted."
        );
      }

      const updatedHistory =
        testHistory.filter(
          (
            savedTest
          ) =>
            String(
              savedTest
                .backendTestId
              ??
              savedTest.id
            )
            !==
            testId
        );

      updateLocalHistory(
        updatedHistory
      );

      if (
        expandedTestId
        === testId
      ) {
        setExpandedTestId(
          null
        );
      }

      setMessage(
        "Test deleted successfully."
      );

    } catch (error) {
      setMessage(
        error.message
        ||
        "The test could not be deleted."
      );

    } finally {
      setDeletingTestId(
        null
      );
    }
  }


  async function
  handleClearHistory() {
    if (
      testHistory.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete your entire mock-test history?"
      );

    if (!confirmed) {
      return;
    }

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    setIsClearing(true);

    setMessage("");

    try {
      const response =
        await fetch(
          `${API_URL}/progress/mock-tests`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "user"
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(
              () => ({})
            );

        throw new Error(
          errorData.detail
          ||
          "Test history could not be cleared."
        );
      }

      setTestHistory([]);

      setExpandedTestId(
        null
      );

      localStorage.removeItem(
        "mockTestHistory"
      );

      setMessage(
        "Test history cleared successfully."
      );

    } catch (error) {
      setMessage(
        error.message
        ||
        "Test history could not be cleared."
      );

    } finally {
      setIsClearing(false);
    }
  }


  if (isLoading) {
    return (
      <main
        className={
          "history-loading-page"
        }
      >
        <div
          className={
            "history-loader"
          }
        >
          <span />
          <span />
          <span />
        </div>

        <span
          className={
            "history-eyebrow"
          }
        >
          PATTERNPREP
        </span>

        <h1>
          Loading test history
        </h1>

        <p>
          Retrieving your previous
          mock-test performance.
        </p>
      </main>
    );
  }


  return (
    <main
      className="history-page"
    >

      <div
        className={
          "history-background"
        }
        aria-hidden="true"
      >
        <div
          className={
            "history-background-grid"
          }
        />

        <div
          className={
            "history-background-glow"
          }
        />
      </div>


      <header
        className={
          "history-navbar"
        }
      >

        <button
          type="button"
          className={
            "history-brand"
          }
          onClick={() =>
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
              PERFORMANCE ARCHIVE
            </small>
          </div>
        </button>


        <div
          className={
            "history-navbar-actions"
          }
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              "history-create-button"
            }
            onClick={() =>
              navigate(
                "/test-configuration"
              )
            }
          >
            New Mock Test

            <span>
              +
            </span>
          </button>
        </div>

      </header>


      <section
        className={
          "history-hero"
        }
      >

        <div>
          <span
            className={
              "history-eyebrow"
            }
          >
            YOUR PROGRESS
          </span>

          <h1>
            Mock Test

            <span>
              {" "}
              History
            </span>
          </h1>

          <p>
            Track every attempt,
            compare your scores,
            and identify the DSA
            patterns that need
            more practice.
          </p>
        </div>


        <div
          className={
            "history-hero-visual"
          }
        >
          <div
            className={
              "history-orbit "
              +
              "history-orbit-one"
            }
          />

          <div
            className={
              "history-orbit "
              +
              "history-orbit-two"
            }
          />

          <div
            className={
              "history-hero-score"
            }
          >
            <span>
              BEST
            </span>

            <strong>
              {
                historyStatistics
                  .bestScore
              }
            </strong>

            <small>
              / 100
            </small>
          </div>
        </div>

      </section>


      {message && (
        <div
          className={
            "history-message"
          }
          role="status"
        >
          <span>
            i
          </span>

          <p>
            {message}
          </p>
        </div>
      )}


      {
        sortedHistory.length
        === 0
        ? (
          <section
            className={
              "history-empty"
            }
          >
            <div
              className={
                "history-empty-icon"
              }
            >
              0
            </div>

            <span
              className={
                "history-eyebrow"
              }
            >
              NO ATTEMPTS YET
            </span>

            <h2>
              Your test history
              is waiting.
            </h2>

            <p>
              Complete your first
              personalized DSA mock
              test and your score,
              attempts, and question
              analysis will appear
              here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/test-configuration"
                )
              }
            >
              Create First Mock Test

              <span>
                →
              </span>
            </button>
          </section>
        )
        : (
          <>

            <section
              className={
                "history-statistics"
              }
            >

              <article>
                <span>
                  TOTAL TESTS
                </span>

                <strong>
                  {
                    historyStatistics
                      .totalTests
                  }
                </strong>

                <p>
                  Completed attempts
                </p>
              </article>


              <article>
                <span>
                  LATEST SCORE
                </span>

                <strong>
                  {
                    historyStatistics
                      .latestScore
                  }

                  <small>
                    /100
                  </small>
                </strong>

                <p>
                  Most recent result
                </p>
              </article>


              <article>
                <span>
                  BEST SCORE
                </span>

                <strong>
                  {
                    historyStatistics
                      .bestScore
                  }

                  <small>
                    /100
                  </small>
                </strong>

                <p>
                  Personal best
                </p>
              </article>


              <article>
                <span>
                  AVERAGE SCORE
                </span>

                <strong>
                  {
                    historyStatistics
                      .averageScore
                  }

                  <small>
                    /100
                  </small>
                </strong>

                <p>
                  Across all tests
                </p>
              </article>

            </section>


            <section
              className={
                "history-records-section"
              }
            >

              <div
                className={
                  "history-section-heading"
                }
              >

                <div>
                  <span>
                    COMPLETE ARCHIVE
                  </span>

                  <h2>
                    Previous Attempts
                  </h2>
                </div>

                <button
                  type="button"
                  className={
                    "history-clear-button"
                  }
                  disabled={
                    isClearing
                  }
                  onClick={
                    handleClearHistory
                  }
                >
                  {
                    isClearing
                      ? "Clearing..."
                      : "Clear History"
                  }
                </button>

              </div>


              <div
                className={
                  "history-record-list"
                }
              >

                {
                  sortedHistory.map(
                    (
                      test,
                      index
                    ) => {

                      const summary =
                        test
                          .resultSummary
                        ?? {};

                      const score =
                        Number(
                          summary
                            .marksOutOf100
                          ?? 0
                        );

                      const counts =
                        summary
                          .counts
                        ?? {};

                      const questions =
                        Array.isArray(
                          test.questions
                        )
                          ? test.questions
                          : [];

                      const testId =
                        String(
                          test
                            .backendTestId
                          ??
                          test.id
                          ??
                          index
                        );

                      const isExpanded =
                        expandedTestId
                        === testId;

                      const completedDate =
                        formatDate(
                          test
                            .submittedAt
                        );

                      const grade =
                        getGrade(
                          score
                        );

                      return (
                        <article
                          key={testId}
                          className={
                            `history-record ${
                              isExpanded
                                ? "history-record-expanded"
                                : ""
                            }`
                          }
                        >

                          <div
                            className={
                              "history-record-main"
                            }
                          >

                            <div
                              className={
                                "history-record-number"
                              }
                            >
                              <span>
                                TEST
                              </span>

                              <strong>
                                {
                                  String(
                                    sortedHistory
                                      .length
                                    -
                                    index
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
                                "history-record-information"
                              }
                            >

                              <div
                                className={
                                  "history-record-tags"
                                }
                              >

                                <span>
                                  {
                                    test
                                      .configuration
                                      ?.testMode
                                    ??
                                    "Mock Test"
                                  }
                                </span>

                                <span
                                  className={
                                    test
                                      .submissionType
                                    ===
                                    "automatic"
                                      ? "automatic"
                                      : "manual"
                                  }
                                >
                                  {
                                    test
                                      .submissionType
                                    ===
                                    "automatic"
                                      ? "Auto Submitted"
                                      : "Manual Submit"
                                  }
                                </span>

                              </div>


                              <h3>
                                Personalized
                                DSA Mock Test
                              </h3>


                              <div
                                className={
                                  "history-record-meta"
                                }
                              >
                                <span>
                                  {
                                    completedDate
                                      .date
                                  }
                                </span>

                                <i>
                                  •
                                </i>

                                <span>
                                  {
                                    completedDate
                                      .time
                                  }
                                </span>

                                <i>
                                  •
                                </i>

                                <span>
                                  {
                                    questions
                                      .length
                                  }

                                  {" questions"}
                                </span>

                                <i>
                                  •
                                </i>

                                <span>
                                  {
                                    formatDuration(
                                      summary
                                        .timeUsed
                                      ?? 0
                                    )
                                  }
                                </span>
                              </div>

                            </div>


                            <div
                              className={
                                "history-record-score"
                              }
                            >
                              <span>
                                Grade {grade}
                              </span>

                              <strong>
                                {score}
                              </strong>

                              <small>
                                / 100
                              </small>
                            </div>


                            <div
                              className={
                                "history-record-actions"
                              }
                            >

                              <button
                                type="button"
                                className={
                                  "history-details-button"
                                }
                                onClick={() =>
                                  toggleTestDetails(
                                    testId
                                  )
                                }
                              >
                                {
                                  isExpanded
                                    ? "Hide Details"
                                    : "View Details"
                                }

                                <span
                                  className={
                                    isExpanded
                                      ? "expanded"
                                      : ""
                                  }
                                >
                                  ↓
                                </span>
                              </button>


                              <button
                                type="button"
                                className={
                                  "history-result-button"
                                }
                                onClick={() =>
                                  handleViewResult(
                                    test
                                  )
                                }
                              >
                                Full Result

                                <span>
                                  →
                                </span>
                              </button>


                              <button
                                type="button"
                                className={
                                  "history-delete-button"
                                }
                                disabled={
                                  deletingTestId
                                  === testId
                                }
                                onClick={() =>
                                  handleDeleteTest(
                                    test
                                  )
                                }
                              >
                                {
                                  deletingTestId
                                  === testId
                                    ? "Deleting..."
                                    : "Delete"
                                }
                              </button>

                            </div>

                          </div>


                          {isExpanded && (
                            <div
                              className={
                                "history-record-details"
                              }
                            >

                              <div
                                className={
                                  "history-attempt-breakdown"
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
                                      <div
                                        key={
                                          resultKey
                                        }
                                        className={
                                          `history-attempt-item history-attempt-${resultKey}`
                                        }
                                      >
                                        <span>
                                          {
                                            information
                                              .icon
                                          }
                                        </span>

                                        <strong>
                                          {
                                            counts[
                                              resultKey
                                            ]
                                            ?? 0
                                          }
                                        </strong>

                                        <p>
                                          {
                                            information
                                              .shortLabel
                                          }
                                        </p>
                                      </div>
                                    )
                                  )
                                }

                              </div>


                              <div
                                className={
                                  "history-question-heading"
                                }
                              >
                                <h4>
                                  Questions
                                  in this test
                                </h4>

                                <span>
                                  {
                                    questions
                                      .length
                                  }

                                  {" total"}
                                </span>
                              </div>


                              <div
                                className={
                                  "history-question-list"
                                }
                              >

                                {
                                  questions.map(
                                    (
                                      question,
                                      questionIndex
                                    ) => {

                                      const response =
                                        test
                                          .responses
                                          ?.[
                                            String(
                                              question.id
                                            )
                                          ]
                                        ?? {};

                                      const result =
                                        response
                                          .result
                                        ??
                                        "not_attempted";

                                      const information =
                                        resultDetails[
                                          result
                                        ]
                                        ??
                                        resultDetails
                                          .not_attempted;

                                      return (
                                        <div
                                          key={
                                            question
                                              .titleSlug
                                            ??
                                            question.id
                                            ??
                                            questionIndex
                                          }
                                          className={
                                            "history-question"
                                          }
                                        >

                                          <span
                                            className={
                                              "history-question-number"
                                            }
                                          >
                                            {
                                              String(
                                                questionIndex
                                                + 1
                                              )
                                                .padStart(
                                                  2,
                                                  "0"
                                                )
                                            }
                                          </span>


                                          <div
                                            className={
                                              "history-question-info"
                                            }
                                          >

                                            <div>
                                              <span
                                                className={
                                                  `history-difficulty history-difficulty-${
                                                    String(
                                                      question
                                                        .difficulty
                                                      ??
                                                      "easy"
                                                    )
                                                      .toLowerCase()
                                                  }`
                                                }
                                              >
                                                {
                                                  question
                                                    .difficulty
                                                  ??
                                                  "Unknown"
                                                }
                                              </span>

                                              {
                                                question
                                                  .previouslySolved
                                                &&
                                                (
                                                  <span
                                                    className={
                                                      "history-previously-solved"
                                                    }
                                                  >
                                                    Previously
                                                    Solved
                                                  </span>
                                                )
                                              }
                                            </div>

                                            <h4>
                                              {
                                                question
                                                  .title
                                              }
                                            </h4>

                                          </div>


                                          <span
                                            className={
                                              `history-question-result history-question-result-${result}`
                                            }
                                          >
                                            <i>
                                              {
                                                information
                                                  .icon
                                              }
                                            </i>

                                            {
                                              information
                                                .label
                                            }
                                          </span>


                                          <a
                                            href={
                                              question.url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            LeetCode

                                            <span>
                                              ↗
                                            </span>
                                          </a>

                                        </div>
                                      );
                                    }
                                  )
                                }

                              </div>

                            </div>
                          )}

                        </article>
                      );
                    }
                  )
                }

              </div>

            </section>

          </>
        )
      }


      <section
        className={
          "history-bottom-action"
        }
      >

        <div>
          <span>
            KEEP IMPROVING
          </span>

          <h2>
            Ready for your
            next challenge?
          </h2>

          <p>
            Generate another mock
            test based on your
            preparation and continue
            improving your DSA
            pattern recognition.
          </p>
        </div>


        <div>
          <button
            type="button"
            className={
              "history-dashboard-button"
            }
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            className={
              "history-new-test-button"
            }
            onClick={() =>
              navigate(
                "/test-configuration"
              )
            }
          >
            Create New Test

            <span>
              →
            </span>
          </button>
        </div>

      </section>

    </main>
  );
}


export default TestHistoryPage;