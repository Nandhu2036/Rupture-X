import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const HeroStatus: React.FC = () => {
  const { ruptureRisk, visionConfidence } = useSimulation();

  const isCritical = ruptureRisk >= 80;
  const isWarning = ruptureRisk >= 30 && ruptureRisk < 80;
  const isHealthy = !isCritical && !isWarning;

  let statusText = 'System Healthy';
  let subText = 'No immediate belt rupture detected';
  let Icon = ShieldCheck;
  let colorClass = 'text-status-green';
  let bgClass = 'bg-status-green/10';

  if (isCritical) {
    statusText = 'Critical Risk';
    subText = 'Emergency maintenance required immediately';
    Icon = ShieldAlert;
    colorClass = 'text-status-red';
    bgClass = 'bg-status-red/10';
  } else if (isWarning) {
    statusText = 'Elevated Risk';
    subText = 'Increased risk of belt degradation detected';
    Icon = AlertTriangle;
    colorClass = 'text-status-amber';
    bgClass = 'bg-status-amber/10';
  }

  return (
    <div className="mb-8 pt-4">
      <div className={twMerge(clsx("industrial-card p-10 flex flex-col md:flex-row items-center justify-between transition-colors duration-500", bgClass))}>
        <div className="flex items-center space-x-8 mb-6 md:mb-0">
          <div className={clsx("p-5 rounded-full bg-black/40", colorClass)}>
            <Icon className="w-16 h-16" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-industrial-400 mb-2">Conveyor Belt Status</h2>
            <div className={clsx("text-5xl font-bold tracking-tight mb-2", colorClass)}>{statusText}</div>
            <p className={clsx("text-lg", isCritical ? "text-status-red/80 font-medium" : "text-industrial-400")}>{subText}</p>
          </div>
        </div>

        <div className="flex space-x-12 bg-black/20 p-6 rounded-3xl">
          <div className="flex flex-col">
            <span className="text-sm text-industrial-400 mb-1">AI Confidence</span>
            <span className="text-3xl font-semibold tracking-tight">{visionConfidence.toFixed(1)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-industrial-400 mb-1">Failure Risk</span>
            <span className={clsx("text-3xl font-semibold tracking-tight", colorClass)}>{ruptureRisk.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
