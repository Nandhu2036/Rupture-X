import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Activity, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const LiveConveyor: React.FC = () => {
  const { ruptureRisk } = useSimulation();
  
  const isWarning = ruptureRisk > 30;

  return (
    <div className="industrial-card p-8 mb-8">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-lg font-semibold tracking-tight">System Schematic</h2>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
          <span className="text-sm font-medium text-industrial-400">Motor Active</span>
        </div>
      </div>

      <div className="relative w-full h-48 bg-[#111] rounded-3xl overflow-hidden flex items-center justify-center">
        
        {/* Schematic Layout */}
        <div className="relative w-full max-w-3xl px-12 h-24">
          
          {/* Rollers */}
          <div className="absolute top-0 left-12 right-12 flex justify-between px-8">
            {[...Array(5)].map((_, i) => (
              <div key={`rt-${i}`} className="w-8 h-8 rounded-full border-[3px] border-industrial-600 bg-industrial-800 animate-spin" style={{ animationDuration: '4s' }}>
                <div className="w-1.5 h-1.5 bg-industrial-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-12 right-12 flex justify-between px-8">
            {[...Array(5)].map((_, i) => (
              <div key={`rb-${i}`} className="w-8 h-8 rounded-full border-[3px] border-industrial-600 bg-industrial-800 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                <div className="w-1.5 h-1.5 bg-industrial-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Drive Motor (Left) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-14 h-14 bg-industrial-700 rounded-2xl flex items-center justify-center z-10 shadow-lg">
            <Settings className="w-8 h-8 text-industrial-400 animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          {/* Tail (Right) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 bg-industrial-700 rounded-full flex items-center justify-center z-10">
            <div className="w-4 h-4 border-2 border-industrial-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* The Belt */}
          <div className="absolute top-3.5 left-6 right-6 h-1.5 bg-industrial-400 rounded-full opacity-50"></div>
          <div className="absolute bottom-3.5 left-6 right-6 h-1.5 bg-industrial-400 rounded-full opacity-50"></div>
          
          {/* Sensors */}
          <div className="absolute -top-12 left-1/4 flex flex-col items-center">
            <div className={clsx("p-2 rounded-xl bg-black border shadow-sm", isWarning ? "border-status-red text-status-red" : "border-white/10 text-industrial-100")}>
              <Camera className="w-5 h-5" />
            </div>
            <div className="w-px h-6 bg-industrial-600 mt-2"></div>
          </div>

          <div className="absolute -top-12 left-1/2 flex flex-col items-center">
            <div className={clsx("p-2 rounded-xl bg-black border shadow-sm", isWarning ? "border-status-amber text-status-amber" : "border-white/10 text-industrial-100")}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-px h-6 bg-industrial-600 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
