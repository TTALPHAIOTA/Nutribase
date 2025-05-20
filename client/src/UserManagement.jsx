export default function NutribasePage() {
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
        {/* Background wave - simplified */}
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
            <div>
              {/* Member 1 */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/48"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>Ganesh Kumarappan (Owner)</p>
                  </div>
                </div>
                <div style={{ color: "#526562" }}>Just now</div>
              </div>
              <hr style={{ border: "none", borderBottom: "1px solid #ebebeb", margin: "0 0 15px 0" }} />
  
              {/* Member 2 */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/48"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>Michelle Hong</p>
                  </div>
                </div>
                <div style={{ color: "#526562" }}>1d ago</div>
              </div>
              <hr style={{ border: "none", borderBottom: "1px solid #ebebeb", margin: "0 0 15px 0" }} />
  
              {/* Member 3 */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/48"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>Emanuel Nader</p>
                  </div>
                </div>
                <div style={{ color: "#526562" }}>2d ago</div>
              </div>
              <hr style={{ border: "none", borderBottom: "1px solid #ebebeb", margin: "0 0 15px 0" }} />
  
              {/* Member 4 */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/48"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>Marcus Mendoza</p>
                  </div>
                </div>
                <div style={{ color: "#526562" }}>2d ago</div>
              </div>
  
              {/* Add member button */}
              <button
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
            </div>
          </div>
        </div>
      </div>
    )
  }
  