"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { SectionNode } from "@/types/builder";
import { getSectionStyles } from "@/utils/styleHelper";
import { Trash2, Move, Plus, ChevronUp, ChevronDown, BookmarkPlus, Link2, Unlink } from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { ComponentWrapper } from "./ComponentWrapper";

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

interface SectionContainerProps {
  section: SectionNode;
  index: number;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ section, index }) => {
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
            ? "outline-2 outline-dashed outline-blue-400 -outline-offset-2"
            : "hover:border-slate-250"
      } ${isDragging ? "opacity-35" : ""}`}
    >
      {/* Section Toolbar Menu */}
      {isSelected && (
        <div className="absolute top-2 left-3 flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-md py-0.5 px-2.5 z-50 shadow-md border border-blue-500 select-none animate-in fade-in duration-100 uppercase tracking-wide">
          <span>Section</span>
          <div className="w-px h-3 bg-blue-400 mx-1" />
          <button
            {...listeners}
            {...attributes}
            title="Drag Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-grab active:cursor-grabbing border-0 bg-transparent"
          >
            <Move className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => moveSectionUpDown("up", e)}
            disabled={index === 0}
            title="Move Up"
            className="p-0.5 text-blue-100 hover:text-white disabled:opacity-30 disabled:pointer-events-none border-0 bg-transparent"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => moveSectionUpDown("down", e)}
            disabled={index === present.sections.length - 1}
            title="Move Down"
            className="p-0.5 text-blue-100 hover:text-white disabled:opacity-30 disabled:pointer-events-none border-0 bg-transparent"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateSection(section.id);
            }}
            title="Duplicate Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer border-0 bg-transparent"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const blockName = prompt("Enter a name for this Reusable Component Block:", "Hero Component Block");
              if (blockName) {
                useBuilderStore.getState().saveSectionAsGlobalBlock(section.id, blockName);
                alert(`Saved "${blockName}" to your Component Library!`);
              }
            }}
            title="Save as Reusable Component Block"
            className="p-0.5 text-amber-300 hover:text-amber-100 cursor-pointer smooth-transition flex items-center gap-1 bg-amber-500/20 px-1.5 rounded border-0"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span className="text-[8px] font-extrabold uppercase">Save Block</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeSection(section.id);
            }}
            title="Delete Section"
            className="p-0.5 text-blue-100 hover:text-red-200 cursor-pointer border-0 bg-transparent"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Linked Block Indicator Badge */}
      {section.globalBlockId && (
        <div className="absolute top-2 right-4 flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 rounded-full px-3 py-1 text-[10px] font-extrabold shadow-md z-30 animate-in fade-in select-none">
          <Link2 className="w-3 h-3 text-emerald-400" />
          <span>GLOBAL COMPONENT LINKED</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              useBuilderStore.getState().unlinkGlobalBlockSection(section.id);
            }}
            title="Unlink from Global Block (Make Independent)"
            className="ml-1 text-emerald-400 hover:text-white flex items-center gap-0.5 bg-emerald-900/60 px-2 py-0.5 rounded-full hover:bg-emerald-800 border-0"
          >
            <Unlink className="w-2.5 h-2.5" />
            <span className="text-[8px]">Detach</span>
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

          {/* Dotted empty slot grids */}
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
              <button className="flex flex-col items-center gap-1 text-[10px] text-slate-500 group-hover/slot:text-blue-600 smooth-transition font-medium border-0 bg-transparent p-0">
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
              className="mt-3 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 hover:text-blue-500 text-xs font-bold rounded-lg flex items-center gap-1.5 smooth-transition shadow-sm cursor-pointer"
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
