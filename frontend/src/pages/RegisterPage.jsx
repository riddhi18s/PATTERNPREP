import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


function RegisterPage() {
  const navigate =
    useNavigate();


  const [
    name,
    setName,
  ] = useState("");


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
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


    if (
      password
      !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );

      setMessageType(
        "error"
      );

      return;
    }


    setIsLoading(
      true
    );


    try {
      const response =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  name.trim(),

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
          "Unable to create your account."
        );

        setMessageType(
          "error"
        );

        return;
      }


      setMessage(
        "Account created successfully. Opening the login page..."
      );

      setMessageType(
        "success"
      );


      setTimeout(
        () => {
          navigate(
            "/login",
            {
              replace:
                true,
            }
          );
        },
        1000
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
      className="auth-page"
    >

      <div
        className="auth-background"
        aria-hidden="true"
      >

        <div
          className="auth-grid"
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
              navigate("/")
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

            START YOUR
            PREPARATION

          </div>


          <h1>

            Build your

            <span>
              own path.
            </span>

          </h1>


          <p>

            Create your PatternPrep
            account to save solved
            questions, build focused
            mock tests, and track
            your progress over time.

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

              Save your solved
              questions

            </div>


            <div>

              <span>
                ✓
              </span>

              Create personalized
              DSA mock tests

            </div>


            <div>

              <span>
                ✓
              </span>

              Review attempted
              questions

            </div>


            <div>

              <span>
                ✓
              </span>

              Track test scores
              and history

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
            +
          </div>


          <div>

            <strong>
              One account
            </strong>

            <span>
              Keep your preparation
              progress together.
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
              GET STARTED
            </span>


            <h2>
              Create your account
            </h2>


            <p>

              Start building mock
              tests around your
              preparation.

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
                htmlFor={
                  "name"
                }
              >
                Full name
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
                  ◯
                </span>


                <input
                  id="name"
                  type="text"
                  placeholder={
                    "Enter your name"
                  }
                  value={
                    name
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setName(
                        event
                          .target
                          .value
                      )
                  }
                  minLength="2"
                  maxLength="100"
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            <div
              className={
                "auth-field"
              }
            >

              <label
                htmlFor={
                  "register-email"
                }
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
                  id={
                    "register-email"
                  }
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
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            <div
              className={
                "auth-field"
              }
            >

              <label
                htmlFor={
                  "register-password"
                }
              >
                Password
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
                  ◇
                </span>


                <input
                  id={
                    "register-password"
                  }
                  type={
                    showPassword
                      ?
                      "text"
                      :
                      "password"
                  }
                  placeholder={
                    "Minimum 8 characters"
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
                  minLength="8"
                  maxLength="128"
                  autoComplete={
                    "new-password"
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


            <div
              className={
                "auth-field"
              }
            >

              <label
                htmlFor={
                  "confirm-password"
                }
              >
                Confirm password
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
                  ◇
                </span>


                <input
                  id={
                    "confirm-password"
                  }
                  type={
                    showConfirmPassword
                      ?
                      "text"
                      :
                      "password"
                  }
                  placeholder={
                    "Enter your password again"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setConfirmPassword(
                        event
                          .target
                          .value
                      )
                  }
                  minLength="8"
                  maxLength="128"
                  autoComplete={
                    "new-password"
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
                      setShowConfirmPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                  }
                >

                  {
                    showConfirmPassword
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

                      Creating
                      account...

                    </>
                  )
                  :
                  (
                    <>

                      Create Account

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
              Already registered?
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
                  "/login"
                )
            }
          >

            Log in to your account

          </button>


          <p
            className={
              "auth-footer-text"
            }
          >

            By creating an account,
            you can save and review
            your PatternPrep
            progress.

          </p>

        </div>

      </section>

    </main>
  );
}


export default RegisterPage;