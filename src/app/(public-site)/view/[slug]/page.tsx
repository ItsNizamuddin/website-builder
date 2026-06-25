"use client";

import React, { useEffect, useState, use } from "react";
import { PageData } from "@/types/builder";
import { RenderComponent } from "@/components/builder/ComponentRegistry";
import { gridCols } from "@/components/builder/Canvas";
import { getSectionStyles } from "@/utils/styleHelper";
import { Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ViewPageProps {
  params: Promise<{ slug: string }>;
}

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

export default function ViewPage({ params }: ViewPageProps) {
  const { slug } = use(params);
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflinePublished, setIsOfflinePublished] = useState(false);
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
    async function loadPublishedPage() {
      // 1. Load page published content
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.page) {
            const published = data.page.publishedContent;
            if (published && published.sections && published.sections.length > 0) {
              setPage({
                name: data.page.name,
                slug: data.page.slug,
                sections: published.sections,
              });
              setLoading(false);
              return;
            } else {
              setError("This page is not published yet.");
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("DB offline, checking LocalStorage for published site.");
      }

      // 2. Fallback to LocalStorage
      const savedData = localStorage.getItem(`builder-published-${slug === "home" ? "home" : slug}`);
      if (savedData) {
        try {
          setPage(JSON.parse(savedData));
          setIsOfflinePublished(true);
        } catch (err) {
          console.error("Failed to parse LocalStorage data", err);
          setError("Failed to load published content.");
        }
      } else {
        setError("This page has not been published yet.");
      }
      setLoading(false);
    }

    loadPublishedPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loading published page...
        </span>
      </div>
    );
  }

  const hasContent = page && page.sections.length > 0;

  if (error || !hasContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[400px]">
        <h1 className="text-xl font-bold text-slate-800">{error || "Page Not Found"}</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          The requested page URL `/view/${slug}` does not have any published layouts.
        </p>
        <Link
          href="/"
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm flex items-center gap-1.5 smooth-transition shadow-lg shadow-blue-900/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Open Web Builder</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Offline publish banner indicator */}
      {isOfflinePublished && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-center gap-2 text-xs text-amber-600 select-none">
          <Globe className="w-3.5 h-3.5" />
          <span>You are viewing a local offline published preview. Set up MongoDB for a cloud-hosted view.</span>
        </div>
      )}

      {/* Rendered Published Sections Layout — CSS vars applied so var(--color-primary) works in components */}
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
          // Skip sections whose EVERY child is a navbar or footer:
          // layout.tsx already renders the global header/footer from Settings,
          // so rendering them again inside page sections creates duplicates.
          const LAYOUT_MANAGED_TYPES = new Set(["navbar", "footer"]);
          const isLayoutManagedSection = section.children.every(
            (child) => LAYOUT_MANAGED_TYPES.has(child.type)
          );
          if (isLayoutManagedSection) return null;

          // In mixed sections, still skip individual navbar/footer children
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
