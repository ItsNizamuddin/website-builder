"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { ToggleSwitch } from "./ToggleSwitch";

interface ButtonPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const ButtonProperties: React.FC<ButtonPropertiesProps> = ({ component, handlePropChange }) => {
  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Link Settings</span>

      {/* Button Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Button Text</label>
        <input
          type="text"
          value={component.props.text || ""}
          onChange={(e) => handlePropChange("text", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          placeholder="Button Label"
        />
      </div>

      {/* Link URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">URL Destination</label>
        <input
          type="text"
          value={component.props.url || ""}
          onChange={(e) => handlePropChange("url", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
          placeholder="#"
        />
      </div>

      {/* Toggle Open in New Tab */}
      <div className="pt-2 border-t border-slate-100">
        <ToggleSwitch
          checked={component.props.openInNewTab === true}
          onChange={(val) => handlePropChange("openInNewTab", val)}
          label="Open in new tab"
          id="btnOpenInNewTab"
        />
      </div>
    </div>
  );
};
