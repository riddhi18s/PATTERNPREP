import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import questions from "../data/leetcode_questions.json";


const API_URL =
  "https://patternprep.onrender.com";

const QUESTIONS_PER_PAGE = 50;


function QuestionSelectionPage() {
  const navigate =
    useNavigate();


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState("All");


  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState("All");


  const [
    showSolvedOnly,
    setShowSolvedOnly,
  ] = useState(false);


  const [
    solvedQuestionIds,
    setSolvedQuestionIds,
  ] = useState([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  useEffect(() => {
    async function loadSolvedQuestions() {
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
            `${API_URL}/progress/solved-questions`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },
            }
          );


        if (
          response.status
          ===
          401
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
            "Could not load solved questions."
          );
        }


        const data =
          await response.json();


        const loadedIds =
          Array.isArray(
            data.question_ids
          )
            ?
            data.question_ids.map(
              (questionId) =>
                String(
                  questionId
                )
            )
            :
            [];


        setSolvedQuestionIds(
          loadedIds
        );


        localStorage.setItem(
          "solvedQuestionIds",

          JSON.stringify(
            loadedIds
          )
        );

      } catch {
        const saved =
          localStorage.getItem(
            "solvedQuestionIds"
          );


        if (saved) {
          try {
            const parsedIds =
              JSON.parse(
                saved
              );


            if (
              Array.isArray(
                parsedIds
              )
            ) {
              setSolvedQuestionIds(
                parsedIds.map(
                  (questionId) =>
                    String(
                      questionId
                    )
                )
              );
            }

          } catch {
            setSolvedQuestionIds(
              []
            );
          }
        }


        setMessage(
          "Backend progress could not be loaded. "
          +
          "Your locally saved progress is being shown."
        );

      } finally {
        setIsLoading(
          false
        );
      }
    }


    loadSolvedQuestions();

  }, [
    navigate,
  ]);


  useEffect(
    () => {
      setCurrentPage(1);
    },
    [
      search,
      selectedTopic,
      selectedDifficulty,
      showSolvedOnly,
    ]
  );


  const topics =
    useMemo(
      () => {
        const topicSet =
          new Set();


        questions.forEach(
          (question) => {
            question.topics.forEach(
              (topic) => {
                topicSet.add(
                  topic
                );
              }
            );
          }
        );


        return Array
          .from(
            topicSet
          )
          .sort();

      },
      []
    );


  const filteredQuestions =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase()
            .replace(
              /^#/,
              ""
            );


        return questions.filter(
          (question) => {
            const normalizedId =
              String(
                question.id
              );


            const normalizedTitle =
              question.title
                .toLowerCase();


            const matchesSearch =
              normalizedSearch
              ===
              ""

              ||

              normalizedId
                .includes(
                  normalizedSearch
                )

              ||

              normalizedTitle
                .includes(
                  normalizedSearch
                );


            const matchesTopic =
              selectedTopic
              ===
              "All"

              ||

              question.topics
                .includes(
                  selectedTopic
                );


            const matchesDifficulty =
              selectedDifficulty
              ===
              "All"

              ||

              question.difficulty
                .toLowerCase()
              ===
              selectedDifficulty
                .toLowerCase();


            const matchesSolved =
              !showSolvedOnly

              ||

              solvedQuestionIds
                .includes(
                  normalizedId
                );


            return (
              matchesSearch

              &&

              matchesTopic

              &&

              matchesDifficulty

              &&

              matchesSolved
            );
          }
        );

      },
      [
        search,
        selectedTopic,
        selectedDifficulty,
        showSolvedOnly,
        solvedQuestionIds,
      ]
    );


  const totalPages =
    Math.max(
      1,

      Math.ceil(
        filteredQuestions.length
        /
        QUESTIONS_PER_PAGE
      )
    );


  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );


  const firstQuestionIndex =
    (
      safeCurrentPage
      -
      1
    )
    *
    QUESTIONS_PER_PAGE;


  const visibleQuestions =
    filteredQuestions.slice(
      firstQuestionIndex,

      firstQuestionIndex
      +
      QUESTIONS_PER_PAGE
    );


  const difficultySummary =
    useMemo(
      () => {
        let easy = 0;

        let medium = 0;

        let hard = 0;


        questions.forEach(
          (question) => {
            const normalizedId =
              String(
                question.id
              );


            if (
              !solvedQuestionIds
                .includes(
                  normalizedId
                )
            ) {
              return;
            }


            const difficulty =
              question.difficulty
                .toLowerCase();


            if (
              difficulty
              ===
              "easy"
            ) {
              easy += 1;
            }


            if (
              difficulty
              ===
              "medium"
            ) {
              medium += 1;
            }


            if (
              difficulty
              ===
              "hard"
            ) {
              hard += 1;
            }
          }
        );


        return {
          easy,
          medium,
          hard,
        };

      },
      [
        solvedQuestionIds,
      ]
    );


  function toggleSolvedQuestion(
    questionId
  ) {
    const normalizedId =
      String(
        questionId
      );


    setSolvedQuestionIds(
      (currentIds) => {
        if (
          currentIds.includes(
            normalizedId
          )
        ) {
          return currentIds.filter(
            (id) =>
              id
              !==
              normalizedId
          );
        }


        return [
          ...currentIds,
          normalizedId,
        ];
      }
    );


    setMessage("");
  }


  function clearFilters() {
    setSearch("");

    setSelectedTopic(
      "All"
    );

    setSelectedDifficulty(
      "All"
    );

    setShowSolvedOnly(
      false
    );

    setCurrentPage(1);
  }


  function goToPreviousPage() {
    setCurrentPage(
      (
        currentPageValue
      ) =>
        Math.max(
          1,

          currentPageValue
          -
          1
        )
    );


    window.scrollTo({
      top: 650,
      behavior: "smooth",
    });
  }


  function goToNextPage() {
    setCurrentPage(
      (
        currentPageValue
      ) =>
        Math.min(
          totalPages,

          currentPageValue
          +
          1
        )
    );


    window.scrollTo({
      top: 650,
      behavior: "smooth",
    });
  }


  async function saveSolvedQuestions() {
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


      return false;
    }


    setIsSaving(
      true
    );


    setMessage("");


    try {
      const response =
        await fetch(
          `${API_URL}/progress/solved-questions`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body:
              JSON.stringify({
                question_ids:
                  solvedQuestionIds,
              }),
          }
        );


      if (
        response.status
        ===
        401
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


        return false;
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

          "Could not save solved questions."
        );
      }


      const data =
        await response.json();


      const savedIds =
        Array.isArray(
          data.question_ids
        )
          ?
          data.question_ids.map(
            (questionId) =>
              String(
                questionId
              )
          )
          :
          [];


      setSolvedQuestionIds(
        savedIds
      );


      localStorage.setItem(
        "solvedQuestionIds",

        JSON.stringify(
          savedIds
        )
      );


      setMessage(
        "Your solved-question progress has been saved."
      );


      return true;

    } catch (
      error
    ) {
      localStorage.setItem(
        "solvedQuestionIds",

        JSON.stringify(
          solvedQuestionIds
        )
      );


      setMessage(
        error.message

        ||

        "Progress could not be saved to the backend."
      );


      return false;

    } finally {
      setIsSaving(
        false
      );
    }
  }


  async function handleSave() {
    await saveSolvedQuestions();
  }


  async function handleSaveAndContinue() {
    const saved =
      await saveSolvedQuestions();


    if (saved) {
      navigate(
        "/test-configuration"
      );
    }
  }


  if (isLoading) {
    return (
      <main
        className={
          "question-loading-page"
        }
      >

        <div
          className={
            "question-loading-spinner"
          }
        />


        <span>
          PATTERNPREP
        </span>


        <h1>
          Loading your progress
        </h1>


        <p>
          Retrieving your saved
          solved questions...
        </p>

      </main>
    );
  }


  return (
    <main
      className={
        "question-page"
      }
    >

      <div
        className={
          "question-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "question-background-grid"
          }
        />


        <div
          className={
            "question-orb "
            +
            "question-orb-one"
          }
        />


        <div
          className={
            "question-orb "
            +
            "question-orb-two"
          }
        />

      </div>


      <header
        className={
          "question-navbar"
        }
      >

        <button
          type="button"
          className={
            "question-brand"
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
              "question-brand-logo"
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
            "question-step"
          }
        >

          <span>
            STEP 2 OF 3
          </span>


          <strong>
            Solved Questions
          </strong>

        </div>


        <button
          type="button"
          className={
            "question-back-button"
          }
          onClick={
            () =>
              navigate(
                "/preparation-setup"
              )
          }
        >

          ← Topic Setup

        </button>

      </header>


      <section
        className={
          "question-hero"
        }
      >

        <div
          className={
            "question-hero-content"
          }
        >

          <span
            className={
              "question-eyebrow"
            }
          >

            BUILD YOUR SOLVED PROFILE

          </span>


          <h1>

            What have you

            <span>
              already solved?
            </span>

          </h1>


          <p>

            Select every question
            you have completed.
            PatternPrep will use
            your solved-question
            history to avoid
            repetition and create
            more relevant mock
            tests.

          </p>

        </div>


        <div
          className={
            "question-summary-card"
          }
        >

          <div
            className={
              "question-summary-heading"
            }
          >

            <span>
              SOLVED QUESTIONS
            </span>


            <span
              className={
                "question-live-dot"
              }
            />

          </div>


          <strong
            className={
              "question-total-solved"
            }
          >

            {
              solvedQuestionIds
                .length
            }

          </strong>


          <p>
            questions marked
            as completed
          </p>


          <div
            className={
              "question-difficulty-summary"
            }
          >

            <div>

              <span
                className={
                  "question-easy-dot"
                }
              />

              <strong>
                {
                  difficultySummary
                    .easy
                }
              </strong>

              <small>
                Easy
              </small>

            </div>


            <div>

              <span
                className={
                  "question-medium-dot"
                }
              />

              <strong>
                {
                  difficultySummary
                    .medium
                }
              </strong>

              <small>
                Medium
              </small>

            </div>


            <div>

              <span
                className={
                  "question-hard-dot"
                }
              />

              <strong>
                {
                  difficultySummary
                    .hard
                }
              </strong>

              <small>
                Hard
              </small>

            </div>

          </div>

        </div>

      </section>


      <section
        className={
          "question-workspace"
        }
      >

        <div
          className={
            "question-workspace-heading"
          }
        >

          <div>

            <span>
              QUESTION LIBRARY
            </span>


            <h2>
              Select solved
              questions
            </h2>


            <p>
              Search by LeetCode
              number or title, or
              narrow the list using
              topic and difficulty
              filters.
            </p>

          </div>


          <div
            className={
              "question-result-count"
            }
          >

            <strong>
              {
                filteredQuestions
                  .length
              }
            </strong>


            <span>
              questions found
            </span>

          </div>

        </div>


        {
          message

          &&

          (
            <div
              className={
                "question-message"
              }
              role="status"
            >

              <span>
                ✓
              </span>


              <p>
                {message}
              </p>

            </div>
          )
        }


        <div
          className={
            "question-toolbar"
          }
        >

          <div
            className={
              "question-search-wrapper"
            }
          >

            <span>
              ⌕
            </span>


            <input
              id="question-search"
              type="search"
              placeholder={
                "Search by number or title..."
              }
              value={
                search
              }
              onChange={
                (event) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
              }
              aria-label={
                "Search by LeetCode question number or title"
              }
            />

          </div>


          <select
            id="topic-filter"
            value={
              selectedTopic
            }
            onChange={
              (event) =>
                setSelectedTopic(
                  event
                    .target
                    .value
                )
            }
            aria-label={
              "Filter by topic"
            }
          >

            <option
              value="All"
            >
              All Topics
            </option>


            {
              topics.map(
                (topic) => (
                  <option
                    key={
                      topic
                    }
                    value={
                      topic
                    }
                  >
                    {topic}
                  </option>
                )
              )
            }

          </select>


          <select
            id={
              "difficulty-filter"
            }
            value={
              selectedDifficulty
            }
            onChange={
              (event) =>
                setSelectedDifficulty(
                  event
                    .target
                    .value
                )
            }
            aria-label={
              "Filter by difficulty"
            }
          >

            <option
              value="All"
            >
              All Difficulties
            </option>


            <option
              value="Easy"
            >
              Easy
            </option>


            <option
              value="Medium"
            >
              Medium
            </option>


            <option
              value="Hard"
            >
              Hard
            </option>

          </select>

        </div>


        <div
          className={
            "question-filter-row"
          }
        >

          <button
            type="button"
            className={
              showSolvedOnly

                ?

                "question-solved-filter "
                +
                "question-solved-filter-active"

                :

                "question-solved-filter"
            }
            onClick={
              () =>
                setShowSolvedOnly(
                  (
                    currentValue
                  ) =>
                    !currentValue
                )
            }
          >

            <span>
              ✓
            </span>

            Show Solved Only

          </button>


          <button
            type="button"
            className={
              "question-clear-filter"
            }
            onClick={
              clearFilters
            }
          >

            Clear Filters

          </button>

        </div>


        {
          filteredQuestions
            .length
          >
          0

            ?

            (
              <>

                <div
                  className={
                    "question-list"
                  }
                >

                  {
                    visibleQuestions.map(
                      (
                        question,
                        index
                      ) => {
                        const normalizedId =
                          String(
                            question.id
                          );


                        const isSolved =
                          solvedQuestionIds
                            .includes(
                              normalizedId
                            );


                        return (
                          <article
                            key={
                              question
                                .titleSlug
                            }
                            className={
                              isSolved

                                ?

                                "question-card "
                                +
                                "question-card-solved"

                                :

                                "question-card"
                            }
                            style={{
                              "--question-delay":
                                `${
                                  Math.min(
                                    index,
                                    20
                                  )
                                  *
                                  20
                                }ms`,
                            }}
                          >

                            <label
                              className={
                                "question-check"
                              }
                            >

                              <input
                                type={
                                  "checkbox"
                                }
                                checked={
                                  isSolved
                                }
                                onChange={
                                  () =>
                                    toggleSolvedQuestion(
                                      question.id
                                    )
                                }
                              />


                              <span
                                className={
                                  "question-custom-checkbox"
                                }
                              >
                                ✓
                              </span>

                            </label>


                            <div
                              className={
                                "question-card-content"
                              }
                            >

                              <div
                                className={
                                  "question-title-row"
                                }
                              >

                                <span
                                  className={
                                    "question-number"
                                  }
                                >

                                  #
                                  {
                                    question.id
                                  }

                                </span>


                                <h3>
                                  {
                                    question
                                      .title
                                  }
                                </h3>

                              </div>


                              <span
                                className={
                                  `question-difficulty
                                  question-difficulty-${
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

                            </div>


                            <a
                              href={
                                question.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className={
                                "question-leetcode-link"
                              }
                            >

                              Solve on LeetCode

                              <span>
                                ↗
                              </span>

                            </a>

                          </article>
                        );
                      }
                    )
                  }

                </div>


                <div
                  className={
                    "question-pagination"
                  }
                >

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage
                      ===
                      1
                    }
                    onClick={
                      goToPreviousPage
                    }
                  >

                    ← Previous

                  </button>


                  <div
                    className={
                      "question-page-details"
                    }
                  >

                    <strong>

                      Page

                      {" "}

                      {
                        safeCurrentPage
                      }

                      {" of "}

                      {
                        totalPages
                      }

                    </strong>


                    <span>

                      Showing

                      {" "}

                      {
                        firstQuestionIndex
                        +
                        1
                      }

                      {"–"}

                      {
                        Math.min(
                          firstQuestionIndex
                          +
                          QUESTIONS_PER_PAGE,

                          filteredQuestions
                            .length
                        )
                      }

                      {" of "}

                      {
                        filteredQuestions
                          .length
                      }

                    </span>

                  </div>


                  <button
                    type="button"
                    disabled={
                      safeCurrentPage
                      ===
                      totalPages
                    }
                    onClick={
                      goToNextPage
                    }
                  >

                    Next →

                  </button>

                </div>

              </>
            )

            :

            (
              <div
                className={
                  "question-empty-state"
                }
              >

                <span>
                  ⌕
                </span>


                <h3>
                  No questions found
                </h3>


                <p>
                  Try another
                  question number,
                  title, or remove
                  the selected
                  filters.
                </p>


                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >

                  Clear Filters

                </button>

              </div>
            )
        }

      </section>


      <footer
        className={
          "question-action-bar"
        }
      >

        <div
          className={
            "question-selection-status"
          }
        >

          <span>
            ✓
          </span>


          <p>

            <strong>
              {
                solvedQuestionIds
                  .length
              }
            </strong>

            {" "}

            questions selected

          </p>

        </div>


        <div
          className={
            "question-actions"
          }
        >

          <button
            type="button"
            className={
              "question-save-button"
            }
            disabled={
              isSaving
            }
            onClick={
              handleSave
            }
          >

            {
              isSaving

                ?

                "Saving..."

                :

                "Save Progress"
            }

          </button>


          <button
            type="button"
            className={
              "question-continue-button"
            }
            disabled={
              isSaving
            }
            onClick={
              handleSaveAndContinue
            }
          >

            {
              isSaving

                ?

                "Saving..."

                :

                "Save and Continue"
            }


            {
              !isSaving

              &&

              (
                <span>
                  →
                </span>
              )
            }

          </button>

        </div>

      </footer>

    </main>
  );
}


export default QuestionSelectionPage;