import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';

export const KinematicChart: React.FC = () => {
  const { jointInterval } = useSimulation();
  const [data, setData] = useState<{time: string, value: number}[]>([]);

  useEffect(() => {
    setData(prev => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const newData = [...prev, { time: timeStr, value: jointInterval }];
      if (newData.length > 20) newData.shift();
      return newData;
    });
  }, [jointInterval]);

  const isWarning = jointInterval > 3.0;
  
  return (
    <div className="industrial-panel p-6 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xs font-mono font-semibold tracking-widest text-industrial-300 uppercase mb-1">Kinematic Analysis</h2>
          <div className="text-[10px] font-mono text-industrial-500 uppercase tracking-widest">Timing Deviation (Δt)</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-industrial-500 mb-1 tracking-widest uppercase">Current Interval</div>
          <div className={clsx("text-2xl font-semibold tracking-tight font-mono", isWarning ? "text-status-amber text-glow-amber" : "text-status-cyan")}>
            {jointInterval.toFixed(2)}s
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="1 4" stroke="#2c2e33" vertical={false} />
            <XAxis dataKey="time" stroke="#40434b" fontSize={9} tickMargin={10} tick={{fill: '#737780'}} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="#40434b" fontSize={9} tick={{fill: '#737780'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0c0c0e', borderColor: '#2c2e33', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#eaebed' }}
              labelStyle={{ color: '#737780', marginBottom: '2px' }}
            />
            <ReferenceLine y={2.8} stroke="#06b6d4" strokeOpacity={0.5} strokeDasharray="2 2" />
            <Line type="stepAfter" dataKey="value" stroke={isWarning ? "#f59e0b" : "#eaebed"} dot={false} strokeWidth={1.5} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
