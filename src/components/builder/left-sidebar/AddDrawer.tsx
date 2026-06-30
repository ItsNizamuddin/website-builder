"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import {
  Type, AlignLeft, Image as ImageIcon, Play, Sparkles, Plus, LayoutGrid, Layers, Columns,
  Layout, Box, Search, Globe, ChevronDown, ChevronRight
} from "lucide-react";
import { ComponentType } from "@/types/builder";

// Light White & Blue Element Card
const LightElementCard: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2.5 h-[72px] bg-slate-50/90 hover:bg-blue-50/80 hover:border-blue-500/60 border border-slate-200/80 rounded-2xl transition-all cursor-pointer group text-center shadow-xs select-none"
  >
    <div className="text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-1">
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-700 leading-tight group-hover:text-blue-600 text-center w-full px-0.5 wrap-break-word">
      {label}
    </span>
  </button>
);

export const AddDrawer: React.FC = () => {
  const {
    addSectionTemplate,
    addSection,
    updateGlobalHeaderProps,
    updateGlobalFooterProps
  } = useBuilderStore();

  const [addTab, setAddTab] = useState<"elements" | "layouts">("elements");
  const [expandedAccordion, setExpandedAccordion] = useState<Record<string, boolean>>({
    navigation: true,
    footer: true,
    hero: true,
    features: true,
  });

  const toggleAccordion = (cat: string) => {
    setExpandedAccordion(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAddComponent = (type: ComponentType) => {
    const store = useBuilderStore.getState();
    let targetSectionId = "";
    if (store.present.sections.length === 0) {
      store.addSection({ desktop: "1-col" });
      const updatedSections = useBuilderStore.getState().present.sections;
      targetSectionId = updatedSections[updatedSections.length - 1].id;
    } else {
      if (store.selectedElement?.sectionId) {
        targetSectionId = store.selectedElement.sectionId;
      } else {
        targetSectionId = store.present.sections[store.present.sections.length - 1].id;
      }
    }
    if (targetSectionId) {
      store.addComponentToSection(targetSectionId, type);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4 animate-in fade-in duration-100">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h3 className="text-sm font-extrabold text-slate-900">Add</h3>
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-extrabold">
          <button
            onClick={() => setAddTab("elements")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${addTab === "elements" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Elements
          </button>
          <button
            onClick={() => setAddTab("layouts")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${addTab === "layouts" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Layouts
          </button>
        </div>
      </div>

      {/* Search elements */}
      <div className="relative">
        <input
          type="text"
          placeholder={addTab === "elements" ? "Search elements" : "Search starter library"}
          className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl py-2 pl-8 pr-3 focus:outline-none focus:border-blue-600 font-medium"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {addTab === "layouts" ? (
        <div className="flex flex-col gap-3">
          {/* 1. NAVIGATION ACCORDION */}
          <div className="flex flex-col border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => toggleAccordion("navigation")}
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 cursor-pointer font-bold text-xs text-slate-800 select-none border-0"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Navigation</span>
              </div>
              {expandedAccordion.navigation ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {expandedAccordion.navigation && (
              <div className="p-3 grid grid-cols-2 gap-3 bg-white border-t border-slate-100">
                <button
                  onClick={() => updateGlobalHeaderProps({ navbarVariant: "left" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-4 bg-white rounded-xs px-1 flex items-center justify-between shadow-2xs">
                      <div className="w-3 h-1.5 bg-slate-900 rounded-2xs" />
                      <div className="flex gap-0.5">
                        <div className="w-2 h-1 bg-slate-300 rounded-2xs" />
                        <div className="w-2 h-1 bg-slate-300 rounded-2xs" />
                      </div>
                      <div className="w-2.5 h-1.5 bg-slate-900 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Navbar Logo Left</span>
                </button>

                <button
                  onClick={() => updateGlobalHeaderProps({ navbarVariant: "center" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-4 bg-white rounded-xs px-1 flex items-center justify-between shadow-2xs">
                      <div className="flex gap-0.5">
                        <div className="w-2 h-1 bg-slate-300 rounded-2xs" />
                      </div>
                      <div className="w-4 h-1.5 bg-slate-900 rounded-2xs" />
                      <div className="flex gap-0.5">
                        <div className="w-2 h-1 bg-slate-300 rounded-2xs" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Navbar Logo Center</span>
                </button>

                <button
                  onClick={() => updateGlobalHeaderProps({ navbarVariant: "no-shadow" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-3.5 bg-white flex items-center justify-between px-1">
                      <div className="w-3 h-1 bg-slate-900 rounded-2xs" />
                      <div className="flex gap-0.5">
                        <div className="w-2 h-0.5 bg-slate-400 rounded-2xs" />
                        <div className="w-2 h-0.5 bg-slate-400 rounded-2xs" />
                      </div>
                      <div className="w-2 h-1 bg-slate-900 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Navbar No Shadow</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. FOOTER ACCORDION */}
          <div className="flex flex-col border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => toggleAccordion("footer")}
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 cursor-pointer font-bold text-xs text-slate-800 select-none border-0"
            >
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600" />
                <span>Footer</span>
              </div>
              {expandedAccordion.footer ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {expandedAccordion.footer && (
              <div className="p-3 grid grid-cols-2 gap-3 bg-white border-t border-slate-100">
                <button
                  onClick={() => updateGlobalFooterProps({ footerVariant: "standard" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-9 bg-white rounded-xs flex flex-col justify-between p-1 shadow-2xs">
                      <div className="flex justify-between items-start">
                        <div className="w-2.5 h-1 bg-slate-900 rounded-2xs" />
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-0.5 bg-slate-400 rounded-2xs" />
                          <div className="w-1.5 h-0.5 bg-slate-400 rounded-2xs" />
                          <div className="w-1.5 h-0.5 bg-slate-400 rounded-2xs" />
                        </div>
                      </div>
                      <div className="w-full h-0.5 bg-slate-300 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Footer Multi-Column</span>
                </button>

                <button
                  onClick={() => updateGlobalFooterProps({ footerVariant: "centered" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-9 bg-white rounded-xs flex flex-col items-center justify-between p-1 shadow-2xs">
                      <div className="w-4 h-1.5 bg-slate-900 rounded-2xs" />
                      <div className="flex gap-0.5">
                        <div className="w-2 h-0.5 bg-slate-400 rounded-2xs" />
                        <div className="w-2 h-0.5 bg-slate-400 rounded-2xs" />
                      </div>
                      <div className="w-full h-0.5 bg-slate-200 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Footer Centered</span>
                </button>

                <button
                  onClick={() => updateGlobalFooterProps({ footerVariant: "subscribe" })}
                  className="flex flex-col cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 shadow-xs">
                    <div className="w-full h-9 bg-white rounded-xs flex flex-col justify-between p-1 shadow-2xs">
                      <div className="w-full h-3 bg-blue-50 border border-blue-200 rounded-2xs flex items-center px-1 justify-between">
                        <div className="w-3 h-1 bg-blue-600 rounded-2xs" />
                        <div className="w-2 h-1 bg-slate-400 rounded-2xs" />
                      </div>
                      <div className="w-full h-0.5 bg-slate-200 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Footer Subscribe</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. HERO ACCORDION */}
          <div className="flex flex-col border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => toggleAccordion("hero")}
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer font-bold text-xs text-slate-800 select-none border-0"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Hero</span>
              </div>
              {expandedAccordion.hero ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {expandedAccordion.hero && (
              <div className="p-3 grid grid-cols-2 gap-3 bg-white border-t border-slate-100">
                <button
                  onClick={() => addSectionTemplate("Hero")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs flex flex-col items-center justify-center p-1 shadow-2xs">
                      <div className="w-8 h-1.5 bg-slate-900 rounded-2xs mb-0.5" />
                      <div className="w-12 h-1 bg-slate-400 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Hero Heading Center</span>
                </button>

                <button
                  onClick={() => addSectionTemplate("ArticleCard")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs flex items-center justify-between p-1 shadow-2xs">
                      <div className="w-4 h-5 bg-slate-300 rounded-2xs" />
                      <div className="flex flex-col gap-0.5 w-6">
                        <div className="w-5 h-1 bg-slate-800 rounded-2xs" />
                        <div className="w-6 h-0.5 bg-slate-400 rounded-2xs" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Hero Heading Left</span>
                </button>

                <button
                  onClick={() => addSectionTemplate("ArticleCard")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs flex items-center justify-between p-1 shadow-2xs">
                      <div className="flex flex-col gap-0.5 w-6">
                        <div className="w-5 h-1 bg-slate-800 rounded-2xs" />
                        <div className="w-6 h-0.5 bg-slate-400 rounded-2xs" />
                      </div>
                      <div className="w-4 h-5 bg-slate-300 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Hero Heading Right</span>
                </button>

                <button
                  onClick={() => addSectionTemplate("Hero")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs flex flex-col items-center justify-center p-1 shadow-2xs">
                      <div className="w-10 h-1.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xs mb-0.5" />
                      <div className="w-6 h-1 bg-slate-800 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Hero Stack</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. FEATURE GRIDS ACCORDION */}
          <div className="flex flex-col border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => toggleAccordion("features")}
              className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer font-bold text-xs text-slate-800 select-none border-0"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>Feature Grids</span>
              </div>
              {expandedAccordion.features ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            {expandedAccordion.features && (
              <div className="p-3 grid grid-cols-2 gap-3 bg-white border-t border-slate-100">
                <button
                  onClick={() => addSectionTemplate("FeatureCards")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs grid grid-cols-3 gap-0.5 p-1 shadow-2xs">
                      <div className="bg-slate-200 rounded-2xs" />
                      <div className="bg-slate-200 rounded-2xs" />
                      <div className="bg-slate-200 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">3-Col Feature Cards</span>
                </button>

                <button
                  onClick={() => addSectionTemplate("Bento")}
                  className="flex flex-col transition-all cursor-pointer text-left group border-0 bg-transparent p-0"
                >
                  <div className="w-full h-14 bg-[#2a2a2a] rounded-xl flex items-center justify-center p-2 group-hover:ring-2 group-hover:ring-blue-500 transition-all shadow-xs">
                    <div className="w-full h-8 bg-white rounded-xs grid grid-cols-3 gap-0.5 p-1 shadow-2xs">
                      <div className="bg-slate-800 rounded-2xs col-span-2" />
                      <div className="bg-blue-600 rounded-2xs" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 group-hover:text-blue-600 truncate">Bento Dashboard Grid</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* AI Section Promo Card */}
          <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-xs text-left">
            <span className="text-[10px] text-blue-900 font-semibold leading-relaxed">
              To design a layout with grids, add a new section.
            </span>
            <button
              onClick={() => addSection({ desktop: "1-col", tablet: "1-col", mobile: "1-col" })}
              className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm shadow-blue-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Add a Section</span>
            </button>
          </div>

          {/* CATEGORY: STRUCTURE */}
          <div className="flex flex-col gap-2 mt-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Structure</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <LightElementCard label="Section" icon={<Layout className="w-4 h-4" />} onClick={() => addSection({ desktop: "1-col" })} />
              <LightElementCard label="Container" icon={<Box className="w-4 h-4" />} onClick={() => addSection({ desktop: "1-col" })} />
              <LightElementCard label="Quick Stack" icon={<LayoutGrid className="w-4 h-4" />} onClick={() => addSection({ desktop: "2-col" })} />
              <LightElementCard label="V Flex" icon={<Columns className="w-4 h-4 rotate-90" />} onClick={() => addSection({ desktop: "1-col" })} />
              <LightElementCard label="H Flex" icon={<Columns className="w-4 h-4" />} onClick={() => addSection({ desktop: "2-col" })} />
            </div>
          </div>

          {/* CATEGORY: BASIC & TYPOGRAPHY */}
          <div className="flex flex-col gap-2 mt-2 text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Basic &amp; Typography</span>
            <div className="grid grid-cols-3 gap-2">
              <LightElementCard label="Heading" icon={<Type className="w-4 h-4" />} onClick={() => handleAddComponent("heading")} />
              <LightElementCard label="Paragraph" icon={<AlignLeft className="w-4 h-4" />} onClick={() => handleAddComponent("text")} />
              <LightElementCard label="Button" icon={<Plus className="w-4 h-4" />} onClick={() => handleAddComponent("button")} />
              <LightElementCard label="Image" icon={<ImageIcon className="w-4 h-4" />} onClick={() => handleAddComponent("image")} />
              <LightElementCard label="Video" icon={<Play className="w-4 h-4" />} onClick={() => handleAddComponent("video")} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
