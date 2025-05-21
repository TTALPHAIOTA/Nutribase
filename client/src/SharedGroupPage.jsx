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

  // SVG Icon Components (copied from MyFoodPage)
  const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
  const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#8a6ae6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#c0bfc7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )

  return (
    <div className="profile-container">
      <div className="header">
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
      <div className="bottom-nav">
        <button className="nav-button" onClick={() => navigate("/myfood")}> <HomeIcon /> </button>
        <button className="nav-button nav-button-active" onClick={() => navigate("/sharedfood")}> <BookmarkIcon /> </button>
        <button className="nav-button" onClick={() => navigate("/profile")}> <UserIcon /> </button>
      </div>
    </div>
  )
}