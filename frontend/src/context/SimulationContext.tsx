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
  
  // WebSocket connection for LIVE data
  useEffect(() => {
    if (!isLiveMode) return;
    
    // Change this IP to your ESP32's IP address on your home WiFi network
    // For example: 'ws://192.168.1.100:81'
    const wsUrl = import.meta.env.VITE_ESP32_WS_URL || 'ws://localhost:8080';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setWsConnected(true);
      setState(prev => ({
        ...prev,
        logs: [{ id: Math.random().toString(), message: 'Connected to Edge Node WebSocket', timestamp: new Date() }, ...prev.logs]
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Expected data format:
        // { type: 'TELEMETRY', payload: { vibration: 18.2, temperature: 62.1, jointInterval: 2.85, ... } }
        // { type: 'VISION', payload: { confidence: 95.0, defects: 0, frameData: 'base64...' } }
        // { type: 'ALERT', payload: { level: 'WARNING', message: '...' } }
        
        setState(prev => {
          if (data.type === 'TELEMETRY' && data.payload) {
             return { ...prev, ...data.payload };
          } else if (data.type === 'VISION' && data.payload) {
             return { ...prev, visionConfidence: data.payload.confidence, visionDefects: data.payload.defects };
          } else if (data.type === 'ALERT' && data.payload) {
             return {
               ...prev,
               alerts: [{ id: Math.random().toString(), type: data.payload.level, message: data.payload.message, timestamp: new Date() }, ...prev.alerts],
               logs: [{ id: Math.random().toString(), message: `ALERT RECEIVED: ${data.payload.message}`, timestamp: new Date() }, ...prev.logs]
             }
          }
          return prev;
        });
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    };
    
    ws.onclose = () => {
      setWsConnected(false);
      setState(prev => ({
        ...prev,
        logs: [{ id: Math.random().toString(), message: 'WebSocket connection lost', timestamp: new Date() }, ...prev.logs]
      }));
    };
    
    return () => {
      ws.close();
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
    if (!state.isDemoMode) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.mode !== 'NORMAL') return prev; // Less noise during specific failure modes for clarity
        
        return {
          ...prev,
          vibration: 18.0 + Math.random() * 0.8,
          temperature: 61.5 + Math.random() * 0.6,
          jointInterval: 2.83 + Math.random() * 0.02,
        };
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [state.isDemoMode, state.mode]);

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
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
