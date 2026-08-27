import React from 'react';
import { LayoutDashboard, Activity, Eye, ShieldAlert, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { icon: LayoutDashboard, label: 'SYSTEM OVERVIEW', active: true },
  { icon: Activity, label: 'KINEMATICS' },
  { icon: Eye, label: 'VISION MATRIX' },
  { icon: ShieldAlert, label: 'EVENT LOGS' },
  { icon: Settings, label: 'CONFIGURATION' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-16 lg:w-64 bg-industrial-950 h-screen flex flex-col hidden md:flex border-r border-industrial-800 shrink-0">
      <div className="p-4 lg:p-6 pb-4 flex items-center justify-center lg:justify-start">
        <div className="w-8 h-8 bg-industrial-800 rounded border border-industrial-700 flex items-center justify-center lg:hidden">
          <span className="text-industrial-100 font-bold text-xs">RX</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-lg font-mono font-bold tracking-widest text-industrial-100">RUPTURE-X</h1>
          <p className="text-[10px] font-mono text-industrial-500 mt-1 uppercase tracking-widest">
            Edge AI Maintenance
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-8 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={twMerge(
              clsx(
                "w-full flex items-center lg:space-x-3 px-3 py-3 lg:px-4 lg:py-3 rounded md:justify-center lg:justify-start text-xs font-mono tracking-widest transition-all",
                item.active 
                  ? "bg-industrial-900 text-status-cyan border border-industrial-800" 
                  : "text-industrial-500 hover:text-industrial-300 hover:bg-industrial-900/50 border border-transparent"
              )
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
