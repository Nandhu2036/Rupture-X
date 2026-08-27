import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const AlertCenter: React.FC = () => {
  const { alerts } = useSimulation();

  const activeAlerts = alerts.slice(0, 5);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="industrial-panel flex flex-col h-full min-h-[300px]">
      <div className="p-4 border-b border-industrial-800 bg-industrial-950/30 flex justify-between items-center">
        <h2 className="text-xs font-mono font-semibold tracking-widest text-industrial-300 uppercase">System Event Log</h2>
        <span className="text-[10px] font-mono text-industrial-500 uppercase tracking-widest">Tailing 5 Events</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-1">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-industrial-500">
            <CheckCircle2 className="w-8 h-8 mb-3 opacity-20" />
            <span className="text-xs font-mono tracking-widest uppercase">System Nominal</span>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCrit = alert.type === 'CRITICAL';
            const isWarn = alert.type === 'WARNING';
            const borderColor = isCrit ? 'border-status-red' : (isWarn ? 'border-status-amber' : 'border-industrial-700');
            const textColor = isCrit ? 'text-status-red' : (isWarn ? 'text-status-amber' : 'text-industrial-300');
            
            return (
              <div key={alert.id} className={clsx("flex items-start md:items-center py-2 px-3 border-l-2 bg-industrial-950/50 hover:bg-industrial-900 transition-colors", borderColor)}>
                <div className="text-[10px] font-mono text-industrial-500 w-24 shrink-0 mt-0.5 md:mt-0">
                  {formatTime(alert.timestamp)}
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center flex-1">
                  <div className={clsx("text-xs font-mono tracking-wider uppercase font-semibold md:w-28 shrink-0 mb-1 md:mb-0", textColor)}>
                    [{alert.type}]
                  </div>
                  <div className="text-xs font-mono text-industrial-300">
                    {alert.message}
                  </div>
                </div>

                {isCrit && <ShieldAlert className="w-4 h-4 text-status-red shrink-0 ml-4 animate-pulse hidden md:block" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
