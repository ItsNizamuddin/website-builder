"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { RenderComponent } from "../ComponentRegistry";
import { ComponentNode } from "@/types/builder";
import { Move, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ComponentWrapperProps {
  component: ComponentNode;
  sectionId: string;
  index: number;
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({ component, sectionId, index }) => {
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
            ? "outline-2 outline-dashed outline-blue-400 -outline-offset-2"
            : "hover-outline"
      } ${isDragging ? "opacity-35" : ""}`}
    >
      {/* Component Action Bar tag overlay */}
      {isSelected && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-md py-0.5 px-2 z-50 shadow-md border border-blue-500 select-none animate-in fade-in duration-100 uppercase tracking-wide">
          <span>{component.type}</span>
          <div className="w-px h-3 bg-blue-400 mx-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement({ type: "section", sectionId });
            }}
            title="Select Parent Section"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer border-0 bg-transparent"
          >
            <span className="text-[9px] font-bold">↑</span>
          </button>
          <button
            {...listeners}
            {...attributes}
            title="Drag to Reorder"
            className="p-0.5 text-blue-100 hover:text-white cursor-grab active:cursor-grabbing border-0 bg-transparent"
          >
            <Move className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(sectionId, component.id);
            }}
            title="Duplicate Component"
            className="p-0.5 text-blue-100 hover:text-white cursor-pointer border-0 bg-transparent"
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
            className="p-0.5 text-blue-100 hover:text-red-200 cursor-pointer border-0 bg-transparent"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className={isSelected ? "" : "pointer-events-none"}>
        <RenderComponent node={component} mode="edit" sectionId={sectionId} />
      </div>
    </div>
  );
};
