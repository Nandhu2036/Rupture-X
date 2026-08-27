#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "RUPTURE-X"; 
const char* password = "rupture123";

WebServer server(80);

const int VIB_PIN = 35;  
const int TEMP_PIN = 34; 
const int TEMP_PWR_PIN = 32; 
const int TEMP_GND_PIN = 33; 

unsigned long lastBumpTime = 0;
float beltPeriod = 0.0;
String statusMsg = "SYSTEM OPTIMAL";

void setup() {
  Serial.begin(115200);
  pinMode(TEMP_PWR_PIN, OUTPUT);
  digitalWrite(TEMP_PWR_PIN, HIGH);
  pinMode(TEMP_GND_PIN, OUTPUT);
  digitalWrite(TEMP_GND_PIN, LOW);
  pinMode(VIB_PIN, INPUT);
  
  WiFi.softAP(ssid, password);
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() {
  server.handleClient();
  int vibState = digitalRead(VIB_PIN);
  
  // Adjusted debounce for ultra-fast reaction
  if (vibState == HIGH) { 
    unsigned long now = millis();
    if (now - lastBumpTime > 100) { // Lowered to 100ms for instantaneous reaction
      beltPeriod = (now - lastBumpTime) / 1000.0;
      lastBumpTime = now;
      if (beltPeriod > 2.5) { statusMsg = "CRITICAL: KINEMATIC ELONGATION"; } 
      else { statusMsg = "SYSTEM OPTIMAL"; }
    }
  }
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>Rupture-X Premium</title>";
  html += "<style>body{background:#050505;color:#00ffcc;font-family:'Segoe UI',sans-serif;margin:0;padding:20px;text-transform:uppercase;}";
  html += ".header{text-align:center;border-bottom:2px solid #00ffcc;padding-bottom:10px;margin-bottom:20px;box-shadow:0 4px 15px rgba(0,255,204,0.15);}";
  html += ".header h1{margin:0;font-size:2.5em;letter-spacing:3px;}";
  html += ".grid{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;}";
  html += ".card{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:20px;width:45%;min-width:300px;box-shadow:inset 0 0 20px rgba(0,0,0,0.8);position:relative;}";
  html += ".card::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent,#00ffcc,transparent);}";
  html += ".val{font-size:3.5em;font-weight:bold;margin:10px 0;color:#fff;text-shadow:0 0 15px #00ffcc;}";
  html += ".status-box{background:#0a0a0a;border:2px solid #00ffcc;border-radius:10px;padding:20px;text-align:center;margin-bottom:20px;box-shadow:0 0 20px rgba(0,255,204,0.1);}";
  html += ".status-text{font-size:2.5em;font-weight:bold;transition:all 0.3s;}";
  html += ".alert{color:#ff003c;text-shadow:0 0 20px #ff003c;animation:pulse 1s infinite;}";
  html += ".optimal{color:#00ffcc;text-shadow:0 0 20px #00ffcc;}";
  html += "@keyframes pulse{0%{opacity:1;}50%{opacity:0.5;}100%{opacity:1;}}";
  html += "canvas{background:#020202;border:1px solid #333;border-radius:5px;width:100%;max-width:600px;}";
  html += ".label{color:#666;font-size:1em;letter-spacing:2px;}</style></head><body>";
  html += "<div class='header'><h1>⚙️ RUPTURE-X COMMAND CENTER</h1></div>";
  html += "<div class='status-box'><div class='label'>SYSTEM STATUS</div><div id='status' class='status-text optimal'>INITIALIZING...</div></div>";
  html += "<div class='grid'>";
  html += "<div class='card' style='text-align:center;'><div class='label'>BEARING TEMPERATURE</div><div id='tval' class='val'>0</div>";
  html += "<div style='width:100%;background:#222;height:10px;border-radius:5px;margin-top:20px;overflow:hidden;'><div id='tbar' style='width:0%;background:#00ffcc;height:100%;transition:width 0.3s,background 0.3s;'></div></div></div>";
  html += "<div class='card' style='text-align:center;'><div class='label'>KINEMATIC SIGNATURE (SECONDS)</div><canvas id='chart' width='600' height='200'></canvas></div>";
  html += "</div><script>";
  html += "var canvas=document.getElementById('chart');var ctx=canvas.getContext('2d');var dataPoints=[];var maxPoints=40;";
  html += "function drawChart(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#111';ctx.lineWidth=1;ctx.beginPath();for(var i=0;i<5;i++){ctx.moveTo(0,i*40);ctx.lineTo(600,i*40);}ctx.stroke();if(dataPoints.length<2)return;ctx.strokeStyle='#00ffcc';ctx.lineWidth=3;ctx.beginPath();var step=600/(maxPoints-1);for(var i=0;i<dataPoints.length;i++){var x=i*step;var y=200-(dataPoints[i]*40);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}";
  html += "setInterval(()=>{fetch('/data').then(r=>r.json()).then(d=>{var stat=document.getElementById('status');stat.innerText=d.s;document.getElementById('tval').innerText=d.t;if(d.s!='SYSTEM OPTIMAL'){stat.className='status-text alert';}else{stat.className='status-text optimal';}";
  html += "var tempPct=(d.t/4095)*100; var tbar=document.getElementById('tbar'); tbar.style.width=tempPct+'%'; if(tempPct>60)tbar.style.background='#ff003c'; else tbar.style.background='#00ffcc';";
  html += "dataPoints.push(d.p);if(dataPoints.length>maxPoints)dataPoints.shift();drawChart();}).catch(e=>console.log(e));}, 500);";
  html += "</script></body></html>";
  server.send(200, "text/html", html);
}

void handleData() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  int tempValue = analogRead(TEMP_PIN);
  int currentVib = digitalRead(VIB_PIN);
  if(tempValue > 2500) { statusMsg = "WARNING: THERMAL OVERLOAD"; }
  String json = "{\"p\":" + String(beltPeriod) + ",\"t\":" + String(tempValue) + ",\"v\":" + String(currentVib) + ",\"s\":\"" + statusMsg + "\"}";
  server.send(200, "application/json", json);
}
