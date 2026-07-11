import {
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


function ResetPasswordPage() {
  const navigate =
    useNavigate();


  const [
    searchParams,
  ] = useSearchParams();


  const token =
    searchParams.get(
      "token"
    );


  const [
    newPassword,
    setNewPassword,
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


  const [
    resetComplete,
    setResetComplete,
  ] = useState(false);


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    setMessage("");

    setMessageType("");


    if (!token) {
      setMessage(
        "The password-reset link is missing or invalid. Please create a new reset request."
      );

      setMessageType(
        "error"
      );

      return;
    }


    if (
      newPassword.length
      <
      8
    ) {
      setMessage(
        "Your new password must contain at least 8 characters."
      );

      setMessageType(
        "error"
      );

      return;
    }


    if (
      newPassword
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
          `${API_URL}/api/auth/reset-password`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                token,

                new_password:
                  newPassword,
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
          "Unable to reset your password."
        );

        setMessageType(
          "error"
        );

        return;
      }


      setMessage(
        "Your password was reset successfully. You can now log in with your new password."
      );

      setMessageType(
        "success"
      );

      setResetComplete(
        true
      );


      setNewPassword("");

      setConfirmPassword("");

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
              navigate(
                "/login"
              )
          }
        >

          <span>
            ←
          </span>

          Back to login

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

            SECURE YOUR ACCOUNT

          </div>


          <h1>

            Set a new

            <span>
              password.
            </span>

          </h1>


          <p>

            Create a strong new
            password for your
            PatternPrep account.
            Your solved questions,
            mock-test history, and
            preparation progress
            will remain available.

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

              Use at least
              8 characters

            </div>


            <div>

              <span>
                ✓
              </span>

              Create a password
              you do not reuse

            </div>


            <div>

              <span>
                ✓
              </span>

              Your preparation
              progress remains safe

            </div>


            <div>

              <span>
                ✓
              </span>

              Log in immediately
              after resetting

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
            ✓
          </div>


          <div>

            <strong>
              Secure reset
            </strong>

            <span>
              Create your new
              account password.
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
              PASSWORD RESET
            </span>


            <h2>

              {
                resetComplete

                  ?
                  "Password updated"

                  :
                  "Create a new password"
              }

            </h2>


            <p>

              {
                resetComplete

                  ?
                  "Your account is ready. Log in using your new password."

                  :
                  "Enter and confirm your new account password."
              }

            </p>

          </div>


          {
            !resetComplete
            &&
            (

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
                      "new-password"
                    }
                  >
                    New password
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
                        "new-password"
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
                        newPassword
                      }
                      onChange={
                        (
                          event
                        ) =>
                          setNewPassword(
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
                      "confirm-new-password"
                    }
                  >
                    Confirm new
                    password
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
                        "confirm-new-password"
                      }
                      type={
                        showConfirmPassword

                          ?
                          "text"

                          :
                          "password"
                      }
                      placeholder={
                        "Enter your new password again"
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

                          Updating
                          password...

                        </>
                      )

                      :
                      (
                        <>

                          Reset Password

                          <span>
                            →
                          </span>

                        </>
                      )
                  }

                </button>

              </form>

            )
          }


          {
            resetComplete
            &&
            (

              <>

                <div
                  className={
                    "auth-message "
                    +
                    "auth-message-success"
                  }
                >

                  <span>
                    ✓
                  </span>


                  <p>
                    {message}
                  </p>

                </div>


                <button
                  type="button"
                  className={
                    "auth-submit-button"
                  }
                  onClick={
                    () =>
                      navigate(
                        "/login",
                        {
                          replace:
                            true,
                        }
                      )
                  }
                >

                  Log In Now

                  <span>
                    →
                  </span>

                </button>

              </>

            )
          }


          {
            !token
            &&
            !resetComplete
            &&
            (

              <div
                className={
                  "auth-message "
                  +
                  "auth-message-error"
                }
              >

                <span>
                  !
                </span>


                <p>

                  No reset token
                  was found. Return
                  to the forgot
                  password page and
                  create a new
                  request.

                </p>

              </div>

            )
          }


          <div
            className={
              "auth-divider"
            }
          >

            <span />

            <p>
              Need another link?
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
                  "/forgot-password"
                )
            }
          >

            Create a new reset
            request

          </button>


          <p
            className={
              "auth-footer-text"
            }
          >

            Password-reset tokens
            expire after 15 minutes.

          </p>

        </div>

      </section>

    </main>
  );
}


export default ResetPasswordPage;