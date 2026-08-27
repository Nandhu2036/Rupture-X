import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceLine } from 'recharts';
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
    <div className="industrial-card p-8 flex flex-col mb-8 h-full min-h-[400px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Kinematic Elongation</h2>
          <p className="text-sm text-industrial-400 mt-1">Live belt joint timing deviation</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-industrial-400 mb-1">Interval</div>
          <div className={clsx("text-3xl font-semibold tracking-tight", isWarning ? "text-status-amber" : "text-industrial-100")}>
            {jointInterval.toFixed(2)}s
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKinematic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isWarning ? "#FF9F0A" : "#0A84FF"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isWarning ? "#FF9F0A" : "#0A84FF"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#3A3A3C" fontSize={10} tickMargin={10} tick={{fill: '#86868B'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#F5F5F7' }}
            />
            <ReferenceLine y={2.8} stroke="#3A3A3C" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="value" stroke={isWarning ? "#FF9F0A" : "#0A84FF"} fillOpacity={1} fill="url(#colorKinematic)" strokeWidth={3} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
