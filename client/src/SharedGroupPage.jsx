import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"

export default function SharedGroupPage() {
  const navigate = useNavigate()
  const [group, setGroup] = useState([])
  const [inviteUser, setInviteUser] = useState("")
  const [message, setMessage] = useState("")
  const username = localStorage.getItem("username") || ""

  useEffect(() => {
    async function fetchGroup() {
      try {
        const res = await fetch(`http://localhost:5050/account/user/${username}`)
        const data = await res.json()
        setGroup(data.group || [])
      } catch {
        setGroup([])
      }
    }
    fetchGroup()
  }, [username])

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteUser) return;
    setMessage("");
    try {
      const res = await fetch("http://localhost:5050/account/invite-to-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, member: inviteUser }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Invite sent!");
        setInviteUser("");
      } else {
        setMessage(data.message || "Failed to send invite");
      }
    } catch {
      setMessage("Error sending invite");
    }
  }

  return (
    <div className="profile-container">
      <div className="header">
        <span className="back-arrow" onClick={() => navigate("/profile")}>
          ←
        </span>
        <h2>Shared Group</h2>
      </div>
      <div style={{ padding: "24px 0" }}>
        {group.length === 0 ? (
          <div style={{ color: "#888", marginBottom: 24 }}>You are in no group.</div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <b>Group Members:</b>
            <ul style={{ marginTop: 8 }}>
              {group.map((member, idx) => (
                <li key={idx} style={{ margin: "6px 0" }}>{member}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleInvite} style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Enter username to invite"
            value={inviteUser}
            onChange={e => setInviteUser(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginRight: "10px",
              width: "60%",
              fontSize: "1rem"
            }}
          />
          <button
            type="submit"
            className="add-food-button"
            style={{ width: "100%", marginTop: 16, fontSize: "1.25rem" }}
          >
            Invite to Shared Fridge
          </button>
        </form>
        {message && <div style={{ color: "#8a6ae6" }}>{message}</div>}
      </div>
    </div>
  )
}