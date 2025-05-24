"use client"
// Keep existing imports for useNavigate, useEffect, useState
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./my-food-styles.css"; // Keep your existing styles
import Food_Item from "./components/Food_Item"; // Import the updated component

// Icon Components (HomeIcon, GroupIcon, UserIcon - keep as they are)
const HomeIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"n fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
   <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
   <circle cx="12" cy="7" r="4" />
 </svg>
);


export default function MyFoodPage() {
  const navigate = useNavigate();
  const [myFoodItems, setMyFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFoodItemForm, setShowFoodItemForm] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState(null); // To store item being edited

  const username = localStorage.getItem("username");

  const fetchMyFood = async () => {
    if (!username) {
      setLoading(false);
      // Optionally navigate to login if no username
      // navigate("/login"); 
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5050/account/user/${username}`);
      if (!res.ok) throw new Error('Failed to fetch food items');
      const data = await res.json();
      setMyFoodItems(data.foods || []);
    } catch (err) {
      console.error("Error fetching food items:", err);
      setMyFoodItems([]); // Set to empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFood();
  }, [username]);

  const handleViewSharedFridge = () => navigate("/sharedfood");
  const handleNavigation = (path) => navigate(path);

  const handleOpenAddFoodForm = () => {
    setEditingFoodItem(null); // Ensure not in edit mode
    setShowFoodItemForm(true);
  };

  const handleOpenEditFoodForm = (item) => {
    setEditingFoodItem(item);
    setShowFoodItemForm(true);
  };

  const handleFormSubmitSuccess = (updatedOrNewItem) => {
     setShowFoodItemForm(false);
     setEditingFoodItem(null);
     fetchMyFood(); // Re-fetch all food items to get the latest list
  };
  
  const handleFormCancel = () => {
     setShowFoodItemForm(false);
     setEditingFoodItem(null);
  };

  const handleDeleteFood = async (foodId) => {
    if (!foodId || !username) return;
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      const res = await fetch(`http://localhost:5050/account/delete-food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, foodId }),
      });
      if (res.ok) {
        setMyFoodItems(prevItems => prevItems.filter(item => item._id !== foodId));
      } else {
        alert("Failed to delete food item: " + (await res.json()).message);
      }
    } catch (err) {
      alert("Error deleting food item: " + err.message);
    }
  };

  const handleManualWeightUpdate = async (foodId, newWeight) => {
     if (!username || !foodId || newWeight === undefined) return;
     const weightValue = parseFloat(newWeight);
     if (isNaN(weightValue) && newWeight !== "") { // Allow empty string to clear weight
         alert("Please enter a valid number for weight.");
         return;
     }

     try {
         const res = await fetch(`http://localhost:5050/account/food-item/${username}/${foodId}`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ weight: newWeight === "" ? null : weightValue }),
         });
         if (!res.ok) throw new Error(await res.json().message || 'Failed to update weight');
         
         // Update local state immediately for better UX
         setMyFoodItems(prevItems => prevItems.map(item => 
             item._id === foodId ? { ...item, weight: newWeight === "" ? null : weightValue } : item
         ));
     } catch (err) {
         alert("Error updating weight: " + err.message);
         fetchMyFood(); // Re-fetch to ensure data consistency on error
     }
  };


  return (
    <div className="my-food-container">
      <div className="my-food-content">
        <h1 className="my-food-title">My Food</h1>

        {showFoodItemForm && (
          <Food_Item
            initialData={editingFoodItem}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleFormCancel}
            username={username}
          />
        )}

        <button 
             className="add-food-button" 
             onClick={handleOpenAddFoodForm}
             style={{ marginBottom: '20px' }} // Ensure consistent styling
             disabled={showFoodItemForm && !editingFoodItem} // Disable if add form is open
         >
          + Add Food
        </button>

        {loading ? (
          <div>Loading...</div>
        ) : myFoodItems.length === 0 && !showFoodItemForm ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '50vh', color: '#c0bfc7', textAlign: 'center'
          }}>
            {/* Removed image: /images/no-food-illustration.svg */}
            <h2 style={{ fontWeight: 600, fontSize: '1.5rem', margin: 0, color: '#b0aeb8' }}>No Food Items Yet</h2>
            <div style={{ fontSize: '1rem', marginTop: 8, color: '#c0bfc7' }}>Click "+ Add Food" to get started.</div>
          </div>
        ) : (
          <div className="my-food-list">
            {myFoodItems.map((item) => (
              <div key={item._id} className="my-food-item">
                {/* REMOVED: <div className="my-food-image my-food-image-bordered"> ... </div> */}
                <div className="my-food-details">
                  <p className="food-name">{item.name}</p>
                  <p className="date">
                    Added: {item.dateAdded
                      ? new Date(item.dateAdded).toLocaleString("en-US", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                  {item.brand && <p className="brand">Brand: {item.brand}</p>}
                  {item.expiration_date && <p className="expiration">Expires: {new Date(item.expiration_date).toLocaleDateString()}</p>}
                  {item.price && <p className="price">Price: {item.price}</p>}
                  <div>
                    <label htmlFor={`weight-${item._id}`} style={{ marginRight: '5px' }}>Weight (g):</label>
                    <input
                      type="number"
                      id={`weight-${item._id}`}
                      value={item.weight === null || item.weight === undefined ? '' : item.weight}
                      onChange={(e) => {
                         // Optimistic UI update
                         const newWeight = e.target.value;
                         setMyFoodItems(prev => prev.map(fi => 
                             fi._id === item._id ? {...fi, weight: newWeight === "" ? null : parseFloat(newWeight) } : fi
                         ));
                      }}
                      onBlur={(e) => handleManualWeightUpdate(item._id, e.target.value)}
                      placeholder="Enter weight"
                      style={{ width: '100px', padding: '5px', marginRight: '10px' }}
                    />
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                 <button onClick={() => handleOpenEditFoodForm(item)} className="edit-btn" style={{padding: '5px 10px', cursor: 'pointer'}}>Edit</button>
                  <button
                    className="delete-food-button"
                    onClick={() => handleDeleteFood(item._id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="shared-fridge-button" onClick={handleViewSharedFridge}>
          View Shared Fridge
        </button>
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
  );
}