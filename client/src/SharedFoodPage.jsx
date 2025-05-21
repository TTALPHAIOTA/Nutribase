"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./shared-food-styles.css"

export default function SharedFoodPage() {
  const navigate = useNavigate()
  const [sharedItems, setSharedItems] = useState([])
  const [loading, setLoading] = useState(true)

  const username = localStorage.getItem("username") || ""

  useEffect(() => {
    async function fetchSharedFoods() {
      try {
        const res = await fetch(`http://localhost:5050/account/user/${username}`)
        const user = await res.json()
        const group = user.group || []

        const promises = group.map(async (member) => {
          const res = await fetch(`http://localhost:5050/account/user/${member}`)
          const memberData = await res.json()
          return (memberData.foods || []).map((food) => ({
            ...food,
            addedBy: member,
          }))
        })

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

  const handleDelete = (indexToRemove) => {
    const updated = sharedItems.filter((_, idx) => idx !== indexToRemove)
    setSharedItems(updated)
  }

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

  return (
    <div className="shared-food-container">
      <div className="shared-food-content">
        <h1 className="shared-food-title">Shared Food</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="food-list">
            {sharedItems.map((item, idx) => (
              // <div key={idx} className="my-food-item">
              //   <div className="my-food-image my-food-image-bordered">
              //     {/* Optionally use item.image if you store images */}
              //     <img src="/placeholder.svg" alt={item.name} className="image" />
              //   </div>
              //   <div className="my-food-details">
              //     <p className="date">
              //       {item.dateAdded
              //         ? new Date(item.dateAdded).toLocaleString("en-US", {
              //             day: "2-digit",
              //             month: "short",
              //             year: "numeric",
              //             hour: "2-digit",
              //             minute: "2-digit",
              //           })
              //         : ""}
              //     </p>
              //     <p className="food-name">
              //       {item.name} {item.weight ? `- ${item.weight}` : ""}
              //     </p>
              //   </div>
              // </div>
              
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
                <button
                  className="delete-food-button"
                  onClick={() => handleDelete(idx)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="fridge-button" onClick={handleViewYourFridge}>
          View Your Fridge
        </button>
      </div>

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


// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import "./shared-food-styles.css"

// export default function SharedFoodPage() {
//   const navigate = useNavigate()
//   const [sharedItems, setSharedItems] = useState([])
//   const [loading, setLoading] = useState(true)

//   // TODO: Replace with real logged-in username (e.g. from context or localStorage)
//   const username = "Emanuel"

//   useEffect(() => {
//     async function fetchSharedFoods() {
//       try {
//         // Fetch current user to get group
//         const res = await fetch(`http://localhost:5050/account/user/${username}`)
//         const user = await res.json()
//         const group = user.group || []

//         // Fetch foods for each group member
//         const promises = group.map(async (member) => {
//           const res = await fetch(`http://localhost:5050/account/user/${member}`)
//           const memberData = await res.json()
//           return (memberData.foods || []).map((food) => ({
//             ...food,
//             addedBy: member,
//           }))
//         })

//         // Also include current user's foods
//         const ownFoods = (user.foods || []).map((food) => ({
//           ...food,
//           addedBy: username,
//         }))

//         const groupFoodsArrays = await Promise.all(promises)
//         const groupFoods = groupFoodsArrays.flat()
//         setSharedItems([...ownFoods, ...groupFoods])
//       } catch (err) {
//         setSharedItems([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchSharedFoods()
//   }, [username])

//   const handleViewYourFridge = () => {
//     navigate("/myfood")
//   }

//   const handleNavigation = (path) => {
//     navigate(path)
//   }

//   const HomeIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//       <polyline points="9 22 9 12 15 12 15 22" />
//     </svg>
//   )

//   const BookmarkIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
//     </svg>
//   )

//   const UserIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>
//   )

//   return (
//     <div className="shared-food-container">
//       {/* Main Content */}
//       <div className="shared-food-content">
//         <h1 className="shared-food-title">Shared Food</h1>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           /* Food Items List */
//           <div className="food-list">
//             {sharedItems.map((item, idx) => (
//               <div key={idx} className="food-item">
//                 <div className="food-image food-image-bordered">
//                   <img src="/placeholder.svg" alt={item.name} className="image" />
//                 </div>
//                 <div className="food-details">
//                   <p className="date">
//                     {item.dateAdded
//                       ? new Date(item.dateAdded).toLocaleString("en-US", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })
//                       : ""}
//                   </p>
//                   <p className="food-name">
//                     {item.name} {item.weight ? `- ${item.weight}` : ""}{" "}
//                     {item.addedBy ? `- ${item.addedBy}` : ""}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* View Your Fridge Button */}
//         <button className="fridge-button" onClick={handleViewYourFridge}>
//           View Your Fridge
//         </button>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="bottom-nav">
//         <button className="nav-button" onClick={() => handleNavigation("/myfood")}>
//           <HomeIcon />
//         </button>
//         <button className="nav-button nav-button-active" onClick={() => handleNavigation("/sharedfood")}>
//           <BookmarkIcon />
//         </button>
//         <button className="nav-button" onClick={() => handleNavigation("/profile")}>
//           <UserIcon />
//         </button>
//       </div>
//     </div>
//   )
// }

