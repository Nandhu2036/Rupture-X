import React from 'react';
import { Activity, ShieldAlert, ActivitySquare, Thermometer } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { clsx } from 'clsx';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const miniChartData = [
  { value: 40 }, { value: 42 }, { value: 38 }, { value: 45 }, { value: 41 }, { value: 50 }, { value: 48 }, { value: 55 }
];

export const MetricCards: React.FC = () => {
  const { beltHealth, ruptureRisk, vibration, temperature } = useSimulation();

  const getStatus = (value: number, thresholdWarn: number, thresholdCrit: number, isHigherWorse = true) => {
    if (isHigherWorse) {
      if (value >= thresholdCrit) return { label: 'CRITICAL', color: 'text-status-red' };
      if (value >= thresholdWarn) return { label: 'WARNING', color: 'text-status-amber' };
      return { label: 'NORMAL', color: 'text-status-green' };
    } else {
      if (value <= thresholdCrit) return { label: 'CRITICAL', color: 'text-status-red' };
      if (value <= thresholdWarn) return { label: 'WARNING', color: 'text-status-amber' };
      return { label: 'HEALTHY', color: 'text-status-green' };
    }
  };

  const healthStatus = getStatus(beltHealth, 85, 60, false);
  const riskStatus = getStatus(ruptureRisk, 30, 80);
  const vibStatus = getStatus(vibration, 30, 45);
  const tempStatus = getStatus(temperature, 75, 90);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Belt Health */}
      <div className="industrial-card p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3 text-industrial-400">
            <div className="p-2 bg-black rounded-xl">
              <Activity className="w-5 h-5 text-status-blue" />
            </div>
            <h3 className="text-sm font-medium">Belt Health</h3>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-semibold tracking-tight">{beltHealth.toFixed(1)}</span>
          <span className="text-xl text-industrial-400">%</span>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <span className={clsx("w-2 h-2 rounded-full", healthStatus.color.replace('text-', 'bg-'))}></span>
          <span className={clsx("text-xs font-medium", healthStatus.color)}>{healthStatus.label}</span>
        </div>
      </div>

      {/* Rupture Risk */}
      <div className="industrial-card p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3 text-industrial-400">
            <div className="p-2 bg-black rounded-xl">
              <ShieldAlert className="w-5 h-5 text-status-amber" />
            </div>
            <h3 className="text-sm font-medium">Rupture Risk</h3>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-semibold tracking-tight">{ruptureRisk.toFixed(1)}</span>
          <span className="text-xl text-industrial-400">%</span>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <span className={clsx("w-2 h-2 rounded-full", riskStatus.color.replace('text-', 'bg-'))}></span>
          <span className={clsx("text-xs font-medium", riskStatus.color)}>{riskStatus.label}</span>
        </div>
      </div>

      {/* Motor Vibration */}
      <div className="industrial-card p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3 text-industrial-400">
            <div className="p-2 bg-black rounded-xl">
              <ActivitySquare className="w-5 h-5 text-status-blue" />
            </div>
            <h3 className="text-sm font-medium">Vibration</h3>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-semibold tracking-tight">{vibration.toFixed(1)}</span>
          <span className="text-xl text-industrial-400">mm/s</span>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <span className={clsx("w-2 h-2 rounded-full", vibStatus.color.replace('text-', 'bg-'))}></span>
          <span className={clsx("text-xs font-medium", vibStatus.color)}>{vibStatus.label}</span>
        </div>
      </div>

      {/* Temperature */}
      <div className="industrial-card p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3 text-industrial-400">
            <div className="p-2 bg-black rounded-xl border border-white/5 shadow-sm">
              <Thermometer className="w-5 h-5 text-status-red" />
            </div>
            <h3 className="text-sm font-medium">Temperature</h3>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-semibold tracking-tight">{temperature.toFixed(1)}</span>
          <span className="text-xl text-industrial-400">°C</span>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <span className={clsx("w-2 h-2 rounded-full", tempStatus.color.replace('text-', 'bg-'))}></span>
          <span className={clsx("text-xs font-medium", tempStatus.color)}>{tempStatus.label}</span>
        </div>
      </div>
    </div>
  );
};
