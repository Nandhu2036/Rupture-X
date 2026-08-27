import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { BrainCircuit, Eye, ActivitySquare } from 'lucide-react';
import { clsx } from 'clsx';

export const RiskEngine: React.FC = () => {
  const { visionConfidence, jointInterval, ruptureRisk } = useSimulation();

  const kinematicAnomaly = Math.min(100, Math.max(0, ((jointInterval - 2.8) / 2.8) * 100 * 10));
  
  const isCritical = ruptureRisk > 80;
  const isWarning = ruptureRisk > 30 && !isCritical;

  return (
    <div className="industrial-card p-8 mb-8 flex flex-col justify-center items-center relative">
      <div className="text-center mb-8">
        <h2 className="text-sm font-semibold tracking-wide text-industrial-400 mb-2 uppercase">Risk Fusion Engine</h2>
        <div className="flex items-center justify-center space-x-3">
          <BrainCircuit className="w-8 h-8 text-status-blue" />
          <span className="text-2xl font-semibold tracking-tight">AI Multi-Modal Analysis</span>
        </div>
      </div>

      <div className="flex w-full justify-around max-w-sm mb-12">
        <div className="flex flex-col items-center space-y-2">
           <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-sm border border-white/5">
             <Eye className="w-6 h-6 text-status-blue" />
           </div>
           <span className="text-sm font-medium">Vision</span>
           <span className="text-xs text-industrial-400">{visionConfidence.toFixed(1)}%</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
           <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-sm border border-white/5">
             <ActivitySquare className="w-6 h-6 text-status-amber" />
           </div>
           <span className="text-sm font-medium">Kinematic</span>
           <span className="text-xs text-industrial-400">{kinematicAnomaly.toFixed(1)}%</span>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 text-center w-full max-w-sm">
        <h3 className="text-sm font-medium text-industrial-400 mb-2">Calculated Rupture Risk</h3>
        <div className={clsx("text-6xl font-bold tracking-tight mb-2", 
          isCritical ? "text-status-red" : (isWarning ? "text-status-amber" : "text-industrial-100")
        )}>
          {ruptureRisk.toFixed(1)}%
        </div>
        <div className={clsx("text-sm font-semibold mt-2",
           isCritical ? "text-status-red" : (isWarning ? "text-status-amber" : "text-status-green")
        )}>
          {isCritical ? 'Critical Condition' : (isWarning ? 'Elevated Alert' : 'Normal Operation')}
        </div>
      </div>
    </div>
  );
};
