"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ComponentNode } from "@/types/builder";
import { ToggleSwitch } from "./ToggleSwitch";
import { LinkItemEditor } from "./LinkItemEditor";
import { CategoryItemEditor } from "./CategoryItemEditor";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface NavbarPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const NavbarProperties: React.FC<NavbarPropertiesProps> = ({ component, handlePropChange }) => {
  const [navbarTab, setNavbarTab] = useState<"design" | "categories" | "links" | "mobile">("design");
  const { logoText } = useBuilderStore();

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">Navbar Settings</span>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl mb-1 gap-0.5 select-none flex-wrap">
        {(["design", "categories", "links", "mobile"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setNavbarTab(tab)}
            className={`flex-1 py-1 rounded-lg text-center text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${navbarTab === tab
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-400 hover:text-slate-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: DESIGN & STYLE */}
      {navbarTab === "design" && (
        <div className="flex flex-col gap-4">
          {/* Theme & Colors */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase text-left">Theme & Colors</span>
            <ColorPicker
              label="Text & Links"
              propKey="textColor"
              rawVal={component.props.textColor || "#0f172a"}
              defaultValue="#0f172a"
              onChange={handlePropChange}
            />
            <ColorPicker
              label="CTA Button"
              propKey="ctaColor"
              rawVal={component.props.ctaColor || "#0f172a"}
              defaultValue="#0f172a"
              onChange={handlePropChange}
            />
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] text-slate-500 font-bold">Background Style</span>
              <select
                value={component.props.bgStyle || "gradient"}
                onChange={(e) => handlePropChange("bgStyle", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Preset Gradient</option>
              </select>
            </div>
            {component.props.bgStyle === "solid" && (
              <ColorPicker
                label="Background Color"
                propKey="bgColor"
                rawVal={component.props.bgColor || "#ffffff"}
                defaultValue="#ffffff"
                onChange={handlePropChange}
              />
            )}
            {component.props.bgStyle !== "solid" && (
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] text-slate-500 font-bold">Background Gradient</span>
                <select
                  value={component.props.bgGradient || "from-white to-white"}
                  onChange={(e) => handlePropChange("bgGradient", e.target.value)}
                  className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="from-white to-white">White (Solid)</option>
                  <option value="from-slate-900 to-slate-950">Charcoal Dark</option>
                  <option value="from-blue-600 to-indigo-900">SkillDeck Blue</option>
                  <option value="from-emerald-600 via-teal-700 to-cyan-800">Emerald Fresh</option>
                  <option value="from-indigo-600 to-pink-500">Sunset Indigo</option>
                  <option value="from-slate-100 to-slate-200">Clean Light Slate</option>
                </select>
              </div>
            )}
          </div>

          {/* Width Layout Mode */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] text-slate-500 font-medium">Navbar Width Style</span>
            <select
              value={component.props.navbarWidth || "floating"}
              onChange={(e) => handlePropChange("navbarWidth", e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            >
              <option value="floating">Floating (Centered Card)</option>
              <option value="full-width">Full Width (Edge-to-Edge)</option>
            </select>
          </div>

          {/* Content Max Width */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] text-slate-500 font-medium">
              {component.props.navbarWidth === "full-width" ? "Inner Content Max Width" : "Navbar Max Width"}
            </span>
            <select
              value={component.props.contentMaxWidth || "6xl"}
              onChange={(e) => handlePropChange("contentMaxWidth", e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            >
              <option value="5xl">5xl (1024px)</option>
              <option value="6xl">6xl (1152px - Default)</option>
              <option value="7xl">7xl (1280px)</option>
              <option value="full">Full Viewport (No Limit)</option>
            </select>
          </div>

          {/* Dropdown Menu Trigger Mode */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] text-slate-500 font-medium">Nav Links Dropdown Trigger</span>
            <select
              value={component.props.dropdownTrigger || "hover"}
              onChange={(e) => handlePropChange("dropdownTrigger", e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            >
              <option value="hover">Show on Hover (Default)</option>
              <option value="click">Show on Click</option>
            </select>
          </div>

          {/* Layout Spacing */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm text-left">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Layout Spacing</span>

            {/* Spacing - Top */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top (Margin)</label>
              <select
                value={component.props.marginTop ?? (component.props.navbarWidth === "full-width" ? "mt-0" : "mt-4")}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="mt-0">None (0px)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px - Default for Floating)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px)</option>
                <option value="mt-12">Huge (48px)</option>
                <option value="mt-16">Super (64px)</option>
              </select>
            </div>

            {/* Spacing - Bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom (Margin)</label>
              <select
                value={component.props.marginBottom ?? "mb-0"}
                onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="mb-0">None (0px)</option>
                <option value="mb-2">Small (8px)</option>
                <option value="mb-4">Medium (16px)</option>
                <option value="mb-6">Large (24px)</option>
                <option value="mb-8">Extra Large (32px)</option>
              </select>
            </div>

            {/* Items Spacing (Gap) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Items Spacing (Gap)</label>
              <select
                value={component.props.itemsGap || "gap-4"}
                onChange={(e) => handlePropChange("itemsGap", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="gap-2">Small (8px)</option>
                <option value="gap-3">Compact (12px)</option>
                <option value="gap-4">Medium (16px - Default)</option>
                <option value="gap-6">Large (24px)</option>
                <option value="gap-8">Extra Large (32px)</option>
                <option value="gap-12">Huge (48px)</option>
              </select>
            </div>


          </div>
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {navbarTab === "categories" && (
        <div className="flex flex-col gap-4 text-left">
          {/* Categories Configuration */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
            <ToggleSwitch
              checked={component.props.showCategories !== false}
              onChange={(checked) => handlePropChange("showCategories", checked)}
              label="Show Categories Button"
              id="showCategories"
            />

            {component.props.showCategories !== false && (
              <div className="flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Button Label</span>
                  <input
                    type="text"
                    value={component.props.categoriesText || ""}
                    onChange={(e) => handlePropChange("categoriesText", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  />
                </div>

                <ToggleSwitch
                  checked={component.props.showCategoriesIcon !== false}
                  onChange={(checked) => handlePropChange("showCategoriesIcon", checked)}
                  label="Show Grid Icon"
                  id="showCategoriesIcon"
                />

                <div className="flex flex-col gap-2 mt-1">
                  <ColorPicker
                    label="Button Background"
                    propKey="categoriesBgColor"
                    rawVal={component.props.categoriesBgColor || "#0f172a"}
                    defaultValue="#0f172a"
                    onChange={handlePropChange}
                  />
                  <ColorPicker
                    label="Button Text"
                    propKey="categoriesTextColor"
                    rawVal={component.props.categoriesTextColor || "#ffffff"}
                    defaultValue="#ffffff"
                    onChange={handlePropChange}
                  />
                </div>

                {/* Categories Dropdown Trigger Mode */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-500 font-medium">Dropdown Trigger Mode</span>
                  <select
                    value={component.props.categoriesTrigger || "hover"}
                    onChange={(e) => handlePropChange("categoriesTrigger", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  >
                    <option value="hover">Show on Hover (Default)</option>
                    <option value="click">Show on Click</option>
                  </select>
                </div>

                {/* Category Selection Switch Mode */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-500 font-medium">Category Switch Mode</span>
                  <select
                    value={component.props.categorySwitchMode || "hover"}
                    onChange={(e) => handlePropChange("categorySwitchMode", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  >
                    <option value="hover">Switch on Hover (Default)</option>
                    <option value="click">Switch on Click</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[9px] text-slate-555 font-bold uppercase">Dropdown Width</span>
                    <select
                      value={component.props.categoriesDropdownWidth || "800px"}
                      onChange={(e) => handlePropChange("categoriesDropdownWidth", e.target.value)}
                      className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                    >
                      <option value="600px">600px (Compact)</option>
                      <option value="700px">700px</option>
                      <option value="800px">800px (Default)</option>
                      <option value="900px">900px</option>
                      <option value="1000px">1000px (Wide)</option>
                      <option value="full-width">Full Width</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[9px] text-slate-555 font-bold uppercase">Dropdown Height</span>
                    <select
                      value={component.props.categoriesDropdownHeight || "450px"}
                      onChange={(e) => handlePropChange("categoriesDropdownHeight", e.target.value)}
                      className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                    >
                      <option value="350px">350px (Short)</option>
                      <option value="400px">400px</option>
                      <option value="450px">450px (Default)</option>
                    </select>
                  </div>
                </div>

                {/* Dropdown Panel Fields Toggles */}
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Dropdown Panel Fields</span>
                  <ToggleSwitch
                    checked={component.props.showCategoryIcon !== false}
                    onChange={(checked) => handlePropChange("showCategoryIcon", checked)}
                    label="Category Icon"
                    id="showCategoryIcon"
                  />
                  <ToggleSwitch
                    checked={component.props.showCategoryDesc !== false}
                    onChange={(checked) => handlePropChange("showCategoryDesc", checked)}
                    label="Category Description"
                    id="showCategoryDesc"
                  />
                  <ToggleSwitch
                    checked={component.props.showCategoryExplore !== false}
                    onChange={(checked) => handlePropChange("showCategoryExplore", checked)}
                    label="Category Explore Link"
                    id="showCategoryExplore"
                  />
                  <ToggleSwitch
                    checked={component.props.showCourseName !== false}
                    onChange={(checked) => handlePropChange("showCourseName", checked)}
                    label="Course Name"
                    id="showCourseName"
                  />
                  <ToggleSwitch
                    checked={component.props.showCourseDetails !== false}
                    onChange={(checked) => handlePropChange("showCourseDetails", checked)}
                    label="Course Info/Details"
                    id="showCourseDetails"
                  />
                  <ToggleSwitch
                    checked={component.props.showCourseBadge !== false}
                    onChange={(checked) => handlePropChange("showCourseBadge", checked)}
                    label="Course Certification Tag"
                    id="showCourseBadge"
                  />
                </div>

                {/* Custom Categories Fallback Editor */}
                <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-slate-200 text-left">
                  <ToggleSwitch
                    checked={component.props.useBackendCategories !== false}
                    onChange={(checked) => handlePropChange("useBackendCategories", checked)}
                    label="Fetch from Backend Database"
                    id="useBackendCategories"
                  />

                  {component.props.useBackendCategories === false && (
                    <div className="flex flex-col gap-3 mt-1.5">
                      <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Custom Categories</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cats = [...(component.props.customCategoriesData || [])];
                            cats.push({
                              id: `cat-${Date.now()}`,
                              name: "New Category",
                              description: "Explore our course offerings",
                              courses: []
                            });
                            handlePropChange("customCategoriesData", cats);
                          }}
                          className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 smooth-transition font-semibold animate-in fade-in"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Category</span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {(component.props.customCategoriesData || []).map((cat: any, cIdx: number) => (
                          <CategoryItemEditor
                            key={cat.id || cIdx}
                            category={cat}
                            onUpdate={(updatedCat) => {
                              const cats = [...(component.props.customCategoriesData || [])];
                              cats[cIdx] = updatedCat;
                              handlePropChange("customCategoriesData", cats);
                            }}
                            onDelete={() => {
                              const cats = (component.props.customCategoriesData || []).filter((_: any, idx: number) => idx !== cIdx);
                              handlePropChange("customCategoriesData", cats);
                            }}
                          />
                        ))}
                        {(component.props.customCategoriesData || []).length === 0 && (
                          <div className="text-[10px] text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-slate-200/60 select-none leading-relaxed">
                            No custom categories defined. Toggle "Fetch from Backend" to load database settings, or add categories here.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LINKS & CTA */}
      {navbarTab === "links" && (
        <div className="flex flex-col gap-4 text-left">
          {/* Logo Configuration */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm">
            <ToggleSwitch
              checked={component.props.showLogo !== false}
              onChange={(checked) => handlePropChange("showLogo", checked)}
              label="Show Logo"
              id="showLogo"
            />

            {component.props.showLogo !== false && (
              <div className="flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-2.5">
                <ToggleSwitch
                  checked={component.props.useGlobalLogoImg !== false}
                  onChange={(checked) => handlePropChange("useGlobalLogoImg", checked)}
                  label="Use Global Logo Image"
                  id="useGlobalLogoImg"
                />
                {component.props.useGlobalLogoImg === false && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Logo Image URL</span>
                    <input
                      type="text"
                      value={component.props.logoImg || ""}
                      onChange={(e) => handlePropChange("logoImg", e.target.value)}
                      className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Logo Name</span>
                  <input
                    type="text"
                    value={component.props.logoText || ""}
                    onChange={(e) => handlePropChange("logoText", e.target.value)}
                    placeholder={logoText || "SkillDeck"}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  />
                </div>

                <ToggleSwitch
                  checked={component.props.showLogoText !== false}
                  onChange={(checked) => handlePropChange("showLogoText", checked)}
                  label="Show Brand Text next to Logo"
                  id="showLogoText"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Logo Link URL</span>
                  <input
                    type="text"
                    value={component.props.logoUrl || ""}
                    onChange={(e) => handlePropChange("logoUrl", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                    placeholder="/"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search Bar Width */}
          {component.props.showSearch !== false && (
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-medium">Search Bar Width</span>
              <select
                value={component.props.searchWidth || "320px"}
                onChange={(e) => handlePropChange("searchWidth", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="240px">240px</option>
                <option value="280px">280px</option>
                <option value="320px">320px (Default)</option>
                <option value="360px">360px</option>
                <option value="400px">400px</option>
                <option value="450px">450px</option>
              </select>
            </div>
          )}

          {/* Search Bar Configuration */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm">
            <ToggleSwitch
              checked={component.props.showSearch !== false}
              onChange={(checked) => handlePropChange("showSearch", checked)}
              label="Show Search Bar"
              id="showSearch"
            />

            {component.props.showSearch !== false && (
              <div className="flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Search Placeholder</span>
                  <input
                    type="text"
                    value={component.props.searchPlaceholder || ""}
                    onChange={(e) => handlePropChange("searchPlaceholder", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nav Links & Dropdowns Editor */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Navigation Links</label>
            <button
              type="button"
              onClick={() => {
                const links = [...(component.props.links || [])];
                links.push({ type: "link", label: "New Page", url: "#" });
                handlePropChange("links", links);
              }}
              className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 smooth-transition font-semibold"
            >
              <Plus className="w-3 h-3" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {(component.props.links || []).map((link: any, idx: number) => (
              <LinkItemEditor
                key={idx}
                link={link}
                onUpdate={(updated) => {
                  const links = [...(component.props.links || [])];
                  links[idx] = updated;
                  handlePropChange("links", links);
                }}
                onDelete={() => {
                  const links = (component.props.links || []).filter((_: any, i: number) => i !== idx);
                  handlePropChange("links", links);
                }}
              />
            ))}
          </div>

          {/* CTA Button Configuration */}
          <div className="flex flex-col gap-1.5 border-t border-slate-200 pt-4">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Button Settings</label>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-550 font-medium">Button Label</span>
              <input
                type="text"
                value={component.props.ctaText || ""}
                onChange={(e) => handlePropChange("ctaText", e.target.value)}
                className="bg-white text-sm text-slate-805 border border-slate-205 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5 mt-1.5">
              <span className="text-[10px] text-slate-550 font-medium">Link Destination URL</span>
              <input
                type="text"
                value={component.props.ctaUrl || ""}
                onChange={(e) => handlePropChange("ctaUrl", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-205 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MOBILE DRAWER */}
      {navbarTab === "mobile" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150 text-left">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Mobile Drawer Configuration</span>

            <ToggleSwitch
              checked={component.props.previewMobileDrawer === true}
              onChange={(checked) => handlePropChange("previewMobileDrawer", checked)}
              label="Force Open Drawer (for editing)"
              id="previewMobileDrawer"
            />

            <ToggleSwitch
              checked={component.props.mobileShowCategories !== false}
              onChange={(checked) => handlePropChange("mobileShowCategories", checked)}
              label="Show Categories Accordion"
              id="mobileShowCategories"
            />

            <ToggleSwitch
              checked={component.props.mobileShowSearch !== false}
              onChange={(checked) => handlePropChange("mobileShowSearch", checked)}
              label="Show Search Bar"
              id="mobileShowSearch"
            />

            <ToggleSwitch
              checked={component.props.mobileShowHelp !== false}
              onChange={(checked) => handlePropChange("mobileShowHelp", checked)}
              label="Show Help Widget"
              id="mobileShowHelp"
            />
          </div>

          {component.props.mobileShowHelp !== false && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm animate-in fade-in">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Mobile Help Section Details</span>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Help Title</span>
                <input
                  type="text"
                  value={component.props.mobileHelpTitle ?? "Didn't find what you need?"}
                  onChange={(e) => handlePropChange("mobileHelpTitle", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Help Subtitle</span>
                <input
                  type="text"
                  value={component.props.mobileHelpSubtitle ?? "We'll help you find it"}
                  onChange={(e) => handlePropChange("mobileHelpSubtitle", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Help Button Text</span>
                <input
                  type="text"
                  value={component.props.mobileHelpBtnText ?? "Call Us"}
                  onChange={(e) => handlePropChange("mobileHelpBtnText", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Phone Number Link</span>
                <input
                  type="text"
                  value={component.props.mobileHelpPhone ?? "tel:+1234567890"}
                  onChange={(e) => handlePropChange("mobileHelpPhone", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Action Type</span>
                <select
                  value={component.props.mobileHelpActionType ?? "phone"}
                  onChange={(e) => handlePropChange("mobileHelpActionType", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                >
                  <option value="phone">Phone Call (tel: link)</option>
                  <option value="url">Page URL Link</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Left Widget Icon</span>
                <select
                  value={component.props.mobileHelpIconType ?? "question"}
                  onChange={(e) => handlePropChange("mobileHelpIconType", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                >
                  <option value="question">Question Mark (?) (Default)</option>
                  <option value="headset">Support Headset</option>
                  <option value="message">Chat Message Bubble</option>
                  <option value="info">Info Icon</option>
                  <option value="none">No Left Icon</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Call Button Icon</span>
                <select
                  value={component.props.mobileHelpBtnIconType ?? "phone"}
                  onChange={(e) => handlePropChange("mobileHelpBtnIconType", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                >
                  <option value="phone">Phone (Default)</option>
                  <option value="arrow">Right Arrow</option>
                  <option value="external">External Link</option>
                  <option value="none">No Icon</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold">Card Visual Style</span>
                <select
                  value={component.props.mobileHelpCardStyle ?? "card"}
                  onChange={(e) => handlePropChange("mobileHelpCardStyle", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                >
                  <option value="card">Rounded Card Box (Default)</option>
                  <option value="flat">Flat Row (Unified List Style)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200/60 pt-3 mt-1 text-left">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Help Card Custom Colors</span>
                <ColorPicker label="Card Background" propKey="mobileHelpBgColor" rawVal={component.props.mobileHelpBgColor || "#ffffff"} defaultValue="#ffffff" onChange={handlePropChange} />
                <ColorPicker label="Card Text & Icon" propKey="mobileHelpTextColor" rawVal={component.props.mobileHelpTextColor || "#0f172a"} defaultValue="#0f172a" onChange={handlePropChange} />
                <ColorPicker label="Call Button Color" propKey="mobileHelpBtnColor" rawVal={component.props.mobileHelpBtnColor || "#0f172a"} defaultValue="#0f172a" onChange={handlePropChange} />
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm text-left">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Mobile Drawer Styling</span>
            <ColorPicker label="Drawer Background" propKey="mobileBgColor" rawVal={component.props.mobileBgColor || "#ffffff"} defaultValue="#ffffff" onChange={handlePropChange} />
            <ColorPicker label="Drawer Text & Icons" propKey="mobileTextColor" rawVal={component.props.mobileTextColor || "#0f172a"} defaultValue="#0f172a" onChange={handlePropChange} />
            <ColorPicker label="Mobile CTA Background" propKey="mobileCtaBgColor" rawVal={component.props.mobileCtaBgColor || "var(--color-primary)"} defaultValue="var(--color-primary)" onChange={handlePropChange} />
            <ColorPicker label="Mobile CTA Text Color" propKey="mobileCtaTextColor" rawVal={component.props.mobileCtaTextColor || "#ffffff"} defaultValue="#ffffff" onChange={handlePropChange} />
          </div>
        </div>
      )}
    </div>
  );
};
