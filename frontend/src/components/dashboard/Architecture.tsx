import React from 'react';
import { Network, Server, Cpu, Activity, ShieldOff, Eye, CpuIcon } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <div className="industrial-card p-6 mb-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-wider">EDGE ARCHITECTURE</h2>
        <div className="flex items-center bg-industrial-900 border border-industrial-700 px-3 py-1 rounded text-[10px] font-mono text-industrial-400">
          <ShieldOff className="w-3 h-3 mr-2" />
          NO CLOUD DEPENDENCY
        </div>
      </div>

      <div className="flex-1 bg-industrial-900/50 rounded-xl border border-industrial-700 p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#343A40_1px,transparent_1px),linear-gradient(to_bottom,#343A40_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none"></div>

        {/* Nodes */}
        <div className="flex flex-col space-y-4 w-full md:w-48 z-10">
          <div className="bg-industrial-800 border border-industrial-600 p-3 rounded-lg flex items-center shadow-md">
            <Eye className="w-5 h-5 text-status-blue mr-3" />
            <div>
              <div className="text-[10px] font-bold font-mono text-industrial-100">ESP32-CAM</div>
              <div className="text-[9px] font-mono text-industrial-400">Vision Node</div>
            </div>
          </div>
          <div className="bg-industrial-800 border border-industrial-600 p-3 rounded-lg flex items-center shadow-md">
            <Activity className="w-5 h-5 text-status-blue mr-3" />
            <div>
              <div className="text-[10px] font-bold font-mono text-industrial-100">ESP32 CORE</div>
              <div className="text-[9px] font-mono text-industrial-400">Sensor Node</div>
            </div>
          </div>
        </div>

        {/* Arrows / Connections */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-0 w-full md:w-auto relative z-10">
           <Network className="w-8 h-8 text-industrial-500 mb-2 opacity-50" />
           <div className="text-[10px] font-mono text-industrial-400 text-center uppercase tracking-widest bg-industrial-900 px-2 py-1 rounded border border-industrial-700">
             Local Edge Network
           </div>
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-industrial-600 -z-10">
             <div className="w-1/2 h-full bg-status-blue/50 animate-[scan_2s_linear_infinite]"></div>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full md:w-56 z-10 mt-4 md:mt-0">
          <div className="bg-industrial-800 border-2 border-status-blue/30 p-4 rounded-xl flex flex-col items-center shadow-[0_0_15px_rgba(88,166,255,0.1)] w-full text-center">
            <CpuIcon className="w-8 h-8 text-status-blue mb-2" />
            <div className="text-xs font-bold font-mono text-industrial-100 mb-1">RUPTURE-X FUSION ENGINE</div>
            <div className="text-[10px] font-mono text-industrial-400">OpenCV + Sensor Analytics</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-0 w-full md:w-auto relative z-10">
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-industrial-600 -z-10">
             <div className="w-1/2 h-full bg-status-green/50 animate-[scan_2s_linear_infinite]"></div>
           </div>
           <div className="text-[10px] font-mono text-industrial-400 text-center uppercase tracking-widest bg-industrial-900 px-2 py-1 rounded border border-industrial-700">
             WebSocket
           </div>
        </div>

        <div className="w-full md:w-48 z-10 mt-4 md:mt-0">
          <div className="bg-industrial-800 border border-status-green/30 p-4 rounded-xl flex items-center shadow-md">
            <Server className="w-6 h-6 text-status-green mr-3" />
            <div>
              <div className="text-[10px] font-bold font-mono text-industrial-100">LOCAL DASHBOARD</div>
              <div className="text-[9px] font-mono text-status-green">OFFLINE / AIR-GAPPED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
