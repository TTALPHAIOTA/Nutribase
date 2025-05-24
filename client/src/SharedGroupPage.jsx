"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css"; // Assuming some styles might be shared or adapt as needed

export default function SharedGroupPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState("");

  const loggedInUsername = localStorage.getItem("username");

  const fetchGroupMembers = async () => {
    if (!loggedInUsername) {
      setError("You must be logged in to manage groups.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5050/account/user/${loggedInUsername}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const userData = await response.json();
      setMembers(userData.group || []);
      setError("");
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, [loggedInUsername]);

  const handleAddMember = async () => {
    if (!newMemberUsername.trim()) {
      setError("Please enter a username to add.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5050/account/group/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUsername: loggedInUsername, memberUsernameToAdd: newMemberUsername }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add member.");
      }
      setSuccess(data.message);
      setMembers(data.group); // Update local state with new group from backend
      setNewMemberUsername("");
      setIsAdding(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => { setSuccess(""); setError(""); }, 3000);
    }
  };

  const handleRemoveMember = async (memberUsernameToRemove) => {
    if (!window.confirm(`Are you sure you want to remove ${memberUsernameToRemove} from your group?`)) return;
    
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5050/account/group/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUsername: loggedInUsername, memberUsernameToRemove }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove member.");
      }
      setSuccess(data.message);
      setMembers(data.group); // Update local state
      setNewMemberUsername("");
      setIsAdding(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => { setSuccess(""); setError(""); }, 3000);
    }
  };

  if (!loggedInUsername) {
     return (
         <div style={{ padding: '20px', textAlign: 'center' }}>
             <p>Please log in to manage your shared group.</p>
             <button onClick={() => navigate('/login')}>Go to Login</button>
         </div>
     );
  }

  return (
    <div
      style={{ /* Using styles from your original SharedGroupPage for the purple theme */
        fontFamily: "Arial, sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#8c63ee",
        minHeight: "100vh",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
          opacity: 0.15, zIndex: 0, backgroundColor: "white",
          borderRadius: "50%", transform: "scale(1.5) translateY(-20%) translateX(20%)",
        }}
      />
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2 }}>
        <button
          style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          ✕
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "5px" }}>Hi {loggedInUsername},</h1>
        <p style={{ fontSize: "20px", marginTop: "0", marginBottom: "30px" }}>Manage your shared fridge group.</p>

        {error && <p style={{ color: "red", backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>{error}</p>}
        {success && <p style={{ color: "green", backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>{success}</p>}

        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", color: "black" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>Group Members</h2>
          
          {isLoading && <p>Loading members...</p>}
          
          {!isLoading && members.length === 0 && !isAdding && (
            <p>You haven't added anyone to your group yet.</p>
          )}

          {!isLoading && members.map((memberUsername, index) => (
            <div
              key={index}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #ebebeb",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <img src={`http://localhost:5050/account/user/${memberUsername}/profile-picture`} 
                      alt={memberUsername} 
                      style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f0f0f0", objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/40?text=Pic"; }} // Fallback
                 />
                 <span>{memberUsername}</span>
              </div>
              <button
                onClick={() => handleRemoveMember(memberUsername)}
                style={{
                  background: "none", border: "1px solid #e53e3e", color: "#e53e3e",
                  fontSize: "14px", cursor: "pointer", padding: '5px 10px', borderRadius: '5px'
                }}
              >
                Remove
              </button>
            </div>
          ))}

          {isAdding ? (
            <div style={{ marginTop: "20px" }}>
              <input
                type="text"
                placeholder="Enter username to add"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                style={{
                  padding: "12px", width: "100%", marginBottom: "10px",
                  borderRadius: "10px", border: "1px solid #ccc", fontSize: "16px", color: 'black'
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleAddMember} disabled={isLoading} style={buttonStyle("#37ad60", "white")}>
                  {isLoading ? "Adding..." : "Add Member"}
                </button>
                <button onClick={() => setIsAdding(false)} style={buttonStyle("#eee", "#333")}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "12px", marginTop: "20px", border: "2px solid #37ad60",
                borderRadius: "50px", backgroundColor: "transparent", color: "#37ad60",
                fontWeight: "bold", fontSize: "16px", cursor: "pointer",
              }}
            >
              + Add a Fridge Member
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor, textColor) => ({
  flex: 1, padding: "10px", backgroundColor: bgColor, color: textColor,
  border: "none", borderRadius: "10px", fontWeight: "bold",
  fontSize: "16px", cursor: "pointer",
});