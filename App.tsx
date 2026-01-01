
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SimulatedPad } from './components/SimulatedPad';
import { SimulatedPhone } from './components/SimulatedPhone';
import { MarketerHome } from './components/MarketerHome';
import { CustomerPhoneHome } from './components/CustomerPhoneHome';

const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('1');

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0f2f5] overflow-hidden">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d31145] rounded-lg flex items-center justify-center text-white shadow-md">
            <i className="fas fa-microchip"></i>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-none">Workflow Demo</h1>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Multi-State Simulation</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Gemini Flash Connected
          </div>
          <button className="text-slate-400 hover:text-[#d31145] transition-colors">
            <i className="fas fa-gear"></i>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Menu */}
        <Sidebar 
          activeId={activeScenarioId} 
          onSelect={setActiveScenarioId} 
        />

        {/* Device Interaction Playground */}
        <main className="flex-1 flex items-center justify-center p-8 gap-12 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center text-[20vw] font-black text-slate-900">
            {activeScenarioId}
          </div>

          {/* iPad Simulator (Left) - Marketer View */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <i className="fas fa-tablet-alt text-[10px] text-[#d31145]"></i>
              <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Marketer Pad</span>
            </div>
            <SimulatedPad>
              <MarketerHome />
            </SimulatedPad>
          </div>

          {/* iPhone Simulator (Right) - Mobile View */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <i className="fas fa-mobile-alt text-[10px] text-[#d31145]"></i>
              <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Customer Phone</span>
            </div>
            <SimulatedPhone>
              <CustomerPhoneHome />
            </SimulatedPhone>
          </div>
        </main>
      </div>

      {/* Footer System Status */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-center px-6 shrink-0 relative z-30">
        <p className="text-[10px] text-slate-400 font-medium">
          <i className="fas fa-info-circle mr-1"></i>
          Double-click sidebar menu items to rename. Content persists across states.
        </p>
      </footer>
    </div>
  );
};

export default App;
