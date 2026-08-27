import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import type { SimulationMode } from '../../context/SimulationContext';
import { Settings2, Play, AlertTriangle, Flame, ShieldAlert, ActivitySquare } from 'lucide-react';
import { clsx } from 'clsx';

export const SimulationControls: React.FC = () => {
  const { mode, setMode, isDemoMode, toggleDemoMode, isLiveMode, toggleLiveMode, wsConnected } = useSimulation();

  const scenarios: { mode: SimulationMode, label: string, icon: React.FC<any>, color: string, hoverColor: string }[] = [
    { mode: 'NORMAL', label: 'NORMAL OPERATION', icon: Play, color: 'text-status-green', hoverColor: 'hover:border-status-green hover:bg-status-green/10' },
    { mode: 'VISION_TEAR', label: 'VISION TEAR', icon: EyeIcon, color: 'text-status-amber', hoverColor: 'hover:border-status-amber hover:bg-status-amber/10' },
    { mode: 'BELT_ELONGATION', label: 'BELT ELONGATION', icon: ActivitySquare, color: 'text-status-amber', hoverColor: 'hover:border-status-amber hover:bg-status-amber/10' },
    { mode: 'THERMAL_OVERLOAD', label: 'THERMAL OVERLOAD', icon: Flame, color: 'text-status-red', hoverColor: 'hover:border-status-red hover:bg-status-red/10' },
    { mode: 'MULTI_MODAL_FAILURE', label: 'MULTI-MODAL FAILURE', icon: ShieldAlert, color: 'text-status-red', hoverColor: 'hover:border-status-red hover:bg-status-red/20' },
  ];

  return (
    <div className="industrial-card p-6 mb-8 border-dashed border-2 border-industrial-600 bg-industrial-900/80">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center text-status-blue">
          <Settings2 className="w-4 h-4 mr-2" />
          Simulation & Data Source Control
        </h2>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-industrial-400 uppercase">Live WebSocket Data</span>
            <button 
              onClick={toggleLiveMode}
              className={clsx("w-8 h-4 rounded-full relative transition-colors", isLiveMode ? "bg-status-green" : "bg-industrial-600")}
            >
              <div className={clsx("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all", isLiveMode ? "left-4.5 right-0.5" : "left-0.5")}></div>
            </button>
            {isLiveMode && (
              <span className={clsx("text-[9px] font-mono ml-2 uppercase", wsConnected ? "text-status-green" : "text-status-amber animate-pulse")}>
                {wsConnected ? '● CONNECTED' : '○ CONNECTING...'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 border-l border-industrial-700 pl-4">
            <span className={clsx("text-[10px] font-mono uppercase", isLiveMode ? "text-industrial-600" : "text-industrial-400")}>Demo Noise</span>
            <button 
              onClick={toggleDemoMode}
              disabled={isLiveMode}
              className={clsx("w-8 h-4 rounded-full relative transition-colors", isDemoMode && !isLiveMode ? "bg-status-blue" : "bg-industrial-600", isLiveMode && "opacity-50 cursor-not-allowed")}
            >
              <div className={clsx("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all", isDemoMode && !isLiveMode ? "left-4.5 right-0.5" : "left-0.5")}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const isActive = mode === s.mode;
          
          return (
            <button
              key={s.mode}
              onClick={() => !isLiveMode && setMode(s.mode)}
              disabled={isLiveMode}
              className={clsx(
                "flex flex-col items-center justify-center p-3 rounded border text-center transition-all duration-300",
                isActive 
                  ? `bg-industrial-800 border-${s.color.split('-')[2]} shadow-[0_0_10px_rgba(255,255,255,0.1)]` 
                  : "bg-industrial-900 border-industrial-700",
                isLiveMode ? "opacity-50 cursor-not-allowed grayscale" : s.hoverColor
              )}
            >
              <Icon className={clsx("w-5 h-5 mb-2", isActive ? s.color : "text-industrial-500")} />
              <span className={clsx("text-[9px] font-mono font-bold leading-tight", isActive ? s.color : "text-industrial-400")}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Helper for Vision Icon since it's used above
function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
