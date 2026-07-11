import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const topics = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Bit Manipulation",
  "Matrix",
  "Tree",
  "Prefix Sum",
  "Breadth-First Search",
  "Two Pointers",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph Theory",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Enumeration",
  "Design",
  "Backtracking",
  "Number Theory",
  "Union-Find",
  "Linked List",
  "Segment Tree",
  "Ordered Set",
  "Monotonic Stack",
  "Divide and Conquer",
  "Combinatorics",
  "Trie",
  "Queue",
  "Bitmask",
  "Recursion",
  "Geometry",
  "Binary Indexed Tree",
  "Hash Function",
  "Memoization",
  "Binary Search Tree",
  "Shortest Path",
  "Topological Sort",
  "String Matching",
  "Rolling Hash",
  "Game Theory",
  "Monotonic Queue",
  "Interactive",
  "Data Stream",
  "Brainteaser",
  "Doubly-Linked List",
  "Merge Sort",
  "Randomized",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Quickselect",
  "Suffix Array",
  "Sweep Line",
  "Probability and Statistics",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Eulerian Circuit",
  "Radix Sort",
  "Strongly Connected Component",
  "Rejection Sampling",
  "Biconnected Component",
];


function PreparationSetupPage() {
  const navigate =
    useNavigate();


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");


  const [
    topicProgress,
    setTopicProgress,
  ] = useState(
    () => {
      const savedProgress =
        localStorage.getItem(
          "topicProgress"
        );


      if (
        !savedProgress
      ) {
        return {};
      }


      try {
        const parsedProgress =
          JSON.parse(
            savedProgress
          );


        return (
          parsedProgress
          &&
          typeof parsedProgress
          ===
          "object"
        )
          ?
          parsedProgress
          :
          {};

      } catch {
        return {};
      }
    }
  );


  const [
    message,
    setMessage,
  ] = useState("");


  const progressSummary =
    useMemo(
      () => {
        let learning = 0;

        let completed = 0;


        topics.forEach(
          (topic) => {
            const status =
              topicProgress[
                topic
              ]
              ||
              "Not Started";


            if (
              status
              ===
              "Learning"
            ) {
              learning += 1;
            }


            if (
              status
              ===
              "Completed"
            ) {
              completed += 1;
            }
          }
        );


        return {
          notStarted:
            topics.length
            -
            learning
            -
            completed,

          learning,

          completed,

          started:
            learning
            +
            completed,

          percentage:
            Math.round(
              (
                completed
                /
                topics.length
              )
              *
              100
            ),
        };
      },
      [
        topicProgress,
      ]
    );


  const filteredTopics =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();


        return topics.filter(
          (topic) => {
            const topicStatus =
              topicProgress[
                topic
              ]
              ||
              "Not Started";


            const matchesSearch =
              normalizedSearch
              ===
              ""
              ||
              topic
                .toLowerCase()
                .includes(
                  normalizedSearch
                );


            const matchesStatus =
              statusFilter
              ===
              "All"
              ||
              topicStatus
              ===
              statusFilter;


            return (
              matchesSearch
              &&
              matchesStatus
            );
          }
        );
      },
      [
        search,
        statusFilter,
        topicProgress,
      ]
    );


  function getTopicStatus(
    topic
  ) {
    return (
      topicProgress[
        topic
      ]
      ||
      "Not Started"
    );
  }


  function updateTopicProgress(
    topic,
    status
  ) {
    setTopicProgress(
      (
        currentProgress
      ) => ({
        ...currentProgress,

        [topic]:
          status,
      })
    );


    setMessage("");
  }


  function saveTopicProgress() {
    localStorage.setItem(
      "topicProgress",

      JSON.stringify(
        topicProgress
      )
    );
  }


  function handleSave() {
    saveTopicProgress();


    setMessage(
      "Your preparation progress has been saved."
    );


    setTimeout(
      () => {
        setMessage("");
      },
      3000
    );
  }


  function handleSaveAndContinue() {
    saveTopicProgress();


    navigate(
      "/question-selection"
    );
  }


  function clearFilters() {
    setSearch("");

    setStatusFilter(
      "All"
    );
  }


  return (
    <main
      className={
        "setup-page"
      }
    >

      <div
        className={
          "setup-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "setup-background-grid"
          }
        />


        <div
          className={
            "setup-orb "
            +
            "setup-orb-one"
          }
        />


        <div
          className={
            "setup-orb "
            +
            "setup-orb-two"
          }
        />

      </div>


      <header
        className={
          "setup-navbar"
        }
      >

        <button
          type="button"
          className={
            "setup-brand"
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
              "setup-brand-logo"
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
            "setup-step"
          }
        >

          <span>
            STEP 1 OF 3
          </span>


          <strong>
            Preparation Setup
          </strong>

        </div>


        <button
          type="button"
          className={
            "setup-dashboard-button"
          }
          onClick={
            () =>
              navigate(
                "/dashboard"
              )
          }
        >

          ← Dashboard

        </button>

      </header>


      <section
        className={
          "setup-hero"
        }
      >

        <div
          className={
            "setup-hero-content"
          }
        >

          <span
            className={
              "setup-eyebrow"
            }
          >
            BUILD YOUR DSA PROFILE
          </span>


          <h1>

            Where are you in your

            <span>
              preparation?
            </span>

          </h1>


          <p>

            Set your current level
            for each DSA topic.
            PatternPrep will use
            this preparation profile
            when you configure your
            personalized mock tests.

          </p>

        </div>


        <div
          className={
            "setup-overview-card"
          }
        >

          <div
            className={
              "setup-overview-heading"
            }
          >

            <div>

              <span>
                OVERALL PROGRESS
              </span>


              <strong>

                {
                  progressSummary
                    .percentage
                }

                %

              </strong>

            </div>


            <div
              className={
                "setup-progress-ring"
              }
              style={{
                "--setup-progress":
                  `${
                    progressSummary
                      .percentage
                  }%`,
              }}
            >

              <div>

                <strong>

                  {
                    progressSummary
                      .completed
                  }

                </strong>


                <span>

                  of
                  {" "}

                  {
                    topics.length
                  }

                </span>

              </div>

            </div>

          </div>


          <div
            className={
              "setup-overview-track"
            }
          >

            <span
              style={{
                width:
                  `${
                    progressSummary
                      .percentage
                  }%`,
              }}
            />

          </div>


          <p>

            {
              progressSummary
                .completed
              ===
              0

                ?
                "Mark topics as Learning or Completed to build your preparation profile."

                :
                `${progressSummary.completed} topics completed and ${progressSummary.learning} currently being learned.`
            }

          </p>

        </div>

      </section>


      <section
        className={
          "setup-stat-grid"
        }
      >

        <article
          className={
            "setup-stat-card "
            +
            "setup-stat-not-started"
          }
        >

          <span
            className={
              "setup-stat-icon"
            }
          >
            ○
          </span>


          <div>

            <span>
              NOT STARTED
            </span>


            <strong>

              {
                progressSummary
                  .notStarted
              }

            </strong>

          </div>

        </article>


        <article
          className={
            "setup-stat-card "
            +
            "setup-stat-learning"
          }
        >

          <span
            className={
              "setup-stat-icon"
            }
          >
            ◐
          </span>


          <div>

            <span>
              LEARNING
            </span>


            <strong>

              {
                progressSummary
                  .learning
              }

            </strong>

          </div>

        </article>


        <article
          className={
            "setup-stat-card "
            +
            "setup-stat-completed"
          }
        >

          <span
            className={
              "setup-stat-icon"
            }
          >
            ✓
          </span>


          <div>

            <span>
              COMPLETED
            </span>


            <strong>

              {
                progressSummary
                  .completed
              }

            </strong>

          </div>

        </article>


        <article
          className={
            "setup-stat-card "
            +
            "setup-stat-started"
          }
        >

          <span
            className={
              "setup-stat-icon"
            }
          >
            ↗
          </span>


          <div>

            <span>
              TOPICS STARTED
            </span>


            <strong>

              {
                progressSummary
                  .started
              }

            </strong>

          </div>

        </article>

      </section>


      <section
        className={
          "setup-workspace"
        }
      >

        <div
          className={
            "setup-workspace-heading"
          }
        >

          <div>

            <span>
              TOPIC PROGRESS
            </span>


            <h2>
              Set your current
              level
            </h2>


            <p>

              Choose the status that
              best represents your
              preparation for every
              topic.

            </p>

          </div>


          <div
            className={
              "setup-topic-count"
            }
          >

            <strong>

              {
                filteredTopics
                  .length
              }

            </strong>


            <span>
              topics shown
            </span>

          </div>

        </div>


        <div
          className={
            "setup-toolbar"
          }
        >

          <div
            className={
              "setup-search-wrapper"
            }
          >

            <span>
              ⌕
            </span>


            <input
              id="topic-search"
              type="search"
              placeholder={
                "Search DSA topics..."
              }
              value={
                search
              }
              onChange={
                (
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
              }
              aria-label={
                "Search topics"
              }
            />

          </div>


          <div
            className={
              "setup-filter-buttons"
            }
          >

            {
              [
                "All",
                "Not Started",
                "Learning",
                "Completed",
              ].map(
                (
                  filter
                ) => (

                  <button
                    key={
                      filter
                    }
                    type="button"
                    className={
                      statusFilter
                      ===
                      filter

                        ?
                        "setup-filter-active"

                        :
                        ""
                    }
                    onClick={
                      () =>
                        setStatusFilter(
                          filter
                        )
                    }
                  >

                    {filter}

                  </button>

                )
              )
            }

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
                  "setup-topic-grid"
                }
              >

                {
                  filteredTopics.map(
                    (
                      topic,
                      index
                    ) => {

                      const status =
                        getTopicStatus(
                          topic
                        );


                      return (

                        <article
                          key={
                            topic
                          }
                          className={
                            "setup-topic-card "
                            +
                            (
                              status
                              ===
                              "Completed"

                                ?
                                "setup-topic-completed"

                                :
                                status
                                ===
                                "Learning"

                                  ?
                                  "setup-topic-learning"

                                  :
                                  "setup-topic-not-started"
                            )
                          }
                          style={{
                            "--topic-delay":
                              `${
                                Math.min(
                                  index,
                                  15
                                )
                                *
                                25
                              }ms`,
                          }}
                        >

                          <div
                            className={
                              "setup-topic-card-heading"
                            }
                          >

                            <span
                              className={
                                "setup-topic-number"
                              }
                            >

                              {
                                String(
                                  topics.indexOf(
                                    topic
                                  )
                                  +
                                  1
                                )
                                  .padStart(
                                    2,
                                    "0"
                                  )
                              }

                            </span>


                            <span
                              className={
                                "setup-status-indicator"
                              }
                            />

                          </div>


                          <h3>
                            {topic}
                          </h3>


                          <label
                            htmlFor={
                              `topic-${
                                topic
                                  .replaceAll(
                                    " ",
                                    "-"
                                  )
                              }`
                            }
                          >

                            Current level

                          </label>


                          <select
                            id={
                              `topic-${
                                topic
                                  .replaceAll(
                                    " ",
                                    "-"
                                  )
                              }`
                            }
                            value={
                              status
                            }
                            onChange={
                              (
                                event
                              ) =>
                                updateTopicProgress(
                                  topic,

                                  event
                                    .target
                                    .value
                                )
                            }
                          >

                            <option
                              value={
                                "Not Started"
                              }
                            >
                              Not Started
                            </option>


                            <option
                              value={
                                "Learning"
                              }
                            >
                              Learning
                            </option>


                            <option
                              value={
                                "Completed"
                              }
                            >
                              Completed
                            </option>

                          </select>

                        </article>

                      );

                    }
                  )
                }

              </div>

            )

            :
            (

              <div
                className={
                  "setup-empty-state"
                }
              >

                <span>
                  ⌕
                </span>


                <h3>
                  No topics found
                </h3>


                <p>

                  Try another search
                  term or remove the
                  selected status
                  filter.

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
          "setup-action-bar"
        }
      >

        <div
          className={
            "setup-save-status"
          }
        >

          {
            message

              ?
              (
                <>

                  <span>
                    ✓
                  </span>

                  <p>
                    {message}
                  </p>

                </>
              )

              :
              (
                <>

                  <span>
                    ✦
                  </span>

                  <p>

                    Your selections
                    are saved when
                    you continue.

                  </p>

                </>
              )
          }

        </div>


        <div
          className={
            "setup-actions"
          }
        >

          <button
            type="button"
            className={
              "setup-save-button"
            }
            onClick={
              handleSave
            }
          >
            Save Progress
          </button>


          <button
            type="button"
            className={
              "setup-continue-button"
            }
            onClick={
              handleSaveAndContinue
            }
          >

            Save and Continue

            <span>
              →
            </span>

          </button>

        </div>

      </footer>

    </main>
  );
}


export default PreparationSetupPage;