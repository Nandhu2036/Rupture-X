import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Info, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const AlertCenter: React.FC = () => {
  const { alerts } = useSimulation();

  const activeAlerts = alerts.slice(0, 4);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return 'Just now';
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'CRITICAL': return { icon: ShieldAlert, color: 'text-status-red', bg: 'bg-status-red/10' };
      case 'WARNING': return { icon: AlertTriangle, color: 'text-status-amber', bg: 'bg-status-amber/10' };
      default: return { icon: Info, color: 'text-status-blue', bg: 'bg-status-blue/10' };
    }
  };

  return (
    <div className="industrial-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-industrial-500">
            <CheckCircle2 className="w-10 h-10 mb-4 text-status-green/50" />
            <span className="text-base font-medium text-status-green">All Systems Nominal</span>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const Icon = style.icon;
            
            return (
              <div key={alert.id} className={clsx("flex items-center justify-between p-5 rounded-2xl", style.bg)}>
                <div className="flex items-center">
                  <div className={clsx("p-3 rounded-xl bg-black/20 mr-5", style.color)}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-industrial-100">{alert.message}</div>
                    <div className="text-xs text-industrial-400 mt-1 capitalize">{alert.type.toLowerCase()} Alert</div>
                  </div>
                </div>
                
                <div className="text-sm font-medium text-industrial-400 shrink-0">
                  {formatTimeAgo(alert.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
