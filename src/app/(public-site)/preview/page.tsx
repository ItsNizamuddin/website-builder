"use client";

import React, { useEffect, useState } from "react";
import { PageData } from "@/types/builder";
import { RenderComponent } from "@/components/builder/ComponentRegistry";
import { gridCols } from "@/components/builder/Canvas";
import { getSectionStyles } from "@/utils/styleHelper";
import { Eye, ArrowLeft } from "lucide-react";

interface GlobalSettings {
  logoImg: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  logoImg: "",
  logoText: "SkillDeck",
  primaryColor: "#2563eb",
  secondaryColor: "#1e3a8a",
  gradientStart: "#3b82f6",
  gradientEnd: "#1e3a8a",
};

export default function PreviewPage() {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);

  // Load global branding settings (logo, colors) independently from page content
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setGlobalSettings({
              logoImg: data.settings.logoImg || "",
              logoText: data.settings.logoText || "SkillDeck",
              primaryColor: data.settings.primaryColor || "#2563eb",
              secondaryColor: data.settings.secondaryColor || "#1e3a8a",
              gradientStart: data.settings.gradientStart || "#3b82f6",
              gradientEnd: data.settings.gradientEnd || "#1e3a8a",
            });
            return;
          }
        }
      } catch (err) {
        console.warn("Settings API unavailable, trying LocalStorage fallback.");
      }
      // LocalStorage fallback for offline support
      setGlobalSettings({
        logoImg: localStorage.getItem("builder-logo-img") || "",
        logoText: localStorage.getItem("builder-logo-text") || "SkillDeck",
        primaryColor: localStorage.getItem("builder-primary-color") || "#2563eb",
        secondaryColor: localStorage.getItem("builder-secondary-color") || "#1e3a8a",
        gradientStart: localStorage.getItem("builder-gradient-start") || "#3b82f6",
        gradientEnd: localStorage.getItem("builder-gradient-end") || "#1e3a8a",
      });
    }
    loadSettings();
  }, []);

  useEffect(() => {
    async function loadPreview() {
      // 1. Load page draft from DB
      try {
        const res = await fetch("/api/pages/home");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.page) {
            setPage({
              name: data.page.name,
              slug: data.page.slug,
              sections: data.page.content.sections || [],
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("DB offline, checking LocalStorage for preview.");
      }

      // 2. Fallback to LocalStorage page draft
      const savedData = localStorage.getItem("builder-draft-home");
      if (savedData) {
        try {
          setPage(JSON.parse(savedData));
        } catch (err) {
          console.error("Failed to parse LocalStorage data", err);
        }
      }
      setLoading(false);
    }

    loadPreview();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loading layout preview...
        </span>
      </div>
    );
  }

  const hasContent = page && page.sections.length > 0;

  if (!hasContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[400px]">
        <h1 className="text-xl font-bold text-slate-800">No content to preview</h1>
        <p className="text-sm text-slate-500 mt-2">Go back to the builder and add some sections first.</p>
        <button
          onClick={() => window.close()}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm smooth-transition shadow-sm cursor-pointer"
        >
          Close Preview
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Floating preview badge/controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 px-4 py-2.5 rounded-full backdrop-blur-md shadow-xl flex items-center gap-3 z-50">
        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold uppercase tracking-wider">
          <Eye className="w-4 h-4" />
          <span>Preview Mode</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={() => window.close()}
          className="flex items-center gap-1 text-xs text-slate-655 hover:text-slate-800 smooth-transition cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Editor</span>
        </button>
      </div>

      {/* Rendered Layout Page — CSS vars applied so var(--color-primary) resolves in components */}
      <div
        className="w-full flex-1 flex flex-col gap-8"
        style={{
          "--color-primary": globalSettings.primaryColor,
          "--color-secondary": globalSettings.secondaryColor,
          "--color-gradient-start": globalSettings.gradientStart,
          "--color-gradient-end": globalSettings.gradientEnd,
        } as React.CSSProperties}
      >
        {page && page.sections.map((section) => {
          // Skip sections whose EVERY child is a navbar or footer —
          // the layout shell already renders the global header/footer from Settings.
          const LAYOUT_MANAGED_TYPES = new Set(["navbar", "footer"]);
          const isLayoutManagedSection = section.children.every(
            (child) => LAYOUT_MANAGED_TYPES.has(child.type)
          );
          if (isLayoutManagedSection) return null;

          // In mixed sections, skip individual navbar/footer children too
          const visibleChildren = section.children.filter(
            (child) => !LAYOUT_MANAGED_TYPES.has(child.type)
          );
          if (visibleChildren.length === 0) return null;

          const desktopClass = gridCols.desktop[section.layout.desktop as keyof typeof gridCols.desktop] || "lg:grid-cols-1";
          const tabletClass = gridCols.tablet[section.layout.tablet as keyof typeof gridCols.tablet] || "md:grid-cols-1";
          const mobileClass = gridCols.mobile[section.layout.mobile as keyof typeof gridCols.mobile] || "grid-cols-1";

          const { outerClasses, outerInlineStyle, innerClasses } = getSectionStyles(section.style);

          return (
            <div key={section.id} className={`w-full ${outerClasses}`} style={outerInlineStyle}>
              <div className={`${innerClasses}`}>
                <div className={`grid gap-6 ${desktopClass} ${tabletClass} ${mobileClass}`}>
                  {visibleChildren.map((child) => (
                    <div key={child.id} className="w-full">
                      <RenderComponent
                        node={{
                          ...child,
                          props: {
                            ...child.props,
                            globalLogoImg: globalSettings.logoImg,
                            globalLogoText: globalSettings.logoText,
                          },
                        }}
                        mode="preview"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
