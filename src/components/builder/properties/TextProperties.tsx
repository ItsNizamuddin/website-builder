"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";

interface TextPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ component, handlePropChange }) => {
  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paragraph Settings</span>

      {/* Copy Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Text Content</label>
        <textarea
          value={component.props.text || ""}
          onChange={(e) => handlePropChange("text", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-32 resize-y font-sans leading-relaxed"
          placeholder="Paragraph text copy..."
        />
      </div>
    </div>
  );
};
