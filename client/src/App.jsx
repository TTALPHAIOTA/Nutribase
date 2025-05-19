import { Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import SignupPage from "./SignupPage"
import LoginPage from "./LoginPage"
import ProfilePage from "./ProfilePage"
import SettingsPage from "./SettingsPage"
import SharedFoodPage from "./SharedFoodPage"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sharedfood" element={<SharedFoodPage />} />
      </Routes>
    </div>
  )
}

export default App

