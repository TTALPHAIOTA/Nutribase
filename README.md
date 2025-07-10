# Nutribase 🍎  
**A Smart Fridge Tracker to Reduce Food Waste**  

Nutribase helps you and your roommates track food items in your fridge, monitor weight changes, and assign ownership to reduce food waste. With hardware integration (ESP32 + sensors), it’s a seamless bridge between your physical fridge and a collaborative digital dashboard.  

## Key Features ✨  
- **Real-time Weight Tracking** – ESP32 + load sensor logs food weight changes.  
- **Item Ownership** – See who added what (via user profiles).  
- **Roommate Collaboration** – Shared dashboard for households.  
- **Food Item Descriptions** – Showcases weight, price, expiration, time added, and brand. 
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
- **Enclosure**: 3D-printed case
- ![image](https://github.com/user-attachments/assets/9104ae17-ffa0-46f5-8ee2-072a0c25709d)
- ![image](https://github.com/user-attachments/assets/db0b6cff-58c5-421c-89df-65fb364059f8)

 

### Wiring Diagram
![image](https://github.com/user-attachments/assets/ba8af867-2c43-44ac-93a1-67ae96bc55c2)
### Connection Guide
1. **Load Cell Wiring**:
   - Red wire → E+ (HX711)
   - Black wire → E- (HX711)
   - White wire → A- (HX711)
   - Green wire → A+ (HX711)
   - HX711 to ESP32:
     - DT → GPIO 23
     - SCK → GPIO 22
     - VCC → 3.3V
     - GND → GND

2. **RFID Module (SPI)**:
   - SDA → GPIO 5
   - SCK → GPIO 18
   - MOSI → GPIO 23
   - MISO → GPIO 19
   - IRQ → Not connected
   - GND → GND
   - 3.3V → 3.3V

3. **LCD Display (I2C)**:
   - SDA → GPIO 21
   - SCL → GPIO 22
   - VCC → 5V
   - GND → GND

4. **Power Management**:
   - Use separate 5V/2A power supply for load cells
   - Add 100µF capacitor between HX711 VCC/GND
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

### ESP32 Firmware  
1. Open `/firmware/Nutribase.ino` in Arduino IDE.  
2. Install required libraries:
   ```bash
   # Install these via Arduino Library Manager:
   - HX711 (for weight sensor)
   - MFRC522 (for RFID)
   - WiFiClientSecure (for HTTPS connections)
## ESP32 Firmware Setup 🛠️

### HTTP Client Implementation
The ESP32 sends weight data to your backend server via HTTP POST requests. Here's the core functionality:

```cpp
#include <HTTPClient.h>
#include <WiFi.h>

// Wi-Fi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://your-backend-url.com/api/data";

// Weight Posting Interval (ms)
const long postInterval = 10000; 
unsigned long lastPostTime = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  if (millis() - lastPostTime >= postInterval) {
    lastPostTime = millis();
    
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      
      // Get weight from load cell
      float weight = LoadCell.getData(); 
      
      // Create JSON payload
      String payload = "{\"weight\":" + String(weight, 2) + "}";
      
      // Send POST request
      int httpCode = http.POST(payload);
      
      if (httpCode > 0) {
        String response = http.getString();
        Serial.println("Server response: " + response);
      } else {
        Serial.println("Error: " + http.errorToString(httpCode));
      }
      http.end();
    } else {
      Serial.println("WiFi disconnected");
    }
  }
}
```

# Frontend setup
cd ../frontend
npm install
npm run dev

3. Update secrets.h with your credentials:
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://your-backend-api.com";

4. Upload to ESP32 via USB.

## Usage 🚀
### Initial Setup
1.Create an account and log in

2 **Power On Hardware**:
   - Connect ESP32 to power source inside the 3D-printed enclosure
   - Ensure LCD display lights up (shows "Nutribase Ready")

3. **WiFi Connection**:
   ```text
   [LCD Display]
   > WiFi: Connecting...
   > WiFi: Connected!

4. Go to shared group in settings
    -Invite users to shared group

###Adding Food Items
    - Click add food item
    - Input all forms
    - Click calibrate weight
    - Place food on the load cell platform
    - Wait for weight stabilization (✔️ appears on LCD)
###NOW ABLE TO VIEW FOOD ITEMS!!

###REPEAT when modifying weight of food item or adding new food item
