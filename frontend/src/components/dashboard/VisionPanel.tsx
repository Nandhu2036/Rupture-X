import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Maximize2, Crosshair, Focus } from 'lucide-react';
import { clsx } from 'clsx';

export const VisionPanel: React.FC = () => {
  const { visionDefects, isLiveMode, visionConfidence } = useSimulation();
  const hasDefect = visionDefects > 0;
  
  const [camIp, setCamIp] = useState('192.168.4.2');

  return (
    <div className="industrial-panel flex flex-col h-[600px] mb-8 relative group">
      
      {/* Top Bar HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-industrial-950/80 rounded border border-white/10 backdrop-blur-sm">
            <Camera className="w-4 h-4 text-status-cyan" />
          </div>
          <h3 className="text-sm font-mono tracking-widest text-industrial-100 uppercase">Edge Vision Matrix</h3>
        </div>
        
        <div className="flex items-center space-x-4 bg-industrial-950/80 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm">
          <span className="text-xxs font-mono text-industrial-400">SRC:</span>
          <input 
            type="text" 
            value={camIp}
            onChange={(e) => setCamIp(e.target.value)}
            className="bg-transparent border-none text-status-cyan text-xs w-24 text-center font-mono focus:outline-none focus:ring-1 focus:ring-status-cyan/50 rounded"
            title="ESP32-CAM IP Address"
          />
          <div className="w-px h-3 bg-industrial-700 mx-2"></div>
          <div className="flex items-center space-x-2">
            <div className={clsx("w-1.5 h-1.5 rounded-full", hasDefect ? "bg-status-red shadow-glow-red animate-pulse" : "bg-status-cyan")}></div>
            <span className="text-xxs font-mono tracking-widest text-industrial-300">
              {hasDefect ? 'ANOMALY' : 'TRACKING'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-industrial-950 flex items-center justify-center overflow-hidden">
        
        {/* HUD Frame Elements */}
        <div className="absolute inset-0 border border-white/[0.02] pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20"></div>
          
          {/* Center Crosshair faintly visible */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-20 flex items-center justify-center">
             <Crosshair className="w-6 h-6 text-status-cyan" />
          </div>
        </div>
        
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
           {isLiveMode ? (
              <>
                <img 
                  src={`http://${camIp}:81/stream`} 
                  alt="ESP32-CAM Live Feed" 
                  className="w-full h-full object-cover filter contrast-125 saturate-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    document.getElementById('stream-error')?.classList.remove('hidden');
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = 'block';
                    document.getElementById('stream-error')?.classList.add('hidden');
                  }}
                />
                <div id="stream-error" className="hidden absolute inset-0 flex items-center justify-center text-status-red font-mono text-sm z-10 bg-black/90 text-center px-4">
                   <div className="flex flex-col items-center">
                     <Focus className="w-8 h-8 mb-4 opacity-50" />
                     <span>ERR_CONNECTION_REFUSED</span>
                     <span className="text-industrial-500 mt-2 text-xs">Waiting for video stream on {camIp}</span>
                   </div>
                </div>
              </>
           ) : (
              <div className="w-full h-full bg-industrial-950 flex flex-col items-center justify-center text-industrial-500 font-mono text-xs tracking-widest relative overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                 <Camera className="w-8 h-8 mb-4 opacity-20" />
                 <span>SYSTEM IDLE</span>
              </div>
           )}
           
           {/* Technical Defect Overlay */}
           {hasDefect && isLiveMode && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-40 border border-status-red bg-status-red/5 z-20 flex flex-col transition-all duration-200">
                <div className="bg-status-red text-white text-xxs font-mono tracking-widest px-2 py-1 self-start ml-[-1px] mt-[-1px]">
                  TARGET ACQUIRED: ANOMALY
                </div>
                
                {/* HUD Corners for the bounding box */}
                <div className="w-3 h-3 border-t-2 border-l-2 border-status-red absolute top-0 left-0"></div>
                <div className="w-3 h-3 border-t-2 border-r-2 border-status-red absolute top-0 right-0"></div>
                <div className="w-3 h-3 border-b-2 border-l-2 border-status-red absolute bottom-0 left-0"></div>
                <div className="w-3 h-3 border-b-2 border-r-2 border-status-red absolute bottom-0 right-0"></div>
                
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-status-red">
                  CONFIDENCE: {visionConfidence.toFixed(1)}%
                </div>
              </div>
           )}
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end z-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <div className="text-xxs text-status-cyan/70 space-y-1 font-mono">
            <div>NODE: EDGE_VISION_01</div>
            <div>STATUS: {isLiveMode ? 'STREAMING' : 'STANDBY'}</div>
            <div>FMT: MJPEG / 15FPS</div>
          </div>
          
          <button className="pointer-events-auto p-2 bg-industrial-950/80 rounded border border-white/10 hover:bg-industrial-800 transition-colors backdrop-blur-sm">
             <Maximize2 className="w-4 h-4 text-industrial-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
