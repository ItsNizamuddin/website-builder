"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import {
  Plus, Layers, Globe, Settings, FileText, Box, ChevronLeft
} from "lucide-react";

import { AddDrawer } from "./left-sidebar/AddDrawer";
import { PagesDrawer } from "./left-sidebar/PagesDrawer";
import { LayersDrawer } from "./left-sidebar/LayersDrawer";
import { ComponentsDrawer } from "./left-sidebar/ComponentsDrawer";

export const SidebarLeft: React.FC = () => {
  const {
    activeDrawer,
    setActiveDrawer,
  } = useBuilderStore();

  const toggleDrawer = (drawer: "add" | "pages" | "layers" | "components") => {
    setActiveDrawer(activeDrawer === drawer ? null : drawer);
  };

  const getDrawerContent = () => {
    switch (activeDrawer) {
      case "add":
        return <AddDrawer />;
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
    </div>
  );
};
