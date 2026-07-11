import {
  useEffect,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function LandingPage() {
  const navigate =
    useNavigate();

  const pageRef =
    useRef(null);


  useEffect(() => {
    const elements =
      pageRef.current
        ?.querySelectorAll(
          ".reveal"
        );


    if (!elements) {
      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target
                  .classList
                  .add(
                    "reveal-visible"
                  );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.15,
        }
      );


    elements.forEach(
      (element) => {
        observer.observe(
          element
        );
      }
    );


    return () => {
      observer.disconnect();
    };
  }, []);


  function handleGuest() {
    localStorage.setItem(
      "guestMode",
      "true"
    );

    navigate(
      "/preparation-setup"
    );
  }


  return (
    <main
      ref={pageRef}
      className="landing-page"
    >

      <div
        className={
          "landing-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "landing-grid"
          }
        />

        <div
          className={
            "landing-orb "
            +
            "landing-orb-one"
          }
        />

        <div
          className={
            "landing-orb "
            +
            "landing-orb-two"
          }
        />

        <div
          className={
            "landing-orb "
            +
            "landing-orb-three"
          }
        />

        <div
          className={
            "landing-particle "
            +
            "particle-one"
          }
        />

        <div
          className={
            "landing-particle "
            +
            "particle-two"
          }
        />

        <div
          className={
            "landing-particle "
            +
            "particle-three"
          }
        />

      </div>


      <section
        className="landing-hero"
      >

        <div
          className={
            "hero-badge "
            +
            "hero-animate "
            +
            "hero-delay-one"
          }
        >

          <span
            className={
              "hero-badge-dot"
            }
          />

          Personalized DSA
          preparation

        </div>


        <h1
          className={
            "landing-title "
            +
            "hero-animate "
            +
            "hero-delay-two"
          }
        >

          Stop solving
          randomly.

          <span>
            Prepare with
            purpose.
          </span>

        </h1>


        <p
          className={
            "landing-description "
            +
            "hero-animate "
            +
            "hero-delay-three"
          }
        >

          PatternPrep creates
          personalized LeetCode
          mock tests based on
          your topics, difficulty
          preferences, and
          preparation history.

        </p>


        <div
          className={
            "landing-actions "
            +
            "hero-animate "
            +
            "hero-delay-four"
          }
        >

          <button
            type="button"
            className={
              "landing-primary-button"
            }
            onClick={
              () =>
                navigate(
                  "/register"
                )
            }
          >

            Start Preparing

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            className={
              "landing-secondary-button"
            }
            onClick={
              () =>
                navigate(
                  "/login"
                )
            }
          >

            Log In

          </button>


          <button
            type="button"
            className={
              "landing-guest-button"
            }
            onClick={
              handleGuest
            }
          >

            Continue as Guest

          </button>

        </div>


        <div
          className={
            "hero-proof "
            +
            "hero-animate "
            +
            "hero-delay-five"
          }
        >

          <span>
            3–7 questions
          </span>

          <span>
            60–180 minutes
          </span>

          <span>
            100-mark evaluation
          </span>

        </div>


        <div
          className={
            "mock-preview "
            +
            "hero-animate "
            +
            "hero-delay-five"
          }
        >

          <div
            className={
              "preview-glow"
            }
          />


          <div
            className={
              "preview-header"
            }
          >

            <div>

              <span
                className={
                  "preview-status"
                }
              >

                MOCK TEST

              </span>

              <h2>
                Personalized
                Practice
              </h2>

            </div>


            <div
              className={
                "preview-timer"
              }
            >

              01:29:42

            </div>

          </div>


          <div
            className={
              "preview-content"
            }
          >

            <div
              className={
                "preview-question"
              }
            >

              <span>
                QUESTION 01
              </span>

              <h3>
                Longest
                Consecutive
                Sequence
              </h3>

              <p>
                Practice questions
                selected from your
                chosen topics and
                difficulty levels.
              </p>

            </div>


            <div
              className={
                "preview-sidebar"
              }
            >

              <div>

                <span>
                  Questions
                </span>

                <strong>
                  5
                </strong>

              </div>


              <div>

                <span>
                  Total Marks
                </span>

                <strong>
                  100
                </strong>

              </div>


              <div>

                <span>
                  Difficulty
                </span>

                <strong>
                  Mixed
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      <section
        className={
          "landing-section "
          +
          "why-section"
        }
      >

        <div
          className={
            "section-heading "
            +
            "reveal"
          }
        >

          <span
            className={
              "section-label"
            }
          >
            WHY PATTERNPREP?
          </span>

          <h2>

            Practice should match

            <span>
              where you are.
            </span>

          </h2>

          <p>

            Random problem solving
            can increase your count
            without improving your
            interview readiness.
            PatternPrep turns your
            preparation history
            into focused mock tests.

          </p>

        </div>


        <div
          className={
            "feature-grid"
          }
        >

          <article
            className={
              "feature-card "
              +
              "feature-card-large "
              +
              "reveal"
            }
          >

            <div
              className={
                "feature-number"
              }
            >
              01
            </div>

            <div
              className={
                "feature-icon"
              }
            >
              ✦
            </div>

            <h3>
              Personalized
              question selection
            </h3>

            <p>

              Choose topics,
              difficulty levels,
              and the number of
              questions. Your test
              is generated around
              the preparation you
              actually need.

            </p>

            <div
              className={
                "topic-demo"
              }
            >

              <span>
                Arrays
              </span>

              <span>
                Dynamic Programming
              </span>

              <span>
                Graphs
              </span>

            </div>

          </article>


          <article
            className={
              "feature-card "
              +
              "reveal"
            }
          >

            <div
              className={
                "feature-number"
              }
            >
              02
            </div>

            <div
              className={
                "feature-icon"
              }
            >
              ◷
            </div>

            <h3>
              Real timed practice
            </h3>

            <p>

              Build the discipline
              to solve under a
              deadline with
              configurable tests
              from 60 to 180
              minutes.

            </p>

          </article>


          <article
            className={
              "feature-card "
              +
              "reveal"
            }
          >

            <div
              className={
                "feature-number"
              }
            >
              03
            </div>

            <div
              className={
                "feature-icon"
              }
            >
              ↗
            </div>

            <h3>
              Meaningful results
            </h3>

            <p>

              Review your score,
              attempt status,
              question links, time
              used, and complete
              test history.

            </p>

          </article>


          <article
            className={
              "feature-card "
              +
              "feature-card-wide "
              +
              "reveal"
            }
          >

            <div>

              <div
                className={
                  "feature-number"
                }
              >
                04
              </div>

              <div
                className={
                  "feature-icon"
                }
              >
                ◎
              </div>

              <h3>
                Avoid repeating
                what you already
                know
              </h3>

              <p>

                Mark solved
                questions and use
                that history while
                configuring future
                mock tests.

              </p>

            </div>


            <div
              className={
                "progress-demo"
              }
            >

              <div>

                <span>
                  Preparation
                  progress
                </span>

                <strong>
                  74%
                </strong>

              </div>

              <div
                className={
                  "progress-track"
                }
              >

                <span />

              </div>

            </div>

          </article>

        </div>

      </section>


      <section
        className={
          "landing-section "
          +
          "workflow-section"
        }
      >

        <div
          className={
            "section-heading "
            +
            "reveal"
          }
        >

          <span
            className={
              "section-label"
            }
          >
            HOW IT WORKS
          </span>

          <h2>

            From setup to insight

            <span>
              in four steps.
            </span>

          </h2>

        </div>


        <div
          className={
            "workflow-grid"
          }
        >

          <article
            className={
              "workflow-card "
              +
              "reveal"
            }
          >

            <span>
              01
            </span>

            <h3>
              Choose topics
            </h3>

            <p>

              Select the DSA
              concepts you want
              to strengthen.

            </p>

          </article>


          <article
            className={
              "workflow-card "
              +
              "reveal"
            }
          >

            <span>
              02
            </span>

            <h3>
              Set difficulty
            </h3>

            <p>

              Decide how many
              Easy, Medium, and
              Hard questions you
              want.

            </p>

          </article>


          <article
            className={
              "workflow-card "
              +
              "reveal"
            }
          >

            <span>
              03
            </span>

            <h3>
              Take the test
            </h3>

            <p>

              Solve selected
              questions in a
              focused, timed
              environment.

            </p>

          </article>


          <article
            className={
              "workflow-card "
              +
              "reveal"
            }
          >

            <span>
              04
            </span>

            <h3>
              Review results
            </h3>

            <p>

              Analyze your score,
              attempts, and test
              history.

            </p>

          </article>

        </div>

      </section>


      <section
        className={
          "landing-section "
          +
          "metrics-section "
          +
          "reveal"
        }
      >

        <div
          className={
            "metric"
          }
        >

          <strong>
            3–7
          </strong>

          <span>
            Questions per test
          </span>

        </div>


        <div
          className={
            "metric"
          }
        >

          <strong>
            60–180
          </strong>

          <span>
            Minute test window
          </span>

        </div>


        <div
          className={
            "metric"
          }
        >

          <strong>
            100
          </strong>

          <span>
            Mark evaluation
          </span>

        </div>


        <div
          className={
            "metric"
          }
        >

          <strong>
            ∞
          </strong>

          <span>
            Focused practice
          </span>

        </div>

      </section>


      <section
        className={
          "landing-cta "
          +
          "reveal"
        }
      >

        <div
          className={
            "cta-orb"
          }
        />


        <span
          className={
            "section-label"
          }
        >
          YOUR NEXT TEST
        </span>


        <h2>

          Turn preparation into

          <span>
            measurable progress.
          </span>

        </h2>


        <p>

          Create your account,
          configure a personalized
          mock test, and begin
          preparing with a clear
          purpose.

        </p>


        <button
          type="button"
          className={
            "landing-primary-button"
          }
          onClick={
            () =>
              navigate(
                "/register"
              )
          }
        >

          Create Free Account

          <span>
            →
          </span>

        </button>

      </section>


      <footer
        className={
          "landing-footer"
        }
      >

        <div>

          <span
            className={
              "footer-logo"
            }
          >
            P
          </span>

          <strong>
            PatternPrep
          </strong>

        </div>


        <p>

          Focused DSA preparation,
          one mock test at a time.

        </p>

      </footer>

    </main>
  );
}


export default LandingPage;