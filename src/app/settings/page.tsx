"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, ShieldCheck, Palette, Image as ImageIcon, Layout,
  CheckCircle2, AlertCircle, Eye, EyeOff, Copy, Check, Sparkles, Sliders, RefreshCw
} from "lucide-react";

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState<"api" | "theme" | "branding" | "layout">("api");

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#1e3a8a");
  const [gradientStart, setGradientStart] = useState("#3b82f6");
  const [gradientEnd, setGradientEnd] = useState("#1e3a8a");
  const [logoText, setLogoText] = useState("SkillDeck");
  const [logoImg, setLogoImg] = useState("");
  const [sectionGap, setSectionGap] = useState("8");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setApiKey(data.settings.apiKey || "");
          setPrimaryColor(data.settings.primaryColor || "#2563eb");
          setSecondaryColor(data.settings.secondaryColor || "#1e3a8a");
          setGradientStart(data.settings.gradientStart || "#3b82f6");
          setGradientEnd(data.settings.gradientEnd || "#1e3a8a");
          setLogoText(data.settings.logoText || "SkillDeck");
          setLogoImg(data.settings.logoImg || "");
          setSectionGap(data.settings.sectionGap || "8");
        }
      })
      .catch((err) => console.error("Error loading settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          primaryColor,
          secondaryColor,
          gradientStart,
          gradientEnd,
          logoText,
          logoImg,
          sectionGap,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("builder-section-gap", sectionGap);
        setSuccessMsg("Settings updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to save settings: " + (data.message || "Unknown error"));
      }
    } catch (err: any) {
      setErrorMsg("Error connecting to server: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
          <span>Loading Global Studio Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased select-none flex flex-col">
      {/* 1. TOP HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-xs shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to Studio Builder</span>
          </Link>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Project Settings</h1>
            <p className="text-[10px] text-slate-400 font-medium">Manage your design tokens, APIs, and brand assets</p>
          </div>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </header>

      {/* 2. MAIN STATIC MASTER-DETAIL LAYOUT */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto my-8 px-6 gap-8">

        {/* LEFT VERTICAL SIDEBAR MENU */}
        <aside className="w-64 shrink-0 flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">Workspace</span>

          <button
            onClick={() => setActiveTab("api")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left cursor-pointer ${activeTab === "api"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200/60 shadow-xs"
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <div className="flex flex-col">
              <span>API Authentication</span>
              <span className={`text-[9px] font-medium ${activeTab === "api" ? "text-blue-100" : "text-slate-400"}`}>Keys &amp; Cloud Tokens</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left cursor-pointer ${activeTab === "theme"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200/60 shadow-xs"
              }`}
          >
            <Palette className="w-4 h-4" />
            <div className="flex flex-col">
              <span>Theme Colors</span>
              <span className={`text-[9px] font-medium ${activeTab === "theme" ? "text-blue-100" : "text-slate-400"}`}>Palette &amp; Gradients</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left cursor-pointer ${activeTab === "branding"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200/60 shadow-xs"
              }`}
          >
            <ImageIcon className="w-4 h-4" />
            <div className="flex flex-col">
              <span>Brand Identity</span>
              <span className={`text-[9px] font-medium ${activeTab === "branding" ? "text-blue-100" : "text-slate-400"}`}>Logo &amp; Assets</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("layout")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left cursor-pointer ${activeTab === "layout"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200/60 shadow-xs"
              }`}
          >
            <Layout className="w-4 h-4" />
            <div className="flex flex-col">
              <span>Layout &amp; Spacing</span>
              <span className={`text-[9px] font-medium ${activeTab === "layout" ? "text-blue-100" : "text-slate-400"}`}>Section Gaps</span>
            </div>
          </button>
        </aside>

        {/* RIGHT DETAIL CONTENT PANEL */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Notifications */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: API AUTHENTICATION */}
          {activeTab === "api" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">API &amp; Authentication Key</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Manage project access tokens for secure API and database queries.</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Cloud API Active</span>
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-extrabold text-slate-700">Project Security Token / API Key</label>
                <div className="relative w-full flex items-center">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-24 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600 font-bold shadow-inner"
                  />
                  <div className="absolute right-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                      title={showApiKey ? "Hide Key" : "Show Key"}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Keep this secret. Do not expose this key in public client repositories.</span>
              </div>
            </div>
          )}

          {/* TAB 2: THEME COLORS & LIVE PREVIEW */}
          {activeTab === "theme" && (
            <div className="flex flex-col gap-6">
              {/* CONTROLS */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col gap-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-extrabold text-slate-900">Color Tokens</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Custom color palettes and gradients used across components.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Primary Color</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border-0 cursor-pointer shadow-xs" />
                      <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-transparent text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none w-full" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Secondary Color</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                      <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-xl border-0 cursor-pointer shadow-xs" />
                      <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="bg-transparent text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none w-full" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Gradient Start</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                      <input type="color" value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} className="w-10 h-10 rounded-xl border-0 cursor-pointer shadow-xs" />
                      <input type="text" value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} className="bg-transparent text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none w-full" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Gradient End</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                      <input type="color" value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} className="w-10 h-10 rounded-xl border-0 cursor-pointer shadow-xs" />
                      <input type="text" value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} className="bg-transparent text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRAND IDENTITY */}
          {activeTab === "branding" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900">Brand Identity</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Set your website brand title and navigation logo asset.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Brand Name / Logo Text</label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="Brand Name"
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Logo Image URL</label>
                  <input
                    type="text"
                    value={logoImg}
                    onChange={(e) => setLogoImg(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* LIVE LOGO BADGE PREVIEW */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Header Navigation Preview</span>
                  <span className="text-xs font-medium text-slate-600 mt-0.5">How your brand logo appears on the site navbar</span>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-xs">
                  {logoImg ? (
                    <img src={logoImg} alt="Logo" className="h-6 w-auto object-contain" />
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                      {logoText.charAt(0) || "S"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & SPACING */}
          {activeTab === "layout" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col gap-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-900">Layout &amp; Grid Spacing</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Define global vertical gaps between canvas sections on published pages.</p>
              </div>

              {/* VISUAL SPACING PRESET CARDS */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-extrabold text-slate-700">Select Default Section Gap</label>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { val: "4", label: "Small", px: "16px", utility: "gap-4" },
                    { val: "8", label: "Medium", px: "32px", utility: "gap-8", recommended: true },
                    { val: "12", label: "Large", px: "48px", utility: "gap-12" },
                    { val: "16", label: "Extra Large", px: "64px", utility: "gap-16" },
                  ].map((preset) => {
                    const isSelected = sectionGap === preset.val;
                    return (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setSectionGap(preset.val)}
                        className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left cursor-pointer relative ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700"
                        }`}
                      >
                        {preset.recommended && (
                          <span className="absolute top-2.5 right-2.5 text-[9px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        <span className={`text-xs font-black ${isSelected ? "text-blue-600" : "text-slate-900"}`}>
                          {preset.label}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 font-mono mt-1">{preset.px}</span>
                        <span className="text-[9px] font-medium text-slate-400 font-mono mt-0.5">{preset.utility}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* REAL-TIME BOX MODEL GAP PREVIEW DIAGRAM */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Real-Time Spacing Diagram</span>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full font-mono">
                    Vertical Gap: {sectionGap === "4" ? "16px" : sectionGap === "8" ? "32px" : sectionGap === "12" ? "48px" : "64px"}
                  </span>
                </div>

                <div className="flex flex-col items-center py-4 bg-white border border-slate-200/80 rounded-xl px-6">
                  {/* Mock Section 1 */}
                  <div className="w-full h-10 bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500">
                    Canvas Section 1
                  </div>

                  {/* Dynamic Gap Marker */}
                  <div
                    className="w-full flex items-center justify-center bg-blue-50 border-y border-blue-200 text-blue-600 text-[10px] font-extrabold font-mono relative my-1 transition-all"
                    style={{
                      height: sectionGap === "4" ? "24px" : sectionGap === "8" ? "40px" : sectionGap === "12" ? "56px" : "72px",
                    }}
                  >
                    <div className="absolute left-4 w-px h-full bg-blue-400" />
                    <span>↕ Gap Space ({sectionGap === "4" ? "16px" : sectionGap === "8" ? "32px" : sectionGap === "12" ? "48px" : "64px"})</span>
                    <div className="absolute right-4 w-px h-full bg-blue-400" />
                  </div>

                  {/* Mock Section 2 */}
                  <div className="w-full h-10 bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500">
                    Canvas Section 2
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
