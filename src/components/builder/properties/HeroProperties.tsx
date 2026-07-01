"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { useBuilderStore } from "@/store/useBuilderStore";

interface HeroPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const HeroProperties: React.FC<HeroPropertiesProps> = ({ component, handlePropChange }) => {
  const { selectedElement } = useBuilderStore();
  const subKey = selectedElement?.subElementKey;

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {subKey ? `Hero: ${subKey}` : "Hero Properties"}
      </span>

      {/* Heading field */}
      {(!subKey || subKey === "heading") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          {/* Tag selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Tag (Level)</label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const tag = `h${num}`;
                const activeTag = component.props.titleTag || "h1";
                const sizeMap: Record<number, string> = {
                  1: "text-5xl",
                  2: "text-4xl",
                  3: "text-3xl",
                  4: "text-2xl",
                  5: "text-xl",
                  6: "text-lg",
                };
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      handlePropChange("titleTag", tag);
                      handlePropChange("titleFontSize", sizeMap[num]);
                    }}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      activeTag === tag
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    H{num}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hero Heading Text</label>
            <textarea
              value={component.props.heading || ""}
              onChange={(e) => handlePropChange("heading", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-20 resize-none font-sans"
              placeholder="Hero Heading text"
            />
          </div>
        </div>
      )}

      {/* Subheading field */}
      {(!subKey || subKey === "subheading") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          {/* Tag selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Tag (Level)</label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
              {["p", "h2", "h3", "h4", "h5", "h6"].map((tag) => {
                const activeTag = component.props.subheadingTag || "p";
                const label = tag.toUpperCase();
                const sizeMap: Record<string, string> = {
                  p: "text-lg",
                  h2: "text-3xl",
                  h3: "text-2xl",
                  h4: "text-xl",
                  h5: "text-lg",
                  h6: "text-base",
                };
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      handlePropChange("subheadingTag", tag);
                      handlePropChange("subtitleFontSize", sizeMap[tag]);
                    }}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      activeTag === tag
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subheading Text</label>
            <textarea
              value={component.props.subheading || ""}
              onChange={(e) => handlePropChange("subheading", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-24 resize-none"
              placeholder="Subheading copy"
            />
          </div>
        </div>
      )}

      {/* CTA Button Text field */}
      {(!subKey || subKey === "buttonText") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link Settings</span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CTA Button Text</label>
            <input
              type="text"
              value={component.props.buttonText || ""}
              onChange={(e) => handlePropChange("buttonText", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              placeholder="Button Label"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">URL Destination</label>
            <input
              type="text"
              value={component.props.buttonUrl || ""}
              onChange={(e) => handlePropChange("buttonUrl", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
              placeholder="#"
            />
          </div>
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={component.props.buttonOpenInNewTab === true}
                onChange={(e) => handlePropChange("buttonOpenInNewTab", e.target.checked)}
                className="w-3.5 h-3.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Open in new tab</span>
            </label>
          </div>
        </div>
      )}

      {/* Alignment - parent container only */}
      {!subKey && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-3 animate-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Text Alignment</label>
            <select
              value={component.props.align || "left"}
              onChange={(e) => handlePropChange("align", e.target.value)}
              className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold cursor-pointer"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Content Spacing (Gap)</label>
            <select
              value={component.props.contentGap || "4"}
              onChange={(e) => handlePropChange("contentGap", e.target.value)}
              className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold cursor-pointer"
            >
              <option value="1">4px (gap-1)</option>
              <option value="2">8px (gap-2)</option>
              <option value="3">12px (gap-3)</option>
              <option value="4">16px (gap-4 - Default)</option>
              <option value="6">24px (gap-6)</option>
              <option value="8">32px (gap-8)</option>
              <option value="12">48px (gap-12)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
