import { Link } from "react-router-dom"
import "./HomePage.css"

const LoginIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="button-icon"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
)

const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="button-icon"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
)

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient">
      {/* Main container with gradient background */}
      <div className="container">
        {/* Teal background with curved elements */}
        <div className="teal-section">
          {/* Logo */}
          <div className="logo">
            <div className="logo-circle">
              <span>✳ Nb</span>
            </div>
          </div>

          {/* Curved white lines */}
          <div className="curved-elements">
            <div className="curve curve-1"></div>
            <div className="curve curve-2"></div>
            <div className="curve curve-3"></div>
          </div>

          {/* Food images */}
          <div className="food-image cucumber-image">
            <img src="/images/cucumberreal.png" alt="Cucumber slices" />
          </div>
          <div className="food-image lettuce-image">
            <img src="/images/lettuce.png" alt="Lettuce leaves" />
          </div>
        </div>

        {/* Bottom dark section with text and buttons */}
        <div className="dark-section">
          <div className="text-content">
            <h1>Welcome to Nutribase</h1>
            <p>The smarter way to share your fridge.</p>
          </div>

          <div className="buttons">
            {/* Added Link component for navigation */}
            <Link to="/login" style={{ textDecoration: "none", width: "100%" }}>
              <button className="login-button">
                <LoginIcon />
                Login
              </button>
            </Link>
            {/* Added Link component for navigation */}
            <Link to="/signup" style={{ textDecoration: "none", width: "100%" }}>
              <button className="signup-button">
                <UserPlusIcon />
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
