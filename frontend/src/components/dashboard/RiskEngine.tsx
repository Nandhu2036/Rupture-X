import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';

export const RiskEngine: React.FC = () => {
  const { visionConfidence, jointInterval, ruptureRisk, temperature } = useSimulation();

  const kinematicAnomaly = Math.min(100, Math.max(0, ((jointInterval - 2.8) / 2.8) * 100 * 10));
  
  const isCritical = ruptureRisk > 80;
  const isWarning = ruptureRisk > 30 && !isCritical;
  
  const statusColor = isCritical ? 'text-status-red' : (isWarning ? 'text-status-amber' : 'text-status-cyan');
  const bgColor = isCritical ? 'bg-status-red/10' : (isWarning ? 'bg-status-amber/10' : 'bg-status-cyan/5');
  const borderColor = isCritical ? 'border-status-red/30' : (isWarning ? 'border-status-amber/30' : 'border-status-cyan/20');

  return (
    <div className="industrial-panel h-full flex flex-col relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-industrial-700 to-transparent"></div>
      
      <div className="p-5 flex items-center justify-between border-b border-industrial-800/50 bg-industrial-950/30">
        <h2 className="text-xs font-mono font-semibold tracking-widest text-industrial-300 uppercase">Multi-Modal Risk Fusion</h2>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-status-cyan rounded-full animate-pulse"></div>
          <span className="text-xxs font-mono text-status-cyan tracking-widest">ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {/* Network Visualization */}
        <div className="flex justify-between items-center w-full max-w-sm mx-auto relative mb-10">
          
          {/* Data Lines */}
          <div className="absolute left-[50px] top-4 right-1/2 h-px bg-gradient-to-r from-industrial-600 to-industrial-400"></div>
          <div className="absolute left-[50px] top-1/2 right-1/2 h-px bg-gradient-to-r from-industrial-600 to-industrial-400 -translate-y-1/2"></div>
          <div className="absolute left-[50px] bottom-4 right-1/2 h-px bg-gradient-to-r from-industrial-600 to-industrial-400"></div>
          
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-industrial-400 via-status-cyan/50 to-industrial-400"></div>
          <div className="absolute left-1/2 top-1/2 right-[50px] h-px bg-gradient-to-r from-status-cyan/50 to-industrial-600 -translate-y-1/2"></div>
          
          {/* Input Nodes */}
          <div className="flex flex-col justify-between h-40 z-10 w-24">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-industrial-400">VISION</span>
              <span className="text-sm font-mono text-industrial-100">{visionConfidence.toFixed(1)}<span className="text-industrial-500">%</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-industrial-400">KINEMATIC</span>
              <span className="text-sm font-mono text-industrial-100">{kinematicAnomaly.toFixed(1)}<span className="text-industrial-500">%</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-industrial-400">THERMAL</span>
              <span className="text-sm font-mono text-industrial-100">{temperature.toFixed(1)}<span className="text-industrial-500">°C</span></span>
            </div>
          </div>
          
          {/* Output Node */}
          <div className="z-10 bg-industrial-950 p-2 rounded-lg border border-industrial-800">
            <div className={clsx("w-16 h-16 rounded flex items-center justify-center border", bgColor, borderColor)}>
              <span className={clsx("text-xl font-bold tracking-tight", statusColor)}>
                {ruptureRisk.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Risk Bar */}
        <div className="w-full">
           <div className="flex justify-between items-end mb-2">
             <span className="text-xs font-mono tracking-wider text-industrial-300">PREDICTIVE RISK SCORE</span>
             <span className={clsx("text-xs font-mono font-semibold tracking-wider", statusColor)}>
               {isCritical ? 'CRITICAL' : (isWarning ? 'WARNING' : 'NORMAL')}
             </span>
           </div>
           <div className="w-full h-1.5 bg-industrial-800 rounded-full overflow-hidden">
             <div 
               className={clsx("h-full transition-all duration-1000", isCritical ? 'bg-status-red' : (isWarning ? 'bg-status-amber' : 'bg-status-cyan'))} 
               style={{ width: `${Math.min(100, Math.max(0, ruptureRisk))}%` }}
             ></div>
           </div>
           <div className="flex justify-between mt-2 text-[9px] font-mono text-industrial-600">
             <span>0.0%</span>
             <span>100.0%</span>
           </div>
        </div>

      </div>
    </div>
  );
};
