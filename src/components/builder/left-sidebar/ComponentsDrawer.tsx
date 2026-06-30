"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";

export const ComponentsDrawer: React.FC = () => {
  const { globalBlocks, insertGlobalBlockSection } = useBuilderStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-3 animate-in fade-in duration-100 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-extrabold text-slate-900">Master Components</h3>
        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full shrink-0">
          {globalBlocks.length} Saved
        </span>
      </div>
      {globalBlocks.length === 0 ? (
        <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs mt-4">
          No saved master blocks yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {globalBlocks.map((b) => (
            <div key={b.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{b.name}</span>
              <button onClick={() => insertGlobalBlockSection(b.id)} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer border-0 shadow-xs">Insert</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
