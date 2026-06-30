"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ComponentNode } from "@/types/builder";
import { ToggleSwitch } from "./ToggleSwitch";
import { FooterColumnEditor } from "./FooterColumnEditor";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface FooterPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const FooterProperties: React.FC<FooterPropertiesProps> = ({ component, handlePropChange }) => {
  const [footerTab, setFooterTab] = useState<"design" | "links">("design");
  const { logoText } = useBuilderStore();

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 animate-in fade-in duration-150 text-left">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Footer Settings</span>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-1 gap-1 select-none">
        {(["design", "links"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFooterTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              footerTab === tab
                ? "bg-white text-blue-605 shadow-xs"
                : "text-slate-400 hover:text-slate-650"
            }`}
          >
            {tab === "design" ? "Style" : "Links & Copyright"}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: STYLE & DESIGN */}
      {footerTab === "design" && (
        <div className="flex flex-col gap-4">
          {/* Theme & Colors */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Theme & Colors</span>
            <ColorPicker
              label="Text & Links"
              propKey="textColor"
              rawVal={component.props.textColor || "#ffffff"}
              defaultValue="#ffffff"
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
                rawVal={component.props.bgColor || "#0f172a"}
                defaultValue="#0f172a"
                onChange={handlePropChange}
              />
            )}
            {component.props.bgStyle !== "solid" && (
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] text-slate-500 font-bold">Background Gradient</span>
                <select
                  value={component.props.bgGradient || "from-slate-900 to-slate-950"}
                  onChange={(e) => handlePropChange("bgGradient", e.target.value)}
                  className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="from-slate-900 to-slate-950">Charcoal Dark (Default)</option>
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
            <span className="text-[10px] text-slate-500 font-medium">Footer Width Style</span>
            <select
              value={component.props.footerWidth || "floating"}
              onChange={(e) => handlePropChange("footerWidth", e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            >
              <option value="floating">Floating (Centered Card)</option>
              <option value="full-width">Full Width (Edge-to-Edge)</option>
            </select>
          </div>

          {/* Content Max Width */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] text-slate-500 font-medium">
              {component.props.footerWidth === "full-width" ? "Inner Content Max Width" : "Footer Max Width"}
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

          {/* Grid Layout Option */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] text-slate-500 font-medium">Columns per Row</span>
            <select
              value={component.props.columnsPerRow || "auto"}
              onChange={(e) => handlePropChange("columnsPerRow", e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            >
              <option value="auto">Auto (All in 1 Row)</option>
              <option value="2">2 Columns</option>
              <option value="3">3 Columns</option>
              <option value="4">4 Columns</option>
              <option value="5">5 Columns</option>
            </select>
          </div>

          {/* Layout Spacing */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm text-left">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Layout Spacing</span>

            {/* Spacing - Top */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top (Margin)</label>
              <select
                value={component.props.marginTop ?? (component.props.footerWidth === "full-width" ? "mt-0" : "mt-8")}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="mt-0">None (0px)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px - Default for Floating)</option>
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


          </div>
        </div>
      )}

      {/* TAB CONTENT: LINKS & COPYRIGHT */}
      {footerTab === "links" && (
        <div className="flex flex-col gap-5 text-left">
          {/* Branding Configuration */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm">
            <ToggleSwitch
              checked={component.props.showBrandColumn !== false}
              onChange={(checked) => handlePropChange("showBrandColumn", checked)}
              label="Show Branding Column"
              id="showBrandColumn"
            />

            {component.props.showBrandColumn !== false && (
              <div className="flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-2.5">
                <ToggleSwitch
                  checked={component.props.useGlobalLogoImg !== false}
                  onChange={(checked) => handlePropChange("useGlobalLogoImg", checked)}
                  label="Use Global Logo Image"
                  id="useGlobalLogoImgFooter"
                />
                {component.props.useGlobalLogoImg === false && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Custom Logo Image URL</span>
                    <input
                      type="text"
                      value={component.props.logoImg || ""}
                      onChange={(e) => handlePropChange("logoImg", e.target.value)}
                      className="bg-white text-xs text-slate-855 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Brand Name / Logo Text</span>
                  <input
                    type="text"
                    value={component.props.brandName || ""}
                    onChange={(e) => handlePropChange("brandName", e.target.value)}
                    placeholder={logoText || "SkillDeck"}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                  />
                </div>

                <ToggleSwitch
                  checked={component.props.showLogoText !== false}
                  onChange={(checked) => handlePropChange("showLogoText", checked)}
                  label="Show Brand Text next to Logo"
                  id="showLogoTextFooter"
                />

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Brand Description</span>
                  <textarea
                    value={component.props.brandDescription ?? "Empowering students with cutting-edge academic learning resources..."}
                    onChange={(e) => handlePropChange("brandDescription", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-16 resize-none font-sans"
                    placeholder="Empowering students..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Social Media Profiles */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Social Media Profiles</span>
            <div className="flex flex-col gap-2.5">
              {[
                { name: "Facebook", key: "socialFacebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />, color: "text-blue-600" },
                { name: "Twitter", key: "socialTwitter", icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />, color: "text-slate-800" },
                { name: "Instagram", key: "socialInstagram", icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, color: "text-pink-650" },
                { name: "LinkedIn", key: "socialLinkedin", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>, color: "text-blue-700" },
                { name: "YouTube", key: "socialYoutube", icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2c-.46 1.72-.46 5.33-.46 5.33s0 3.6.46 5.33a2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2c.46-1.72.46-5.33.46-5.33s0-3.6-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" /></>, color: "text-red-600" }
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 ${s.color} flex items-center justify-center shrink-0`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={`${s.name} URL`}
                    value={component.props[s.key] || ""}
                    onChange={(e) => handlePropChange(s.key, e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full font-mono text-[10px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Columns Configuration */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Footer Columns</span>
            <div className="flex flex-col gap-3">
              {(component.props.columns || []).map((col: any, colIdx: number) => (
                <FooterColumnEditor
                  key={colIdx}
                  col={col}
                  colIdx={colIdx}
                  onUpdate={(updatedCol) => {
                    const columns = [...(component.props.columns || [])];
                    columns[colIdx] = updatedCol;
                    handlePropChange("columns", columns);
                  }}
                  onDelete={() => {
                    const columns = (component.props.columns || []).filter((_: any, i: number) => i !== colIdx);
                    handlePropChange("columns", columns);
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const columns = [...(component.props.columns || [])];
                columns.push({
                  type: "links",
                  title: `Column ${columns.length + 1}`,
                  links: [{ label: "New Link", url: "#" }]
                });
                handlePropChange("columns", columns);
              }}
              className="mt-1 w-full py-2 bg-blue-50 border border-dashed border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100/50 smooth-transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Column</span>
            </button>
          </div>

          {/* Copyright Text */}
          <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
            <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Copyright Info</label>
            <input
              type="text"
              value={component.props.copyrightText || ""}
              onChange={(e) => handlePropChange("copyrightText", e.target.value)}
              className="bg-white text-sm text-slate-850 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            />
          </div>

          {/* Privacy Policy Link */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm mt-1">
            <ToggleSwitch
              checked={component.props.showPrivacyPolicy !== false}
              onChange={(checked) => handlePropChange("showPrivacyPolicy", checked)}
              label="Show Privacy Policy Link"
              id="showPrivacyPolicy"
            />
            {component.props.showPrivacyPolicy !== false && (
              <div className="flex flex-col gap-2 mt-2 border-t border-slate-200/50 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold">Link Label</span>
                  <input
                    type="text"
                    value={component.props.privacyPolicyLabel ?? "Privacy Policy"}
                    onChange={(e) => handlePropChange("privacyPolicyLabel", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                    placeholder="Privacy Policy"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold">Destination URL</span>
                  <input
                    type="text"
                    value={component.props.privacyPolicyUrl ?? "#"}
                    onChange={(e) => handlePropChange("privacyPolicyUrl", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                    placeholder="#"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Terms of Service Link */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm mt-1">
            <ToggleSwitch
              checked={component.props.showTermsOfService !== false}
              onChange={(checked) => handlePropChange("showTermsOfService", checked)}
              label="Show Terms of Service Link"
              id="showTermsOfService"
            />
            {component.props.showTermsOfService !== false && (
              <div className="flex flex-col gap-2 mt-2 border-t border-slate-200/50 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold">Link Label</span>
                  <input
                    type="text"
                    value={component.props.termsOfServiceLabel ?? "Terms of Service"}
                    onChange={(e) => handlePropChange("termsOfServiceLabel", e.target.value)}
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                    placeholder="Terms of Service"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-bold">Destination URL</span>
                  <input
                    type="text"
                    value={component.props.termsOfServiceUrl ?? "#"}
                    onChange={(e) => handlePropChange("termsOfServiceUrl", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                    placeholder="#"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
