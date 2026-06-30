"use client";

import React, { useRef, useEffect } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Minus } from "lucide-react";

import { GlobalComponentWrapper } from "./canvas/GlobalComponentWrapper";
import { SectionContainer, gridCols } from "./canvas/SectionContainer";

export { gridCols };

export const Canvas: React.FC = () => {
  const {
    present,
    activeDevice,
    zoom,
    setZoom,
    globalHeader,
    globalFooter,
    primaryColor,
    secondaryColor,
    gradientStart,
    gradientEnd,
    sectionGap,
    leftSidebarCollapsed,
    activeDrawer,
    selectedElement,
    setSelectedElement,
    toggleShowHeader,
    toggleShowFooter,
  } = useBuilderStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomToFit = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32;
      const targetWidth = activeDevice === "desktop" ? 1200 : activeDevice === "tablet" ? 768 : 375;
      const fitZoom = Math.min(100, Math.floor((containerWidth / targetWidth) * 100));
      setZoom(Math.max(25, fitZoom));
    }
  };

  const handleZoomOut = () => {
    setZoom(Math.max(25, zoom - 10));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 10));
  };

  useEffect(() => {
    handleZoomToFit();

    // Pulse fit calculations during CSS transitions to ensure 60fps smooth scaling
    const startTime = Date.now();
    const timer = setInterval(() => {
      handleZoomToFit();
      if (Date.now() - startTime > 300) {
        clearInterval(timer);
      }
    }, 16);

    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      handleZoomToFit();
    });
    observer.observe(containerRef.current);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [activeDevice, selectedElement, leftSidebarCollapsed, activeDrawer]);

  const targetWidth = activeDevice === "desktop" ? 1200 : activeDevice === "tablet" ? 768 : 375;

  return (
    <main className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-100/90 relative font-sans">
      {/* Webflow-Style Studio Top Canvas Bar */}
      <div className="w-full h-10 bg-white border-b border-slate-200 px-4 flex justify-between items-center shrink-0 z-30 shadow-xs select-none">
        {/* Left: Active Element Hierarchy Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Body</span>
          {selectedElement ? (
            <>
              <span className="text-slate-300">›</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 capitalize">
                {selectedElement.type}
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-300">›</span>
              <span className="text-slate-700 font-bold">Canvas View</span>
            </>
          )}
        </div>

        {/* Center: Current Pixel Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1.5">
            <span>{activeDevice === "desktop" ? "1200px" : activeDevice === "tablet" ? "768px" : "375px"}</span>
            <span className="text-[9px] text-slate-400 font-sans uppercase font-bold">({activeDevice})</span>
          </div>

          {/* Canvas Optional Header/Footer Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-extrabold select-none">
            <button
              onClick={toggleShowHeader}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 border-0 ${
                present.showHeader !== false
                  ? "bg-white text-blue-600 shadow-2xs border border-slate-200/60 font-bold"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Toggle Global Header on Canvas"
            >
              <span>Header</span>
              <span className={`w-1.5 h-1.5 rounded-full ${present.showHeader !== false ? "bg-blue-600" : "bg-slate-300"}`} />
            </button>
            <button
              onClick={toggleShowFooter}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 border-0 ${
                present.showFooter !== false
                  ? "bg-white text-blue-600 shadow-2xs border border-slate-200/60 font-bold"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Toggle Global Footer on Canvas"
            >
              <span>Footer</span>
              <span className={`w-1.5 h-1.5 rounded-full ${present.showFooter !== false ? "bg-blue-600" : "bg-slate-300"}`} />
            </button>
          </div>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-lg px-1.5 py-0.5">
            <button
              onClick={handleZoomOut}
              className="p-0.5 hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 rounded smooth-transition cursor-pointer border-0 bg-transparent"
              title="Zoom Out (-10%)"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 w-9 text-center font-mono">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-0.5 hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 rounded smooth-transition cursor-pointer border-0 bg-transparent"
              title="Zoom In (+10%)"
            >
              <Plus className="w-3 h-3" />
            </button>
            <div className="w-px h-3 bg-slate-200 mx-0.5" />
            <button
              onClick={handleZoomToFit}
              className="px-1.5 py-0.5 bg-white hover:bg-blue-50 text-[9px] font-extrabold text-blue-600 rounded smooth-transition border border-slate-200 cursor-pointer shadow-2xs"
            >
              Fit Screen
            </button>
          </div>
        </div>
      </div>

      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto py-6 px-4 flex flex-col items-center min-h-0 canvas-grid"
      >
        <div
          className="relative shrink-0 flex justify-center"
          style={{
            width: `${targetWidth}px`,
          }}
        >
          <div
            className={`shadow-2xl border border-slate-200/80 bg-white p-0 flex flex-col overflow-hidden rounded-2xl ${
              sectionGap === "4" ? "gap-4" : sectionGap === "12" ? "gap-12" : sectionGap === "16" ? "gap-16" : "gap-8"
            }`}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              width: `${targetWidth}px`,
              minHeight: "85vh",
              '--color-primary': primaryColor,
              '--color-secondary': secondaryColor,
              '--color-gradient-start': gradientStart,
              '--color-gradient-end': gradientEnd,
            } as React.CSSProperties}
          >
            {/* Render Global Navigation Header if enabled */}
            {globalHeader && present.showHeader !== false && (
              <div className="w-full shrink-0 z-30">
                <GlobalComponentWrapper component={globalHeader} type="globalHeader" />
              </div>
            )}

            {/* Main Page Sections */}
            <div className={`flex-1 flex flex-col ${
              sectionGap === "4" ? "gap-4" : sectionGap === "12" ? "gap-12" : sectionGap === "16" ? "gap-16" : "gap-8"
            }`}>
              {present.sections.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-24 bg-white border border-dashed border-slate-300 rounded-2xl p-8 shadow-sm my-4">
                  <span className="text-sm font-semibold text-slate-700">Your visual canvas is empty</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-[280px] leading-relaxed">
                    Add a layout section from the left side panel to start arranging components in grids.
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={present.sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {present.sections.map((section, idx) => (
                    <SectionContainer
                      key={section.id}
                      section={section}
                      index={idx}
                    />
                  ))}
                </SortableContext>
              )}
            </div>

            {/* Render Global Footer if enabled */}
            {globalFooter && present.showFooter !== false && (
              <div className="w-full shrink-0 z-30 mt-auto">
                <GlobalComponentWrapper component={globalFooter} type="globalFooter" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
