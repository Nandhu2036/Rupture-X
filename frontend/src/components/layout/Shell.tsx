import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Shell: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-industrial-950 text-industrial-100 selection:bg-status-cyan/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-industrial-950 to-industrial-900/50">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
