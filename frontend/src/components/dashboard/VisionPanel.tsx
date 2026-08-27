import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

export const VisionPanel: React.FC = () => {
  const { visionDefects, isLiveMode } = useSimulation();
  const hasDefect = visionDefects > 0;
  
  // Keep track of the camera IP dynamically
  const [camIp, setCamIp] = useState('192.168.4.2');

  return (
    <div className="industrial-card p-6 flex flex-col h-[500px] mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-5 h-5 text-status-blue" />
          <h3 className="text-lg font-medium text-industrial-100">Vision Analysis</h3>
        </div>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            value={camIp}
            onChange={(e) => setCamIp(e.target.value)}
            className="bg-industrial-800 border border-industrial-700 text-industrial-100 text-xs px-2 py-1 rounded w-28 text-center font-mono"
            title="ESP32-CAM IP Address"
          />
          <div className="flex items-center space-x-2">
            <div className={clsx("w-2 h-2 rounded-full animate-pulse", hasDefect ? "bg-status-red" : "bg-status-green")}></div>
            <span className="text-sm font-medium text-industrial-400">
              {hasDefect ? 'Anomaly Detected' : 'Monitoring'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {/* Simple Camera noise/grain (only visible if stream fails or loading) */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
        
        {/* ACTUAL LIVE VIDEO STREAM FROM ESP32-CAM */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
           {isLiveMode ? (
              <>
                <img 
                  src={`http://${camIp}:81/stream`} 
                  alt="ESP32-CAM Live Feed" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    document.getElementById('stream-error')?.classList.remove('hidden');
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = 'block';
                    document.getElementById('stream-error')?.classList.add('hidden');
                  }}
                />
                <div id="stream-error" className="hidden absolute inset-0 flex items-center justify-center text-status-red font-mono text-sm z-10 bg-black/80 text-center px-4">
                   [ESP32-CAM OFFLINE]<br/>Waiting for Camera on {camIp}
                </div>
              </>
           ) : (
              // Fallback / Demo animation when not in Live Mode
              <div className="w-[120%] h-full bg-[#111] transform -rotate-1 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10 animate-[slide_1s_linear_infinite]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, transparent 2px, transparent 100px)' }}></div>
                 {!hasDefect && (
                   <div className="opacity-50 text-industrial-400 font-mono text-sm tracking-widest">
                     SYSTEM IDLE (ENABLE LIVE WS)
                   </div>
                 )}
              </div>
           )}
           
           {/* Defect Overlay (Works on top of the live video!) */}
           {hasDefect && isLiveMode && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-status-red bg-status-red/10 z-20 rounded-xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(255,69,58,0.5)]">
                <span className="bg-status-red text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3">
                  Anomaly Detected
                </span>
                {/* Crosshairs */}
                <div className="w-4 h-4 border-t-2 border-l-2 border-status-red absolute top-0 left-0"></div>
                <div className="w-4 h-4 border-t-2 border-r-2 border-status-red absolute top-0 right-0"></div>
                <div className="w-4 h-4 border-b-2 border-l-2 border-status-red absolute bottom-0 left-0"></div>
                <div className="w-4 h-4 border-b-2 border-r-2 border-status-red absolute bottom-0 right-0"></div>
              </div>
           )}
        </div>

        <div className="absolute bottom-6 left-6 text-xs text-white/70 space-y-1 font-mono z-20 bg-black/40 px-2 py-1 rounded">
          <div>CAM-01 {isLiveMode ? `[LIVE - ${camIp}]` : '[OFFLINE]'}</div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 bg-black/40 p-2 rounded-full cursor-pointer hover:bg-black/60 transition-colors">
           <Maximize2 className="w-5 h-5 text-white" />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { background-position: 100px 0; }
          to { background-position: 0 0; }
        }
      `}} />
    </div>
  );
};
