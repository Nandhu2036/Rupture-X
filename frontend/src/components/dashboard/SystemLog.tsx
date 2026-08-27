import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Terminal } from 'lucide-react';

export const SystemLog: React.FC = () => {
  const { logs } = useSimulation();

  return (
    <div className="industrial-card p-6 h-64 flex flex-col">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center border-b border-industrial-600 pb-2">
        <Terminal className="w-4 h-4 mr-2 text-industrial-400" />
        System Log
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
        {logs.map((log) => (
          <div key={log.id} className="flex">
            <span className="text-industrial-500 mr-4 shrink-0">
              {log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-industrial-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
