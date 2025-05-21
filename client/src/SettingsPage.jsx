"use client"

import { useNavigate } from "react-router-dom"
import "./SettingsPage.css"

export default function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="mobile-container">
      <div className="page-header">
        <span className="back-button" onClick={() => navigate(-1)}>
          ←
        </span>
        <span className="header-title">Settings</span>
      </div>

      <div className="settings-options">
        <div className="settings-item">Change Profile Photo</div>
        <div className="settings-item">Change Personal Info</div>
        <div className="settings-item">Change Password</div>
      </div>
    </div>
  )
}
