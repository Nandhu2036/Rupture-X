import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

export const VisionPanel: React.FC = () => {
  const { visionConfidence, visionDefects, isLiveMode } = useSimulation();
  const hasDefect = visionDefects > 0;

  return (
    <div className="industrial-card p-0 flex flex-col relative overflow-hidden mb-8 h-[400px]">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-lg font-semibold flex items-center text-white">
          <Camera className="w-5 h-5 mr-3 text-status-blue" />
          Edge Vision Feed
        </h2>
        
        <div className={clsx("px-3 py-1 rounded-full text-xs font-medium border", 
          hasDefect ? "bg-status-red/20 text-status-red border-status-red/50" : "bg-black/50 text-status-green border-status-green/50"
        )}>
          {hasDefect ? 'Anomaly Detected' : 'Clear'}
        </div>
      </div>

      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {/* Simple Camera noise/grain (only visible if stream fails or loading) */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
        
        {/* ACTUAL LIVE VIDEO STREAM FROM ESP32-CAM */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
           {isLiveMode ? (
              <img 
                src={import.meta.env.VITE_ESP32_STREAM_URL || "http://192.168.4.1:81/stream"} 
                alt="ESP32-CAM Live Feed" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  document.getElementById('stream-error')?.classList.remove('hidden');
                }}
              />
           ) : (
              // Fallback / Demo animation when not in Live Mode
              <div className="w-[120%] h-full bg-[#111] transform -rotate-1 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10 animate-[slide_1s_linear_infinite]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, transparent 2px, transparent 100px)' }}></div>
                 {!hasDefect && (
                   <div className="opacity-50 text-industrial-400 font-mono text-sm tracking-widest">
                     SIMULATION MODE (ENABLE LIVE WS)
                   </div>
                 )}
              </div>
           )}
           
           <div id="stream-error" className="hidden absolute inset-0 flex items-center justify-center text-status-red font-mono text-sm z-10 bg-black/80">
              [STREAM DISCONNECTED - CHECK ESP32-CAM IP]
           </div>
           
           {/* Defect Overlay (Works on top of the live video!) */}
           {hasDefect && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-status-red bg-status-red/10 z-20 rounded-xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(255,69,58,0.5)]">
                <span className="bg-status-red text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3">
                  Tear Detected (Confidence: {visionConfidence.toFixed(1)}%)
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
          <div>CAM-01 {isLiveMode ? '[LIVE]' : '[DEMO]'}</div>
          <div>FPS: {isLiveMode ? 'STREAM' : (hasDefect ? '16' : '30')}</div>
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
