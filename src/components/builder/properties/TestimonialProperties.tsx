"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface TestimonialPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const TestimonialProperties: React.FC<TestimonialPropertiesProps> = ({ component, handlePropChange }) => {
  const { primaryColor } = useBuilderStore();

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Testimonial</span>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Quote</label>
        <textarea
          value={component.props.quote || ""}
          onChange={(e) => handlePropChange("quote", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-16 resize-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Author Name</label>
        <input
          type="text"
          value={component.props.author || ""}
          onChange={(e) => handlePropChange("author", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Role/Designation</label>
        <input
          type="text"
          value={component.props.role || ""}
          onChange={(e) => handlePropChange("role", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Company</label>
        <input
          type="text"
          value={component.props.company || ""}
          onChange={(e) => handlePropChange("company", e.target.value)}
          className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-500 font-medium">Avatar URL</label>
        <input
          type="text"
          value={component.props.avatar || ""}
          onChange={(e) => handlePropChange("avatar", e.target.value)}
          className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
        />
      </div>
    </div>
  );
};
