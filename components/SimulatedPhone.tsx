
import React from 'react';

interface SimulatedPhoneProps {
  children?: React.ReactNode;
}

export const SimulatedPhone: React.FC<SimulatedPhoneProps> = ({ children }) => {
  return (
    <div className="relative group drop-shadow-2xl">
      {/* Device Body */}
      <div 
        className="relative bg-[#1a1a1a] rounded-[3.8rem] p-1.5 border-[4px] border-[#333] shadow-inner"
        style={{
          height: '70vh',
          aspectRatio: '9 / 19.5'
        }}
      >
        {/* Screen Surface */}
        <div className="w-full h-full bg-black rounded-[3.4rem] p-1 overflow-hidden relative">
          <div className="w-full h-full bg-white rounded-[2.9rem] overflow-hidden flex flex-col relative">
            
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[85px] h-7 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="absolute right-4 w-2 h-2 rounded-full bg-[#111] border border-slate-800"></div>
            </div>

            {/* Viewport Content */}
            <div className="flex-1 overflow-hidden relative z-10">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="h-8 w-full flex items-center justify-center shrink-0 z-20">
              <div className="w-[100px] h-1.5 bg-slate-100 rounded-full mb-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Controls Decoration */}
      <div className="absolute -left-1.5 top-32 w-1 h-8 bg-[#333] rounded-l-sm"></div>
      <div className="absolute -left-1.5 top-44 w-1 h-12 bg-[#333] rounded-l-sm"></div>
      <div className="absolute -left-1.5 top-60 w-1 h-12 bg-[#333] rounded-l-sm"></div>
      <div className="absolute -right-1.5 top-44 w-1 h-16 bg-[#333] rounded-r-sm"></div>
    </div>
  );
};
