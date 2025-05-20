"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="mobile-container">
      <div className="page-header">
        <span className="back-button" onClick={() => navigate("/profile")}>
          ←
        </span>
        <span className="header-title">Settings</span>
      </div>
      <div className="settings-options">
        <button
          className="settings-item"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
    </div>
  );
}
