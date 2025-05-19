"use client"

import { useState } from "react"
import "./shared-food-styles.css"

// Custom icon components to replace lucide-react
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

export default function SharedFoodPage() {
  // This could be fetched from an API in a real application
  const [sharedItems] = useState([
    {
      id: 1,
      image: "/placeholder.svg?height=80&width=80",
      date: "26 Jan, 2025 11:39AM",
      name: "Cobb Salad",
      sharedBy: "Michelle",
      profileImage: "/placeholder.svg?height=56&width=56",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=80&width=80",
      date: "24 Jan, 2025 11:05AM",
      name: "Leftover Ramen",
      sharedBy: "Emanuel",
      profileImage: "/placeholder.svg?height=56&width=56",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=80&width=80",
      date: "25 Jan, 2025 1:39PM",
      name: "Yellow Onion",
      quantity: "0.13 lbs",
      hasBorder: true,
    },
    {
      id: 4,
      image: "/placeholder.svg?height=80&width=80",
      date: "25 Jan, 2025 1:43PM",
      name: "Ground Beef",
      quantity: "0.67 lbs",
    },
  ])

  return (
    <div className="shared-food-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="time">18:10</div>
        <div className="status-icons">
          <div className="signal-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <div className="wifi">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8C3 4.5 5.5 2 9 2C12.5 2 15 4.5 15 8" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 12C1 6 5 2 10 2C15 2 19 6 19 12" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="battery">
            <div className="battery-level"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="shared-food-content">
        <h1 className="shared-food-title">Shared Food</h1>

        {/* Food Items List */}
        <div className="food-list">
          {sharedItems.map((item) => (
            <div key={item.id} className="food-item">
              <div className={`food-image ${item.hasBorder ? "food-image-bordered" : ""}`}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="image" />
              </div>
              <div className="food-details">
                <p className="date">{item.date}</p>
                <p className="food-name">
                  {item.name} {item.sharedBy ? `- ${item.sharedBy}` : item.quantity ? `- ${item.quantity}` : ""}
                </p>
              </div>
              {item.profileImage && (
                <div className="profile-image">
                  <img src={item.profileImage || "/placeholder.svg"} alt="Profile" className="image" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View Your Fridge Button */}
        <button className="fridge-button">View Your Fridge</button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-button">
          <HomeIcon />
        </button>
        <button className="nav-button">
          <SearchIcon />
        </button>
        <button className="nav-button">
          <BookmarkIcon />
        </button>
        <button className="nav-button">
          <UserIcon />
        </button>
      </div>
    </div>
  )
}