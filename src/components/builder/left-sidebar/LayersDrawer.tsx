"use client";

import React from "react";
import { Layout } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";

export const LayersDrawer: React.FC = () => {
  const { present } = useBuilderStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-3 animate-in fade-in duration-100 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-extrabold text-slate-900">Navigator Tree</h3>
      </div>
      <div className="flex flex-col gap-1.5 text-xs">
        {present.sections.map((s, idx) => (
          <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-700">
            <Layout className="w-3.5 h-3.5 text-blue-600" />
            <span>Section {idx + 1} ({s.children.length} items)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
