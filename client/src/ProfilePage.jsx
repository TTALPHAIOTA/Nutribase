"use client"

import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username")
    setUsername(storedUsername || "")
  }, [])

  return (
    <div className="profile-container">
      <div className="header">
        <span className="back-arrow" onClick={() => navigate("/myfood")}>
          ←
        </span>
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <img
          src="/images/profile.jpg"
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <div className="profile-name">{username}</div>
          {/* ID line removed */}
        </div>
      </div>

      <div className="profile-list">
        <button onClick={() => navigate("/settings")} className="profile-list-item">
          <span role="img" aria-label="settings">
            ⚙️
          </span>{" "}
          Settings
        </button>
        <button className="profile-list-item" onClick={() => navigate("/about")}>
          <span role="img" aria-label="about">
            ℹ️
          </span>{" "}
          About
        </button>
        <button className="profile-list-item" onClick={() => navigate("/sharedfood")}>
          <span role="img" aria-label="group">
            👥
          </span>{" "}
          Shared Group
        </button>
      </div>

      <button className="logout-btn" onClick={() => {
        localStorage.removeItem("username")
        navigate("/")
      }}>
        Logout
      </button>
    </div>
  )
}


// import { useNavigate } from "react-router-dom";
// import "./ProfilePage.css"; // Create this CSS file for custom styles

// export default function ProfilePage() {
//   const navigate = useNavigate();

//   return (
//     <div className="profile-container">
//       <h2>Profile</h2>
//       <div className="profile-card">
//         <img
//           src="/images/profile.jpg" // Replace with your image path
//           alt="Profile"
//           className="profile-avatar"
//         />
//         <div>
//           <div className="profile-name">Ganesh Kumarappan</div>
//           <div className="profile-id">ID: 12025550161</div>
//         </div>
//       </div>
//       <div className="profile-list">
//         <button onClick={() => navigate("/settings")} className="profile-list-item">
//           <span role="img" aria-label="settings">⚙️</span> Settings
//         </button>
//         <button className="profile-list-item">
//           <span role="img" aria-label="about">ℹ️</span> About
//         </button>
//         <button className="profile-list-item">
//           <span role="img" aria-label="help">❓</span> Help
//         </button>
//       </div>
//       <button className="logout-btn">Logout</button>
//     </div>
//   );
// }