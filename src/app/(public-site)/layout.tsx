"use client";

import React, { useEffect, useState } from "react";
import { ComponentNode } from "@/types/builder";
import { RenderComponent } from "@/components/builder/ComponentRegistry";

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [globalHeader, setGlobalHeader] = useState<ComponentNode | null>(null);
  const [globalFooter, setGlobalFooter] = useState<ComponentNode | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#1e3a8a");
  const [gradientStart, setGradientStart] = useState("#3b82f6");
  const [gradientEnd, setGradientEnd] = useState("#1e3a8a");
  const [logoImg, setLogoImg] = useState("");
  const [logoText, setLogoText] = useState("SkillDeck");
  const [sectionGap, setSectionGap] = useState("8");

  useEffect(() => {
    async function loadGlobalSettings() {
      let apiSucceeded = false;

      // 1. Fetch from settings API
      try {
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.success && settingsData.settings) {
            apiSucceeded = true;
            setGlobalHeader(settingsData.settings.globalHeader || null);
            setGlobalFooter(settingsData.settings.globalFooter || null);
            if (settingsData.settings.primaryColor) setPrimaryColor(settingsData.settings.primaryColor);
            if (settingsData.settings.secondaryColor) setSecondaryColor(settingsData.settings.secondaryColor);
            if (settingsData.settings.gradientStart) setGradientStart(settingsData.settings.gradientStart);
            if (settingsData.settings.gradientEnd) setGradientEnd(settingsData.settings.gradientEnd);
            if (settingsData.settings.logoImg !== undefined) setLogoImg(settingsData.settings.logoImg);
            if (settingsData.settings.logoText !== undefined) setLogoText(settingsData.settings.logoText);
            if (settingsData.settings.sectionGap !== undefined) setSectionGap(settingsData.settings.sectionGap);
          }
        }
      } catch (err) {
        console.warn("Failed to load global settings in layout:", err);
      }

      // 2. LocalStorage fallback — only used when API failed
      if (!apiSucceeded) {
        const localHeader = localStorage.getItem("builder-global-header");
        const localFooter = localStorage.getItem("builder-global-footer");
        const localLogoImg = localStorage.getItem("builder-logo-img");
        const localLogoText = localStorage.getItem("builder-logo-text");
        const localPrimary = localStorage.getItem("builder-primary-color");
        const localSecondary = localStorage.getItem("builder-secondary-color");
        const localGradStart = localStorage.getItem("builder-gradient-start");
        const localGradEnd = localStorage.getItem("builder-gradient-end");

        if (localHeader) {
          try { setGlobalHeader(JSON.parse(localHeader)); } catch (e) { }
        }
        if (localFooter) {
          try { setGlobalFooter(JSON.parse(localFooter)); } catch (e) { }
        }
        if (localLogoImg !== null) setLogoImg(localLogoImg);
        if (localLogoText) setLogoText(localLogoText);
        if (localPrimary) setPrimaryColor(localPrimary);
        if (localSecondary) setSecondaryColor(localSecondary);
        if (localGradStart) setGradientStart(localGradStart);
        if (localGradEnd) setGradientEnd(localGradEnd);
        const localGap = localStorage.getItem("builder-section-gap");
        if (localGap) setSectionGap(localGap);
      }
    }

    loadGlobalSettings();
  }, []);


  return (
    <div
      className={`min-h-screen bg-white text-slate-800 font-sans flex flex-col ${
        sectionGap === "4" ? "gap-4" : sectionGap === "12" ? "gap-12" : sectionGap === "16" ? "gap-16" : "gap-8"
      }`}
      style={{
        "--color-primary": primaryColor,
        "--color-secondary": secondaryColor,
        "--color-gradient-start": gradientStart,
        "--color-gradient-end": gradientEnd,
      } as React.CSSProperties}
    >
      {/* Global Header */}
      {globalHeader && (
        <div className="w-full shrink-0 bg-transparent">
          <RenderComponent
            node={{
              ...globalHeader,
              props: {
                ...globalHeader.props,
                globalLogoImg: logoImg,
                globalLogoText: logoText,
              }
            }}
            mode="preview"
          />
        </div>
      )}

      {/* Rendered Page Sections Layout */}
      <main className="w-full flex-1 flex flex-col">
        {children}
      </main>

      {/* Global Footer */}
      {globalFooter && (
        <div className="w-full shrink-0">
          <RenderComponent
            node={{
              ...globalFooter,
              props: {
                ...globalFooter.props,
                globalLogoImg: logoImg,
                globalLogoText: logoText,
              }
            }}
            mode="preview"
          />
        </div>
      )}
    </div>
  );
}
