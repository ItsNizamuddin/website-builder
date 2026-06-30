"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";

interface ImagePropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({ component, handlePropChange }) => {
  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Image Settings</span>

      {/* Image Source URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Image Source URL</label>
        <input
          type="text"
          value={component.props.src || ""}
          onChange={(e) => handlePropChange("src", e.target.value)}
          className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
          placeholder="https://images.unsplash.com/photo-..."
        />
      </div>

      {/* Aspect Ratio / Sizing */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Sizing / Layout</label>
        <select
          value={component.props.aspectRatio || "aspect-video"}
          onChange={(e) => handlePropChange("aspectRatio", e.target.value)}
          className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
        >
          <option value="aspect-auto">Aspect Auto (Natural)</option>
          <option value="aspect-square">Square (1:1)</option>
          <option value="aspect-video">Video widescreen (16:9)</option>
          <option value="aspect-4/3">Standard photo (4:3)</option>
          <option value="h-32 w-32 rounded-full">Circle Thumbnail</option>
        </select>
      </div>

      {/* Alt Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Alt Description Text</label>
        <input
          type="text"
          value={component.props.alt || ""}
          onChange={(e) => handlePropChange("alt", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          placeholder="Use alt text from asset"
        />
      </div>
    </div>
  );
};
