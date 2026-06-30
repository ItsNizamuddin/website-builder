"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";

interface HeadingPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const HeadingProperties: React.FC<HeadingPropertiesProps> = ({ component, handlePropChange }) => {
  const currentLevel = component.props.level || "h2";
  const numVal = parseInt(currentLevel.replace("h", "")) || 2;

  const handleLevelChange = (num: number) => {
    handlePropChange("level", `h${num}`);
    // Adjust default font size based on level
    const sizeMap: Record<number, string> = {
      1: "text-5xl",
      2: "text-3xl",
      3: "text-2xl",
      4: "text-xl",
      5: "text-lg",
      6: "text-base",
    };
    handlePropChange("fontSize", sizeMap[num]);
  };

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Heading Settings</span>

      {/* Heading Level (Tag) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Tag (Level)</label>
        <div className="grid grid-cols-6 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleLevelChange(num)}
              className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                numVal === num
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              }`}
            >
              H{num}
            </button>
          ))}
        </div>
      </div>

      {/* Copy Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Text Content</label>
        <textarea
          value={component.props.text || ""}
          onChange={(e) => handlePropChange("text", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-20 resize-none font-sans"
          placeholder="Heading text copy"
        />
      </div>
    </div>
  );
};
