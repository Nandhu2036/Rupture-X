import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';

export const Topbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { wsConnected } = useSimulation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-industrial-950 border-b border-industrial-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <h2 className="text-sm font-mono font-semibold tracking-widest text-industrial-100 uppercase hidden md:block">System Overview</h2>
        <div className="h-4 w-px bg-industrial-800 hidden md:block"></div>
        <div className="flex items-center space-x-2">
          <div className={clsx("w-1.5 h-1.5 rounded-full", wsConnected ? "bg-status-cyan shadow-glow-cyan animate-pulse" : "bg-status-amber")}></div>
          <span className={clsx("text-xxs font-mono tracking-widest uppercase", wsConnected ? "text-status-cyan" : "text-status-amber")}>
            {wsConnected ? 'LIVE TELEMETRY' : 'CONNECTING SENSORS'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-mono text-industrial-500 uppercase tracking-widest">Global Time (UTC)</span>
          <span className="text-sm font-mono text-industrial-100">
            {time.toISOString().substr(11, 8)} Z
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-industrial-500 uppercase tracking-widest">Local Time</span>
          <span className="text-sm font-mono text-industrial-300">
            {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </header>
  );
};
