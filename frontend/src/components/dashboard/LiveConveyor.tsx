import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Activity, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const LiveConveyor: React.FC = () => {
  const { ruptureRisk } = useSimulation();
  
  const isWarning = ruptureRisk > 30;

  return (
    <div className="industrial-panel flex flex-col mb-8 p-6">
      <div className="flex justify-between items-center mb-8 border-b border-industrial-800 pb-4">
        <h2 className="text-xs font-mono font-semibold tracking-widest text-industrial-300 uppercase">System Schematic</h2>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-widest text-status-cyan">DRIVE ACTIVE</span>
        </div>
      </div>

      <div className="relative w-full h-48 bg-industrial-950 border border-white/[0.02] rounded overflow-hidden flex items-center justify-center">
        
        {/* Schematic Layout */}
        <div className="relative w-full max-w-3xl px-12 h-24">
          
          {/* Rollers */}
          <div className="absolute top-0 left-12 right-12 flex justify-between px-8">
            {[...Array(5)].map((_, i) => (
              <div key={`rt-${i}`} className="w-8 h-8 rounded-full border-[2px] border-industrial-700 bg-industrial-900 animate-spin" style={{ animationDuration: '4s' }}>
                <div className="w-1.5 h-1.5 bg-industrial-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-12 right-12 flex justify-between px-8">
            {[...Array(5)].map((_, i) => (
              <div key={`rb-${i}`} className="w-8 h-8 rounded-full border-[2px] border-industrial-700 bg-industrial-900 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                <div className="w-1.5 h-1.5 bg-industrial-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Drive Motor (Left) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 bg-industrial-900 border border-industrial-700 flex items-center justify-center z-10">
            <Settings className="w-6 h-6 text-status-cyan animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          {/* Tail (Right) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 bg-industrial-900 border border-industrial-700 rounded-full flex items-center justify-center z-10">
            <div className="w-3 h-3 border border-industrial-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* The Belt */}
          <div className="absolute top-[14px] left-6 right-6 h-px bg-industrial-500"></div>
          <div className="absolute bottom-[14px] left-6 right-6 h-px bg-industrial-500"></div>
          
          {/* Sensors */}
          <div className="absolute -top-12 left-1/4 flex flex-col items-center">
            <div className={clsx("p-1.5 bg-industrial-950 border", isWarning ? "border-status-red text-status-red" : "border-industrial-700 text-industrial-400")}>
              <Camera className="w-4 h-4" />
            </div>
            <div className="w-px h-6 bg-industrial-700 mt-2"></div>
          </div>

          <div className="absolute -top-12 left-1/2 flex flex-col items-center">
            <div className={clsx("p-1.5 bg-industrial-950 border", isWarning ? "border-status-amber text-status-amber" : "border-industrial-700 text-industrial-400")}>
              <Activity className="w-4 h-4" />
            </div>
            <div className="w-px h-6 bg-industrial-700 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
