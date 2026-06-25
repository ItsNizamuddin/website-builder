"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useBuilderStore } from "@/store/useBuilderStore";
import { Undo, Redo, Monitor, Tablet, Smartphone, Save, Eye, Send, Check, Settings, X, Loader2, ChevronDown, FileText, Plus } from "lucide-react";

interface HeaderProps {
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
  isDbConnected: boolean;
  onPageSwitch: (slug: string) => Promise<void>;
  onCreatePage: (name: string, slug: string) => Promise<boolean>;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onPublish,
  isSaving,
  isPublishing,
  isDbConnected,
  onPageSwitch,
  onCreatePage,
}) => {
  const {
    present,
    past,
    future,
    undo,
    redo,
    activeDevice,
    setActiveDevice,
    isSaved,
  } = useBuilderStore();

  const [slug, setSlug] = useState(present.slug);
  const [name, setName] = useState(present.name);
  const [isSavedBanner, setIsSavedBanner] = useState(false);

  // Global Settings Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [apiToken, setApiToken] = useState("");
  const [settingsPrimary, setSettingsPrimary] = useState("#2563eb");
  const [settingsSecondary, setSettingsSecondary] = useState("#1e3a8a");
  const [settingsGradientStart, setSettingsGradientStart] = useState("#3b82f6");
  const [settingsGradientEnd, setSettingsGradientEnd] = useState("#1e3a8a");
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsLogoImg, setSettingsLogoImg] = useState("");
  const [settingsLogoText, setSettingsLogoText] = useState("SkillDeck");
  const [settingsSectionGap, setSettingsSectionGap] = useState("8");

  // Page Selector & Creation States
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  const [pagesList, setPagesList] = useState<{ name: string; slug: string }[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);

  // Sync state when active page changes
  React.useEffect(() => {
    setSlug(present.slug);
    setName(present.name);
  }, [present.slug, present.name]);

  // Load page list
  const fetchPagesList = async () => {
    setLoadingPages(true);
    try {
      if (isDbConnected) {
        const res = await fetch("/api/pages");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.pages) {
            setPagesList(data.pages);
          }
        }
      } else {
        const localList = localStorage.getItem("builder-pages-list");
        if (localList) {
          setPagesList(JSON.parse(localList));
        } else {
          setPagesList([{ name: "Home Page", slug: "home" }]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch pages list:", err);
    } finally {
      setLoadingPages(false);
    }
  };

  React.useEffect(() => {
    if (isPageSelectorOpen) {
      fetchPagesList();
    }
  }, [isDbConnected, isPageSelectorOpen]);

  React.useEffect(() => {
    setMounted(true);
    // Initial fetch of pages
    fetchPagesList();
  }, [isDbConnected]);

  React.useEffect(() => {
    if (isSettingsOpen) {
      setLoadingSettings(true);
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setApiToken(data.settings.apiKey || "");
            setSettingsPrimary(data.settings.primaryColor || "#2563eb");
            setSettingsSecondary(data.settings.secondaryColor || "#1e3a8a");
            setSettingsGradientStart(data.settings.gradientStart || "#3b82f6");
            setSettingsGradientEnd(data.settings.gradientEnd || "#1e3a8a");
            setSettingsLogoImg(data.settings.logoImg || "");
            setSettingsLogoText(data.settings.logoText || "SkillDeck");
            setSettingsSectionGap(data.settings.sectionGap || "8");
          }
        })
        .catch((err) => console.error("Error loading settings:", err))
        .finally(() => setLoadingSettings(false));
    }
  }, [isSettingsOpen]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiToken,
          primaryColor: settingsPrimary,
          secondaryColor: settingsSecondary,
          gradientStart: settingsGradientStart,
          gradientEnd: settingsGradientEnd,
          logoImg: settingsLogoImg,
          logoText: settingsLogoText,
          sectionGap: settingsSectionGap,
        }),
      });
      const data = await res.json();
      if (data.success) {
        useBuilderStore.setState({
          primaryColor: settingsPrimary,
          secondaryColor: settingsSecondary,
          gradientStart: settingsGradientStart,
          gradientEnd: settingsGradientEnd,
          logoImg: settingsLogoImg,
          logoText: settingsLogoText,
          sectionGap: settingsSectionGap,
        });
        setIsSettingsOpen(false);
      } else {
        alert("Failed to save settings: " + (data.message || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    useBuilderStore.setState((state) => ({
      present: { ...state.present, name: e.target.value },
      isSaved: false,
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setSlug(cleaned);
    useBuilderStore.setState((state) => ({
      present: { ...state.present, slug: cleaned },
      isSaved: false,
    }));
  };

  const handleSaveClick = async () => {
    await onSave();
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 2000);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-50 shadow-sm">
      {/* Page Title & Slug Configuration */}
      <div className="flex items-center gap-4">
        {/* Page Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPageSelectorOpen(!isPageSelectorOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 smooth-transition shadow-sm cursor-pointer animate-in fade-in"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Pages</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPageSelectorOpen && (
            <div className="absolute left-0 mt-2 bg-white border border-slate-200 rounded-2xl w-56 py-2 shadow-xl z-50 text-left animate-in zoom-in-95 duration-100">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-4 py-1.5 block">Select Page</span>

              <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                {pagesList.map((p) => (
                  <button
                    key={p.slug}
                    onClick={async () => {
                      setIsPageSelectorOpen(false);
                      await onPageSwitch(p.slug);
                    }}
                    className={`px-4 py-2 text-xs font-semibold flex items-center justify-between text-slate-700 hover:bg-slate-50 smooth-transition text-left w-full ${present.slug === p.slug ? "bg-blue-50/50 text-blue-600 hover:bg-blue-50/70" : ""
                      }`}
                  >
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono font-medium">/{p.slug}</span>
                    </div>
                    {present.slug === p.slug && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    setIsPageSelectorOpen(false);
                    setIsCreatePageOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl smooth-transition shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Page</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200" />

        <div className="flex flex-col">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Page Name"
            className="bg-transparent text-sm font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 smooth-transition w-36"
          />
          <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1 mt-0.5">
            <span>/view/</span>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="slug"
              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none text-blue-600 font-semibold font-mono w-24"
            />
          </div>
        </div>

        {/* Database Status Badge */}
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDbConnected
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            }`}
        >
          {isDbConnected ? "Cloud Sync" : "Local Storage"}
        </span>
      </div>

      {/* Breakpoint / Device Viewport Toggles */}
      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
        <button
          onClick={() => setActiveDevice("desktop")}
          title="Desktop layout preview"
          className={`p-1.5 rounded-md smooth-transition ${activeDevice === "desktop"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            }`}
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveDevice("tablet")}
          title="Tablet layout preview"
          className={`p-1.5 rounded-md smooth-transition ${activeDevice === "tablet"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            }`}
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveDevice("mobile")}
          title="Mobile layout preview"
          className={`p-1.5 rounded-md smooth-transition ${activeDevice === "mobile"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            }`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Editor History and Save Actions */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none smooth-transition"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none smooth-transition"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Global Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Global Site Settings"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm smooth-transition flex items-center justify-center cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Preview in Tab */}
        <a
          href="/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg smooth-transition shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </a>

        {/* Save Draft */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="flex items-center gap-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg smooth-transition disabled:opacity-50 shadow-sm"
        >
          {isSavedBanner ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{isSaving ? "Saving..." : isSavedBanner ? "Saved!" : "Save Draft"}</span>
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg smooth-transition disabled:opacity-50 shadow-sm shadow-blue-500/25"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
        </button>
      </div>

      {/* Global settings modal overlay */}
      {mounted && isSettingsOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Global Site Settings</span>
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium leading-normal">
                  Configure settings that apply across your entire website.
                </span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 smooth-transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingSettings ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading global settings...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* SkillDeck API Integration */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-4 shadow-sm flex-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">SkillDeck API Integration</span>

                    {/* Fixed Base URL */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-semibold">API Endpoint URL</label>
                      <div className="bg-slate-100 text-xs text-slate-500 border border-slate-200 rounded-lg p-2.5 font-medium select-none font-mono">
                        https://api.skilldeck.net/api/v1
                      </div>
                      <span className="text-[9px] text-slate-400 leading-normal font-medium">
                        Permanently configured for the application.
                      </span>
                    </div>

                    {/* Access Token Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-semibold">API Access Token (API Key)</label>
                      <input
                        type="password"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        placeholder="Enter your SkillDeck API key"
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full font-medium"
                        required
                      />
                      <span className="text-[9px] text-slate-400 leading-normal font-medium">
                        Used for courses, categories, blogs, testimonials, leads, and payment authorization.
                      </span>
                    </div>
                  </div>

                  {/* Website Branding Logo settings */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-4 shadow-sm flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Website Logo & Brand</span>
                      <span className="text-[9px] text-slate-400 leading-normal font-medium">
                        Set your brand&apos;s name and logo image URL to apply globally.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-semibold">Global Logo Text / Brand Name</label>
                      <input
                        type="text"
                        value={settingsLogoText}
                        onChange={(e) => setSettingsLogoText(e.target.value)}
                        placeholder="e.g. SkillDeck"
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-semibold">Global Logo Image URL</label>
                      <input
                        type="text"
                        value={settingsLogoImg}
                        onChange={(e) => setSettingsLogoImg(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Website Branding Colors */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-4 shadow-sm flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Website Branding Colors</span>
                      <span className="text-[9px] text-slate-400 leading-normal font-medium">
                        Set your brand&apos;s solid colors and custom gradient presets.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Solid Colors */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Theme Colors</span>
                        {/* Primary Color */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 font-semibold">Primary Color</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={settingsPrimary}
                              onChange={(e) => setSettingsPrimary(e.target.value)}
                              className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
                            />
                            <input
                              type="text"
                              value={settingsPrimary}
                              onChange={(e) => setSettingsPrimary(e.target.value)}
                              className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1 w-full font-mono focus:border-blue-600 focus:outline-none"
                              placeholder="#2563eb"
                            />
                          </div>
                        </div>

                        {/* Secondary Color */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 font-semibold">Secondary Color</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={settingsSecondary}
                              onChange={(e) => setSettingsSecondary(e.target.value)}
                              className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
                            />
                            <input
                              type="text"
                              value={settingsSecondary}
                              onChange={(e) => setSettingsSecondary(e.target.value)}
                              className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1 w-full font-mono focus:border-blue-600 focus:outline-none"
                              placeholder="#1e3a8a"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gradient Preset */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gradient Preset</span>
                        {/* Gradient Start */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 font-semibold">Gradient Start</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={settingsGradientStart}
                              onChange={(e) => setSettingsGradientStart(e.target.value)}
                              className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
                            />
                            <input
                              type="text"
                              value={settingsGradientStart}
                              onChange={(e) => setSettingsGradientStart(e.target.value)}
                              className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1 w-full font-mono focus:border-blue-600 focus:outline-none"
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>

                        {/* Gradient End */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-505 font-semibold">Gradient End</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={settingsGradientEnd}
                              onChange={(e) => setSettingsGradientEnd(e.target.value)}
                              className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
                            />
                            <input
                              type="text"
                              value={settingsGradientEnd}
                              onChange={(e) => setSettingsGradientEnd(e.target.value)}
                              className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1 w-full font-mono focus:border-blue-600 focus:outline-none"
                              placeholder="#1e3a8a"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Swatch */}
                    <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
                      <span className="text-[9px] text-slate-400 font-semibold select-none">Gradient Preview:</span>
                      <div className="flex-1 h-6 rounded-lg shadow-inner border border-slate-200 overflow-hidden">
                        <div
                          className="w-full h-full"
                          style={{ background: `linear-gradient(135deg, ${settingsGradientStart}, ${settingsGradientEnd})` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Spacing */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Section Spacing</span>
                    <span className="text-[9px] text-slate-400 leading-normal font-medium">
                      Controls the vertical gap between all page sections globally.
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {([
                      { label: "None", value: "0" },
                      { label: "XS", value: "2" },
                      { label: "SM", value: "4" },
                      { label: "MD", value: "6" },
                      { label: "LG", value: "8" },
                      { label: "XL", value: "12" },
                      { label: "2XL", value: "16" },
                      { label: "3XL", value: "24" },
                    ] as { label: string; value: string }[]).map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSettingsSectionGap(value)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border smooth-transition cursor-pointer ${
                          settingsSectionGap === value
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {label}
                        <span className={`ml-1 text-[9px] font-medium ${
                          settingsSectionGap === value ? "text-blue-200" : "text-slate-400"
                        }`}>{value === "0" ? "0px" : `${parseInt(value) * 4}px`}</span>
                      </button>
                    ))}
                  </div>
                  {/* Live preview of gap */}
                  <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400 font-semibold">Preview:</span>
                    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
                      {["Header", "Content", "Footer"].map((label, i) => (
                        <React.Fragment key={label}>
                          <div className="h-5 bg-slate-100 flex items-center px-2">
                            <span className="text-[9px] text-slate-400 font-medium">{label}</span>
                          </div>
                          {i < 2 && (
                            <div
                              className="bg-blue-100 transition-all duration-200"
                              style={{ height: `${Math.max(2, parseInt(settingsSectionGap) * 2)}px` }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl text-xs smooth-transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs smooth-transition shadow-md shadow-blue-500/10 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {savingSettings && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{savingSettings ? "Saving..." : "Save Settings"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Create Page Modal overlay */}
      {mounted && isCreatePageOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-slate-805">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Create New Page</span>
                </h3>
                <span className="text-[10px] text-slate-405 mt-0.5 font-medium leading-normal">
                  Add a new page layout to your website project.
                </span>
              </div>
              <button
                onClick={() => setIsCreatePageOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-105 text-slate-400 hover:text-slate-700 smooth-transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreatingPage(true);
                const success = await onCreatePage(newPageName, newPageSlug);
                setCreatingPage(false);
                if (success) {
                  setNewPageName("");
                  setNewPageSlug("");
                  setIsCreatePageOpen(false);
                }
              }}
              className="flex flex-col gap-4 text-left"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-semibold">Page Name</label>
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    const autoSlug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-");
                    setNewPageSlug(autoSlug);
                  }}
                  placeholder="e.g. About Us"
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-505 font-semibold">URL Path (Slug)</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium select-none">/view/</span>
                  <input
                    type="text"
                    value={newPageSlug}
                    onChange={(e) => {
                      const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
                      setNewPageSlug(cleaned);
                    }}
                    placeholder="about-us"
                    className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full font-mono"
                    required
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePageOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl text-xs smooth-transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs smooth-transition shadow-md shadow-blue-500/10 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {creatingPage && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
