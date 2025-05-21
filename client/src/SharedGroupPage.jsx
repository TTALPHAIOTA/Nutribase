"use client"

import { useState } from "react"

export default function SharedGroup() {
  const [members, setMembers] = useState([
    { name: "Ganesh Kumarappan (Owner)", time: "Just now" },
    { name: "Michelle Hong", time: "1d ago" },
    { name: "Emanuel Nader", time: "2d ago" },
    { name: "Marcus Mendoza", time: "2d ago" },
  ])
  const [adding, setAdding] = useState(false)
  const [newMember, setNewMember] = useState("")

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      setMembers([...members, { name: newMember.trim(), time: "Just now" }])
      setNewMember("")
      setAdding(false)
    }
  }

  const handleRemove = (index) => {
    const updated = [...members]
    updated.splice(index, 1)
    setMembers(updated)
  }

  const handleCancel = () => {
    setNewMember("")
    setAdding(false)
  }

  return (
    <div
      style={{
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
      {/* Background wave */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0.15,
          zIndex: 0,
          backgroundColor: "white",
          borderRadius: "50%",
          transform: "scale(1.5) translateY(-20%) translateX(20%)",
        }}
      />

      {/* Close button */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2 }}>
        <button style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}>
          ✕
        </button>
      </div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "5px" }}>Hi Ganesh,</h1>
        <p style={{ fontSize: "24px", marginTop: "0" }}>Manage your fridge.</p>

        {/* Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "30px",
            color: "black",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Your Nutribase</h2>
            <a href="#" style={{ color: "#37ad60", textDecoration: "none", fontWeight: "bold" }}>
              See all
            </a>
          </div>

          {/* Members list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {members.map((member, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #ebebeb",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/48"
                      alt={member.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{member.name}</p>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#81838f" }}>{member.time}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e53e3e",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add member input */}
            {adding && (
              <div style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  style={{
                    padding: "12px",
                    width: "100%",
                    marginBottom: "10px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleAddMember}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#37ad60",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#eee",
                      color: "#333",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add Member Button */}
            {!adding && (
              <button
                onClick={() => setAdding(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "12px",
                  marginTop: "20px",
                  border: "2px solid #37ad60",
                  borderRadius: "50px",
                  backgroundColor: "transparent",
                  color: "#37ad60",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    transform: "rotate(-45deg)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      right: "0",
                      height: "2px",
                      backgroundColor: "#37ad60",
                      transform: "translateY(-50%)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      backgroundColor: "#37ad60",
                      transform: "translateX(-50%)",
                    }}
                  ></span>
                </span>
                Add a Fridge Member
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
