"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";

export const PagesDrawer: React.FC = () => {
  const { present } = useBuilderStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4 animate-in fade-in duration-100 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-extrabold text-slate-900">Pages Manager</h3>
        <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
      </div>

      {/* Active Page Settings Card */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-3 shadow-xs">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Page Configuration</span>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-600">Page Title</label>
          <input
            type="text"
            value={present.name}
            onChange={(e) => {
              useBuilderStore.setState((state) => ({
                present: { ...state.present, name: e.target.value },
                isSaved: false,
              }));
            }}
            placeholder="Page Name"
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-600">URL Path (Slug)</label>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
            <span className="text-[10px] text-slate-400 font-mono select-none">/view/</span>
            <input
              type="text"
              value={present.slug}
              onChange={(e) => {
                const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
                useBuilderStore.setState((state) => ({
                  present: { ...state.present, slug: cleaned },
                  isSaved: false,
                }));
              }}
              placeholder="slug"
              className="bg-transparent text-xs font-bold text-blue-600 font-mono focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Create New Page Banner */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Page Actions</span>
        <button
          onClick={() => {
            const pName = prompt("Enter new page name:", "About Us");
            if (pName) {
              const pSlug = pName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
              useBuilderStore.setState((state) => ({
                present: { ...state.present, name: pName, slug: pSlug, sections: [] },
                isSaved: false,
              }));
              alert(`Created and switched to dynamic page: ${pName} (/view/${pSlug})`);
            }
          }}
          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border-0 shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Page</span>
        </button>
      </div>
    </div>
  );
};
