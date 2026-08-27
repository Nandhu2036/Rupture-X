import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const HeroStatus: React.FC = () => {
  const { ruptureRisk, visionConfidence, isLiveMode, wsConnected } = useSimulation();

  const isCritical = ruptureRisk >= 80;
  const isWarning = ruptureRisk >= 30 && ruptureRisk < 80;

  let statusText = 'OPERATIONAL';
  let subText = 'SYSTEM HEALTHY • NO STRUCTURAL DEGRADATION DETECTED';
  let colorClass = 'text-status-cyan';
  let bgClass = 'bg-status-cyan/5 border-status-cyan/20';
  let indicatorClass = 'bg-status-cyan shadow-[0_0_12px_rgba(6,182,212,0.6)]';

  if (isCritical) {
    statusText = 'CRITICAL ALARM';
    subText = 'EMERGENCY SHUTDOWN RECOMMENDED • STRUCTURAL FAILURE IMMINENT';
    colorClass = 'text-status-red text-glow-red';
    bgClass = 'bg-status-red/5 border-status-red/30';
    indicatorClass = 'bg-status-red shadow-glow-red animate-pulse';
  } else if (isWarning) {
    statusText = 'WARNING STATE';
    subText = 'ELEVATED RISK LEVEL • MONITOR KINEMATICS CLOSELY';
    colorClass = 'text-status-amber';
    bgClass = 'bg-status-amber/5 border-status-amber/20';
    indicatorClass = 'bg-status-amber shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse';
  }

  if (!isLiveMode || !wsConnected) {
    statusText = 'SYSTEM OFFLINE';
    subText = 'WAITING FOR SENSOR TELEMETRY...';
    colorClass = 'text-industrial-400';
    bgClass = 'bg-industrial-900 border-industrial-800';
    indicatorClass = 'bg-industrial-600';
  }

  return (
    <div className="w-full">
      <div className={twMerge(clsx("industrial-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between transition-colors duration-500 border-l-4", bgClass))}>
        
        {/* Left Side: Primary Status */}
        <div className="flex items-start md:items-center space-x-6 mb-6 md:mb-0">
          <div className="mt-2 md:mt-0 flex-shrink-0">
            <div className={clsx("w-4 h-4 rounded-full", indicatorClass)}></div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-industrial-400 uppercase">Primary Conveyor Status</h2>
              <span className="text-industrial-600">|</span>
              <span className="text-xs font-mono text-industrial-500 uppercase">Unit 01</span>
            </div>
            <div className={clsx("text-4xl md:text-5xl font-bold tracking-tight mb-2", colorClass)}>
              {statusText}
            </div>
            <p className={clsx("text-xs font-mono tracking-wider", colorClass.replace('text-', 'text-').replace('text-glow-red', ''))}>
              {subText}
            </p>
          </div>
        </div>

        {/* Right Side: High-Level Fused Metrics */}
        <div className="flex space-x-8 md:space-x-12 border-t md:border-t-0 md:border-l border-industrial-800 pt-6 md:pt-0 pl-0 md:pl-12 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-xxs font-mono text-industrial-400 mb-2 uppercase tracking-widest">AI Confidence</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-semibold tracking-tight text-industrial-100">{visionConfidence.toFixed(1)}</span>
              <span className="text-sm font-mono text-industrial-500">%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xxs font-mono text-industrial-400 mb-2 uppercase tracking-widest">Rupture Risk</span>
            <div className="flex items-baseline space-x-1">
              <span className={clsx("text-2xl font-semibold tracking-tight", colorClass)}>{ruptureRisk.toFixed(1)}</span>
              <span className="text-sm font-mono text-industrial-500">%</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
