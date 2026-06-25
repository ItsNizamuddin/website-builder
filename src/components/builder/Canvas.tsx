"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { RenderComponent } from "./ComponentRegistry";
import { SectionNode, ComponentNode } from "@/types/builder";
import { getSectionStyles } from "@/utils/styleHelper";
import { Trash2, Move, Plus, ChevronUp, ChevronDown, Layout, Minus, Menu, PanelBottom } from "lucide-react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

// Tailwind grid column mapping for compiler scanning
export const gridCols = {
  desktop: {
    "1-col": "lg:grid-cols-1",
    "2-col": "lg:grid-cols-2",
    "3-col": "lg:grid-cols-3",
    "4-col": "lg:grid-cols-4",
    "70-30": "lg:grid-cols-[7fr_3fr]",
    "30-70": "lg:grid-cols-[3fr_7fr]",
    "25-75": "lg:grid-cols-[1fr_3fr]",
  },
  tablet: {
    "1-col": "md:grid-cols-1",
    "2-col": "md:grid-cols-2",
    "3-col": "md:grid-cols-3",
    "4-col": "md:grid-cols-4",
    "70-30": "md:grid-cols-[7fr_3fr]",
    "30-70": "md:grid-cols-[3fr_7fr]",
    "25-75": "md:grid-cols-[1fr_3fr]",
  },
  mobile: {
    "1-col": "grid-cols-1",
    "2-col": "grid-cols-1",
    "3-col": "grid-cols-1",
    "4-col": "grid-cols-1",
    "70-30": "grid-cols-1",
    "30-70": "grid-cols-1",
    "25-75": "grid-cols-1",
  },
};

// Component Wrapper for toolbar selection and reordering inside a grid cell - revised for light theme
const ComponentWrapper: React.FC<{
  component: ComponentNode;
  sectionId: string;
  index: number;
}> = ({ component, sectionId, index }) => {
  const { selectedElement, setSelectedElement, removeComponent, duplicateComponent, hoveredElementId } = useBuilderStore();

  const isSelected =
    selectedElement?.type === "component" &&
    selectedElement.sectionId === sectionId &&
    selectedElement.elementId === component.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      type: "component",
      sectionId,
      component,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({
      type: "component",
      sectionId,
      elementId: component.id,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      className={`group relative p-2 rounded-xl transition-all duration-150 cursor-pointer ${
        isSelected
          ? "selected-outline"
          : hoveredElementId === component.id
          ? "outline-2 outline-dashed outline-blue-400 outline-offset-[-2px]"
          : "hover-outline"
      } ${isDragging ? "opacity-35" : ""}`}
    >
      {/* Component Action Bar tag overlay (GrapesJS / Craft.js style) */}
      {isSelected && (
        <div className="absolute -top-3.5 left-2 flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-md py-0.5 px-2 z-50 shadow-md border border-blue-500 select-none animate-in fade-in duration-100 uppercase tracking-wide">
          <span>{component.type}</span>
          <div className="w-px h-3 bg-blue-400 mx-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement({ type: "section", sectionId });
            }}
            title="Select Parent Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer smooth-transition"
          >
            <span className="text-[9px] font-bold">↑</span>
          </button>
          <button
            {...listeners}
            {...attributes}
            title="Drag to Reorder"
            className="p-0.5 text-blue-100 hover:text-white cursor-grab active:cursor-grabbing"
          >
            <Move className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(sectionId, component.id);
            }}
            title="Duplicate Component"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer smooth-transition"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeComponent(sectionId, component.id);
            }}
            title="Delete Component"
            className="p-0.5 text-blue-100 hover:text-red-200 cursor-pointer smooth-transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className={isSelected ? "" : "pointer-events-none"}>
        <RenderComponent node={component} mode="edit" />
      </div>
    </div>
  );
};


// Global Component Wrapper for fixed header/footer elements
const GlobalComponentWrapper: React.FC<{
  component: ComponentNode;
  type: "globalHeader" | "globalFooter";
}> = ({ component, type }) => {
  const { selectedElement, setSelectedElement, logoImg, logoText } = useBuilderStore();
  const isSelected = selectedElement?.type === type;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({
      type,
    });
  };

  return (
    <div
      onClick={handleSelect}
      className={`group relative p-2 rounded-xl transition-all duration-150 cursor-pointer ${
        isSelected ? "selected-outline" : "hover-outline"
      }`}
    >
      {/* Component Action Tag overlay - revised for blue accents */}
      <div className="absolute -top-3.5 right-2 hidden group-hover:flex items-center bg-blue-600 border border-blue-500 rounded-md py-0.5 px-2.5 z-40 shadow-md">
        <span className="text-[9px] text-white font-bold uppercase tracking-wider">
          {type === "globalHeader" ? "Global Header" : "Global Footer"}
        </span>
      </div>

      <div className={isSelected ? "" : "pointer-events-none"}>
        <RenderComponent
          node={{
            ...component,
            props: {
              ...component.props,
              globalLogoImg: logoImg,
              globalLogoText: logoText,
            }
          }}
          mode="edit"
        />
      </div>
    </div>
  );
};

// Section Container holding columns and droppable zone - revised for light theme
const SectionContainer: React.FC<{
  section: SectionNode;
  index: number;
}> = ({ section, index }) => {
  const { selectedElement, setSelectedElement, removeSection, duplicateSection, addComponentToSection, present, hoveredElementId } = useBuilderStore();
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${section.id}`,
    data: {
      sectionId: section.id,
    },
  });

  const isSelected =
    selectedElement?.type === "section" &&
    selectedElement.sectionId === section.id &&
    !selectedElement.elementId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "section",
      section,
      index,
    },
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({
      type: "section",
      sectionId: section.id,
    });
  };

  const moveSectionUpDown = (direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const store = useBuilderStore.getState();
    const otherIndex = direction === "up" ? index - 1 : index + 1;
    if (otherIndex >= 0 && otherIndex < present.sections.length) {
      const otherSection = present.sections[otherIndex];
      store.reorderSections(section.id, otherSection.id);
    }
  };

  const desktopClass = gridCols.desktop[section.layout.desktop as keyof typeof gridCols.desktop] || "lg:grid-cols-1";
  const tabletClass = gridCols.tablet[section.layout.tablet as keyof typeof gridCols.tablet] || "md:grid-cols-1";
  const mobileClass = gridCols.mobile[section.layout.mobile as keyof typeof gridCols.mobile] || "grid-cols-1";

  const getColCount = (layout: string) => {
    if (layout === "1-col") return 1;
    if (layout === "2-col" || layout === "70-30" || layout === "30-70" || layout === "25-75") return 2;
    if (layout === "3-col") return 3;
    if (layout === "4-col") return 4;
    return 1;
  };

  const currentCols = getColCount(section.layout.desktop);
  const emptySlotsCount = Math.max(0, currentCols - section.children.length);

  const { outerClasses, outerInlineStyle, innerClasses } = getSectionStyles(section.style);

  return (
    <div
      ref={setNodeRef}
      style={{ ...sortableStyle, ...outerInlineStyle }}
      onClick={handleSelect}
      className={`group/section relative smooth-transition shadow-sm ${outerClasses} ${
        isSelected
          ? "selected-outline"
          : hoveredElementId === section.id
          ? "outline-2 outline-dashed outline-blue-400 outline-offset-[-2px]"
          : "hover:border-slate-250"
      } ${isDragging ? "opacity-35" : ""}`}
    >
      {/* Section Toolbar Menu (GrapesJS / Craft.js style) */}
      {isSelected && (
        <div className="absolute -top-3.5 left-4 flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-md py-0.5 px-2.5 z-50 shadow-md border border-blue-500 select-none animate-in fade-in duration-100 uppercase tracking-wide">
          <span>Section</span>
          <div className="w-px h-3 bg-blue-400 mx-1" />
          <button
            {...listeners}
            {...attributes}
            title="Drag Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-grab active:cursor-grabbing"
          >
            <Move className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => moveSectionUpDown("up", e)}
            disabled={index === 0}
            title="Move Up"
            className="p-0.5 text-blue-100 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => moveSectionUpDown("down", e)}
            disabled={index === present.sections.length - 1}
            title="Move Down"
            className="p-0.5 text-blue-100 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateSection(section.id);
            }}
            title="Duplicate Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer smooth-transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeSection(section.id);
            }}
            title="Delete Section"
            className="p-0.5 text-blue-100 hover:text-red-200 cursor-pointer smooth-transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid container with droppable hook */}
      <div ref={setDroppableRef} className={`min-h-[140px] flex flex-col justify-center ${innerClasses}`}>
        <div className={`grid gap-6 ${desktopClass} ${tabletClass} ${mobileClass}`}>
          <SortableContext
            items={section.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.children.map((child, idx) => (
              <ComponentWrapper
                key={child.id}
                component={child}
                sectionId={section.id}
                index={idx}
              />
            ))}
          </SortableContext>

          {/* Dotted empty slot grids - revised for light theme */}
          {Array.from({ length: emptySlotsCount }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="border border-dashed border-slate-300 hover:border-blue-500/30 bg-slate-50 hover:bg-blue-50/10 rounded-xl min-h-[90px] flex items-center justify-center group/slot smooth-transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElement({ type: "section", sectionId: section.id });
                addComponentToSection(section.id, "heading");
              }}
            >
              <button className="flex flex-col items-center gap-1 text-[10px] text-slate-500 group-hover/slot:text-blue-600 smooth-transition font-medium">
                <Plus className="w-4 h-4 text-slate-400 group-hover/slot:text-blue-500 group-hover/slot:scale-110 smooth-transition" />
                <span>Add component here</span>
              </button>
            </div>
          ))}
        </div>

        {/* Global Component Appender for Section */}
        {section.children.length === 0 && emptySlotsCount === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
            <span className="text-xs text-slate-500 font-semibold">Empty Grid Area</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addComponentToSection(section.id, "heading");
              }}
              className="mt-3 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 hover:text-blue-500 text-xs font-bold rounded-lg flex items-center gap-1.5 smooth-transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert First Component</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
    leftSidebarCollapsed,
    selectedElement,
    setSelectedElement,
  } = useBuilderStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleZoomToFit = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 96; // 96px for margins/padding spacing
      const targetWidth = activeDevice === "desktop" ? 1200 : activeDevice === "tablet" ? 768 : 375;
      const fitZoom = Math.min(100, Math.floor((containerWidth / targetWidth) * 100));
      setZoom(Math.max(25, fitZoom));
    }
  };

  const handleZoomOut = () => {
    setZoom(Math.max(25, zoom - 10));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(150, zoom + 10));
  };

  React.useEffect(() => {
    // Auto-fit on active device change, initial mounting, or left sidebar toggle
    handleZoomToFit();

    // The left sidebar sliding transition takes 300ms.
    // Run zoom-to-fit calculations at short intervals to animate the scale smoothly.
    const interval = setInterval(() => {
      handleZoomToFit();
    }, 30);

    const timer = setTimeout(() => {
      clearInterval(interval);
      handleZoomToFit();
    }, 350);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [activeDevice, leftSidebarCollapsed]);

  // Window resize observer to recalculate zoom to fit if user scales window
  React.useEffect(() => {
    const handleResize = () => {
      handleZoomToFit();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeDevice]);

  const targetWidth = activeDevice === "desktop" ? 1200 : activeDevice === "tablet" ? 768 : 375;

  return (
    <main className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-100 relative">
      {/* Zoom / Scale Toolbar panel - matching SkillDeck aesthetic */}
      <div className="w-full py-2 bg-white border-b border-slate-200/80 flex justify-center items-center shrink-0 z-30 shadow-sm select-none gap-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Canvas Zoom</span>
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
          <button 
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 rounded-lg smooth-transition cursor-pointer"
            title="Zoom Out (-10%)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-slate-700 w-12 text-center">{zoom}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 rounded-lg smooth-transition cursor-pointer"
            title="Zoom In (+10%)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button 
            onClick={handleZoomToFit}
            className="px-2 py-0.5 hover:bg-blue-50 text-[10px] font-bold text-blue-600 hover:text-blue-500 rounded-lg smooth-transition border border-blue-200/40 cursor-pointer"
          >
            Fit Screen
          </button>
        </div>
      </div>

      {/* Main scroll container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-8 flex flex-col items-center min-h-0 canvas-grid"
      >
        {selectedElement && (selectedElement.type === "globalHeader" || selectedElement.type === "globalFooter") && (
          <div className="w-full max-w-4xl bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 duration-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                {selectedElement.type === "globalHeader" ? <Menu className="w-4 h-4" /> : <PanelBottom className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-800">
                  Editing {selectedElement.type === "globalHeader" ? "Global Navigation Bar" : "Global Footer"}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                  This component is shared across all pages. Any customizations made here will update dynamically.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-300 text-xs font-bold rounded-xl smooth-transition shadow-xs cursor-pointer"
            >
              Back to Page Editor
            </button>
          </div>
        )}

        <div
          className="relative shrink-0"
          style={{
            width: `${targetWidth * (zoom / 100)}px`,
          }}
        >
          <div 
            className="shadow-xl rounded-3xl bg-white p-2 flex flex-col gap-8 transition-all duration-150 overflow-hidden"
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: "top left",
              width: `${targetWidth}px`,
              minHeight: `${85 / (zoom / 100)}vh`,
              '--color-primary': primaryColor,
              '--color-secondary': secondaryColor,
              '--color-gradient-start': gradientStart,
              '--color-gradient-end': gradientEnd,
            } as React.CSSProperties}
          >
            {selectedElement?.type === "globalHeader" ? (
              <div className="flex-1 flex flex-col justify-center py-12">
                <GlobalComponentWrapper component={globalHeader!} type="globalHeader" />
              </div>
            ) : selectedElement?.type === "globalFooter" ? (
              <div className="flex-1 flex flex-col justify-center py-12">
                <GlobalComponentWrapper component={globalFooter!} type="globalFooter" />
              </div>
            ) : (
              <>
                {present.sections.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-24 bg-white border border-dashed border-slate-300 rounded-2xl p-8 shadow-sm">
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
