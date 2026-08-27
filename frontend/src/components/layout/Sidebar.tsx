import React from 'react';
import { LayoutDashboard, Activity, Eye, AlertTriangle, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Activity, label: 'Kinematic Analysis' },
  { icon: Eye, label: 'Vision AI' },
  { icon: AlertTriangle, label: 'Alerts' },
  { icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-industrial-900 h-screen flex flex-col hidden md:flex border-r border-white/5">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-industrial-100">RUPTURE-X</h1>
        <p className="text-xs text-industrial-400 mt-2 font-medium">
          Edge AI Maintenance
        </p>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={twMerge(
              clsx(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                item.active 
                  ? "bg-industrial-800 text-industrial-100 shadow-sm" 
                  : "text-industrial-400 hover:text-industrial-100 hover:bg-industrial-800/50"
              )
            )}
          >
            <item.icon className={clsx("w-5 h-5", item.active ? "text-status-blue" : "")} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
