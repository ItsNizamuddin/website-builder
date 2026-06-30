"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { ComponentNode } from "@/types/builder";
import { Trash2, Settings, Move } from "lucide-react";

// Sub-editor properties panel components
import { CommonStyleProperties } from "./properties/CommonStyleProperties";
import { NavbarProperties } from "./properties/NavbarProperties";
import { FooterProperties } from "./properties/FooterProperties";
import { HeroProperties } from "./properties/HeroProperties";
import { TestimonialProperties } from "./properties/TestimonialProperties";
import { FaqProperties } from "./properties/FaqProperties";
import { CourseCardProperties } from "./properties/CourseCardProperties";
import { HeadingProperties } from "./properties/HeadingProperties";
import { TextProperties } from "./properties/TextProperties";
import { ButtonProperties } from "./properties/ButtonProperties";
import { ImageProperties } from "./properties/ImageProperties";

export const SidebarRight: React.FC = () => {
  const {
    present,
    selectedElement,
    updateComponentProps,
    removeComponent,
    updateSectionLayout,
    updateSectionStyle,
    removeSection,
    activeDevice,
    globalHeader,
    globalFooter,
    primaryColor,
    secondaryColor,
    gradientStart,
    gradientEnd,
  } = useBuilderStore();

  const [compTab, setCompTab] = React.useState<"settings" | "style">("settings");

  if (!selectedElement) {
    return (
      <aside className="w-72 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full p-6 text-slate-400 select-none justify-center items-center text-center shadow-sm">
        <Settings className="w-8 h-8 text-slate-350 mb-3 stroke-1 animate-pulse" />
        <p className="text-sm font-semibold text-slate-700">No element selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
          Click on a section or component in the canvas to adjust its properties.
        </p>
      </aside>
    );
  }

  const { type, sectionId, elementId } = selectedElement;

  // 1. SECTION CONFIGURATIONS
  if (type === "section") {
    if (!sectionId) return null;
    const section = present.sections.find((s) => s.id === sectionId);
    if (!section) return null;

    const sectionStyle = section.style || {};

    const layoutOptions = [
      { value: "1-col", label: "1 Column" },
      { value: "2-col", label: "2 Columns" },
      { value: "3-col", label: "3 Columns" },
      { value: "4-col", label: "4 Columns" },
      { value: "70-30", label: "70 / 30 Layout" },
      { value: "30-70", label: "30 / 70 Layout" },
      { value: "25-75", label: "25 / 75 Layout" },
    ];

    const handleLayoutChange = (device: "desktop" | "tablet" | "mobile", value: string) => {
      updateSectionLayout(sectionId, { [device]: value });
    };

    const handleStyleChange = (key: string, value: any) => {
      updateSectionStyle(sectionId, { [key]: value });
    };

    const renderSectionColorPicker = (label: string, styleKey: string, defaultValue: string) => {
      const rawVal = sectionStyle[styleKey] ?? defaultValue;

      let hexValue = rawVal;
      if (rawVal === "var(--color-primary)") hexValue = primaryColor || "#2563eb";
      else if (rawVal === "var(--color-secondary)") hexValue = secondaryColor || "#1e3a8a";
      else if (rawVal === "var(--color-gradient-start)") hexValue = gradientStart || "#3b82f6";
      else if (rawVal === "var(--color-gradient-end)") hexValue = gradientEnd || "#1e3a8a";

      if (!hexValue || !hexValue.startsWith("#") || hexValue.length !== 7) {
        hexValue = defaultValue.startsWith("#") ? defaultValue : "#ffffff";
      }

      const presets = [
        { name: "Primary", varName: "var(--color-primary)", color: primaryColor || "#2563eb" },
        { name: "Secondary", varName: "var(--color-secondary)", color: secondaryColor || "#1e3a8a" },
        { name: "Grad Start", varName: "var(--color-gradient-start)", color: gradientStart || "#3b82f6" },
        { name: "Grad End", varName: "var(--color-gradient-end)", color: gradientEnd || "#1e3a8a" },
      ];

      const displayVal = rawVal.startsWith("var(--")
        ? rawVal.replace("var(--color-", "").replace(")", "").toUpperCase()
        : rawVal;

      return (
        <div className="flex flex-col gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60 shadow-xs text-left">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexValue}
                onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-xs font-mono text-slate-500 font-bold">{displayVal}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t border-slate-200/50 pt-2 mt-0.5">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Presets</span>
            <div className="flex items-center gap-2 flex-wrap">
              {presets.map((preset) => {
                const isSelected = rawVal === preset.varName;
                return (
                  <button
                    key={preset.varName}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStyleChange(styleKey, preset.varName);
                    }}
                    className="w-4 h-4 rounded-full border smooth-transition hover:scale-110 flex items-center justify-center relative group shadow-xs cursor-pointer"
                    style={{
                      backgroundColor: preset.color,
                      borderColor: isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.3)"
                    }}
                    title={preset.name}
                  >
                    {isSelected && (
                      <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    return (
      <aside className="w-68 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto z-45 shadow-sm select-none font-sans">
        <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Section Properties</span>
          </h2>
          <button
            onClick={() => removeSection(sectionId)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 smooth-transition border border-red-500/20 cursor-pointer"
            title="Delete Section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Section ID info */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Section ID</span>
            <code className="text-xs text-slate-650 font-mono bg-slate-50 border border-slate-150 p-2 rounded-lg break-all select-all">
              {sectionId}
            </code>
          </div>

          {/* 1. LAYOUT SETTINGS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide text-left">Layout & Grids</span>

            {/* Container Max Width */}
            <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60 shadow-xs text-left">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Section Max Width</label>
              <select
                value={sectionStyle.containerWidth || "boxed"}
                onChange={(e) => handleStyleChange("containerWidth", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="boxed">Boxed (1152px - Default)</option>
                <option value="narrow">Narrow (1024px)</option>
                <option value="wide">Wide (1280px)</option>
                <option value="full">Full Width (100%)</option>
              </select>
            </div>

            {/* Desktop Layout */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Desktop Grid Columns</span>
              </label>
              <select
                value={section.layout.desktop}
                onChange={(e) => handleLayoutChange("desktop", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tablet Layout */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Tablet Grid Columns</span>
              </label>
              <select
                value={section.layout.tablet}
                onChange={(e) => handleLayoutChange("tablet", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Layout */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Mobile Grid Columns</span>
              </label>
              <select
                value={section.layout.mobile}
                onChange={(e) => handleLayoutChange("mobile", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. SPACING SETTINGS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide text-left">Spacing (Margins & Padding)</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3 text-left">
              {/* Padding Top */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Top</span>
                <select
                  value={sectionStyle.paddingTop || "medium"}
                  onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (80px)</option>
                  <option value="xxl">Huge (128px)</option>
                </select>
              </div>

              {/* Padding Bottom */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Bottom</span>
                <select
                  value={sectionStyle.paddingBottom || "medium"}
                  onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (80px)</option>
                  <option value="xxl">Huge (128px)</option>
                </select>
              </div>

              {/* Padding Left/Right */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Horizontal</span>
                <select
                  value={sectionStyle.paddingLeftRight || "medium"}
                  onChange={(e) => handleStyleChange("paddingLeftRight", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (64px)</option>
                </select>
              </div>

              <div className="h-px bg-slate-200/50 my-1" />

              {/* Margin Top */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Margin - Top</span>
                <select
                  value={sectionStyle.marginTop || "none"}
                  onChange={(e) => handleStyleChange("marginTop", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (32px)</option>
                  <option value="large">Large (64px)</option>
                  <option value="xl">Extra Large (96px)</option>
                </select>
              </div>

              {/* Margin Bottom */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Margin - Bottom</span>
                <select
                  value={sectionStyle.marginBottom || "none"}
                  onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (32px)</option>
                  <option value="large">Large (64px)</option>
                  <option value="xl">Extra Large (96px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. BACKGROUND STYLING */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 text-left">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Background Styling</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Background Type</span>
                <select
                  value={sectionStyle.bgType || "none"}
                  onChange={(e) => handleStyleChange("bgType", e.target.value)}
                  className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (Transparent / Theme Default)</option>
                  <option value="color">Solid Color</option>
                  <option value="gradient">Preset Gradient</option>
                  <option value="image">Background Image</option>
                </select>
              </div>

              {/* Solid Color Picker */}
              {sectionStyle.bgType === "color" && renderSectionColorPicker("Solid Color", "bgColor", "#ffffff")}

              {/* Preset Gradients */}
              {sectionStyle.bgType === "gradient" && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gradients Presets</span>
                  <select
                    value={sectionStyle.bgGradient || "from-white to-white"}
                    onChange={(e) => handleStyleChange("bgGradient", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    <option value="from-white to-white">White (Solid)</option>
                    <option value="from-slate-900 via-slate-950 to-black">Charcoal Dark</option>
                    <option value="from-blue-600 via-blue-700 to-indigo-900">SkillDeck Blue</option>
                    <option value="from-emerald-600 via-teal-700 to-cyan-800">Emerald Fresh</option>
                    <option value="from-orange-500 via-red-500 to-indigo-650">Sunset Glow</option>
                    <option value="from-purple-600 to-blue-500">Royal Lavender</option>
                    <option value="from-rose-500 to-orange-500">Warm Ember</option>
                    <option value="from-slate-100 to-slate-200">Clean Light Slate</option>
                  </select>
                </div>
              )}

              {/* Background Image Options */}
              {sectionStyle.bgType === "image" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Image URL</span>
                    <input
                      type="text"
                      value={sectionStyle.bgImage || ""}
                      onChange={(e) => handleStyleChange("bgImage", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Image Size</span>
                      <select
                        value={sectionStyle.bgImageSize || "cover"}
                        onChange={(e) => handleStyleChange("bgImageSize", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain (Fit)</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Position</span>
                      <select
                        value={sectionStyle.bgImagePosition || "center"}
                        onChange={(e) => handleStyleChange("bgImagePosition", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. BORDERS & CORNERS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 text-left">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Borders & Corners</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
              {/* Rounded Corners */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rounded Corners</span>
                <select
                  value={sectionStyle.borderRadius || "none"}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">Sharp Corners (None)</option>
                  <option value="sm">Rounded Small</option>
                  <option value="md">Rounded Medium</option>
                  <option value="lg">Rounded Large</option>
                  <option value="xl">Rounded XL</option>
                  <option value="2xl">Rounded 2XL</option>
                  <option value="3xl">Rounded 3XL</option>
                  <option value="full">Pill / Circle</option>
                </select>
              </div>

              {/* Border Position */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Border Position</span>
                <select
                  value={sectionStyle.borderPosition || "none"}
                  onChange={(e) => handleStyleChange("borderPosition", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">No Border</option>
                  <option value="all">All Sides</option>
                  <option value="top">Top border only</option>
                  <option value="bottom">Bottom border only</option>
                  <option value="y">Top & Bottom borders</option>
                </select>
              </div>

              {sectionStyle.borderPosition && sectionStyle.borderPosition !== "none" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Border Style</span>
                      <select
                        value={sectionStyle.borderStyle || "solid"}
                        onChange={(e) => handleStyleChange("borderStyle", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Border Width</span>
                      <select
                        value={sectionStyle.borderWidth || "1px"}
                        onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="1px">1px</option>
                        <option value="2px">2px</option>
                        <option value="4px">4px</option>
                      </select>
                    </div>
                  </div>

                  {renderSectionColorPicker("Border Color", "borderColor", "#e2e8f0")}
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. COMPONENT CONFIGURATIONS
  let component: ComponentNode | null = null;
  if (type === "globalHeader") {
    component = globalHeader;
  } else if (type === "globalFooter") {
    component = globalFooter;
  } else {
    const section = present.sections.find((s) => s.id === sectionId);
    component = section?.children.find((c) => c.id === elementId) || null;
  }

  if (!component) return null;

  const handlePropChange = (key: string, value: any) => {
    if (type === "globalHeader") {
      useBuilderStore.setState((state) => ({
        globalHeader: state.globalHeader
          ? { ...state.globalHeader, props: { ...state.globalHeader.props, [key]: value } }
          : null,
        isSaved: false,
      }));
    } else if (type === "globalFooter") {
      useBuilderStore.setState((state) => ({
        globalFooter: state.globalFooter
          ? { ...state.globalFooter, props: { ...state.globalFooter.props, [key]: value } }
          : null,
        isSaved: false,
      }));
    } else if (sectionId && elementId) {
      updateComponentProps(sectionId, elementId, { [key]: value });
    }
  };

  const getSpecificSubEditor = () => {
    if (!component) return null;
    switch (component.type) {
      case "navbar":
        return <NavbarProperties component={component} handlePropChange={handlePropChange} />;
      case "footer":
        return <FooterProperties component={component} handlePropChange={handlePropChange} />;
      case "hero":
        return <HeroProperties component={component} handlePropChange={handlePropChange} />;
      case "testimonial":
        return <TestimonialProperties component={component} handlePropChange={handlePropChange} />;
      case "faq":
        return <FaqProperties component={component} handlePropChange={handlePropChange} />;
      case "courseCard":
        return <CourseCardProperties component={component} handlePropChange={handlePropChange} />;
      case "heading":
        return <HeadingProperties component={component} handlePropChange={handlePropChange} />;
      case "text":
        return <TextProperties component={component} handlePropChange={handlePropChange} />;
      case "button":
        return <ButtonProperties component={component} handlePropChange={handlePropChange} />;
      case "image":
        return <ImageProperties component={component} handlePropChange={handlePropChange} />;
      case "video":
        return (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Video Settings</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Embed Video URL</label>
              <input
                type="text"
                value={component.props.src || ""}
                onChange={(e) => handlePropChange("src", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="text-xs text-slate-400 text-center py-6">
            Basic component settings. Style properties are available under the "Style" tab.
          </div>
        );
    }
  };

  return (
    <aside className="w-72 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden z-45 shadow-sm select-none font-sans">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 select-none">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Edit: {component.type}</span>
        </h2>
        {type !== "globalHeader" && type !== "globalFooter" && (
          <button
            onClick={() => sectionId && elementId && removeComponent(sectionId, elementId)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 smooth-transition border border-red-500/20 cursor-pointer"
            title="Delete Component"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Settings / Style Tab Selection */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl mx-4 mt-4 text-[10px] font-extrabold select-none shrink-0 border border-slate-200">
        <button
          onClick={() => setCompTab("settings")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer border-0 ${compTab === "settings" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
        >
          Settings
        </button>
        <button
          onClick={() => setCompTab("style")}
          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer border-0 ${compTab === "style" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
        >
          Style
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-1.5 overflow-y-auto flex flex-col gap-5">
        {compTab === "settings" ? (
          <div className="flex flex-col gap-4 px-2.5 pb-4">
            {getSpecificSubEditor()}
          </div>
        ) : (
          <CommonStyleProperties component={component} handlePropChange={handlePropChange} />
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 select-none flex items-center justify-between text-[10px] text-slate-500 font-semibold shrink-0">
        <span className="flex items-center gap-1">
          <Move className="w-3 h-3 text-blue-600" />
          <span>Active view: {activeDevice}</span>
        </span>
        <span>ID: {elementId?.substring(0, 8)}...</span>
      </div>
    </aside>
  );
};
