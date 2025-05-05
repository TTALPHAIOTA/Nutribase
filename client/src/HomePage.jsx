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
            <img
              src="/images/cucumberreal.png"
              alt="Cucumber slices"
            />
          </div>
          <div className="food-image lettuce-image">
            <img
              src="/images/lettuce.png"
              alt="Lettuce leaves"
            />
          </div>
        </div>

        {/* Bottom dark section with text and buttons */}
        <div className="dark-section">
          <div className="text-content">
            <h1>Welcome to Nutribase</h1>
            <p>The smarter way to share your fridge.</p>
          </div>

          <div className="buttons">
            <button className="login-button">
              <LoginIcon />
              Login
            </button>
            <button className="signup-button">
              <UserPlusIcon />
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage


// import React from 'react';
// import { Link } from 'react-router-dom'; // or use <a> / <button> if you don't have routing

// const HomePage = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center bg-white">
//       {/* Hero */}
//       <div
//         className="relative w-full h-80 sm:h-96 bg-cover bg-center"
//         style={{ backgroundImage: "url('/images/hero.png')" }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent" />
//       </div>

//       {/* Content panel */}
//       <div className="bg-gray-900 w-full max-w-sm mt-[-2rem] rounded-t-3xl px-6 py-10 text-center shadow-xl">
//         <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
//           Welcome to Nutribase
//         </h1>
//         <p className="text-gray-300 mb-8">
//           The smarter way to share your fridge.
//         </p>

//         <Link
//           to="/login"
//           className="block w-full mb-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition"
//         >
//           Login
//         </Link>
//         <Link
//           to="/signup"
//           className="block w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-xl transition"
//         >
//           Sign up
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default HomePage;