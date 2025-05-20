import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div className="profile-container">
      <div className="header">
        <span className="back-arrow" onClick={() => navigate("/profile")}>
          ←
        </span>
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
          <li>• Track your food items and their weight</li>
          <li>• See who added each item</li>
          <li>• Share your fridge with roommates</li>
          <li>• Easy, collaborative fridge management</li>
        </ul>
      </div>
    </div>
  )
}