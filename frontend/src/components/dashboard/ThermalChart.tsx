import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';

export const ThermalChart: React.FC = () => {
  const { temperature } = useSimulation();
  const [data, setData] = useState<{time: string, bearing: number, motor: number}[]>([]);

  useEffect(() => {
    setData(prev => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const motorTemp = temperature * 0.8 + Math.random() * 2;
      const newData = [...prev, { time: timeStr, bearing: temperature, motor: motorTemp }];
      if (newData.length > 20) newData.shift();
      return newData;
    });
  }, [temperature]);

  const isWarning = temperature > 75;
  const isCritical = temperature > 90;

  let color = "#238636"; // green
  if (isCritical) color = "#F85149"; // red
  else if (isWarning) color = "#D29922"; // amber

  return (
    <div className="industrial-card p-6 flex flex-col mb-8 h-[400px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-wider">THERMAL MONITORING</h2>
          <div className="flex space-x-4 mt-2">
             <div className="flex items-center text-[10px] font-mono text-industrial-400">
               <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
               Bearing 01
             </div>
             <div className="flex items-center text-[10px] font-mono text-industrial-400">
               <div className="w-2 h-2 rounded-full mr-2 bg-status-blue"></div>
               Drive Motor
             </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-industrial-400 uppercase">Bearing 01 Peak</div>
          <div className={clsx("text-2xl font-mono font-bold", isCritical ? "text-status-red animate-pulse" : (isWarning ? "text-status-amber" : "text-industrial-100"))}>
            {temperature.toFixed(1)}°C
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBearing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMotor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#58A6FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" vertical={false} />
            <XAxis dataKey="time" stroke="#8B949E" fontSize={10} tickMargin={10} />
            <YAxis domain={[40, 100]} stroke="#8B949E" fontSize={10} tickFormatter={(val) => `${val}°`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1D20', borderColor: '#343A40', fontFamily: 'monospace', fontSize: '12px' }}
              itemStyle={{ color: '#F0F6FC' }}
            />
            <ReferenceLine y={75} stroke="#D29922" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'WARNING > 75°C', fill: '#D29922', fontSize: 10, fontFamily: 'monospace' }} />
            <ReferenceLine y={90} stroke="#F85149" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'CRITICAL > 90°C', fill: '#F85149', fontSize: 10, fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="motor" stroke="#58A6FF" fillOpacity={1} fill="url(#colorMotor)" isAnimationActive={false} />
            <Area type="monotone" dataKey="bearing" stroke={color} fillOpacity={1} fill="url(#colorBearing)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
