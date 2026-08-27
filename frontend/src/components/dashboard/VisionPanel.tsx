import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Camera, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

export const VisionPanel: React.FC = () => {
  const { visionConfidence, visionDefects } = useSimulation();
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
        {/* Simple Camera noise/grain */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        
        {/* The Belt */}
        <div className="w-[120%] h-full bg-[#111] transform -rotate-1 relative overflow-hidden flex items-center justify-center">
           {/* Moving lines to simulate belt */}
           <div className="absolute inset-0 opacity-10 animate-[slide_1s_linear_infinite]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, transparent 2px, transparent 100px)' }}></div>
           
           {hasDefect && (
              <div className="relative w-64 h-24 border-2 border-status-red bg-status-red/10 z-20 rounded-xl flex items-center justify-center animate-pulse">
                <span className="bg-status-red text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3">
                  Tear Detected (Confidence: {visionConfidence.toFixed(1)}%)
                </span>
              </div>
           )}
           {!hasDefect && (
             <div className="opacity-50 text-industrial-400 font-mono text-sm tracking-widest">
               SCANNING BELT SURFACE...
             </div>
           )}
        </div>

        <div className="absolute bottom-6 left-6 text-xs text-white/70 space-y-1 font-mono">
          <div>CAM-01</div>
          <div>640x480 @ {hasDefect ? '16' : '30'}FPS</div>
        </div>

        <div className="absolute bottom-6 right-6">
           <Maximize2 className="w-5 h-5 text-white/50 hover:text-white transition-colors cursor-pointer" />
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
