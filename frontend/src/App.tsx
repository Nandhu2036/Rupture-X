import React from 'react';
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
        <div className="max-w-6xl mx-auto space-y-6">
          <HeroStatus />
          <MetricCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskEngine />
            <KinematicChart />
          </div>

          <VisionPanel />
          <LiveConveyor />
          <AlertCenter />
          
          <footer className="mt-12 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-industrial-400">
             <div>
               <span className="font-semibold text-industrial-100">RUPTURE-X</span>
               <span className="mx-2">|</span>
               Edge AI Predictive Maintenance
             </div>
             <div className="mt-4 md:mt-0">
               Live Operations Center
             </div>
          </footer>
        </div>
      </Shell>
    </SimulationProvider>
  );
}

export default App;
