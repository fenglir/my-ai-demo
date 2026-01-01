
import React from 'react';

interface SimulatedPadProps {
  children?: React.ReactNode;
}

export const SimulatedPad: React.FC<SimulatedPadProps> = ({ children }) => {
  return (
    <div className="relative group drop-shadow-2xl">
      {/* Outer Case */}
      <div className="relative bg-black rounded-[3rem] p-3.5 border-[6px] border-[#1a1a1a]">
        {/* Screen Container */}
        <div 
          className="relative bg-white rounded-[2.2rem] overflow-hidden shadow-inner flex flex-col"
          style={{ 
            height: '70vh', 
            aspectRatio: '4 / 3',
          }}
        >
          {/* Status Bar */}
          <div className="h-8 w-full flex items-center justify-between px-10 shrink-0">
            <div className="text-[11px] font-bold text-slate-300">9:41 AM</div>
            <div className="flex items-center gap-2">
              <i className="fas fa-wifi text-[10px] text-slate-200"></i>
              <i className="fas fa-battery-full text-[10px] text-slate-200"></i>
            </div>
          </div>

          {/* Actual Content Viewport */}
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {children}
          </div>
          
          {/* Virtual Home Bar */}
          <div className="h-6 w-full flex items-center justify-center pb-2">
            <div className="w-32 h-1 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative Pencil Magnet */}
      <div className="absolute -right-[8px] top-1/4 w-1.5 h-32 bg-[#222] rounded-r-lg"></div>
    </div>
  );
};
