import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"

export default function SharedGroupPage() {
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [inviteUser, setInviteUser] = useState("")
  const [message, setMessage] = useState("")
  const username = localStorage.getItem("username") || ""

  useEffect(() => {
    async function fetchGroup() {
      try {
        const res = await fetch(`http://localhost:5050/account/user/${username}`)
        const data = await res.json()
        setGroup(data.group || null)
      } catch {
        setGroup(null)
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
        {!group ? (
          <div style={{ color: "#888", marginBottom: 24 }}>You are in no group.</div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <b>Group Members:</b>
            <ul style={{ marginTop: 8, padding: 0, listStyle: "none" }}>
              {group.members && group.members.map((member, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", margin: "12px 0" }}>
                  {/* Placeholder avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0",
                    display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, fontWeight: 600, fontSize: 18
                  }}>
                    {member.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>{member.username}</span>
                    {member.role === "owner" && <span style={{ color: "#4CAF50", fontWeight: 600, marginLeft: 6 }}>(Owner)</span>}
                    {member.role === "member" && <span style={{ color: "#888", marginLeft: 6 }}>(Member)</span>}
                  </div>
                </li>
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
            style={{
              width: "100%",
              marginTop: 16,
              fontSize: "1.15rem",
              border: "1.5px solid #4CAF50",
              color: "#4CAF50",
              background: "#fff",
              borderRadius: 12,
              padding: "12px 0",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <span style={{ display: "flex", alignItems: "center", marginRight: 8 }}>
              <svg width="22" height="22" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
            Add a Fridge Member
          </button>
        </form>
        {message && <div style={{ color: "#8a6ae6" }}>{message}</div>}
      </div>
    </div>
  )
}