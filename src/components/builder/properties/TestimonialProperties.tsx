"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { useBuilderStore } from "@/store/useBuilderStore";

interface TestimonialPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const TestimonialProperties: React.FC<TestimonialPropertiesProps> = ({ component, handlePropChange }) => {
  const { selectedElement } = useBuilderStore();
  const subKey = selectedElement?.subElementKey;

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {subKey ? `Testimonial: ${subKey}` : "Client Testimonial"}
      </span>

      {/* Quote */}
      {(!subKey || subKey === "quote") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quote Text</label>
          <textarea
            value={component.props.quote || ""}
            onChange={(e) => handlePropChange("quote", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-24 resize-none"
          />
        </div>
      )}

      {/* Author Details */}
      {(!subKey || subKey === "author") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Author Name</label>
          <input
            type="text"
            value={component.props.author || ""}
            onChange={(e) => handlePropChange("author", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
          />
        </div>
      )}

      {/* Avatar Image settings */}
      {(!subKey || subKey === "avatar") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Avatar Image Settings</span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avatar Image URL</label>
            <input
              type="text"
              value={component.props.avatar || ""}
              onChange={(e) => handlePropChange("avatar", e.target.value)}
              className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Alt Description Text</label>
            <input
              type="text"
              value={component.props.avatarAlt || ""}
              onChange={(e) => handlePropChange("avatarAlt", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              placeholder="Alt description for avatar image"
            />
          </div>
        </div>
      )}

      {/* Role */}
      {(!subKey || subKey === "role") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Role/Designation</label>
          <input
            type="text"
            value={component.props.role || ""}
            onChange={(e) => handlePropChange("role", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Company */}
      {(!subKey || subKey === "company") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Company</label>
          <input
            type="text"
            value={component.props.company || ""}
            onChange={(e) => handlePropChange("company", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Alignment - parent container only */}
      {!subKey && (
        <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Text Alignment</label>
          <select
            value={component.props.align || "left"}
            onChange={(e) => handlePropChange("align", e.target.value)}
            className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}
    </div>
  );
};
