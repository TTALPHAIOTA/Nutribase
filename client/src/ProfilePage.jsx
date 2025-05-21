"use client"

import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"
import { useEffect, useState } from "react"

// SVG Icon Components (copied from MyFoodPage)

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8a6ae6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const GroupIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#8a6ae6" : "#c0bfc7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <circle cx="12" cy="10" r="3"/>
    <circle cx="6.5" cy="12.5" r="2.5"/>
    <circle cx="17.5" cy="12.5" r="2.5"/>
    <path d="M2 20c0-2.5 4-4 10-4s10 1.5 10 4"/>
  </svg>
)

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
        <button className="profile-list-item" onClick={() => navigate("/sharedgroup")}>
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

      <div className="bottom-nav">
        <button className="nav-button" onClick={() => navigate("/myfood")}> <HomeIcon /> </button>
        <button className="nav-button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }} onClick={() => navigate("/sharedfood")}> <GroupIcon active={false} /> </button>
        <button className="nav-button nav-button-active" onClick={() => navigate("/profile")}> <UserIcon /> </button>
      </div>
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