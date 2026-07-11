import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


function JoinTestPage() {
  const navigate =
    useNavigate();

  const {
    shareCode,
  } = useParams();


  const [
    sharedTest,
    setSharedTest,
  ] = useState(null);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(
    () => {
      async function loadSharedTest() {
        const accessToken =
          localStorage.getItem(
            "accessToken"
          );


        if (!accessToken) {
          localStorage.setItem(
            "pendingSharedTestCode",

            shareCode
          );


          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }


        setIsLoading(
          true
        );

        setError("");


        try {
          const response =
            await fetch(
              `${
                API_URL
              }/shared-tests/${
                shareCode
              }`,
              {
                method:
                  "GET",

                headers: {
                  Authorization:
                    `Bearer ${
                      accessToken
                    }`,
                },
              }
            );


          const data =
            await response
              .json()
              .catch(
                () => ({})
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

            localStorage.setItem(
              "pendingSharedTestCode",

              shareCode
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
              data.detail

              ||

              "The shared test could not be found."
            );
          }


          setSharedTest(
            data
          );

        } catch (
          requestError
        ) {
          setError(
            requestError.message

            ||

            "The shared test could not be loaded."
          );

        } finally {
          setIsLoading(
            false
          );
        }
      }


      loadSharedTest();

    },
    [
      navigate,
      shareCode,
    ]
  );


  function handleStartSharedTest() {
    if (
      !sharedTest
      ||
      !sharedTest.test_data
    ) {
      return;
    }


    const receivedTest =
      sharedTest.test_data;


    const configuration =
      receivedTest
        .configuration

      ||

      {};


    const startedAt =
      Date.now();


    const duration =
      Number(
        configuration
          .duration

        ||

        60
      );


    const endTime =
      startedAt
      +
      duration
      *
      60
      *
      1000;


    const activeMockTest = {
      ...receivedTest,

      id:
        `shared-${
          sharedTest
            .share_code
        }-${
          startedAt
        }`,

      sharedTestCode:
        sharedTest
          .share_code,

      sharedBy:
        sharedTest
          .creator_name,

      status:
        "in-progress",

      startedAt,

      endTime,

      responses: {},
    };


    localStorage.setItem(
      "generatedMockTest",

      JSON.stringify(
        receivedTest
      )
    );


    localStorage.setItem(
      "activeMockTest",

      JSON.stringify(
        activeMockTest
      )
    );


    localStorage.removeItem(
      "pendingSharedTestCode"
    );


    navigate(
      "/mock-test"
    );
  }


  if (isLoading) {
    return (
      <main
        className={
          "join-test-page"
        }
      >

        <section
          className={
            "join-test-card"
          }
        >

          <div
            className={
              "join-test-loader"
            }
          />


          <span>
            PATTERNPREP CHALLENGE
          </span>


          <h1>
            Loading shared test
          </h1>


          <p>
            Retrieving the same
            question set for you...
          </p>

        </section>

      </main>
    );
  }


  if (
    error
    ||
    !sharedTest
  ) {
    return (
      <main
        className={
          "join-test-page"
        }
      >

        <section
          className={
            "join-test-card"
          }
        >

          <span
            className={
              "join-test-error-icon"
            }
          >
            !
          </span>


          <span>
            SHARED TEST
          </span>


          <h1>
            Test unavailable
          </h1>


          <p>
            {
              error

              ||

              "This shared test could not be found."
            }
          </p>


          <button
            type="button"
            onClick={
              () =>
                navigate(
                  "/dashboard"
                )
            }
          >

            Go to Dashboard

          </button>

        </section>

      </main>
    );
  }


  const testData =
    sharedTest.test_data

    ||

    {};


  const configuration =
    testData.configuration

    ||

    {};


  const questions =
    Array.isArray(
      testData.questions
    )

      ?

      testData.questions

      :

      [];


  const difficultyDistribution =
    configuration
      .difficultyDistribution

    ||

    {};


  return (
    <main
      className={
        "join-test-page"
      }
    >

      <div
        className={
          "join-test-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "join-test-grid"
          }
        />


        <div
          className={
            "join-test-orb "
            +
            "join-test-orb-one"
          }
        />


        <div
          className={
            "join-test-orb "
            +
            "join-test-orb-two"
          }
        />

      </div>


      <header
        className={
          "join-test-navbar"
        }
      >

        <button
          type="button"
          className={
            "join-test-brand"
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


          PatternPrep

        </button>


        <span
          className={
            "join-test-code"
          }
        >

          CODE:

          {" "}

          {
            sharedTest
              .share_code
          }

        </span>

      </header>


      <section
        className={
          "join-test-content"
        }
      >

        <div
          className={
            "join-test-introduction"
          }
        >

          <span
            className={
              "join-test-eyebrow"
            }
          >

            YOU HAVE BEEN INVITED

          </span>


          <h1>

            Join the same

            <span>
              mock-test challenge.
            </span>

          </h1>


          <p>

            <strong>
              {
                sharedTest
                  .creator_name
              }
            </strong>

            {" shared this test with you. "}

            You will receive the
            exact same questions
            in the exact same
            order. Your timer,
            answers, score, and
            result will remain
            separate.

          </p>


          <div
            className={
              "join-test-info"
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
                  configuration
                    .duration

                  ||

                  60
                }
              </strong>

              <span>
                Minutes
              </span>

            </div>


            <div>

              <strong>
                {
                  configuration
                    .testMode

                  ||

                  "Practice"
                }
              </strong>

              <span>
                Mode
              </span>

            </div>

          </div>


          <button
            type="button"
            className={
              "join-test-start-button"
            }
            onClick={
              handleStartSharedTest
            }
          >

            Accept and Start Test

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            className={
              "join-test-dashboard-button"
            }
            onClick={
              () =>
                navigate(
                  "/dashboard"
                )
            }
          >

            Return to Dashboard

          </button>

        </div>


        <aside
          className={
            "join-test-summary"
          }
        >

          <div
            className={
              "join-test-summary-heading"
            }
          >

            <span>
              TEST SUMMARY
            </span>


            <span>
              ✓ Ready
            </span>

          </div>


          <div
            className={
              "join-test-summary-row"
            }
          >

            <span>
              Shared by
            </span>


            <strong>
              {
                sharedTest
                  .creator_name
              }
            </strong>

          </div>


          <div
            className={
              "join-test-summary-row"
            }
          >

            <span>
              Questions
            </span>


            <strong>
              {
                questions.length
              }
            </strong>

          </div>


          <div
            className={
              "join-test-summary-row"
            }
          >

            <span>
              Time limit
            </span>


            <strong>

              {
                configuration
                  .duration

                ||

                60
              }

              {" minutes"}

            </strong>

          </div>


          <div
            className={
              "join-test-difficulty"
            }
          >

            <span>
              DIFFICULTY MIX
            </span>


            <div>

              <p>

                <strong>
                  {
                    difficultyDistribution
                      .Easy

                    ??

                    0
                  }
                </strong>

                Easy

              </p>


              <p>

                <strong>
                  {
                    difficultyDistribution
                      .Medium

                    ??

                    0
                  }
                </strong>

                Medium

              </p>


              <p>

                <strong>
                  {
                    difficultyDistribution
                      .Hard

                    ??

                    0
                  }
                </strong>

                Hard

              </p>

            </div>

          </div>


          <div
            className={
              "join-test-note"
            }
          >

            <span>
              i
            </span>


            <p>
              Your timer starts
              only after you click
              Accept and Start Test.
            </p>

          </div>

        </aside>

      </section>

    </main>
  );
}


export default JoinTestPage;