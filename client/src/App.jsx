import { Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import SignupPage from "./SignupPage"
import LoginPage from "./LoginPage"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
