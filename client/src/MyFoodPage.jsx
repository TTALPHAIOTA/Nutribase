"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./my-food-styles.css"

// Custom icon components
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
)

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function MyFoodPage() {
  const navigate = useNavigate()

  // This could be fetched from an API in a real application
  const [myFoodItems] = useState([
    {
      id: 1,
      image: "/placeholder.svg?height=80&width=80",
      date: "25 Jan, 2025 1:39PM",
      name: "Yellow Onion",
      quantity: "0.13 lbs",
      hasBorder: true,
    },
    {
      id: 2,
      image: "/placeholder.svg?height=80&width=80",
      date: "25 Jan, 2025 1:43PM",
      name: "Ground Beef",
      quantity: "0.67 lbs",
    },
  ])

  const handleViewSharedFridge = () => {
    navigate("/sharedfood")
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="my-food-container">
      {/* Main Content */}
      <div className="my-food-content">
        <h1 className="my-food-title">My Food</h1>

        {/* Food Items List */}
        <div className="my-food-list">
          {myFoodItems.map((item) => (
            <div key={item.id} className="my-food-item">
              <div className={`my-food-image ${item.hasBorder ? "my-food-image-bordered" : ""}`}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="image" />
              </div>
              <div className="my-food-details">
                <p className="date">{item.date}</p>
                <p className="food-name">
                  {item.name} {item.quantity ? `- ${item.quantity}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View Shared Fridge Button */}
        <button className="shared-fridge-button" onClick={handleViewSharedFridge}>
          View Shared Fridge
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-button nav-button-active" onClick={() => handleNavigation("/myfood")}>
          <HomeIcon />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/")}>
          <SearchIcon />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/sharedfood")}>
          <BookmarkIcon />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/profile")}>
          <UserIcon />
        </button>
      </div>
    </div>
  )
}

