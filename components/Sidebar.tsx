
import React, { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onSelect }) => {
  const [items, setItems] = useState<MenuItem[]>([
    { id: '1', name: 'Home Interface', icon: 'fa-house' },
    { id: '2', name: 'Data Insights', icon: 'fa-chart-simple' },
    { id: '3', name: 'User Profile', icon: 'fa-user-gear' },
    { id: '4', name: 'Global Settings', icon: 'fa-sliders' },
    { id: '5', name: 'Debug Console', icon: 'fa-terminal' },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      setItems(items.map(item => item.id === id ? { ...item, name: newName } : item));
    }
    setEditingId(null);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 overflow-hidden">
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scenarios</h2>
          <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
            {items.length}
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingId(item.id);
              }}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${activeId === item.id 
                  ? 'bg-[#d31145] text-white shadow-lg shadow-[#d31145]/10 translate-x-1' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#d31145]'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                ${activeId === item.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-[#d31145]/5'}
              `}>
                <i className={`fas ${item.icon} text-xs ${activeId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#d31145]'}`}></i>
              </div>

              {editingId === item.id ? (
                <input
                  autoFocus
                  className="flex-1 bg-white border-2 border-[#d31145] rounded-lg px-2 py-1 text-sm outline-none text-slate-800 font-bold"
                  defaultValue={item.name}
                  onBlur={(e) => handleRename(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(item.id, e.currentTarget.value);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 font-semibold text-sm truncate">
                  {item.name}
                </span>
              )}

              {activeId !== item.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-angle-right text-[10px]"></i>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px]">
            <i className="fas fa-robot"></i>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-slate-800 uppercase">AI Assistant</p>
            <p className="text-[9px] text-slate-400 truncate">Ready to help with Scenario {activeId}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
