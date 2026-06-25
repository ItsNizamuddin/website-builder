"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { ComponentType } from "@/types/builder";
import {
  Type, AlignLeft, Image as ImageIcon, Play, Sparkles,
  Quote, HelpCircle, BookOpen, Plus, LayoutGrid, Layers, Columns,
  Menu, PanelBottom, ChevronLeft, ChevronRight, ChevronDown, Layout, Info
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

// Draggable item card for the component palette
const PaletteDraggableItem: React.FC<{ type: ComponentType; label: string; icon: React.ReactNode }> = ({
  type,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "palette-component",
      componentType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-500/40 hover:bg-blue-50/20 cursor-grab active:cursor-grabbing smooth-transition shadow-sm group select-none ${isDragging ? "opacity-40 border-blue-600" : ""
        }`}
    >
      <div className="p-2 bg-slate-50 rounded-lg text-blue-600 group-hover:text-blue-500 group-hover:scale-105 smooth-transition border border-slate-200">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-800">{label}</span>
        <span className="text-[10px] text-slate-400">Drag to canvas</span>
      </div>
    </div>
  );
};

// Clean Template section list button
const TemplateSectionBtn: React.FC<{
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500/40 hover:bg-blue-50/25 cursor-pointer smooth-transition shadow-xs w-full group select-none text-left"
  >
    <div className="p-1.5 bg-slate-50 rounded-lg text-blue-600 group-hover:text-blue-550 group-hover:scale-105 smooth-transition border border-slate-200">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-slate-800">{label}</span>
      <span className="text-[9px] text-slate-400 font-medium">Click to insert block</span>
    </div>
  </button>
);

export const SidebarLeft: React.FC = () => {
  const {
    present,
    leftSidebarCollapsed,
    setLeftSidebarCollapsed,
    selectedElement,
    setSelectedElement,
    hoveredElementId,
    setHoveredElementId,
    addSectionTemplate,
    globalHeader,
    globalFooter,
  } = useBuilderStore();

  const [activeTab, setActiveTab] = React.useState<"layouts" | "components" | "layers">("layouts");
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({
    navigation: true,
    introduction: true,
    content: true,
    business: true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Content-only components — navbar/footer are global-only and not added to page sections
  const componentTypes: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
    { type: "heading", label: "Heading", icon: <Type className="w-4 h-4" /> },
    { type: "text", label: "Paragraph", icon: <AlignLeft className="w-4 h-4" /> },
    { type: "image", label: "Image Block", icon: <ImageIcon className="w-4 h-4" /> },
    { type: "button", label: "Button Link", icon: <Plus className="w-4 h-4" /> },
    { type: "video", label: "Video Embed", icon: <Play className="w-4 h-4" /> },
    { type: "hero", label: "Hero Banner", icon: <Sparkles className="w-4 h-4" /> },
    { type: "testimonial", label: "Testimonial", icon: <Quote className="w-4 h-4" /> },
    { type: "faq", label: "FAQ Accordion", icon: <HelpCircle className="w-4 h-4" /> },
    { type: "courseCard", label: "Course Card", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case "navbar": return <Menu className="w-3.5 h-3.5" />;
      case "footer": return <PanelBottom className="w-3.5 h-3.5" />;
      case "heading": return <Type className="w-3.5 h-3.5" />;
      case "text": return <AlignLeft className="w-3.5 h-3.5" />;
      case "image": return <ImageIcon className="w-3.5 h-3.5" />;
      case "button": return <Plus className="w-3.5 h-3.5" />;
      case "video": return <Play className="w-3.5 h-3.5" />;
      case "hero": return <Sparkles className="w-3.5 h-3.5" />;
      case "testimonial": return <Quote className="w-3.5 h-3.5" />;
      case "faq": return <HelpCircle className="w-3.5 h-3.5" />;
      case "courseCard": return <BookOpen className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      {leftSidebarCollapsed && (
        <button
          type="button"
          onClick={() => setLeftSidebarCollapsed(false)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-slate-50 text-blue-600 p-3.5 rounded-r-2xl shadow-xl border border-l-0 border-slate-200/80 flex items-center justify-center cursor-pointer smooth-transition group hover:pl-5 hover:text-blue-700"
          title="Open Tool Palette"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 smooth-transition" />
        </button>
      )}
      <aside className={`border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden select-none z-45 shadow-sm transition-all duration-300 ${
        leftSidebarCollapsed ? "w-0 border-r-0" : "w-64 border-r"
      }`}>
        {/* Editor Panel Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Builder Palette</span>
          </h2>
          <button
            type="button"
            onClick={() => setLeftSidebarCollapsed(true)}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-605 smooth-transition cursor-pointer flex items-center justify-center"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("layouts")}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "layouts"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-1" />
            <span>Layouts</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("components")}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "components"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Components</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("layers")}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "layers"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Layers</span>
          </button>
        </div>

        {/* TAB 1: PREBUILT SECTION TEMPLATES */}
        {activeTab === "layouts" && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0 bg-white">
            {/* Category: GLOBAL NAVIGATION (shared across all pages) */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleCategory("navigation")}
                className="flex items-center justify-between w-full text-[10px] text-slate-500 font-extrabold uppercase tracking-wider text-left border-b border-slate-100 pb-1 cursor-pointer select-none"
              >
                <span>Global Navigation</span>
                <ChevronDown className={`w-3.5 h-3.5 smooth-transition ${openCategories.navigation ? "" : "-rotate-90"}`} />
              </button>
              {openCategories.navigation && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  {/* Info banner explaining global zone */}
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-2.5">
                    <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                      Header &amp; Footer are <strong>shared across all pages</strong>. Click below to edit them globally.
                    </p>
                  </div>
                  {/* Edit Global Header button — navigates to global edit mode */}
                  <button
                    onClick={() => setSelectedElement({ type: "globalHeader" })}
                    className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer smooth-transition shadow-xs w-full group select-none text-left ${
                      globalHeader
                        ? "bg-white border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/25"
                        : "bg-amber-50 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border smooth-transition group-hover:scale-105 ${
                      globalHeader ? "bg-slate-50 border-slate-200 text-blue-600" : "bg-amber-100 border-amber-200 text-amber-600"
                    }`}>
                      <Menu className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">Global Header</span>
                      <span className="text-[9px] font-medium text-slate-400">
                        {globalHeader ? "Click to edit" : "Not configured yet"}
                      </span>
                    </div>
                    {globalHeader && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active" />
                    )}
                  </button>
                  {/* Edit Global Footer button */}
                  <button
                    onClick={() => setSelectedElement({ type: "globalFooter" })}
                    className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer smooth-transition shadow-xs w-full group select-none text-left ${
                      globalFooter
                        ? "bg-white border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/25"
                        : "bg-amber-50 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border smooth-transition group-hover:scale-105 ${
                      globalFooter ? "bg-slate-50 border-slate-200 text-blue-600" : "bg-amber-100 border-amber-200 text-amber-600"
                    }`}>
                      <PanelBottom className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">Global Footer</span>
                      <span className="text-[9px] font-medium text-slate-400">
                        {globalFooter ? "Click to edit" : "Not configured yet"}
                      </span>
                    </div>
                    {globalFooter && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Category: INTRODUCTION */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleCategory("introduction")}
                className="flex items-center justify-between w-full text-[10px] text-slate-500 font-extrabold uppercase tracking-wider text-left border-b border-slate-100 pb-1 cursor-pointer select-none"
              >
                <span>Introduction</span>
                <ChevronDown className={`w-3.5 h-3.5 smooth-transition ${openCategories.introduction ? "" : "-rotate-90"}`} />
              </button>
              {openCategories.introduction && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  <TemplateSectionBtn
                    label="Hero Banner"
                    onClick={() => addSectionTemplate("Hero")}
                    icon={<Sparkles className="w-4 h-4" />}
                  />
                </div>
              )}
            </div>

            {/* Category: CONTENT */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleCategory("content")}
                className="flex items-center justify-between w-full text-[10px] text-slate-500 font-extrabold uppercase tracking-wider text-left border-b border-slate-100 pb-1 cursor-pointer select-none"
              >
                <span>Content Grid</span>
              </button>
              {openCategories.content && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  <TemplateSectionBtn
                    label="Bento Showcase"
                    onClick={() => addSectionTemplate("Bento")}
                    icon={<LayoutGrid className="w-4 h-4" />}
                  />
                  <TemplateSectionBtn
                    label="Article Card Details"
                    onClick={() => addSectionTemplate("ArticleCard")}
                    icon={<AlignLeft className="w-4 h-4" />}
                  />
                  <TemplateSectionBtn
                    label="Feature Showcase Cards"
                    onClick={() => addSectionTemplate("FeatureCards")}
                    icon={<Columns className="w-4 h-4" />}
                  />
                  <TemplateSectionBtn
                    label="Product Cards Grid"
                    onClick={() => addSectionTemplate("CardGrid")}
                    icon={<BookOpen className="w-4 h-4" />}
                  />
                </div>
              )}
            </div>

            {/* Category: BUSINESS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleCategory("business")}
                className="flex items-center justify-between w-full text-[10px] text-slate-500 font-extrabold uppercase tracking-wider text-left border-b border-slate-100 pb-1 cursor-pointer select-none"
              >
                <span>Business Cards</span>
                <ChevronDown className={`w-3.5 h-3.5 smooth-transition ${openCategories.business ? "" : "-rotate-90"}`} />
              </button>
              {openCategories.business && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  <TemplateSectionBtn
                    label="Pricing Matrix"
                    onClick={() => addSectionTemplate("Pricing")}
                    icon={<Quote className="w-4 h-4" />}
                  />
                  <TemplateSectionBtn
                    label="Contact Form Block"
                    onClick={() => addSectionTemplate("ContactUs")}
                    icon={<HelpCircle className="w-4 h-4" />}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMPONENT DRAG PALETTE */}
        {activeTab === "components" && (
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-0 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Drag Components</span>
            </h2>
            <div className="flex flex-col gap-2">
              {componentTypes.map((item) => (
                <PaletteDraggableItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HIERARCHICAL LAYERS COMPONENT TREE */}
        {activeTab === "layers" && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 min-h-0 bg-white select-none">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Layers Navigator</span>
            </h2>

            <div className="flex flex-col gap-1 text-left">
              {/* Root Node: Page */}
              <div className="flex items-center gap-2 py-1.5 px-2 bg-slate-50 border border-slate-150 rounded-lg text-slate-700 font-semibold text-xs mb-2">
                <Layout className="w-3.5 h-3.5 text-slate-400" />
                <span>Page Layout Root</span>
              </div>

              {/* Sections & Components Nested Loop */}
              {present.sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 italic text-[11px] gap-2 bg-slate-50/50 rounded-xl border border-slate-100">
                  <Info className="w-5 h-5 text-slate-300 stroke-1" />
                  <span>No layers to navigate. Add layout blocks to start.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {present.sections.map((section, secIdx) => {
                    const isSecSelected = selectedElement?.type === "section" && selectedElement.sectionId === section.id && !selectedElement.elementId;
                    const isSecHovered = hoveredElementId === section.id;

                    return (
                      <div key={section.id} className="flex flex-col gap-1">
                        {/* Section Node Row */}
                        <div
                          onClick={() => setSelectedElement({ type: "section", sectionId: section.id })}
                          onMouseEnter={() => setHoveredElementId(section.id)}
                          onMouseLeave={() => setHoveredElementId(null)}
                          className={`flex items-center gap-2 py-1.5 px-3 rounded-lg border text-xs cursor-pointer smooth-transition ${
                            isSecSelected
                              ? "bg-blue-600 border-blue-600 text-white font-bold"
                              : isSecHovered
                              ? "bg-blue-50 border-blue-200 text-blue-600 font-semibold"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium"
                          }`}
                        >
                          <Layout className={`w-3.5 h-3.5 ${isSecSelected ? "text-white" : "text-blue-500"}`} />
                          <span className="truncate">Section {secIdx + 1} ({section.layout.desktop})</span>
                        </div>

                        {/* Component Children Rows nested under Section */}
                        <div className="pl-4 border-l-2 border-slate-100 ml-3.5 flex flex-col gap-1 mt-0.5 mb-1.5">
                          {section.children.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic py-1 pl-2">Empty column grid</span>
                          ) : (
                            section.children.map((child) => {
                              const isCompSelected = selectedElement?.type === "component" && selectedElement.sectionId === section.id && selectedElement.elementId === child.id;
                              const isCompHovered = hoveredElementId === child.id;

                              return (
                                <div
                                  key={child.id}
                                  onClick={() => setSelectedElement({ type: "component", sectionId: section.id, elementId: child.id })}
                                  onMouseEnter={() => setHoveredElementId(child.id)}
                                  onMouseLeave={() => setHoveredElementId(null)}
                                  className={`flex items-center gap-2 py-1 px-2.5 rounded-lg border text-[11px] cursor-pointer smooth-transition ${
                                    isCompSelected
                                      ? "bg-blue-500 border-blue-500 text-white font-semibold"
                                      : isCompHovered
                                      ? "bg-blue-50/50 border-blue-200 text-blue-600"
                                      : "bg-white hover:bg-slate-50/80 border-slate-200 text-slate-650"
                                  }`}
                                >
                                  {getComponentIcon(child.type)}
                                  <span className="truncate capitalize">{child.type}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-1 text-center shrink-0">
          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
            <Columns className="w-3 h-3 text-blue-600" />
            <span>Total Sections: {present.sections.length}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
