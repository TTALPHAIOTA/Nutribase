"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./shared-food-styles.css"; // Ensure this CSS file doesn't have image specific styles or they are adapted

// Icon Components (HomeIcon, GroupIcon, UserIcon - keep as they are)
const HomeIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
   <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
   <polyline points="9 22 9 12 15 12 15 22" />
 </svg>
);

const GroupIcon = ({ active }) => (
 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#8a6ae6" : "#c0bfc7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
   <circle cx="12" cy="10" r="3"/>
   <circle cx="6.5" cy="12.5" r="2.5"/>
   <circle cx="17.5" cy="12.5" r="2.5"/>
   <path d="M2 20c0-2.5 4-4 10-4s10 1.5 10 4"/>
 </svg>
);

const UserIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
   <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
   <circle cx="12" cy="7" r="4" />
 </svg>
);

export default function SharedFoodPage() {
  const navigate = useNavigate();
  const [sharedItems, setSharedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUsername = localStorage.getItem("username"); // Current logged-in user

  useEffect(() => {
    async function fetchSharedFoods() {
      if (!loggedInUsername) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5050/account/user/${loggedInUsername}`);
        const user = await res.json();
        const groupMembers = user.group || []; // Names of group members
        
        let allSharedFoods = [];

        // Add current user's foods
        if (user.foods) {
          allSharedFoods.push(...user.foods.map(food => ({ ...food, addedBy: loggedInUsername, isOwner: true })));
        }

        // Fetch foods for each group member
        const memberFoodPromises = groupMembers
          .filter(memberUsername => memberUsername !== loggedInUsername) // Don't re-fetch own food
          .map(async (memberUsername) => {
            try {
              const memberRes = await fetch(`http://localhost:5050/account/user/${memberUsername}`);
              if (!memberRes.ok) return [];
              const memberData = await memberRes.json();
              return (memberData.foods || []).map(food => ({ 
                 ...food, 
                 addedBy: memberUsername, 
                 isOwner: false // Mark as not owned by the current logged-in user
             }));
            } catch (memberErr) {
              console.error(`Failed to fetch food for ${memberUsername}`, memberErr);
              return [];
            }
          });
        
        const groupFoodsArrays = await Promise.all(memberFoodPromises);
        groupFoodsArrays.forEach(memberFoods => allSharedFoods.push(...memberFoods));
        
        // Sort by dateAdded, most recent first
        allSharedFoods.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        setSharedItems(allSharedFoods);

      } catch (err) {
        console.error("Error fetching shared foods:", err);
        setSharedItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSharedFoods();
  }, [loggedInUsername]);

  const handleViewYourFridge = () => navigate("/myfood");
  const handleNavigation = (path) => navigate(path);

  const handleDeleteFood = async (foodId, ownerUsername) => {
     if (ownerUsername !== loggedInUsername) {
         alert("You can only delete your own food items.");
         return;
     }
     if (!foodId || !ownerUsername) return;
     if (!window.confirm("Are you sure you want to delete this food item?")) return;

     try {
         const res = await fetch(`http://localhost:5050/account/delete-food`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ username: ownerUsername, foodId }), // Backend expects username of owner
         });
         if (res.ok) {
         setSharedItems(prevItems => prevItems.filter(item => item._id !== foodId));
         } else {
         alert("Failed to delete food item: " + (await res.json()).message);
         }
     } catch (err) {
         alert("Error deleting food item: " + err.message);
     }
  };


  return (
    <div className="shared-food-container">
      <div className="shared-food-content">
        <h1 className="shared-food-title">Shared Food</h1>
        {loading ? (
          <div>Loading...</div>
        ) : sharedItems.length === 0 ? (
         <div style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>
             <p>No shared food items yet, or you're not in a group.</p>
             <p>Add food to your fridge or manage your group in Profile settings.</p>
         </div>
        ) : (
          <div className="food-list">
            {sharedItems.map((item) => (
              <div key={item._id || `${item.name}-${item.dateAdded}-${item.addedBy}`} className="food-item"> {/* Use a robust key */}
                {/* REMOVED: <div className="food-image food-image-bordered"> ... </div> */}
                <div className="food-details">
                  <p className="food-name">{item.name}</p>
                  <p className="date">
                    Added: {item.dateAdded
                      ? new Date(item.dateAdded).toLocaleString("en-US", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                  {item.weight !== null && item.weight !== undefined && <p className="weight">Weight: {item.weight}g</p>}
                  {item.brand && <p className="brand">Brand: {item.brand}</p>}
                  {item.expiration_date && <p className="expiration">Expires: {new Date(item.expiration_date).toLocaleDateString()}</p>}
                  <p className="added-by">Added by: {item.addedBy}{item.isOwner ? " (You)" : ""}</p>
                </div>
                {item.isOwner && (
                     <button
                         className="delete-food-button"
                         onClick={() => handleDeleteFood(item._id, item.addedBy)}
                         aria-label={`Remove ${item.name}`}
                         title="Delete this item"
                     >
                         ×
                     </button>
                )}
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
        <button className="nav-button nav-button-active" style={{ flex: 1 }} onClick={() => handleNavigation("/sharedfood")}>
          <GroupIcon active={true} />
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/profile")}>
          <UserIcon />
        </button>
      </div>
    </div>
  );
}