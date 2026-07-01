"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface CommonStylePropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const CommonStyleProperties: React.FC<CommonStylePropertiesProps> = ({ component, handlePropChange }) => {
  const { selectedElement } = useBuilderStore();
  const subKey = selectedElement?.subElementKey;

  const isComposite = ["hero", "testimonial", "faq", "courseCard", "navbar", "footer"].includes(component.type);
  const hasTypography = isComposite
    ? !!subKey
    : ["heading", "text", "button"].includes(component.type);

  // Resolve target prop keys based on sub-element selection
  const getSubPropKey = (baseKey: string) => {
    if (!subKey) return baseKey;

    if (baseKey === "fontWeight") {
      if (subKey === "heading" || subKey === "title") return "titleFontWeight";
      if (subKey === "subheading") return "subtitleFontWeight";
      if (subKey === "quote") return "quoteFontWeight";
      if (subKey === "author") return "authorFontWeight";
      if (subKey === "question") return "questionFontWeight";
      if (subKey === "answer") return "answerFontWeight";
      if (subKey === "duration" || subKey === "instructor") return "detailsFontWeight";
    }

    if (baseKey === "lineHeight") {
      if (subKey === "heading" || subKey === "title") return "titleLineHeight";
      if (subKey === "subheading") return "subtitleLineHeight";
      if (subKey === "quote") return "quoteLineHeight";
      if (subKey === "author") return "authorLineHeight";
      if (subKey === "question") return "questionLineHeight";
      if (subKey === "answer") return "answerLineHeight";
      if (subKey === "duration" || subKey === "instructor") return "detailsLineHeight";
    }

    if (baseKey === "align") {
      if (subKey === "heading" || subKey === "title") return "titleAlign";
      if (subKey === "subheading") return "subtitleAlign";
      if (subKey === "quote") return "quoteAlign";
      if (subKey === "author") return "authorAlign";
      if (subKey === "question") return "questionAlign";
      if (subKey === "answer") return "answerAlign";
      if (subKey === "duration" || subKey === "instructor") return "detailsAlign";
    }

    if (baseKey === "textDecoration") {
      if (subKey === "heading" || subKey === "title") return "titleDecoration";
      if (subKey === "subheading") return "subtitleDecoration";
      if (subKey === "quote") return "quoteDecoration";
      if (subKey === "author") return "authorDecoration";
      if (subKey === "question") return "questionDecoration";
      if (subKey === "answer") return "answerDecoration";
      if (subKey === "duration" || subKey === "instructor") return "detailsDecoration";
    }

    return baseKey;
  };

  // Resolve target default values for sub-element styling keys
  const getSubPropVal = (baseKey: string, fallback: string) => {
    const resolvedKey = getSubPropKey(baseKey);
    return component.props[resolvedKey] || fallback;
  };

  // Helper to map pixel or auto value to corresponding Tailwind spacing class
  const getTailwindClass = (prefix: string, rawVal: string) => {
    if (!rawVal || rawVal === "0") return `${prefix}-0`;
    if (rawVal.toLowerCase() === "auto") return `${prefix}-auto`;
    const num = parseInt(rawVal);
    if (isNaN(num)) return `${prefix}-0`;
    
    // Map standard spacing steps
    if (num <= 2) return `${prefix}-0.5`;
    if (num <= 5) return `${prefix}-1`;
    if (num <= 9) return `${prefix}-2`;
    if (num <= 13) return `${prefix}-3`;
    if (num <= 18) return `${prefix}-4`;
    if (num <= 22) return `${prefix}-5`;
    if (num <= 28) return `${prefix}-6`;
    if (num <= 36) return `${prefix}-8`;
    if (num <= 44) return `${prefix}-10`;
    if (num <= 56) return `${prefix}-12`;
    return `${prefix}-16`; // 64px or above
  };

  const updateSpacing = (key: string, rawVal: string, prefix: string) => {
    handlePropChange(`${key}Raw`, rawVal);
    const twClass = getTailwindClass(prefix, rawVal);
    handlePropChange(key, twClass);
  };

  return (
    <div className="flex flex-col gap-5 text-left animate-in fade-in duration-150 font-sans select-none px-1">
      
      {/* 1. LAYOUT & DIMENSIONS */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Layout &amp; Size</span>
        
        <div className="flex flex-col gap-3 pt-1">
          {/* Width Row */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Width</span>
            <select
              value={component.props.width || "w-full"}
              onChange={(e) => handlePropChange("width", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="w-auto">w-auto</option>
              <option value="w-full">w-full (100%)</option>
              <option value="max-w-xs">max-w-xs (320px)</option>
              <option value="max-w-md">max-w-md (448px)</option>
              <option value="max-w-xl">max-w-xl (576px)</option>
              <option value="max-w-3xl">max-w-3xl (768px)</option>
              <option value="max-w-5xl">max-w-5xl (1024px)</option>
            </select>
          </div>
          
          {/* Height Row */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Height</span>
            <select
              value={component.props.height || "h-auto"}
              onChange={(e) => handlePropChange("height", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="h-auto">h-auto</option>
              <option value="h-full">h-full (100%)</option>
              <option value="min-h-[100px]">min-100px</option>
              <option value="min-h-[200px]">min-200px</option>
              <option value="min-h-[300px]">min-300px</option>
              <option value="min-h-[400px]">min-400px</option>
            </select>
          </div>

          {/* Align Horizontal (X) Row */}
          {!isComposite && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Align X</span>
              <div className="w-44 grid grid-cols-4 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                {[
                  { val: "left", label: "Left" },
                  { val: "center", label: "Center" },
                  { val: "right", label: "Right" },
                  { val: "stretch", label: "Stretch" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handlePropChange("alignX", item.val)}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      (component.props.alignX || "left") === item.val
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Align Vertical (Y) Row */}
          {!isComposite && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Align Y</span>
              <div className="w-44 grid grid-cols-4 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                {[
                  { val: "top", label: "Top" },
                  { val: "center", label: "Center" },
                  { val: "bottom", label: "Bottom" },
                  { val: "stretch", label: "Stretch" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handlePropChange("alignY", item.val)}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      (component.props.alignY || "top") === item.val
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Child Gap Row */}
          {!isComposite && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Gap</span>
              <select
                value={component.props.gap || ""}
                onChange={(e) => handlePropChange("gap", e.target.value)}
                className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
              >
                <option value="">No Gap</option>
                <option value="1">4px (gap-1)</option>
                <option value="2">8px (gap-2)</option>
                <option value="3">12px (gap-3)</option>
                <option value="4">16px (gap-4)</option>
                <option value="6">24px (gap-6)</option>
                <option value="8">32px (gap-8)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. SPACING BOX MODEL */}
      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spacing (Box Model)</span>
        
        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center font-mono text-[9px] text-slate-400 shadow-2xs">
          {/* MARGIN BOX */}
          <div className="w-full border border-dashed border-slate-350 rounded-xl p-2 bg-slate-100/50 flex flex-col relative">
            <span className="absolute top-1 left-1.5 font-bold uppercase tracking-wider text-[8px] text-slate-400">Margin</span>
            
            {/* Margin Top */}
            <div className="flex justify-center mb-1">
              <input
                type="text"
                value={component.props.marginTopRaw || "0"}
                onChange={(e) => updateSpacing("marginTop", e.target.value, "mt")}
                className="w-10 bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                placeholder="0"
                title="Margin Top (px)"
              />
            </div>

            <div className="flex items-center justify-between gap-1 w-full my-1">
              {/* Margin Left */}
              <input
                type="text"
                value={component.props.marginLeftRaw || "0"}
                onChange={(e) => updateSpacing("marginLeft", e.target.value, "ml")}
                className="w-10 bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                placeholder="0"
                title="Margin Left (px or auto)"
              />

              {/* PADDING BOX */}
              <div className="flex-1 max-w-[140px] border border-solid border-slate-200 rounded-lg p-2.5 bg-white flex flex-col relative shadow-2xs">
                <span className="absolute top-1 left-1.5 font-bold uppercase tracking-wider text-[8px] text-slate-400">Padding</span>
                
                {/* Padding Top */}
                <div className="flex justify-center mb-1">
                  <input
                    type="text"
                    value={component.props.paddingTopRaw || "0"}
                    onChange={(e) => updateSpacing("paddingTop", e.target.value, "pt")}
                    className="w-9 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                    placeholder="0"
                    title="Padding Top (px)"
                  />
                </div>

                <div className="flex items-center justify-between gap-1 w-full my-1">
                  {/* Padding Left */}
                  <input
                    type="text"
                    value={component.props.paddingLeftRaw || "0"}
                    onChange={(e) => updateSpacing("paddingLeft", e.target.value, "pl")}
                    className="w-9 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                    placeholder="0"
                    title="Padding Left (px)"
                  />

                  {/* Inner Box Icon */}
                  <div className="w-5 h-4 bg-slate-100 rounded-sm border border-slate-200/80 shrink-0" />

                  {/* Padding Right */}
                  <input
                    type="text"
                    value={component.props.paddingRightRaw || "0"}
                    onChange={(e) => updateSpacing("paddingRight", e.target.value, "pr")}
                    className="w-9 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                    placeholder="0"
                    title="Padding Right (px)"
                  />
                </div>

                {/* Padding Bottom */}
                <div className="flex justify-center mt-1">
                  <input
                    type="text"
                    value={component.props.paddingBottomRaw || "0"}
                    onChange={(e) => updateSpacing("paddingBottom", e.target.value, "pb")}
                    className="w-9 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                    placeholder="0"
                    title="Padding Bottom (px)"
                  />
                </div>
              </div>

              {/* Margin Right */}
              <input
                type="text"
                value={component.props.marginRightRaw || "0"}
                onChange={(e) => updateSpacing("marginRight", e.target.value, "mr")}
                className="w-10 bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                placeholder="0"
                title="Margin Right (px or auto)"
              />
            </div>

            {/* Margin Bottom */}
            <div className="flex justify-center mt-1">
              <input
                type="text"
                value={component.props.marginBottomRaw || "0"}
                onChange={(e) => updateSpacing("marginBottom", e.target.value, "mb")}
                className="w-10 bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-700 text-center focus:border-blue-600 focus:outline-none"
                placeholder="0"
                title="Margin Bottom (px)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. WEBFLOW-STYLE TYPOGRAPHY PANEL (Conditionally visible for text-containing elements) */}
      {hasTypography && (
        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Typography &amp; Sub-Colors</span>
          
          <div className="flex flex-col gap-3 pt-1">
            {/* Weight Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Weight</span>
              <select
                value={getSubPropVal("fontWeight", "font-normal")}
                onChange={(e) => handlePropChange(getSubPropKey("fontWeight"), e.target.value)}
                className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
              >
                <option value="font-light">300 - Light</option>
                <option value="font-normal">400 - Normal</option>
                <option value="font-medium">500 - Medium</option>
                <option value="font-semibold">600 - Semibold</option>
                <option value="font-bold">700 - Bold</option>
                <option value="font-extrabold">800 - Extrabold</option>
              </select>
            </div>

            {/* Dynamic Typography Sizes */}
            {/* 1. Generic Size (Heading / Text / Button) */}
            {(component.type === "heading" || component.type === "text" || component.type === "button") && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Size</span>
                <select
                  value={component.props.fontSize || (component.type === "heading" ? "text-3xl" : "text-base")}
                  onChange={(e) => handlePropChange("fontSize", e.target.value)}
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="text-xs">12px (xs)</option>
                  <option value="text-sm">14px (sm)</option>
                  <option value="text-base">16px (base)</option>
                  <option value="text-lg">18px (lg)</option>
                  <option value="text-xl">20px (xl)</option>
                  <option value="text-2xl">24px (2xl)</option>
                  <option value="text-3xl">30px (3xl)</option>
                  <option value="text-4xl">36px (4xl)</option>
                  <option value="text-5xl">48px (5xl)</option>
                </select>
              </div>
            )}

            {/* 2. Hero Typography Sizes & Colors */}
            {component.type === "hero" && (
              <>
                {subKey === "heading" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.titleFontSize || "text-4xl"}
                        onChange={(e) => handlePropChange("titleFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xl">20px (xl)</option>
                        <option value="text-2xl">24px (2xl)</option>
                        <option value="text-3xl">30px (3xl)</option>
                        <option value="text-4xl">36px (4xl)</option>
                        <option value="text-5xl">48px (5xl)</option>
                        <option value="text-6xl">60px (6xl)</option>
                        <option value="text-7xl">72px (7xl)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="titleColor"
                          rawVal={component.props.titleColor || "#ffffff"}
                          defaultValue="#ffffff"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "subheading" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.subtitleFontSize || "text-lg"}
                        onChange={(e) => handlePropChange("subtitleFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xs">12px (xs)</option>
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                        <option value="text-lg">18px (lg)</option>
                        <option value="text-xl">20px (xl)</option>
                        <option value="text-2xl">24px (2xl)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="subtitleColor"
                          rawVal={component.props.subtitleColor || "#ffffff"}
                          defaultValue="#ffffff"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "buttonText" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Button BG</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="ctaBgColor"
                          rawVal={component.props.ctaBgColor || "#ffffff"}
                          defaultValue="#ffffff"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Button Text</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="ctaTextColor"
                          rawVal={component.props.ctaTextColor || "var(--color-primary)"}
                          defaultValue="var(--color-primary)"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 3. Testimonial Typography Sizes & Colors */}
            {component.type === "testimonial" && (
              <>
                {subKey === "quote" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.quoteFontSize || "text-base"}
                        onChange={(e) => handlePropChange("quoteFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                        <option value="text-lg">18px (lg)</option>
                        <option value="text-xl">20px (xl)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="quoteColor"
                          rawVal={component.props.quoteColor || "#334155"}
                          defaultValue="#334155"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "author" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.authorFontSize || "text-sm"}
                        onChange={(e) => handlePropChange("authorFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xs">12px (xs)</option>
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="authorColor"
                          rawVal={component.props.authorColor || "#0f172a"}
                          defaultValue="#0f172a"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(subKey === "company" || subKey === "role") && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Accent Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="detailsColor"
                          rawVal={component.props.detailsColor || "var(--color-primary)"}
                          defaultValue="var(--color-primary)"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 4. FAQ Typography Sizes & Colors */}
            {component.type === "faq" && (
              <>
                {subKey === "question" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.questionFontSize || "text-sm"}
                        onChange={(e) => handlePropChange("questionFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xs">12px (xs)</option>
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                        <option value="text-lg">18px (lg)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="questionColor"
                          rawVal={component.props.questionColor || "#1e293b"}
                          defaultValue="#1e293b"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "answer" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.answerFontSize || "text-xs"}
                        onChange={(e) => handlePropChange("answerFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xs">12px (xs)</option>
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="answerColor"
                          rawVal={component.props.answerColor || "#475569"}
                          defaultValue="#475569"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 5. Course Card Typography Sizes & Colors */}
            {component.type === "courseCard" && (
              <>
                {subKey === "title" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.titleFontSize || "text-lg"}
                        onChange={(e) => handlePropChange("titleFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                        <option value="text-lg">18px (lg)</option>
                        <option value="text-xl">20px (xl)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="titleColor"
                          rawVal={component.props.titleColor || "#1e293b"}
                          defaultValue="#1e293b"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(subKey === "duration" || subKey === "instructor") && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Size</span>
                      <select
                        value={component.props.detailsFontSize || "text-xs"}
                        onChange={(e) => handlePropChange("detailsFontSize", e.target.value)}
                        className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="text-xs">12px (xs)</option>
                        <option value="text-sm">14px (sm)</option>
                        <option value="text-base">16px (base)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="detailsColor"
                          rawVal={component.props.detailsColor || "#64748b"}
                          defaultValue="#64748b"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "badge" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Badge BG</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="badgeBgColor"
                          rawVal={component.props.badgeBgColor || "var(--color-primary)"}
                          defaultValue="var(--color-primary)"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "price" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Text Color</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="priceColor"
                          rawVal={component.props.priceColor || "#1e293b"}
                          defaultValue="#1e293b"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {subKey === "button" && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Button BG</span>
                      <div className="w-44 flex justify-end">
                        <ColorPicker
                          label=""
                          propKey="ctaBgColor"
                          rawVal={component.props.ctaBgColor || "var(--color-primary)"}
                          defaultValue="var(--color-primary)"
                          onChange={handlePropChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 6. Navbar Typography Sizes & Colors */}
            {component.type === "navbar" && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Logo Size</span>
                  <select
                    value={component.props.logoFontSize || "text-xl"}
                    onChange={(e) => handlePropChange("logoFontSize", e.target.value)}
                    className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="text-base">16px (base)</option>
                    <option value="text-lg">18px (lg)</option>
                    <option value="text-xl">20px (xl)</option>
                    <option value="text-2xl">24px (2xl)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Link Size</span>
                  <select
                    value={component.props.linkFontSize || "text-sm"}
                    onChange={(e) => handlePropChange("linkFontSize", e.target.value)}
                    className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="text-xs">12px (xs)</option>
                    <option value="text-sm">14px (sm)</option>
                    <option value="text-base">16px (base)</option>
                  </select>
                </div>
              </>
            )}

            {/* 7. Footer Typography Sizes & Colors */}
            {component.type === "footer" && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Brand Size</span>
                  <select
                    value={component.props.brandNameFontSize || "text-lg"}
                    onChange={(e) => handlePropChange("brandNameFontSize", e.target.value)}
                    className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="text-base">16px (base)</option>
                    <option value="text-lg">18px (lg)</option>
                    <option value="text-xl">20px (xl)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Link Size</span>
                  <select
                    value={component.props.linkFontSize || "text-xs"}
                    onChange={(e) => handlePropChange("linkFontSize", e.target.value)}
                    className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="text-xs">12px (xs)</option>
                    <option value="text-sm">14px (sm)</option>
                    <option value="text-base">16px (base)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Desc Size</span>
                  <select
                    value={component.props.descriptionFontSize || "text-xs"}
                    onChange={(e) => handlePropChange("descriptionFontSize", e.target.value)}
                    className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="text-xs">12px (xs)</option>
                    <option value="text-sm">14px (sm)</option>
                    <option value="text-base">16px (base)</option>
                  </select>
                </div>
              </>
            )}

            {/* Height Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Height</span>
              <select
                value={getSubPropVal("lineHeight", "leading-normal")}
                onChange={(e) => handlePropChange(getSubPropKey("lineHeight"), e.target.value)}
                className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
              >
                <option value="leading-none">None (1.0)</option>
                <option value="leading-tight">Tight (1.25)</option>
                <option value="leading-normal">Normal (1.5)</option>
                <option value="leading-relaxed">Relaxed (1.625)</option>
                <option value="leading-loose">Loose (2.0)</option>
              </select>
            </div>

            {/* Color Row - only for simple/non-composite components */}
            {!isComposite && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Color</span>
                <div className="w-44 flex justify-end">
                  <ColorPicker
                    label=""
                    propKey="color"
                    rawVal={component.props.color || (component.type === "text" ? "#475569" : "#0f172a")}
                    defaultValue={component.type === "text" ? "#475569" : "#0f172a"}
                    onChange={handlePropChange}
                  />
                </div>
              </div>
            )}

            {/* Align Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Align</span>
              <div className="w-44 grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                {[
                  { val: "left", label: "Left" },
                  { val: "center", label: "Center" },
                  { val: "right", label: "Right" },
                ].map((a) => (
                  <button
                    key={a.val}
                    type="button"
                    onClick={() => handlePropChange(getSubPropKey("align"), a.val)}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      getSubPropVal("align", "left") === a.val
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decor Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Decor</span>
              <div className="w-44 grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                {[
                  { val: "no-underline", label: "None" },
                  { val: "underline", label: "Under" },
                  { val: "line-through", label: "Strike" },
                ].map((decor) => (
                  <button
                    key={decor.val}
                    type="button"
                    onClick={() => handlePropChange(getSubPropKey("textDecoration"), decor.val)}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      getSubPropVal("textDecoration", "no-underline") === decor.val
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {decor.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BACKGROUND STYLING */}
      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Background &amp; Blur</span>
        
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">BG Type</span>
            <select
              value={component.props.bgType || "none"}
              onChange={(e) => handlePropChange("bgType", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="none">None (Transparent)</option>
              <option value="color">Solid Color</option>
              <option value="gradient">Linear Gradient</option>
              <option value="image">Image Banner</option>
            </select>
          </div>

          {component.props.bgType === "color" && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">BG Color</span>
              <div className="w-44 flex justify-end">
                <ColorPicker
                  label=""
                  propKey="bgColor"
                  rawVal={component.props.bgColor || "#ffffff"}
                  defaultValue="#ffffff"
                  onChange={handlePropChange}
                />
              </div>
            </div>
          )}

          {component.props.bgType === "gradient" && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Start Color</span>
                <div className="w-44 flex justify-end">
                  <ColorPicker
                    label=""
                    propKey="gradientStart"
                    rawVal={component.props.gradientStart || "#3b82f6"}
                    defaultValue="#3b82f6"
                    onChange={handlePropChange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">End Color</span>
                <div className="w-44 flex justify-end">
                  <ColorPicker
                    label=""
                    propKey="gradientEnd"
                    rawVal={component.props.gradientEnd || "#1e3a8a"}
                    defaultValue="#1e3a8a"
                    onChange={handlePropChange}
                  />
                </div>
              </div>
            </div>
          )}

          {component.props.bgType === "image" && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">URL</span>
                <input
                  type="text"
                  value={component.props.bgImage || ""}
                  onChange={(e) => handlePropChange("bgImage", e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-mono text-[9px]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Fit</span>
                <select
                  value={component.props.bgImageSize || "cover"}
                  onChange={(e) => handlePropChange("bgImageSize", e.target.value)}
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="cover">Cover (Fill)</option>
                  <option value="contain">Contain (Fit)</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              {/* Background Image Blur */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Image Blur</span>
                <select
                  value={component.props.bgImageBlur || "0px"}
                  onChange={(e) => handlePropChange("bgImageBlur", e.target.value)}
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="0px">No Blur</option>
                  <option value="4px">Light Blur (4px)</option>
                  <option value="8px">Medium Blur (8px)</option>
                  <option value="12px">Strong Blur (12px)</option>
                  <option value="20px">Extreme Blur (20px)</option>
                </select>
              </div>

              {/* Background Overlay Tint */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Overlay Tint</span>
                <select
                  value={component.props.bgOverlayOpacity || "0"}
                  onChange={(e) => handlePropChange("bgOverlayOpacity", e.target.value)}
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="0">None (0%)</option>
                  <option value="0.15">15% Darken</option>
                  <option value="0.3">30% Darken</option>
                  <option value="0.45">45% Darken</option>
                  <option value="0.6">60% Darken</option>
                  <option value="0.75">75% Darken</option>
                </select>
              </div>
            </div>
          )}

          {/* Glassmorphism Backdrop Blur */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Glass Blur</span>
            <select
              value={component.props.backdropBlur || "none"}
              onChange={(e) => handlePropChange("backdropBlur", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="none">No Blur (None)</option>
              <option value="backdrop-blur-sm">Frosted Glass SM</option>
              <option value="backdrop-blur">Frosted Glass MD</option>
              <option value="backdrop-blur-md">Frosted Glass LG</option>
              <option value="backdrop-blur-lg">Frosted Glass XL</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. BORDERS & CORNERS */}
      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Borders &amp; Shadows</span>
        
        <div className="flex flex-col gap-3 pt-1">
          {/* Border Radius */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Radius</span>
            <select
              value={component.props.borderRadius || "rounded-none"}
              onChange={(e) => handlePropChange("borderRadius", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="rounded-none">Sharp Corners (0)</option>
              <option value="rounded-sm">Rounded SM</option>
              <option value="rounded-md">Rounded MD</option>
              <option value="rounded-lg">Rounded LG</option>
              <option value="rounded-xl">Rounded XL</option>
              <option value="rounded-2xl">Rounded 2XL</option>
              <option value="rounded-full">Pill / Circle</option>
            </select>
          </div>

          {/* Border Style */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Border</span>
            <select
              value={component.props.borderStyle || "none"}
              onChange={(e) => handlePropChange("borderStyle", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="none">No Border</option>
              <option value="solid">Solid border</option>
              <option value="dashed">Dashed border</option>
              <option value="dotted">Dotted border</option>
            </select>
          </div>

          {component.props.borderStyle && component.props.borderStyle !== "none" && (
            <>
              {/* Border Width */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Width</span>
                <select
                  value={component.props.borderWidth || "border"}
                  onChange={(e) => handlePropChange("borderWidth", e.target.value)}
                  className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="border">1px (border)</option>
                  <option value="border-2">2px (border-2)</option>
                  <option value="border-4">4px (border-4)</option>
                </select>
              </div>

              {/* Border Color */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Color</span>
                <div className="w-44 flex justify-end">
                  <ColorPicker
                    label=""
                    propKey="borderColor"
                    rawVal={component.props.borderColor || "#e2e8f0"}
                    defaultValue="#e2e8f0"
                    onChange={handlePropChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* Shadow Size */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Shadow</span>
            <select
              value={component.props.shadowSize || "shadow-none"}
              onChange={(e) => handlePropChange("shadowSize", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="shadow-none">None</option>
              <option value="shadow-xs">Extra Small (shadow-xs)</option>
              <option value="shadow-sm">Small (shadow-sm)</option>
              <option value="shadow">Medium (shadow)</option>
              <option value="shadow-md">Large (shadow-md)</option>
              <option value="shadow-lg">Extra Large (shadow-lg)</option>
              <option value="shadow-xl">Double XL (shadow-xl)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. POSITIONING & Z-INDEX */}
      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Positioning</span>
        
        <div className="flex flex-col gap-3 pt-1">
          {/* Position Type */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Position</span>
            <select
              value={component.props.position || "relative"}
              onChange={(e) => handlePropChange("position", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="relative">Relative (Normal)</option>
              <option value="absolute">Absolute (Overlay)</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {/* Z-Index */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Z-Index</span>
            <select
              value={component.props.zIndex || ""}
              onChange={(e) => handlePropChange("zIndex", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="">Auto (Default)</option>
              <option value="z-0">z-0</option>
              <option value="z-10">z-10 (Overlay)</option>
              <option value="z-20">z-20</option>
              <option value="z-30">z-30</option>
              <option value="z-40">z-40</option>
              <option value="z-50">z-50 (Top)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 7. EFFECTS & TRANSITIONS */}
      <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Effects &amp; Transitions</span>
        
        <div className="flex flex-col gap-3 pt-1">
          {/* Opacity */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Opacity</span>
            <select
              value={component.props.opacity || "opacity-100"}
              onChange={(e) => handlePropChange("opacity", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="opacity-100">100%</option>
              <option value="opacity-90">90%</option>
              <option value="opacity-75">75%</option>
              <option value="opacity-50">50%</option>
              <option value="opacity-25">25%</option>
            </select>
          </div>

          {/* Hover Scale Animation */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Hover Zoom</span>
            <select
              value={component.props.hoverScale || ""}
              onChange={(e) => handlePropChange("hoverScale", e.target.value)}
              className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
            >
              <option value="">No Zoom effect</option>
              <option value="hover:scale-[1.02]">Subtle Scale (2%)</option>
              <option value="hover:scale-[1.05]">Normal Scale (5%)</option>
              <option value="hover:scale-[1.10]">Strong Scale (10%)</option>
            </select>
          </div>

          {component.props.hoverScale && (
            /* Transition Speed */
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">Speed</span>
              <select
                value={component.props.transitionSpeed || "duration-150"}
                onChange={(e) => handlePropChange("transitionSpeed", e.target.value)}
                className="w-44 bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none font-medium cursor-pointer"
              >
                <option value="duration-75">Fast (75ms)</option>
                <option value="duration-150">Normal (150ms)</option>
                <option value="duration-300">Smooth (300ms)</option>
                <option value="duration-500">Slow (500ms)</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
