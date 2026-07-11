import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import questions
  from "../data/leetcode_questions.json";


const testModes = {
  Revision: {
    icon: "↻",

    description:
      "Mostly questions you have already solved.",

    ratio:
      "70% solved",
  },

  Balanced: {
    icon: "◈",

    description:
      "A balanced mix of solved and unsolved questions.",

    ratio:
      "50% solved",
  },

  Challenge: {
    icon: "⚡",

    description:
      "Mostly questions you have not marked as solved.",

    ratio:
      "20% solved",
  },
};


const solvedRatios = {
  Revision: 0.7,
  Balanced: 0.5,
  Challenge: 0.2,
};


const difficultyOptions = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
];


function shuffleQuestions(
  questionList
) {
  const shuffled = [
    ...questionList,
  ];


  for (
    let index =
      shuffled.length - 1;

    index > 0;

    index--
  ) {

    const randomIndex =
      Math.floor(
        Math.random()
        *
        (index + 1)
      );


    [
      shuffled[index],
      shuffled[randomIndex],
    ] = [
      shuffled[randomIndex],
      shuffled[index],
    ];

  }


  return shuffled;
}


function TestConfigurationPage() {
  const navigate =
    useNavigate();


  const [
    testMode,
    setTestMode,
  ] = useState(
    "Balanced"
  );


  const [
    questionCount,
    setQuestionCount,
  ] = useState(5);


  const [
    duration,
    setDuration,
  ] = useState(60);


  const [
    easyCount,
    setEasyCount,
  ] = useState(2);


  const [
    mediumCount,
    setMediumCount,
  ] = useState(2);


  const [
    hardCount,
    setHardCount,
  ] = useState(1);


  const [
    selectedTopics,
    setSelectedTopics,
  ] = useState([]);


  const [
    topicSearch,
    setTopicSearch,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  const availableTopics =
    useMemo(
      () => {

        const savedProgress =
          localStorage.getItem(
            "topicProgress"
          );


        if (savedProgress) {

          try {

            const topicProgress =
              JSON.parse(
                savedProgress
              );


            const activeTopics =
              Object
                .entries(
                  topicProgress
                )
                .filter(
                  ([, status]) =>
                    status
                    ===
                    "Learning"

                    ||

                    status
                    ===
                    "Completed"
                )
                .map(
                  ([topic]) =>
                    topic
                )
                .sort();


            if (
              activeTopics.length
              >
              0
            ) {

              return activeTopics;

            }

          } catch {

            console.log(
              "Could not read "
              +
              "topic progress."
            );

          }

        }


        const topicSet =
          new Set();


        questions.forEach(
          (question) => {

            question
              .topics
              .forEach(
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


  const filteredTopics =
    useMemo(
      () => {

        const normalizedSearch =
          topicSearch
            .trim()
            .toLowerCase();


        if (
          normalizedSearch
          ===
          ""
        ) {

          return availableTopics;

        }


        return availableTopics
          .filter(
            (topic) =>
              topic
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
          );

      },
      [
        availableTopics,
        topicSearch,
      ]
    );


  const selectedDifficultyTotal =
    Number(
      easyCount
    )
    +
    Number(
      mediumCount
    )
    +
    Number(
      hardCount
    );


  const difficultyCountIsValid =
    selectedDifficultyTotal
    ===
    Number(
      questionCount
    );


  const difficultyProgress =
    Math.min(
      100,

      (
        selectedDifficultyTotal
        /
        Number(
          questionCount
        )
      )
      *
      100
    );


  function toggleTopic(
    topic
  ) {

    setSelectedTopics(
      (currentTopics) => {

        if (
          currentTopics
            .includes(
              topic
            )
        ) {

          return currentTopics
            .filter(
              (
                currentTopic
              ) =>
                currentTopic
                !==
                topic
            );

        }


        return [
          ...currentTopics,
          topic,
        ];

      }
    );


    setMessage("");

  }


  function selectAllTopics() {

    setSelectedTopics(
      availableTopics
    );


    setMessage("");

  }


  function clearAllTopics() {

    setSelectedTopics(
      []
    );


    setMessage("");

  }


  function getSolvedQuestionIds() {

    const saved =
      localStorage.getItem(
        "solvedQuestionIds"
      );


    if (!saved) {

      return [];

    }


    try {

      const parsed =
        JSON.parse(
          saved
        );


      if (
        Array.isArray(
          parsed
        )
      ) {

        return parsed;

      }


      return [];

    } catch {

      return [];

    }

  }


  function selectQuestionsForDifficulty(
    difficulty,
    requiredCount,
    solvedIdSet
  ) {

    if (
      requiredCount
      ===
      0
    ) {

      return [];

    }


    const candidates =
      questions.filter(
        (question) => {

          const matchesDifficulty =
            question
              .difficulty
              .toLowerCase()
            ===
            difficulty
              .toLowerCase();


          const matchesTopic =
            question
              .topics
              .some(
                (topic) =>
                  selectedTopics
                    .includes(
                      topic
                    )
              );


          return (
            matchesDifficulty

            &&

            matchesTopic
          );

        }
      );


    if (
      candidates.length
      <
      requiredCount
    ) {

      throw new Error(

        `Not enough ${difficulty} `
        +
        "questions are available "
        +
        "for the selected topics. "
        +
        `Required: ${requiredCount}, `
        +
        `available: ${candidates.length}.`

      );

    }


    const solvedCandidates =
      shuffleQuestions(

        candidates.filter(
          (question) =>
            solvedIdSet.has(
              String(
                question.id
              )
            )
        )

      );


    const unsolvedCandidates =
      shuffleQuestions(

        candidates.filter(
          (question) =>
            !solvedIdSet.has(
              String(
                question.id
              )
            )
        )

      );


    const preferredSolvedCount =
      Math.round(

        requiredCount
        *
        solvedRatios[
          testMode
        ]

      );


    const selectedSolved =
      solvedCandidates.slice(

        0,

        Math.min(
          preferredSolvedCount,
          solvedCandidates.length
        )

      );


    const preferredUnsolvedCount =
      requiredCount
      -
      selectedSolved.length;


    const selectedUnsolved =
      unsolvedCandidates.slice(

        0,

        Math.min(
          preferredUnsolvedCount,
          unsolvedCandidates.length
        )

      );


    const selected = [

      ...selectedSolved,

      ...selectedUnsolved,

    ];


    const remainingCount =
      requiredCount
      -
      selected.length;


    if (
      remainingCount
      >
      0
    ) {

      const selectedSlugs =
        new Set(

          selected.map(
            (question) =>
              question
                .titleSlug
          )

        );


      const remainingCandidates =
        shuffleQuestions(

          candidates.filter(
            (question) =>
              !selectedSlugs
                .has(
                  question
                    .titleSlug
                )
          )

        );


      selected.push(

        ...remainingCandidates
          .slice(

            0,

            remainingCount

          )

      );

    }


    return selected.map(
      (question) => ({

        ...question,

        previouslySolved:
          solvedIdSet.has(

            String(
              question.id
            )

          ),

      })
    );

  }


  function handleGenerateTest(
    event
  ) {

    event.preventDefault();


    setMessage("");


    if (
      selectedTopics.length
      ===
      0
    ) {

      setMessage(
        "Select at least one topic before generating your mock test."
      );


      return;

    }


    if (
      !difficultyCountIsValid
    ) {

      setMessage(

        "The Easy, Medium, and Hard question counts must equal the selected total number of questions."

      );


      return;

    }


    const configuration = {

      testMode,

      questionCount:
        Number(
          questionCount
        ),

      duration:
        Number(
          duration
        ),

      difficultyDistribution: {

        Easy:
          Number(
            easyCount
          ),

        Medium:
          Number(
            mediumCount
          ),

        Hard:
          Number(
            hardCount
          ),

      },

      selectedTopics,

    };


    try {

      const solvedQuestionIds =
        getSolvedQuestionIds();


      const solvedIdSet =
        new Set(

          solvedQuestionIds.map(
            (questionId) =>
              String(
                questionId
              )
          )

        );


      const generatedQuestions = [

        ...selectQuestionsForDifficulty(

          "Easy",

          Number(
            easyCount
          ),

          solvedIdSet

        ),


        ...selectQuestionsForDifficulty(

          "Medium",

          Number(
            mediumCount
          ),

          solvedIdSet

        ),


        ...selectQuestionsForDifficulty(

          "Hard",

          Number(
            hardCount
          ),

          solvedIdSet

        ),

      ];


      const shuffledTest =
        shuffleQuestions(
          generatedQuestions
        );


      const generatedMockTest = {

        id:
          `test-${Date.now()}`,

        createdAt:
          new Date()
            .toISOString(),

        status:
          "preview",

        configuration,

        questions:
          shuffledTest,

      };


      localStorage.setItem(

        "testConfiguration",

        JSON.stringify(
          configuration
        )

      );


      localStorage.setItem(

        "generatedMockTest",

        JSON.stringify(
          generatedMockTest
        )

      );


      navigate(
        "/test-preview"
      );

    } catch (
      error
    ) {

      setMessage(

        error.message

        ||

        "The mock test could not be generated."

      );

    }

  }


  return (

    <main
      className={
        "configuration-page"
      }
    >

      <div
        className={
          "configuration-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "configuration-background-grid"
          }
        />


        <div
          className={
            "configuration-orb "
            +
            "configuration-orb-one"
          }
        />


        <div
          className={
            "configuration-orb "
            +
            "configuration-orb-two"
          }
        />

      </div>


      <header
        className={
          "configuration-navbar"
        }
      >

        <button
          type="button"
          className={
            "configuration-brand"
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
              "configuration-brand-logo"
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
            "configuration-step"
          }
        >

          <span>
            STEP 3 OF 3
          </span>


          <strong>
            Test Configuration
          </strong>

        </div>


        <button
          type="button"
          className={
            "configuration-back-button"
          }
          onClick={
            () =>
              navigate(
                "/question-selection"
              )
          }
        >

          ← Solved Questions

        </button>

      </header>


      <section
        className={
          "configuration-hero"
        }
      >

        <div
          className={
            "configuration-hero-content"
          }
        >

          <span
            className={
              "configuration-eyebrow"
            }
          >

            PERSONALIZED MOCK TEST

          </span>


          <h1>

            Build your

            <span>
              perfect test.
            </span>

          </h1>


          <p>

            Choose your test mode,
            question distribution,
            time limit, and topics.
            PatternPrep will create
            a personalized DSA mock
            test based on your
            preparation history.

          </p>

        </div>


        <aside
          className={
            "configuration-summary-card"
          }
        >

          <div
            className={
              "configuration-summary-label"
            }
          >

            <span>
              LIVE CONFIGURATION
            </span>


            <span
              className={
                "configuration-live-dot"
              }
            />

          </div>


          <div
            className={
              "configuration-summary-main"
            }
          >

            <strong>

              {
                questionCount
              }

            </strong>


            <div>

              <span>
                QUESTIONS
              </span>


              <p>

                {
                  duration
                }

                {" "}

                minute limit

              </p>

            </div>

          </div>


          <div
            className={
              "configuration-summary-details"
            }
          >

            <div>

              <span>
                MODE
              </span>


              <strong>
                {testMode}
              </strong>

            </div>


            <div>

              <span>
                TOPICS
              </span>


              <strong>

                {
                  selectedTopics
                    .length
                }

              </strong>

            </div>

          </div>


          <div
            className={
              "configuration-mini-distribution"
            }
          >

            <span
              className={
                "configuration-mini-easy"
              }
              style={{
                flex:
                  Math.max(
                    easyCount,
                    0.15
                  ),
              }}
            />


            <span
              className={
                "configuration-mini-medium"
              }
              style={{
                flex:
                  Math.max(
                    mediumCount,
                    0.15
                  ),
              }}
            />


            <span
              className={
                "configuration-mini-hard"
              }
              style={{
                flex:
                  Math.max(
                    hardCount,
                    0.15
                  ),
              }}
            />

          </div>

        </aside>

      </section>


      <form
        className={
          "configuration-form"
        }
        onSubmit={
          handleGenerateTest
        }
      >

        <section
          className={
            "configuration-section"
          }
        >

          <div
            className={
              "configuration-section-heading"
            }
          >

            <div>

              <span>
                01
              </span>


              <div>

                <h2>
                  Choose a test mode
                </h2>


                <p>

                  Control how much
                  the test focuses
                  on solved or new
                  questions.

                </p>

              </div>

            </div>

          </div>


          <div
            className={
              "configuration-mode-grid"
            }
          >

            {
              Object.entries(
                testModes
              ).map(
                ([
                  mode,
                  details,
                ]) => (

                  <label
                    key={
                      mode
                    }
                    className={

                      testMode
                      ===
                      mode

                        ?

                        "configuration-mode-card "
                        +
                        "configuration-mode-active"

                        :

                        "configuration-mode-card"

                    }
                  >

                    <input
                      type="radio"
                      name={
                        "test-mode"
                      }
                      value={
                        mode
                      }
                      checked={
                        testMode
                        ===
                        mode
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setTestMode(
                            event
                              .target
                              .value
                          )
                      }
                    />


                    <div
                      className={
                        "configuration-mode-top"
                      }
                    >

                      <span
                        className={
                          "configuration-mode-icon"
                        }
                      >

                        {
                          details
                            .icon
                        }

                      </span>


                      <span
                        className={
                          "configuration-radio"
                        }
                      />

                    </div>


                    <h3>
                      {mode}
                    </h3>


                    <p>

                      {
                        details
                          .description
                      }

                    </p>


                    <small>

                      {
                        details
                          .ratio
                      }

                    </small>

                  </label>

                )
              )
            }

          </div>

        </section>


        <section
          className={
            "configuration-section"
          }
        >

          <div
            className={
              "configuration-section-heading"
            }
          >

            <div>

              <span>
                02
              </span>


              <div>

                <h2>
                  Test essentials
                </h2>


                <p>

                  Select the number
                  of questions and
                  your available
                  test time.

                </p>

              </div>

            </div>

          </div>


          <div
            className={
              "configuration-essentials-grid"
            }
          >

            <div
              className={
                "configuration-select-card"
              }
            >

              <span
                className={
                  "configuration-select-icon"
                }
              >
                ◫
              </span>


              <div>

                <label
                  htmlFor={
                    "question-count"
                  }
                >

                  Total Questions

                </label>


                <p>

                  Choose the size
                  of your mock test.

                </p>

              </div>


              <select
                id={
                  "question-count"
                }
                value={
                  questionCount
                }
                onChange={
                  (
                    event
                  ) =>
                    setQuestionCount(

                      Number(
                        event
                          .target
                          .value
                      )

                    )
                }
              >

                {
                  [
                    3,
                    4,
                    5,
                    6,
                    7,
                  ].map(
                    (count) => (

                      <option
                        key={
                          count
                        }
                        value={
                          count
                        }
                      >

                        {count}

                      </option>

                    )
                  )
                }

              </select>

            </div>


            <div
              className={
                "configuration-select-card"
              }
            >

              <span
                className={
                  "configuration-select-icon"
                }
              >
                ◷
              </span>


              <div>

                <label
                  htmlFor={
                    "test-duration"
                  }
                >

                  Time Limit

                </label>


                <p>

                  The test submits
                  automatically when
                  time expires.

                </p>

              </div>


              <select
                id={
                  "test-duration"
                }
                value={
                  duration
                }
                onChange={
                  (
                    event
                  ) =>
                    setDuration(

                      Number(
                        event
                          .target
                          .value
                      )

                    )
                }
              >

                {
                  [
                    60,
                    90,
                    120,
                    150,
                    180,
                  ].map(
                    (
                      minutes
                    ) => (

                      <option
                        key={
                          minutes
                        }
                        value={
                          minutes
                        }
                      >

                        {
                          minutes
                        }

                        {" min"}

                      </option>

                    )
                  )
                }

              </select>

            </div>

          </div>

        </section>


        <section
          className={
            "configuration-section"
          }
        >

          <div
            className={
              "configuration-section-heading "
              +
              "configuration-difficulty-heading"
            }
          >

            <div>

              <span>
                03
              </span>


              <div>

                <h2>

                  Difficulty
                  distribution

                </h2>


                <p>

                  Decide how many
                  Easy, Medium, and
                  Hard questions
                  should appear.

                </p>

              </div>

            </div>


            <div
              className={

                difficultyCountIsValid

                  ?

                  "configuration-count-badge "
                  +
                  "configuration-count-valid"

                  :

                  "configuration-count-badge "
                  +
                  "configuration-count-invalid"

              }
            >

              {
                selectedDifficultyTotal
              }

              {" / "}

              {
                questionCount
              }

            </div>

          </div>


          <div
            className={
              "configuration-difficulty-grid"
            }
          >

            <div
              className={
                "configuration-difficulty-card "
                +
                "configuration-easy-card"
              }
            >

              <div>

                <span
                  className={
                    "configuration-difficulty-dot"
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


              <select
                id={
                  "easy-count"
                }
                value={
                  easyCount
                }
                onChange={
                  (
                    event
                  ) =>
                    setEasyCount(

                      Number(
                        event
                          .target
                          .value
                      )

                    )
                }
              >

                {
                  difficultyOptions
                    .map(
                      (
                        number
                      ) => (

                        <option
                          key={
                            number
                          }
                          value={
                            number
                          }
                        >

                          {number}

                        </option>

                      )
                    )
                }

              </select>

            </div>


            <div
              className={
                "configuration-difficulty-card "
                +
                "configuration-medium-card"
              }
            >

              <div>

                <span
                  className={
                    "configuration-difficulty-dot"
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


              <select
                id={
                  "medium-count"
                }
                value={
                  mediumCount
                }
                onChange={
                  (
                    event
                  ) =>
                    setMediumCount(

                      Number(
                        event
                          .target
                          .value
                      )

                    )
                }
              >

                {
                  difficultyOptions
                    .map(
                      (
                        number
                      ) => (

                        <option
                          key={
                            number
                          }
                          value={
                            number
                          }
                        >

                          {number}

                        </option>

                      )
                    )
                }

              </select>

            </div>


            <div
              className={
                "configuration-difficulty-card "
                +
                "configuration-hard-card"
              }
            >

              <div>

                <span
                  className={
                    "configuration-difficulty-dot"
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


              <select
                id={
                  "hard-count"
                }
                value={
                  hardCount
                }
                onChange={
                  (
                    event
                  ) =>
                    setHardCount(

                      Number(
                        event
                          .target
                          .value
                      )

                    )
                }
              >

                {
                  difficultyOptions
                    .map(
                      (
                        number
                      ) => (

                        <option
                          key={
                            number
                          }
                          value={
                            number
                          }
                        >

                          {number}

                        </option>

                      )
                    )
                }

              </select>

            </div>

          </div>


          <div
            className={
              "configuration-distribution-track"
            }
          >

            <span
              style={{
                width:
                  `${difficultyProgress}%`,
              }}
            />

          </div>


          <p
            className={

              difficultyCountIsValid

                ?

                "configuration-validation "
                +
                "configuration-validation-success"

                :

                "configuration-validation "
                +
                "configuration-validation-error"

            }
          >

            {
              difficultyCountIsValid

                ?

                "✓ Distribution matches the selected test size."

                :

                `The difficulty counts must add up to ${questionCount}.`
            }

          </p>

        </section>


        <section
          className={
            "configuration-section"
          }
        >

          <div
            className={
              "configuration-section-heading "
              +
              "configuration-topic-heading"
            }
          >

            <div>

              <span>
                04
              </span>


              <div>

                <h2>
                  Select test topics
                </h2>


                <p>

                  Choose one or more
                  topics for your
                  personalized test.

                </p>

              </div>

            </div>


            <div
              className={
                "configuration-selected-count"
              }
            >

              <strong>

                {
                  selectedTopics
                    .length
                }

              </strong>


              <span>
                selected
              </span>

            </div>

          </div>


          <div
            className={
              "configuration-topic-toolbar"
            }
          >

            <div
              className={
                "configuration-topic-search"
              }
            >

              <span>
                ⌕
              </span>


              <input
                type="search"
                placeholder={
                  "Search available topics..."
                }
                value={
                  topicSearch
                }
                onChange={
                  (
                    event
                  ) =>
                    setTopicSearch(
                      event
                        .target
                        .value
                    )
                }
              />

            </div>


            <div
              className={
                "configuration-topic-actions"
              }
            >

              <button
                type="button"
                onClick={
                  selectAllTopics
                }
              >

                Select All

              </button>


              <button
                type="button"
                onClick={
                  clearAllTopics
                }
              >

                Clear All

              </button>

            </div>

          </div>


          {
            filteredTopics
              .length
            >
            0

              ?

              (

                <div
                  className={
                    "configuration-topic-grid"
                  }
                >

                  {
                    filteredTopics.map(
                      (
                        topic,
                        index
                      ) => (

                        <label
                          key={
                            topic
                          }
                          className={

                            selectedTopics
                              .includes(
                                topic
                              )

                              ?

                              "configuration-topic-card "
                              +
                              "configuration-topic-active"

                              :

                              "configuration-topic-card"

                          }
                          style={{
                            "--configuration-topic-delay":
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

                          <input
                            type={
                              "checkbox"
                            }
                            checked={
                              selectedTopics
                                .includes(
                                  topic
                                )
                            }
                            onChange={
                              () =>
                                toggleTopic(
                                  topic
                                )
                            }
                          />


                          <span
                            className={
                              "configuration-topic-checkbox"
                            }
                          >
                            ✓
                          </span>


                          <strong>
                            {topic}
                          </strong>

                        </label>

                      )
                    )
                  }

                </div>

              )

              :

              (

                <div
                  className={
                    "configuration-empty-topics"
                  }
                >

                  <span>
                    ⌕
                  </span>


                  <h3>
                    No topics found
                  </h3>


                  <p>

                    Try searching
                    with another
                    topic name.

                  </p>


                  <button
                    type="button"
                    onClick={
                      () =>
                        setTopicSearch(
                          ""
                        )
                    }
                  >

                    Clear Search

                  </button>

                </div>

              )
          }

        </section>


        {
          message

          &&

          (

            <div
              className={
                "configuration-message"
              }
              role="alert"
            >

              <span>
                !
              </span>


              <p>
                {message}
              </p>

            </div>

          )
        }


        <footer
          className={
            "configuration-action-bar"
          }
        >

          <div
            className={
              "configuration-ready-status"
            }
          >

            <span>

              {
                difficultyCountIsValid
                &&
                selectedTopics.length
                >
                0

                  ?

                  "✓"

                  :

                  "○"
              }

            </span>


            <div>

              <strong>

                {
                  difficultyCountIsValid
                  &&
                  selectedTopics.length
                  >
                  0

                    ?

                    "Configuration ready"

                    :

                    "Complete your configuration"
                }

              </strong>


              <p>

                {
                  questionCount
                }

                {" questions • "}

                {
                  duration
                }

                {" minutes • "}

                {
                  selectedTopics
                    .length
                }

                {
                  selectedTopics
                    .length
                  ===
                  1

                    ?

                    " topic"

                    :

                    " topics"
                }

              </p>

            </div>

          </div>


          <div
            className={
              "configuration-footer-actions"
            }
          >

            <button
              type="button"
              className={
                "configuration-dashboard-button"
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


            <button
              type="submit"
              className={
                "configuration-generate-button"
              }
            >

              Generate Mock Test

              <span>
                →
              </span>

            </button>

          </div>

        </footer>

      </form>

    </main>

  );

}


export default TestConfigurationPage;