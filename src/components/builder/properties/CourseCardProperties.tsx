"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { ColorPicker } from "./ColorPicker";
import { ToggleSwitch } from "./ToggleSwitch";
import { useBuilderStore } from "@/store/useBuilderStore";

interface CourseCardPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const CourseCardProperties: React.FC<CourseCardPropertiesProps> = ({ component, handlePropChange }) => {
  const { primaryColor } = useBuilderStore();

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Course Details</span>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Course Title</label>
        <input
          type="text"
          value={component.props.title || ""}
          onChange={(e) => handlePropChange("title", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Instructor</label>
        <input
          type="text"
          value={component.props.instructor || ""}
          onChange={(e) => handlePropChange("instructor", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex-row flex gap-2">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[10px] text-slate-500 font-medium">Price</label>
          <input
            type="text"
            value={component.props.price || ""}
            onChange={(e) => handlePropChange("price", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[10px] text-slate-500 font-medium">Duration</label>
          <input
            type="text"
            value={component.props.duration || ""}
            onChange={(e) => handlePropChange("duration", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Badge</label>
        <input
          type="text"
          value={component.props.badge || ""}
          onChange={(e) => handlePropChange("badge", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Course Image URL</label>
        <input
          type="text"
          value={component.props.image || ""}
          onChange={(e) => handlePropChange("image", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Button Call to Action</label>
        <input
          type="text"
          value={component.props.buttonText || ""}
          onChange={(e) => handlePropChange("buttonText", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Link Destination URL</label>
        <input
          type="text"
          value={component.props.url || ""}
          onChange={(e) => handlePropChange("url", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
          placeholder="#"
        />
      </div>
    </div>
  );
};
