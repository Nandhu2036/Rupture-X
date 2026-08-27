#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h> // Make sure to install ArduinoJson library

// Replace with your network credentials
const char* ssid = "Scribbler";
const char* password = "Ex09_873";

// WebSocket Server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Sensor Pins (Example)
const int VIB_PIN = 34; // Analog pin for vibration sensor

unsigned long lastUpdate = 0;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Send live data every 500ms
  if (millis() - lastUpdate > 500) {
    lastUpdate = millis();
    
    // 1. Read real vibration data
    // (This is just an example. Adjust mapping based on your sensor)
    int rawVib = analogRead(VIB_PIN);
    float vibrationVal = map(rawVib, 0, 4095, 0, 50); // Scale to 0-50 mm/s
    
    // Simulate other values based on vibration
    float jointInterval = 2.8 + (vibrationVal / 100.0);
    float beltHealth = 100 - (vibrationVal > 30 ? (vibrationVal - 30) : 0);
    float ruptureRisk = (vibrationVal / 50.0) * 100.0;
    
    // 2. Build JSON payload
    StaticJsonDocument<256> doc;
    doc["type"] = "TELEMETRY";
    
    JsonObject payload = doc.createNestedObject("payload");
    payload["vibration"] = vibrationVal;
    payload["jointInterval"] = jointInterval;
    payload["beltHealth"] = beltHealth;
    payload["ruptureRisk"] = ruptureRisk;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // 3. Send over WebSocket
    webSocket.broadcastTXT(jsonString);
  }
}
