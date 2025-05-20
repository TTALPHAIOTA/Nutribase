"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./shared-food-styles.css"

export default function SharedFoodPage() {
  const navigate = useNavigate()
  const [sharedItems, setSharedItems] = useState([])
  const [loading, setLoading] = useState(true)

  // TODO: Replace with real logged-in username (e.g. from context or localStorage)
  const username = "Emanuel"

  useEffect(() => {
    async function fetchSharedFoods() {
      try {
        // Fetch current user to get group
        const res = await fetch(`http://localhost:5050/account/user/${username}`)
        const user = await res.json()
        const group = user.group || []

        // Fetch foods for each group member
        const promises = group.map(async (member) => {
          const res = await fetch(`http://localhost:5050/account/user/${member}`)
          const memberData = await res.json()
          return (memberData.foods || []).map((food) => ({
            ...food,
            addedBy: member,
          }))
        })

        // Also include current user's foods
        const ownFoods = (user.foods || []).map((food) => ({
          ...food,
          addedBy: username,
        }))

        const groupFoodsArrays = await Promise.all(promises)
        const groupFoods = groupFoodsArrays.flat()
        setSharedItems([...ownFoods, ...groupFoods])
      } catch (err) {
        setSharedItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchSharedFoods()
  }, [username])

  const handleViewYourFridge = () => {
    navigate("/myfood")
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="shared-food-container">
      {/* Main Content */}
      <div className="shared-food-content">
        <h1 className="shared-food-title">Shared Food</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          /* Food Items List */
          <div className="food-list">
            {sharedItems.map((item, idx) => (
              <div key={idx} className="food-item">
                <div className="food-image food-image-bordered">
                  <img src="/placeholder.svg" alt={item.name} className="image" />
                </div>
                <div className="food-details">
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
                  <p className="food-name">
                    {item.name} {item.weight ? `- ${item.weight}` : ""}{" "}
                    {item.addedBy ? `- ${item.addedBy}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Your Fridge Button */}
        <button className="fridge-button" onClick={handleViewYourFridge}>
          View Your Fridge
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-button" onClick={() => handleNavigation("/myfood")}>
          <HomeIcon />
        </button>
        <button className="nav-button nav-button-active" onClick={() => handleNavigation("/sharedfood")}>
          <BookmarkIcon />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/profile")}>
          <UserIcon />
        </button>
      </div>
    </div>
  )
}

