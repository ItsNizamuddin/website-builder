"use client";

import React, { useState, useEffect } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import {
  Plus, Layers, Globe, Settings, FileText, Box, ChevronLeft, X
} from "lucide-react";

import { AddDrawer } from "./left-sidebar/AddDrawer";
import { PagesDrawer } from "./left-sidebar/PagesDrawer";
import { LayersDrawer } from "./left-sidebar/LayersDrawer";
import { ComponentsDrawer } from "./left-sidebar/ComponentsDrawer";

export const SidebarLeft: React.FC = () => {
  const {
    activeDrawer,
    setActiveDrawer,
    addSection,
  } = useBuilderStore();

  const [showQuickStack, setShowQuickStack] = useState(false);
  const [quickStackPos, setQuickStackPos] = useState({ top: 0, left: 0 });
  const [quickCols, setQuickCols] = useState(2);
  const [quickRows, setQuickRows] = useState(2);

  // Close Quick Stack popover when drawer is closed or switched
  useEffect(() => {
    setShowQuickStack(false);
  }, [activeDrawer]);

  const toggleDrawer = (drawer: "add" | "pages" | "layers" | "components") => {
    setActiveDrawer(activeDrawer === drawer ? null : drawer);
  };

  const handleQuickStackClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setQuickStackPos({
      top: rect.top,
      left: rect.right + 12
    });
    setShowQuickStack(!showQuickStack);
  };

  const getDrawerContent = () => {
    switch (activeDrawer) {
      case "add":
        return <AddDrawer onQuickStackClick={handleQuickStackClick} />;
      case "pages":
        return <PagesDrawer />;
      case "layers":
        return <LayersDrawer />;
      case "components":
        return <ComponentsDrawer />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full select-none shrink-0 z-45 font-sans">
      {/* 1. NARROW FIXED DOCK STRIP */}
      <aside className="w-11 lg:w-11 2xl:w-14 bg-slate-50 text-slate-500 border-r border-slate-200 flex flex-col items-center py-2.5 justify-between shrink-0 z-50 shadow-xs">
        {/* Top Tool Icons */}
        <div className="flex flex-col items-center gap-1.5 w-full px-1">
          <button
            onClick={() => toggleDrawer("add")}
            className={`w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 ${
              activeDrawer === "add" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold" : "hover:bg-slate-200/60 hover:text-slate-800"
            }`}
            title="Add Elements (A)"
          >
            <Plus className="w-4 h-4 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            onClick={() => toggleDrawer("pages")}
            className={`w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 ${
              activeDrawer === "pages" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold" : "hover:bg-slate-200/60 hover:text-slate-800"
            }`}
            title="Pages (P)"
          >
            <FileText className="w-4 h-4 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            onClick={() => toggleDrawer("layers")}
            className={`w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 ${
              activeDrawer === "layers" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold" : "hover:bg-slate-200/60 hover:text-slate-800"
            }`}
            title="Navigator / Layers (Z)"
          >
            <Layers className="w-4 h-4 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            onClick={() => toggleDrawer("components")}
            className={`w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 ${
              activeDrawer === "components" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold" : "hover:bg-slate-200/60 hover:text-slate-800"
            }`}
            title="Master Components Library (Shift+A)"
          >
            <Box className="w-4 h-4 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>

        {/* Bottom System Icons */}
        <div className="flex flex-col items-center gap-1.5 w-full px-1 pt-3 border-t border-slate-200">
          <button className="w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center hover:bg-slate-200/60 hover:text-slate-800 transition-all cursor-pointer border-0 bg-transparent" title="Site Settings">
            <Globe className="w-3.5 h-3.5 lg:w-3.5 lg:h-3.5 2xl:w-4 2xl:h-4" />
          </button>
          <button onClick={() => window.location.href = "/settings"} className="w-8 h-8 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center hover:bg-slate-200/60 hover:text-slate-800 transition-all cursor-pointer border-0 bg-transparent" title="Global Site Settings">
            <Settings className="w-3.5 h-3.5 lg:w-3.5 lg:h-3.5 2xl:w-4 2xl:h-4" />
          </button>
        </div>
      </aside>

      {/* 2. EXPANDABLE FLYOUT DRAWER */}
      {activeDrawer && (
        <aside className="w-80 bg-white text-slate-800 border-r border-slate-200 flex flex-col h-full shrink-0 shadow-xl z-40 animate-in slide-in-from-left duration-150 relative">
          {/* Half-inside, Half-outside Circular Collapse Arrow Toggle Button */}
          <button
            onClick={() => setActiveDrawer(null)}
            className="absolute -right-3.5 top-4 w-7 h-7 bg-white hover:bg-blue-600 text-slate-500 hover:text-white border border-slate-200 rounded-full flex items-center justify-center shadow-md z-50 transition-all cursor-pointer group"
            title="Collapse Sidebar Drawer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Render Active Drawer Component */}
          {getDrawerContent()}
        </aside>
      )}

      {/* 3. QUICK STACK PRESETS POP-OVER */}
      {showQuickStack && (
        <div 
          style={{ top: `${Math.max(10, quickStackPos.top - 48)}px`, left: `${quickStackPos.left}px` }}
          className="fixed w-64 bg-[#1e1e1e] text-white rounded-xl shadow-2xl z-55 p-4 border border-slate-800 flex flex-col gap-4 font-sans select-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Arrow pointing left */}
          <div className="absolute left-[-6px] top-[54px] w-3 h-3 bg-[#1e1e1e] border-l border-b border-slate-800 rotate-45 pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Presets</span>
            <button
              onClick={() => setShowQuickStack(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 cursor-pointer border-0 bg-transparent"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grids Preset Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* 1 Col */}
            <button
              onClick={() => {
                addSection({ desktop: "1x1" });
                setShowQuickStack(false);
              }}
              title="1 Column"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded flex items-center justify-center p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 w-full h-full rounded-[1px]" />
            </button>

            {/* 2 Cols */}
            <button
              onClick={() => {
                addSection({ desktop: "2x1" });
                setShowQuickStack(false);
              }}
              title="2 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-2 gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 3 Cols */}
            <button
              onClick={() => {
                addSection({ desktop: "3x1" });
                setShowQuickStack(false);
              }}
              title="3 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-3 gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 4 Cols */}
            <button
              onClick={() => {
                addSection({ desktop: "4x1" });
                setShowQuickStack(false);
              }}
              title="4 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-4 gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 70-30 */}
            <button
              onClick={() => {
                addSection({ desktop: "70-30" });
                setShowQuickStack(false);
              }}
              title="70/30 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-[7fr_3fr] gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 30-70 */}
            <button
              onClick={() => {
                addSection({ desktop: "30-70" });
                setShowQuickStack(false);
              }}
              title="30/70 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-[3fr_7fr] gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 25-75 */}
            <button
              onClick={() => {
                addSection({ desktop: "25-75" });
                setShowQuickStack(false);
              }}
              title="25/75 Columns"
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-[1fr_3fr] gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-slate-400 h-full rounded-[1px]" />
              <div className="bg-slate-400 h-full rounded-[1px]" />
            </button>

            {/* 2x2 Custom Grid */}
            <button
              onClick={() => {
                addSection({ desktop: `${quickCols}x${quickRows}` });
                setShowQuickStack(false);
              }}
              title={`${quickCols}x${quickRows} Custom Grid`}
              className="w-full h-8 border border-slate-800 bg-[#2d2d2d] rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-1 hover:bg-slate-700 hover:border-slate-600 cursor-pointer text-white"
            >
              <div className="bg-blue-500 rounded-[1px]" />
              <div className="bg-blue-500 rounded-[1px]" />
              <div className="bg-blue-500 rounded-[1px]" />
              <div className="bg-blue-500 rounded-[1px]" />
            </button>
          </div>

          {/* Cols & Rows adjustments */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3">
            {/* Columns Counter */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Columns</span>
              <div className="flex items-center gap-2 bg-[#2d2d2d] px-2 py-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setQuickCols(Math.max(1, quickCols - 1))}
                  className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer border-0 bg-transparent px-1"
                >
                  -
                </button>
                <span className="text-xs font-bold w-4 text-center text-slate-200">{quickCols}</span>
                <button
                  onClick={() => setQuickCols(Math.min(4, quickCols + 1))}
                  className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer border-0 bg-transparent px-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rows Counter */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Rows</span>
              <div className="flex items-center gap-2 bg-[#2d2d2d] px-2 py-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setQuickRows(Math.max(1, quickRows - 1))}
                  className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer border-0 bg-transparent px-1"
                >
                  -
                </button>
                <span className="text-xs font-bold w-4 text-center text-slate-200">{quickRows}</span>
                <button
                  onClick={() => setQuickRows(Math.min(4, quickRows + 1))}
                  className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer border-0 bg-transparent px-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bottom custom info */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px]">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer no-underline"
              onClick={(e) => {
                e.preventDefault();
                addSection({ desktop: `${quickCols}x${quickRows}` });
                setShowQuickStack(false);
              }}
            >
              <span>Apply {quickCols}x{quickRows} Grid</span>
            </a>
            <button
              onClick={() => setShowQuickStack(false)}
              className="text-slate-500 hover:text-slate-300 cursor-pointer border-0 bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
