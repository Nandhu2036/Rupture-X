import { SimulationProvider } from './context/SimulationContext';
import { Shell } from './components/layout/Shell';
import { HeroStatus } from './components/dashboard/HeroStatus';
import { MetricCards } from './components/dashboard/MetricCards';
import { LiveConveyor } from './components/dashboard/LiveConveyor';
import { VisionPanel } from './components/dashboard/VisionPanel';
import { KinematicChart } from './components/dashboard/KinematicChart';
import { RiskEngine } from './components/dashboard/RiskEngine';
import { AlertCenter } from './components/dashboard/AlertCenter';

function App() {
  return (
    <SimulationProvider>
      <Shell>
        <div className="flex flex-col gap-6 lg:gap-8">
          <HeroStatus />
          <MetricCards />
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            <div className="xl:col-span-5 flex flex-col">
              <RiskEngine />
            </div>
            <div className="xl:col-span-7 flex flex-col">
              <KinematicChart />
            </div>
          </div>

          <VisionPanel />
          <LiveConveyor />
          <AlertCenter />
          
          <footer className="mt-16 py-8 border-t border-industrial-800 flex flex-col md:flex-row justify-between items-center text-xs text-industrial-400 font-mono">
             <div className="flex items-center space-x-4">
               <span className="text-industrial-300 font-medium tracking-wider">RUPTURE-X</span>
               <span className="w-1 h-1 bg-industrial-600 rounded-full"></span>
               <span>EDGE AI PREDICTIVE MAINTENANCE</span>
             </div>
             <div className="mt-4 md:mt-0 flex items-center space-x-3">
               <span className="w-2 h-2 bg-status-cyan/50 rounded-full animate-pulse"></span>
               <span>LIVE OPERATIONS CENTER</span>
             </div>
          </footer>
        </div>
      </Shell>
    </SimulationProvider>
  );
}

export default App;
