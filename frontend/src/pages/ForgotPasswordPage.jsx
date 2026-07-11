import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_URL =
  "https://patternprep.onrender.com";


function ForgotPasswordPage() {
  const navigate =
    useNavigate();


  const [
    email,
    setEmail,
  ] = useState("");


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
          `${API_URL}/api/auth/forgot-password`,
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
          "Could not process the password reset request."
        );

        setMessageType(
          "error"
        );

        return;
      }


      if (
        data.reset_token
      ) {
        setMessage(
          "Reset request created. Opening the password reset page..."
        );

        setMessageType(
          "success"
        );


        setTimeout(
          () => {
            navigate(
              `/reset-password?token=${
                encodeURIComponent(
                  data.reset_token
                )
              }`
            );
          },
          1000
        );

        return;
      }


      setMessage(
        data.message
        ||
        "Password reset instructions have been created."
      );

      setMessageType(
        "success"
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

            ACCOUNT RECOVERY

          </div>


          <h1>

            Return to your

            <span>
              preparation.
            </span>

          </h1>


          <p>

            Enter the email address
            linked to your
            PatternPrep account.
            We will create a secure
            password-reset request
            so you can regain access.

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

              Secure password-reset
              token

            </div>


            <div>

              <span>
                ✓
              </span>

              Reset requests expire
              automatically

            </div>


            <div>

              <span>
                ✓
              </span>

              Your saved preparation
              remains available

            </div>


            <div>

              <span>
                ✓
              </span>

              Continue your test
              history after login

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
            ↻
          </div>


          <div>

            <strong>
              Recover access
            </strong>

            <span>
              Continue preparing
              with your account.
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
              RESET PASSWORD
            </span>


            <h2>
              Forgot your
              password?
            </h2>


            <p>

              Enter your registered
              email address to
              continue.

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
                  "reset-email"
                }
              >
                Registered email
                address
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
                  id="reset-email"
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

                      Processing...

                    </>
                  )
                  :
                  (
                    <>

                      Continue

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
              Remembered it?
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

            Return to login

          </button>


          <p
            className={
              "auth-footer-text"
            }
          >

            Your password-reset
            token is valid for
            15 minutes.

          </p>

        </div>

      </section>

    </main>
  );
}


export default ForgotPasswordPage;