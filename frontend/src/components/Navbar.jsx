import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


function Navbar() {
  const location =
    useLocation();

  const navigate =
    useNavigate();


  const accessToken =
    localStorage.getItem(
      "accessToken"
    );


  const isLoggedIn =
    Boolean(
      accessToken
    );


  function isActive(
    path
  ) {
    return (
      location.pathname
      ===
      path
    );
  }


  function handleLogout() {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "solvedQuestionIds"
    );

    localStorage.removeItem(
      "mockTestHistory"
    );

    localStorage.removeItem(
      "generatedMockTest"
    );

    localStorage.removeItem(
      "activeMockTest"
    );

    localStorage.removeItem(
      "completedMockTest"
    );


    navigate(
      "/",
      {
        replace: true,
      }
    );
  }


  return (
    <header
      className="navbar"
    >

      <Link
        to={
          isLoggedIn
            ?
            "/dashboard"
            :
            "/"
        }
        className="navbar-logo"
      >

        <span
          className={
            "navbar-logo-mark"
          }
        >
          P
        </span>

        <span>
          PatternPrep
        </span>

      </Link>


      <nav
        className="navbar-links"
        aria-label={
          "Main navigation"
        }
      >

        {
          isLoggedIn

          ?

          (
            <>

              <Link
                to="/dashboard"
                className={
                  isActive(
                    "/dashboard"
                  )

                    ?

                    "active"

                    :

                    ""
                }
              >
                Dashboard
              </Link>


              <Link
                to={
                  "/test-configuration"
                }
                className={
                  isActive(
                    "/test-configuration"
                  )

                    ?

                    "active"

                    :

                    ""
                }
              >
                Mock Test
              </Link>


              <Link
                to="/test-history"
                className={
                  isActive(
                    "/test-history"
                  )

                    ?

                    "active"

                    :

                    ""
                }
              >
                History
              </Link>


              <button
                type="button"
                className={
                  "navbar-logout"
                }
                onClick={
                  handleLogout
                }
              >
                Log Out
              </button>

            </>
          )

          :

          (
            <>

              <Link
                to="/login"
                className={
                  isActive(
                    "/login"
                  )

                    ?

                    "active"

                    :

                    ""
                }
              >
                Log In
              </Link>


              <Link
                to="/register"
                className={
                  "navbar-cta"
                }
              >
                Get Started
              </Link>

            </>
          )
        }

      </nav>

    </header>
  );
}


export default Navbar;