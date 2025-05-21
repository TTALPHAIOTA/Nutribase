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

// New Group Icon SVG
const GroupIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#8a6ae6" : "#c0bfc7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <circle cx="12" cy="10" r="3"/>
    <circle cx="6.5" cy="12.5" r="2.5"/>
    <circle cx="17.5" cy="12.5" r="2.5"/>
    <path d="M2 20c0-2.5 4-4 10-4s10 1.5 10 4"/>
  </svg>
)

export default function MyFoodPage() {
  const navigate = useNavigate()
  const [myFoodItems, setMyFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFood, setNewFood] = useState({ name: "", dateAdded: "" })
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [photoFoodName, setPhotoFoodName] = useState("")
  const [photoFile, setPhotoFile] = useState(null)
  const [pendingFood, setPendingFood] = useState(null) // NEW

  const username = localStorage.getItem("username") || ""

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

  // Step 1: User clicks "Add" on food form
  const handleAddFood = () => {
    if (!newFood.name || !newFood.dateAdded) return
    setPendingFood(newFood)
    setPhotoFoodName(newFood.name)
    setShowAddForm(false)
    setShowPhotoUpload(true)
  }

  // Step 2: User uploads photo or skips
  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0])
  }

  // Step 3: Upload photo (if any) and add food to DB
  const handleUploadPhoto = async () => {
    let photoUploaded = false
    if (photoFile && pendingFood) {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("foodName", pendingFood.name)
      formData.append("photo", photoFile)
      try {
        const res = await fetch("http://localhost:5050/account/upload-food-photo", {
          method: "POST",
          body: formData,
        })
        photoUploaded = res.ok
      } catch {}
    }
    await actuallyAddFoodToDB()
  }

  // Step 4: Skip photo
  const handleSkipPhoto = async () => {
    await actuallyAddFoodToDB()
  }

  // Step 5: Actually add food to DB (after photo step)
  const actuallyAddFoodToDB = async () => {
    if (!pendingFood) return
    try {
      const res = await fetch("http://localhost:5050/account/add-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          food: pendingFood,
        }),
      })
      if (res.ok) {
        const updated = [...myFoodItems, pendingFood]
        setMyFoodItems(updated)
        setNewFood({ name: "", dateAdded: "" })
      } else {
        alert("Failed to add food")
      }
    } catch {
      alert("Error adding food")
    }
    setShowPhotoUpload(false)
    setPhotoFile(null)
    setPhotoFoodName("")
    setPendingFood(null)
  }

  const handleDeleteFood = async (indexToRemove) => {
    const foodToDelete = myFoodItems[indexToRemove]
    if (!foodToDelete) return
    try {
      const res = await fetch("http://localhost:5050/account/delete-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          foodName: foodToDelete.name,
          dateAdded: foodToDelete.dateAdded,
        }),
      })
      if (res.ok) {
        const updated = myFoodItems.filter((_, idx) => idx !== indexToRemove)
        setMyFoodItems(updated)
      } else {
        alert("Failed to delete food item")
      }
    } catch {
      alert("Error deleting food item")
    }
  }

  return (
    <div className="my-food-container">
      <div className="my-food-content">
        <h1 className="my-food-title">My Food</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          myFoodItems.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#c0bfc7', textAlign: 'center'
            }}>
              {/* Remove or comment out the image below */}
              {/* <img src="/images/no-food-illustration.svg" alt="No Food" style={{ width: 180, marginBottom: 32, opacity: 0.15 }} /> */}
              <h2 style={{ fontWeight: 600, fontSize: 32, margin: 0, color: '#b0aeb8' }}>No Food</h2>
              <div style={{ fontSize: 18, marginTop: 8, color: '#c0bfc7' }}>You don't have any food items yet</div>
            </div>
          ) : (
            <div className="my-food-list">
              {myFoodItems.map((item, idx) => (
                <div key={idx} className="my-food-item">
                  <div className="my-food-image my-food-image-bordered">
                    <img src={item.photoUrl || "/placeholder.svg"} alt={item.name} className="image" />
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
          )
        )}

        <button className="shared-fridge-button" onClick={handleViewSharedFridge}>
          View Shared Fridge
        </button>

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

        {showPhotoUpload && (
          <div className="add-food-form">
            <label style={{ marginBottom: 8 }}>
              Upload a photo for <b>{photoFoodName}</b>:
            </label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            <div className="form-actions">
              <button onClick={handleUploadPhoto} disabled={!pendingFood}>
                Upload Photo
              </button>
              <button className="cancel-btn" onClick={handleSkipPhoto}>
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <button className="nav-button nav-button-active" onClick={() => handleNavigation("/myfood")}>
          <HomeIcon />
        </button>
        <button className="nav-button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }} onClick={() => handleNavigation("/sharedfood")}>
          <GroupIcon active={false} />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/profile")}>
          <UserIcon />
        </button>
      </div>
    </div>
  )
}
