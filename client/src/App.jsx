import { Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import SignupPage from "./SignupPage"
import LoginPage from "./LoginPage"
import ProfilePage from "./ProfilePage"
import SettingsPage from "./SettingsPage"
import SharedGroupPage from "./SharedGroupPage"
import MyFoodPage from "./MyFoodPage"
import AboutPage from "./AboutPage"
import UserManagement from "./UserManagement"
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
        <Route path="/sharedfood" element={<SharedGroupPage />} />
        <Route path="/myfood" element={<MyFoodPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/usermanagement" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default App


