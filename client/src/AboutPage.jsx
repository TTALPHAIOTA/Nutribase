import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"

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
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? "#222" : "#c0bfc7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="3"/>
    <circle cx="6.5" cy="12.5" r="2.5"/>
    <circle cx="17.5" cy="12.5" r="2.5"/>
    <path d="M2 20c0-2.5 4-4 10-4s10 1.5 10 4"/>
  </svg>
)

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div className="profile-container">
      <div className="header">
        <span className="back-arrow" onClick={() => navigate("/profile")}>←</span>
        <h2>About</h2>
      </div>
      <div style={{ padding: "24px 0", color: "#2f313e", fontSize: "1.1rem" }}>
        <p>
          <b>Smart Food Tracker</b> is a fridge tracking app that helps you manage what's in your fridge.
        </p>
        <br />
        <p>
          Using an ESP32, you can weigh your food items directly in your fridge. You can also collaborate with roommates so everyone sees which items are theirs. This app is designed to help users manage their fridge contents and reduce food waste!
        </p>
        <br />
        <ul style={{ marginLeft: 20 }}>
          <li>Track your food items and their weight</li>
          <li>See who added each item</li>
          <li>Share your fridge with roommates</li>
          <li>Easy, collaborative fridge management</li>
        </ul>
      </div>
    </div>
  )
}