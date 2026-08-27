import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

const data = [
  { time: 'NOW', health: 94 },
  { time: '+6H', health: 92 },
  { time: '+12H', health: 88 },
  { time: '+18H', health: 80 },
  { time: '+24H', health: 65 },
  { time: '+36H', health: 45 },
  { time: '+48H', health: 20 },
];

export const PredictiveMaintenance: React.FC = () => {
  const { mode } = useSimulation();
  
  // Adjust prediction based on mode
  const predictionData = data.map(d => ({
    ...d,
    health: mode === 'NORMAL' ? d.health : Math.max(0, d.health - 25)
  }));
  
  const maintenanceWindow = mode === 'NORMAL' ? '36–48 hours' : '8–12 hours';
  const status = mode === 'NORMAL' ? 'MONITOR' : 'URGENT PLAN';

  return (
    <div className="industrial-card p-6 mb-8 h-80 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-wider flex items-center">
            PREDICTIVE MAINTENANCE
          </h2>
          <p className="text-xs text-industrial-400 mt-1 max-w-md">
            Predictive estimate based on vibration, thermal and visual anomaly trends. Not an industrial safety guarantee.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-industrial-400 uppercase">Est. Maintenance Window</div>
          <div className={clsx("text-xl font-mono font-bold mt-1", mode !== 'NORMAL' ? "text-status-amber" : "text-industrial-100")}>
            {maintenanceWindow}
          </div>
          <div className={clsx("text-[10px] font-mono font-bold uppercase mt-1 px-2 py-0.5 inline-block rounded", mode !== 'NORMAL' ? "bg-status-amber/20 text-status-amber" : "bg-status-blue/20 text-status-blue")}>
            {status}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mode === 'NORMAL' ? "#58A6FF" : "#D29922"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={mode === 'NORMAL' ? "#58A6FF" : "#D29922"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" vertical={false} />
            <XAxis dataKey="time" stroke="#8B949E" fontSize={10} tickMargin={10} />
            <YAxis domain={[0, 100]} stroke="#8B949E" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1D20', borderColor: '#343A40', fontFamily: 'monospace', fontSize: '12px' }}
              itemStyle={{ color: '#F0F6FC' }}
            />
            <ReferenceLine y={60} stroke="#D29922" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Maintenance Threshold', fill: '#D29922', fontSize: 10, fontFamily: 'monospace' }} />
            <ReferenceLine y={30} stroke="#F85149" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Failure Risk', fill: '#F85149', fontSize: 10, fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="health" stroke={mode === 'NORMAL' ? "#58A6FF" : "#D29922"} fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} strokeDasharray="5 5" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
