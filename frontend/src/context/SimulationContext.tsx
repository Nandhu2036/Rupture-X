import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type SimulationMode = 'NORMAL';

interface SimulationState {
  mode: SimulationMode;
  isDemoMode: boolean;
  beltHealth: number;
  ruptureRisk: number;
  vibration: number;
  temperature: number;
  jointInterval: number;
  visionConfidence: number;
  visionDefects: number;
  alerts: Alert[];
  logs: SystemLog[];
}

interface Alert {
  id: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: Date;
}

interface SystemLog {
  id: string;
  message: string;
  timestamp: Date;
}

interface SimulationContextType extends SimulationState {
  setMode: (mode: SimulationMode) => void;
  toggleDemoMode: () => void;
  isLiveMode: boolean;
  wsConnected: boolean;
  toggleLiveMode: () => void;
}

const defaultState: SimulationState = {
  mode: 'NORMAL',
  isDemoMode: false,
  beltHealth: 0,
  ruptureRisk: 0,
  vibration: 0,
  temperature: 0,
  jointInterval: 0,
  visionConfidence: 0,
  visionDefects: 0,
  alerts: [],
  logs: []
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(defaultState);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Data connection for LIVE mode (polling the ESP32)
  useEffect(() => {
    if (!isLiveMode) {
      setWsConnected(false);
      return;
    }
    
    // Hardcoded IP of the Primary ESP32 SoftAP
    const baseIp = 'http://192.168.4.1';
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${baseIp}/data`);
        if (!response.ok) {
           setWsConnected(false);
           return;
        }
        
        setWsConnected(true);
        const data = await response.json();
        
        // Real Data format from SmartBelt.ino: {"p": 2.5, "t": 4095, "v": 1, "s": "WARNING: THERMAL OVERLOAD"}
        const p = parseFloat(data.p) || 0;
        const t_raw = parseInt(data.t) || 0;
        const v_raw = parseInt(data.v) || 0;
        const statusMsg = data.s || '';
        
        // Convert raw temp (0-4095) to celsius approximation
        // 0 = 20C, 4095 = 90C
        const tempC = 20 + (t_raw / 4095.0) * 70;
        
        // Use the raw period 'p' directly for kinematics, use v_raw for raw vibration hits
        const vib = (v_raw === 1) ? 25.0 : p * 10; // Simple mapping for display purposes if v_raw is high
        
        // Calculate Health and Risk strictly from real sensor state
        const risk = (t_raw > 2500 || statusMsg.includes('WARNING') || statusMsg.includes('CRITICAL')) ? 85 : 15;
        const health = 100 - risk;
        
        setState(s => ({
          ...s,
          jointInterval: p,
          temperature: tempC,
          vibration: vib,
          beltHealth: health,
          ruptureRisk: risk,
          alerts: statusMsg !== "SYSTEM OPTIMAL" ? [
             { id: Date.now().toString(), type: 'CRITICAL' as const, message: statusMsg, timestamp: new Date() },
             ...s.alerts
          ].slice(0, 5) : s.alerts
        }));

      } catch (err) {
        console.error("HTTP Polling error - Sensor Offline:", err);
        setWsConnected(false);
        // Reset values to indicate offline
        setState(s => ({
          ...s,
          temperature: 0,
          vibration: 0,
          beltHealth: 0,
          ruptureRisk: 0,
          jointInterval: 0
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const setMode = (mode: SimulationMode) => {
    setState({ ...state, mode });
  };

  const toggleDemoMode = () => {
    // Disabled for full physical hardware flow
    console.log("Demo mode disabled for live physical integration");
  };

  const toggleLiveMode = () => {
    setIsLiveMode(prev => !prev);
  };

  return (
    <SimulationContext.Provider value={{ ...state, setMode, toggleDemoMode, isLiveMode, wsConnected, toggleLiveMode }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
