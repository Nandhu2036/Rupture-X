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
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Data connection for LIVE mode (polling the ESP32)
  useEffect(() => {
    if (!isLiveMode) {
      setWsConnected(false);
      return;
    }
    
    // Hardcoded IP of the Primary ESP32 SoftAP
    const baseIp = 'http://192.168.4.1';
    
    let lastTemp = 30.0;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${baseIp}/data`);
        if (!response.ok) {
           setWsConnected(false);
           return;
        }
        
        setWsConnected(true);
        const data = await response.json();
        
        const p = parseFloat(data.p) || 0;
        const t_raw = parseInt(data.t) || 0;
        const v_raw = parseInt(data.v) || 0;
        const statusMsg = data.s || '';
        
        // Temperature Smoothing Filter (Removes random jumping from analog noise)
        // Baseline 30C, up to 70C for anomalies
        const rawTempC = 30 + (t_raw / 4095.0) * 40;
        lastTemp = (lastTemp * 0.8) + (rawTempC * 0.2); // Low-pass filter for extreme stability
        
        // Fast Kinematic Reaction
        const vib = (v_raw === 1) ? 35.0 : p * 10;
        
        // Sensor Fusion: Trigger Vision AI detection if physical sensors detect anomaly!
        const hasAnomaly = (lastTemp > 50 || vib > 30 || statusMsg.includes('WARNING') || statusMsg.includes('CRITICAL'));
        const risk = hasAnomaly ? 85 : 12;
        const health = 100 - risk;
        
        setState(s => ({
          ...s,
          jointInterval: p,
          temperature: lastTemp,
          vibration: vib,
          beltHealth: health,
          ruptureRisk: risk,
          visionDefects: hasAnomaly ? 1 : 0,
          alerts: statusMsg !== "SYSTEM OPTIMAL" ? [
             { id: Date.now().toString(), type: 'CRITICAL' as const, message: statusMsg, timestamp: new Date() },
             ...s.alerts
          ].slice(0, 5) : s.alerts
        }));

      } catch (err) {
        console.error("HTTP Polling error - Sensor Offline:", err);
        setWsConnected(false);
      }
    }, 150); // Ultra-fast 150ms polling to eliminate lag

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
