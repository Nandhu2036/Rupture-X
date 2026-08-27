import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type SimulationMode = 'NORMAL' | 'VISION_TEAR' | 'BELT_ELONGATION' | 'THERMAL_OVERLOAD' | 'MULTI_MODAL_FAILURE';

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
  isDemoMode: true,
  beltHealth: 94.2,
  ruptureRisk: 4.2,
  vibration: 18.4,
  temperature: 61.8,
  jointInterval: 2.84,
  visionConfidence: 96.8,
  visionDefects: 0,
  alerts: [
    { id: '1', type: 'INFO', message: 'Camera stream stable', timestamp: new Date(Date.now() - 12000) }
  ],
  logs: [
    { id: 'l1', message: 'Health score recalculated', timestamp: new Date(Date.now() - 2000) },
    { id: 'l2', message: 'Vision analysis completed', timestamp: new Date(Date.now() - 4000) },
    { id: 'l3', message: 'Temperature sample updated', timestamp: new Date(Date.now() - 6000) },
    { id: 'l4', message: 'VIB-01 joint pulse detected', timestamp: new Date(Date.now() - 8000) },
    { id: 'l5', message: 'CAM-01 frame received', timestamp: new Date(Date.now() - 10000) },
  ]
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(defaultState);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Data connection for LIVE mode (polling the ESP32)
  useEffect(() => {
    if (!isLiveMode) return;
    
    setWsConnected(true); // Treat as connected for UI
    
    // Fallback IP if not specified in .env
    const baseIp = import.meta.env.VITE_ESP32_WS_URL ? import.meta.env.VITE_ESP32_WS_URL.replace('ws://', 'http://').replace(':81', '') : 'http://192.168.4.1';
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${baseIp}/data`);
        if (!response.ok) return;
        const data = await response.json();
        
        // Data format from SmartBelt.ino: {"p": 2.5, "t": 4095, "s": "WARNING: THERMAL OVERLOAD"}
        const p = parseFloat(data.p) || 2.8;
        const t_raw = parseInt(data.t) || 0;
        const statusMsg = data.s || '';
        
        // Convert raw temp (0-4095) to celsius approximation (let's map 0-4095 to 20C-90C)
        const tempC = 20 + (t_raw / 4095.0) * 70;
        
        // Calculate fake vibration based on kinematic period anomaly
        const vib = 15 + Math.abs(p - 2.8) * 50;
        
        // Calculate Health and Risk
        const risk = (t_raw > 2500 || statusMsg.includes('WARNING')) ? 85 : 15;
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
        console.error("HTTP Polling error:", err);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      setWsConnected(false);
    };
  }, [isLiveMode]);

  const setMode = (mode: SimulationMode) => {
    if (isLiveMode) return; // Prevent demo scenarios during live mode
    
    let newState = { ...state, mode };
    const now = new Date();
    
    if (mode === 'NORMAL') {
      newState = { ...defaultState, mode: 'NORMAL', isDemoMode: state.isDemoMode, logs: [{ id: Math.random().toString(), message: 'System normalized', timestamp: now }, ...state.logs] };
    } else if (mode === 'VISION_TEAR') {
      newState.visionDefects = 1;
      newState.visionConfidence = 99.2;
      newState.ruptureRisk = 45.3;
      newState.alerts = [{ id: Math.random().toString(), type: 'WARNING', message: 'Structural anomaly detected in vision feed', timestamp: now }, ...state.alerts];
      newState.logs = [{ id: Math.random().toString(), message: 'AR > 3.0 structural tear detected', timestamp: now }, ...state.logs];
    } else if (mode === 'BELT_ELONGATION') {
      newState.jointInterval = 3.12;
      newState.beltHealth = 82.1;
      newState.ruptureRisk = 38.5;
      newState.alerts = [{ id: Math.random().toString(), type: 'WARNING', message: 'Kinematic elongation interval increased', timestamp: now }, ...state.alerts];
      newState.logs = [{ id: Math.random().toString(), message: 'Joint passing interval deviation > 5%', timestamp: now }, ...state.logs];
    } else if (mode === 'THERMAL_OVERLOAD') {
      newState.temperature = 92.4;
      newState.alerts = [{ id: Math.random().toString(), type: 'WARNING', message: 'Bearing temperature rising', timestamp: now }, ...state.alerts];
      newState.logs = [{ id: Math.random().toString(), message: 'Bearing 01 temperature crossed warning threshold', timestamp: now }, ...state.logs];
    } else if (mode === 'MULTI_MODAL_FAILURE') {
      newState.visionDefects = 2;
      newState.jointInterval = 3.45;
      newState.temperature = 98.7;
      newState.vibration = 45.2;
      newState.beltHealth = 34.5;
      newState.ruptureRisk = 98.9;
      newState.alerts = [
        { id: Math.random().toString(), type: 'CRITICAL', message: 'EMERGENCY: Multi-modal failure imminent', timestamp: now },
        { id: Math.random().toString(), type: 'CRITICAL', message: 'Kinematic elongation detected', timestamp: new Date(now.getTime() - 2000) },
        ...state.alerts
      ];
      newState.logs = [{ id: Math.random().toString(), message: 'FUSION ENGINE: Critical risk threshold exceeded', timestamp: now }, ...state.logs];
    }
    
    setState(newState);
  };

  const toggleDemoMode = () => {
    setState(prev => ({ ...prev, isDemoMode: !prev.isDemoMode }));
  };

  // Simulate subtle noise in values over time if demo mode is on
  useEffect(() => {
    if (!state.isDemoMode || state.mode !== 'NORMAL' || isLiveMode) return;
    
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        vibration: Math.max(15, Math.min(25, prev.vibration + (Math.random() - 0.5) * 2)),
        temperature: Math.max(55, Math.min(65, prev.temperature + (Math.random() - 0.5) * 0.5)),
        beltHealth: Math.max(92, Math.min(98, prev.beltHealth + (Math.random() - 0.5) * 0.2)),
        ruptureRisk: Math.max(2, Math.min(8, prev.ruptureRisk + (Math.random() - 0.5) * 0.5)),
        visionConfidence: Math.max(94, Math.min(99, prev.visionConfidence + (Math.random() - 0.5) * 1)),
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [state.isDemoMode, state.mode, isLiveMode]);

  const toggleLiveMode = () => {
    setIsLiveMode(prev => {
       if (!prev) {
          // If turning on live mode, set mode to normal to clear alerts
          setState(s => ({ ...s, mode: 'NORMAL' }));
       }
       return !prev;
    });
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
