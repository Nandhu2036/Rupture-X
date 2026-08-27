import React from 'react';
import { Server, Camera, Activity, Thermometer, Wifi } from 'lucide-react';

export const SensorNetwork: React.FC = () => {
  const sensors = [
    { id: 'RX-CORE-01', name: 'ESP32 Edge Core', status: 'ONLINE', icon: Server, color: 'text-status-green', signal: 98 },
    { id: 'CAM-01', name: 'ESP32-CAM', status: 'STREAMING', icon: Camera, color: 'text-status-blue', signal: 92 },
    { id: 'VIB-01', name: 'SW-420 Vibration', status: 'ACTIVE', icon: Activity, color: 'text-status-green', signal: 100 },
    { id: 'TEMP-01', name: 'NTC Temperature', status: 'ACTIVE', icon: Thermometer, color: 'text-status-green', signal: 100 },
  ];

  return (
    <div className="industrial-card p-6 mb-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-wider flex items-center">
          EDGE DEVICES
        </h2>
        <span className="text-xs text-industrial-400 font-mono">Network Health</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map(sensor => {
          const Icon = sensor.icon;
          return (
            <div key={sensor.id} className="bg-industrial-900 border border-industrial-700 rounded-lg p-4 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-industrial-800 rounded border border-industrial-600">
                    <Icon className="w-4 h-4 text-industrial-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-industrial-100">{sensor.id}</div>
                    <div className="text-[10px] text-industrial-400 font-mono mt-0.5">{sensor.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-3 h-3 text-status-green" />
                  <span className="text-[9px] font-mono text-industrial-500">{sensor.signal}%</span>
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-industrial-700 flex items-center">
                 <div className="w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: sensor.color === 'text-status-green' ? '#238636' : '#58A6FF' }}></div>
                 <span className={`text-[10px] font-bold font-mono ${sensor.color}`}>{sensor.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
