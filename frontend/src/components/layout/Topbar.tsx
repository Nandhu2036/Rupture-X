import React, { useState, useEffect } from 'react';
import { Bell, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';

export const Topbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { alerts, wsConnected } = useSimulation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => a.type === 'CRITICAL' || a.type === 'WARNING').length;

  return (
    <header className="h-20 bg-industrial-900/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-industrial-800 rounded-full flex items-center justify-center border border-white/10">
          <Activity className="w-5 h-5 text-status-blue" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold tracking-tight text-industrial-100">Overview</h2>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-industrial-800/50 rounded-full px-4 py-2 border border-white/5">
          <div className={clsx("w-2 h-2 rounded-full", wsConnected ? "bg-status-green animate-pulse" : "bg-status-amber")}></div>
          <span className="text-xs font-medium text-industrial-100">
            {wsConnected ? 'Live Data Connected' : 'Connecting to Edge...'}
          </span>
        </div>

        <div className="text-sm font-medium text-industrial-400">
          {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </div>

        <button className="relative p-2 text-industrial-400 hover:text-industrial-100 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-red rounded-full"></span>
          )}
        </button>
      </div>
    </header>
  );
};
