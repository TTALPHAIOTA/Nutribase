"use client"
import "./MyFoodPage.css"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./my-food-styles.css"

// Icon Components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function MyFoodPage() {
  const navigate = useNavigate()
  const [myFoodItems, setMyFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFood, setNewFood] = useState({ name: "", dateAdded: "" })

  const username = "Emanuel"

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5050/account/user/${username}`)
        const data = await res.json()
        setMyFoodItems(data.foods || [])
      } catch (err) {
        setMyFoodItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [username])

  const handleViewSharedFridge = () => {
    navigate("/sharedfood")
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

<<<<<<< Updated upstream
  const handleAddFood = async () => {
    const name = prompt("Enter the name of the food item:")
    if (!name) return

    // Simulate hardware scale reading (replace with real hardware integration)
    alert("Please place the food item on the scale and press OK when ready.")
    // For now, prompt for weight
    const weight = prompt("Enter the measured weight in lbs (e.g., 0.25):")
    if (!weight) return

    const food = {
      name,
      dateAdded: new Date().toISOString(),
      addedBy: username,
      weight,
    }

    try {
      const res = await fetch("http://localhost:5050/account/add-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, food }),
      })
      const data = await res.json()
      if (res.ok) {
        setMyFoodItems((prev) => [...prev, food])
      } else {
        alert(data.message || "Failed to add food")
      }
    } catch (err) {
      alert("Error connecting to server")
    }
=======
  const handleAddFood = () => {
    if (!newFood.name || !newFood.dateAdded) return
    const updated = [...myFoodItems, newFood]
    setMyFoodItems(updated)
    setNewFood({ name: "", dateAdded: "" })
    setShowAddForm(false)
  }

  const handleDeleteFood = (indexToRemove) => {
    const updated = myFoodItems.filter((_, idx) => idx !== indexToRemove)
    setMyFoodItems(updated)
>>>>>>> Stashed changes
  }

  return (
    <div className="my-food-container">
      <div className="my-food-content">
        <h1 className="my-food-title">My Food</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="my-food-list">
            {myFoodItems.map((item, idx) => (
              <div key={idx} className="my-food-item">
                <div className="my-food-image my-food-image-bordered">
                  <img src="/placeholder.svg" alt={item.name} className="image" />
                </div>
                <div className="my-food-details">
                  <p className="date">
                    {item.dateAdded
                      ? new Date(item.dateAdded).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                  <p className="food-name">{item.name}</p>
                </div>
                <button
                  className="delete-food-button"
                  onClick={() => handleDeleteFood(idx)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="shared-fridge-button" onClick={handleViewSharedFridge}>
          View Shared Fridge
        </button>

<<<<<<< Updated upstream
        {/* Add Food Button */}
        <button className="add-food-button" onClick={handleAddFood}>
          + Add Food
        </button>
=======
        <button className="add-food-button" onClick={() => setShowAddForm(true)}>
          + Add Food
        </button>

        {showAddForm && (
          <div className="add-food-form">
            <input
              type="text"
              placeholder="Food name"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            />
            <input
              type="datetime-local"
              value={newFood.dateAdded}
              onChange={(e) => setNewFood({ ...newFood, dateAdded: e.target.value })}
            />
            <div className="form-actions">
              <button onClick={handleAddFood}>Add</button>
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}
>>>>>>> Stashed changes
      </div>

      <div className="bottom-nav">
        <button className="nav-button nav-button-active" onClick={() => handleNavigation("/myfood")}>
          <HomeIcon />
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
