"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { RenderComponent } from "../ComponentRegistry";
import { ComponentNode } from "@/types/builder";

interface GlobalComponentWrapperProps {
  component: ComponentNode;
  type: "globalHeader" | "globalFooter";
}

export const GlobalComponentWrapper: React.FC<GlobalComponentWrapperProps> = ({ component, type }) => {
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
        type === "globalHeader" ? "z-50" : "z-10"
      } ${isSelected ? "selected-outline" : "hover-outline"}`}
    >
      {/* Component Action Tag overlay */}
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
