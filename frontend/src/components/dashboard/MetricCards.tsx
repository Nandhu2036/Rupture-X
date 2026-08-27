import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';

export const MetricCards: React.FC = () => {
  const { beltHealth, ruptureRisk, vibration, temperature } = useSimulation();

  const getStatus = (value: number, thresholdWarn: number, thresholdCrit: number, isHigherWorse = true) => {
    if (isHigherWorse) {
      if (value >= thresholdCrit) return { label: 'CRITICAL', color: 'text-status-red' };
      if (value >= thresholdWarn) return { label: 'WARNING', color: 'text-status-amber' };
      return { label: 'NORMAL', color: 'text-status-cyan' };
    } else {
      if (value <= thresholdCrit) return { label: 'CRITICAL', color: 'text-status-red' };
      if (value <= thresholdWarn) return { label: 'WARNING', color: 'text-status-amber' };
      return { label: 'HEALTHY', color: 'text-status-cyan' };
    }
  };

  const healthStatus = getStatus(beltHealth, 85, 60, false);
  const riskStatus = getStatus(ruptureRisk, 30, 80);
  const vibStatus = getStatus(vibration, 30, 45);
  const tempStatus = getStatus(temperature, 75, 90);

  const metrics = [
    { title: 'SYSTEM HEALTH', value: beltHealth.toFixed(1), unit: '%', status: healthStatus },
    { title: 'RUPTURE RISK', value: ruptureRisk.toFixed(1), unit: '%', status: riskStatus },
    { title: 'KINEMATIC VIB', value: vibration.toFixed(1), unit: 'MM/S', status: vibStatus },
    { title: 'THERMAL LOAD', value: temperature.toFixed(1), unit: '°C', status: tempStatus }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-industrial-800 border border-industrial-800 rounded-lg overflow-hidden">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-industrial-950 p-5 flex flex-col justify-between h-32 hover:bg-industrial-900 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xxs font-mono text-industrial-400 uppercase tracking-widest">{m.title}</h3>
            <div className="flex items-center space-x-1.5">
              <span className={clsx("w-1.5 h-1.5 rounded-full", m.status.color.replace('text-', 'bg-'))}></span>
              <span className={clsx("text-xxs font-mono tracking-wider", m.status.color)}>{m.status.label}</span>
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-auto">
            <span className={clsx("text-4xl font-semibold tracking-tight", m.status.color === 'text-status-red' ? 'text-status-red' : 'text-industrial-100')}>
              {m.value}
            </span>
            <span className="text-xs font-mono text-industrial-500 uppercase">{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
