const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Mock Edge Device WebSocket Server running on ws://localhost:8080');

wss.on('connection', function connection(ws) {
  console.log('Dashboard connected. Sending telemetry...');

  let iteration = 0;

  const interval = setInterval(() => {
    iteration++;
    
    // Simulate some drifting values
    const temp = 60 + Math.sin(iteration / 10) * 15; // 45 to 75
    const vib = 15 + Math.abs(Math.sin(iteration / 5) * 20); // 15 to 35
    const joint = 2.8 + Math.random() * 0.1;
    
    // Send TELEMETRY
    ws.send(JSON.stringify({
      type: 'TELEMETRY',
      payload: {
        vibration: vib,
        temperature: temp,
        jointInterval: joint,
        beltHealth: 90 - (temp > 70 ? 5 : 0),
        ruptureRisk: (temp > 70 ? 45 : 12)
      }
    }));

    // Every 10 iterations, send a VISION update
    if (iteration % 10 === 0) {
       ws.send(JSON.stringify({
         type: 'VISION',
         payload: {
           confidence: 96 + Math.random() * 3,
           defects: temp > 72 ? 1 : 0
         }
       }));
    }

    // Every 20 iterations, send an ALERT
    if (iteration % 20 === 0) {
      if (temp > 70) {
        ws.send(JSON.stringify({
          type: 'ALERT',
          payload: { level: 'WARNING', message: `High temperature detected: ${temp.toFixed(1)}°C` }
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'INFO',
          payload: { level: 'INFO', message: 'Routine health check passed.' }
        }));
      }
    }
  }, 2000);

  ws.on('close', () => {
    console.log('Dashboard disconnected');
    clearInterval(interval);
  });
});
