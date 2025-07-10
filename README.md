# Nutribase 🍎  
**A Smart Fridge Tracker to Reduce Food Waste**  

![Nutribase Demo](https://via.placeholder.com/800x400?text=Nutribase+Demo+GIF/Image) *[Replace with screenshot/GIF]*  

Nutribase helps you and your roommates track food items in your fridge, monitor weight changes, and assign ownership to reduce food waste. With hardware integration (ESP32 + sensors), it’s a seamless bridge between your physical fridge and a collaborative digital dashboard.  

## Key Features ✨  
- **Real-time Weight Tracking** – ESP32 + load sensor logs food weight changes.  
- **Item Ownership Tags** – See who added what (via RFID/user profiles).  
- **Roommate Collaboration** – Shared dashboard for households.  
- **Expiry Alerts** – Notifications for soon-to-expire items.  
- **3D-Printed Enclosure** – Neatly houses hardware inside your fridge.  

---

## Hardware Setup 🔌  
### Components  
- **Microcontroller**: ESP32  
- **Sensors**:  
  - Weight sensor (e.g., HX711 + load cell)  
  - RFID module (for tagging items/users)  
- **Display**: LCD with I2C module  
- **Misc**: Jumper wires, breadboard (3.5" x 2.25"), LED lights  
- **Enclosure**: 3D-printed case ([STL files](/hardware/enclosure)).  

### Wiring Diagram  
![Wiring Diagram](https://via.placeholder.com/600x400?text=ESP32+Wiring+Diagram) *[Add Fritzing diagram image]*  

1. Connect the load cell to HX711, then to ESP32.  
2. Wire the RFID module via SPI.  
3. Attach the LCD via I2C.  
*(See [hardware/README.md](/hardware) for detailed pinouts.)*  

---

## Software Stack 💻  
### Frontend  
- **React** (TypeScript) – Interactive dashboard.  
- **Libraries**: Material-UI, Chart.js (for weight trends).  

### Backend  
- **Node.js** + **Express** – REST API for fridge data.  
- **WebSocket** – Real-time updates for weight changes.  

### Database  
- **MongoDB** – Stores users, items, and fridge logs.  

### ESP32 Firmware  
- Written in **C++ (Arduino Core)**.  
- Posts weight/RFID data to the backend via WiFi.  

---

## Installation 🛠️  
### Backend & Frontend  
```bash
# Clone the repo
git clone https://github.com/yourusername/Nutribase.git

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure MongoDB URI
npm start

# Frontend setup
cd ../frontend
npm install
npm run dev
