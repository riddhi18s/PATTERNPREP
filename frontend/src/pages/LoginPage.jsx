import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


function LoginPage() {
  const navigate =
    useNavigate();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    messageType,
    setMessageType,
  ] = useState("");


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setMessage("");

    setMessageType("");

    setIsLoading(true);


    try {
      const response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  email
                    .trim()
                    .toLowerCase(),

                password,
              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {
        setMessage(
          data.detail
          ||
          "Unable to log in."
        );

        setMessageType(
          "error"
        );

        return;
      }


      localStorage.setItem(
        "accessToken",
        data.access_token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );


      localStorage.removeItem(
        "guestMode"
      );


      setMessage(
        "Login successful. Opening your dashboard..."
      );


      setMessageType(
        "success"
      );


      setTimeout(
        () => {
          navigate(
            "/dashboard",
            {
              replace:
                true,
            }
          );
        },
        700
      );

    } catch {
      setMessage(
        "Could not connect to the PatternPrep server. Please try again."
      );

      setMessageType(
        "error"
      );

    } finally {
      setIsLoading(
        false
      );
    }
  }


  return (
    <main
      className={
        "auth-page"
      }
    >

      <div
        className={
          "auth-background"
        }
        aria-hidden="true"
      >

        <div
          className={
            "auth-grid"
          }
        />

        <div
          className={
            "auth-orb "
            +
            "auth-orb-one"
          }
        />

        <div
          className={
            "auth-orb "
            +
            "auth-orb-two"
          }
        />

      </div>


      <section
        className={
          "auth-introduction"
        }
      >

        <button
          type="button"
          className={
            "auth-back-button"
          }
          onClick={
            () =>
              navigate(
                "/"
              )
          }
        >

          <span>
            ←
          </span>

          Back to home

        </button>


        <div
          className={
            "auth-introduction-content"
          }
        >

          <div
            className={
              "auth-label"
            }
          >

            <span />

            PERSONALIZED
            PREPARATION

          </div>


          <h1>

            Practice with

            <span>
              direction.
            </span>

          </h1>


          <p>

            Build focused DSA
            mock tests around your
            topics, difficulty
            preferences, and
            preparation history.

          </p>


          <div
            className={
              "auth-benefits"
            }
          >

            <div>

              <span>
                ✓
              </span>

              Topic-based question
              selection

            </div>


            <div>

              <span>
                ✓
              </span>

              Timed mock-test
              environment

            </div>


            <div>

              <span>
                ✓
              </span>

              100-mark evaluation
              system

            </div>


            <div>

              <span>
                ✓
              </span>

              Saved test history
              and progress

            </div>

          </div>

        </div>


        <div
          className={
            "auth-mini-card"
          }
        >

          <div
            className={
              "auth-mini-icon"
            }
          >
            ↗
          </div>


          <div>

            <strong>
              Prepare smarter
            </strong>

            <span>
              Continue from where
              you stopped.
            </span>

          </div>

        </div>

      </section>


      <section
        className={
          "auth-form-section"
        }
      >

        <div
          className={
            "auth-card"
          }
        >

          <div
            className={
              "auth-card-heading"
            }
          >

            <div
              className={
                "auth-logo"
              }
            >
              P
            </div>


            <span>
              PatternPrep
            </span>

          </div>


          <div
            className={
              "auth-title"
            }
          >

            <span
              className={
                "auth-eyebrow"
              }
            >
              WELCOME BACK
            </span>


            <h2>
              Log in to your
              account
            </h2>


            <p>

              Access your saved
              progress and continue
              your preparation.

            </p>

          </div>


          <form
            className={
              "auth-form"
            }
            onSubmit={
              handleSubmit
            }
          >

            <div
              className={
                "auth-field"
              }
            >

              <label
                htmlFor="email"
              >
                Email address
              </label>


              <div
                className={
                  "auth-input-wrapper"
                }
              >

                <span
                  className={
                    "auth-input-icon"
                  }
                >
                  @
                </span>


                <input
                  id="email"
                  type="email"
                  placeholder={
                    "you@example.com"
                  }
                  value={
                    email
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setEmail(
                        event
                          .target
                          .value
                      )
                  }
                  autoComplete={
                    "email"
                  }
                  required
                />

              </div>

            </div>


            <div
              className={
                "auth-field"
              }
            >

              <div
                className={
                  "auth-label-row"
                }
              >

                <label
                  htmlFor={
                    "password"
                  }
                >
                  Password
                </label>


                <button
                  type="button"
                  className={
                    "auth-text-button"
                  }
                  onClick={
                    () =>
                      navigate(
                        "/forgot-password"
                      )
                  }
                >

                  Forgot password?

                </button>

              </div>


              <div
                className={
                  "auth-input-wrapper"
                }
              >

                <span
                  className={
                    "auth-input-icon"
                  }
                >
                  ◇
                </span>


                <input
                  id="password"
                  type={
                    showPassword
                      ?
                      "text"
                      :
                      "password"
                  }
                  placeholder={
                    "Enter your password"
                  }
                  value={
                    password
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setPassword(
                        event
                          .target
                          .value
                      )
                  }
                  autoComplete={
                    "current-password"
                  }
                  required
                />


                <button
                  type="button"
                  className={
                    "password-toggle"
                  }
                  onClick={
                    () =>
                      setShowPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                  }
                  aria-label={
                    showPassword
                      ?
                      "Hide password"
                      :
                      "Show password"
                  }
                >

                  {
                    showPassword
                      ?
                      "Hide"
                      :
                      "Show"
                  }

                </button>

              </div>

            </div>


            {
              message
              &&
              (

                <div
                  className={
                    "auth-message "
                    +
                    (
                      messageType
                      ===
                      "success"

                        ?
                        "auth-message-success"

                        :
                        "auth-message-error"
                    )
                  }
                >

                  <span>

                    {
                      messageType
                      ===
                      "success"

                        ?
                        "✓"

                        :
                        "!"
                    }

                  </span>


                  <p>
                    {message}
                  </p>

                </div>

              )
            }


            <button
              type="submit"
              className={
                "auth-submit-button"
              }
              disabled={
                isLoading
              }
            >

              {
                isLoading
                ?
                (
                  <>

                    <span
                      className={
                        "auth-spinner"
                      }
                    />

                    Logging in...

                  </>
                )
                :
                (
                  <>

                    Log In

                    <span>
                      →
                    </span>

                  </>
                )
              }

            </button>

          </form>


          <div
            className={
              "auth-divider"
            }
          >

            <span />

            <p>
              New to PatternPrep?
            </p>

            <span />

          </div>


          <button
            type="button"
            className={
              "auth-secondary-action"
            }
            onClick={
              () =>
                navigate(
                  "/register"
                )
            }
          >

            Create an account

          </button>


          <p
            className={
              "auth-footer-text"
            }
          >

            Your preparation
            progress stays linked
            to your account.

          </p>

        </div>

      </section>

    </main>
  );
}


export default LoginPage;