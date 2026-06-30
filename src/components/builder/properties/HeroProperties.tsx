"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface HeroPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const HeroProperties: React.FC<HeroPropertiesProps> = ({ component, handlePropChange }) => {
  const { primaryColor, gradientStart, gradientEnd } = useBuilderStore();

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hero Properties</span>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Hero Heading</label>
        <input
          type="text"
          value={component.props.heading || ""}
          onChange={(e) => handlePropChange("heading", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Subheading</label>
        <textarea
          value={component.props.subheading || ""}
          onChange={(e) => handlePropChange("subheading", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-16 resize-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">CTA Button Text</label>
        <input
          type="text"
          value={component.props.buttonText || ""}
          onChange={(e) => handlePropChange("buttonText", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">CTA Link URL</label>
        <input
          type="text"
          value={component.props.buttonUrl || ""}
          onChange={(e) => handlePropChange("buttonUrl", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
        />
      </div>

    </div>
  );
};
