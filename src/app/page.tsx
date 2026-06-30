"use client";

import React, { useEffect, useState } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { Header } from "@/components/builder/Header";
import { SidebarLeft } from "@/components/builder/SidebarLeft";
import { Canvas } from "@/components/builder/Canvas";
import { SidebarRight } from "@/components/builder/SidebarRight";
import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor 
} from "@dnd-kit/core";

export default function BuilderPage() {
  const { 
    present, 
    loadPage, 
    addComponentToSection, 
    reorderSections, 
    reorderComponents,
    setSaved
  } = useBuilderStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Setup sensors for dnd-kit to prevent triggering drag on simple clicks/inputs
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires moving 8px before dragging starts
      },
    })
  );

  // Load draft from DB or LocalStorage on mount
  useEffect(() => {
    async function loadInitialData() {
      // 1. Fetch site settings (apiKey, globalHeader, globalFooter)
      try {
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.success && settingsData.settings) {
            const updateObj: any = {};
            if (settingsData.settings.globalHeader) updateObj.globalHeader = settingsData.settings.globalHeader;
            if (settingsData.settings.globalFooter) updateObj.globalFooter = settingsData.settings.globalFooter;
            if (settingsData.settings.primaryColor) updateObj.primaryColor = settingsData.settings.primaryColor;
            if (settingsData.settings.secondaryColor) updateObj.secondaryColor = settingsData.settings.secondaryColor;
            if (settingsData.settings.gradientStart) updateObj.gradientStart = settingsData.settings.gradientStart;
            if (settingsData.settings.gradientEnd) updateObj.gradientEnd = settingsData.settings.gradientEnd;
            if (settingsData.settings.logoImg !== undefined) updateObj.logoImg = settingsData.settings.logoImg;
            if (settingsData.settings.logoText !== undefined) updateObj.logoText = settingsData.settings.logoText;
            if (settingsData.settings.sectionGap !== undefined) updateObj.sectionGap = settingsData.settings.sectionGap;
            useBuilderStore.setState(updateObj);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch settings from DB on mount:", err);
      }

      // 2. Fetch active page draft
      try {
        const res = await fetch("/api/pages/home");
        
        // If the database response is active (not a 503 service unavailable error)
        if (res.status !== 503) {
          setIsDbConnected(true);
          
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.page) {
              loadPage({
                name: data.page.name,
                slug: data.page.slug,
                sections: data.page.content.sections || [],
              });
              setLoading(false);
              return;
            }
          } else if (res.status === 404) {
            // Database is connected, but the default 'home' page doesn't exist yet.
            // We remain in Cloud Sync mode and display the default layout state.
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("MongoDB is offline or not configured. Falling back to LocalStorage.");
      }

      // LocalStorage fallback
      setIsDbConnected(false);
      const savedData = localStorage.getItem("builder-draft-home");
      const localHeader = localStorage.getItem("builder-global-header");
      const localFooter = localStorage.getItem("builder-global-footer");
      const localLogoImg = localStorage.getItem("builder-logo-img");
      const localLogoText = localStorage.getItem("builder-logo-text");
      const localPrimaryColor = localStorage.getItem("builder-primary-color");
      const localSecondaryColor = localStorage.getItem("builder-secondary-color");
      const localGradientStart = localStorage.getItem("builder-gradient-start");
      const localGradientEnd = localStorage.getItem("builder-gradient-end");

      const updateObj: any = {};
      if (localHeader) {
        try { updateObj.globalHeader = JSON.parse(localHeader); } catch (e) {}
      }
      if (localFooter) {
        try { updateObj.globalFooter = JSON.parse(localFooter); } catch (e) {}
      }
      if (localLogoImg !== null) updateObj.logoImg = localLogoImg;
      if (localLogoText) updateObj.logoText = localLogoText;
      if (localPrimaryColor) updateObj.primaryColor = localPrimaryColor;
      if (localSecondaryColor) updateObj.secondaryColor = localSecondaryColor;
      if (localGradientStart) updateObj.gradientStart = localGradientStart;
      if (localGradientEnd) updateObj.gradientEnd = localGradientEnd;
      useBuilderStore.setState(updateObj);

      if (savedData) {
        try {
          loadPage(JSON.parse(savedData));
        } catch (e) {
          console.error("Failed to parse LocalStorage data", e);
        }
      }
      setLoading(false);
    }

    loadInitialData();
  }, [loadPage]);

  // Handle Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    const { globalHeader, globalFooter, primaryColor, secondaryColor, gradientStart, gradientEnd, logoImg, logoText } = useBuilderStore.getState();
    
    if (isDbConnected) {
      try {
        // Save global settings
        await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            globalHeader,
            globalFooter,
            primaryColor,
            secondaryColor,
            gradientStart,
            gradientEnd,
            logoImg,
            logoText,
          }),
        });

        // Save page content
        const res = await fetch(`/api/pages/${present.slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: present.name,
            slug: present.slug,
            content: {
              sections: present.sections,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSaved(true);
            setIsSaving(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to save to database. Saving to LocalStorage instead.", err);
      }
    }

    // Fallback save to LocalStorage
    localStorage.setItem(`builder-draft-${present.slug}`, JSON.stringify(present));
    localStorage.setItem("builder-global-header", JSON.stringify(globalHeader));
    localStorage.setItem("builder-global-footer", JSON.stringify(globalFooter));
    localStorage.setItem("builder-logo-img", logoImg || "");
    localStorage.setItem("builder-logo-text", logoText || "");
    localStorage.setItem("builder-primary-color", primaryColor);
    localStorage.setItem("builder-secondary-color", secondaryColor);
    localStorage.setItem("builder-gradient-start", gradientStart);
    localStorage.setItem("builder-gradient-end", gradientEnd);
    setSaved(true);
    setIsSaving(false);
  };

  // Handle Publish Live
  const handlePublishLive = async () => {
    setIsPublishing(true);
    
    // Auto-save first
    await handleSaveDraft();

    if (isDbConnected) {
      try {
        const res = await fetch(`/api/pages/${present.slug}/publish`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            alert(`Page published successfully! Available at /view/${present.slug}`);
            setIsPublishing(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to publish to database. Publishing to LocalStorage.", err);
      }
    }

    // LocalStorage fallback publish
    localStorage.setItem(`builder-published-${present.slug}`, JSON.stringify(present));
    alert(`Published offline! Simulated deployment is active at /view/${present.slug} (LocalStorage mode)`);
    setIsPublishing(false);
  };

  // Handle Page Switching
  const handlePageSwitch = async (targetSlug: string) => {
    if (targetSlug === present.slug) return;

    // 1. Auto-save current page draft first
    await handleSaveDraft();

    setLoading(true);
    try {
      if (isDbConnected) {
        const res = await fetch(`/api/pages/${targetSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.page) {
            loadPage({
              name: data.page.name,
              slug: data.page.slug,
              sections: data.page.content.sections || [],
            });
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load page from database. Trying LocalStorage.");
    }

    // LocalStorage fallback
    const savedData = localStorage.getItem(`builder-draft-${targetSlug}`);
    if (savedData) {
      try {
        loadPage(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse LocalStorage data", e);
      }
    } else {
      // Create empty page if it doesn't exist
      loadPage({
        name: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1) + " Page",
        slug: targetSlug,
        sections: [],
      });
    }
    setLoading(false);
  };

  // Handle Page Creation
  const handleCreatePage = async (name: string, slug: string): Promise<boolean> => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!name || !cleanSlug) return false;

    if (isDbConnected) {
      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug: cleanSlug,
            content: { sections: [] },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            await handlePageSwitch(cleanSlug);
            return true;
          }
        } else {
          const data = await res.json();
          alert(data.message || "Failed to create page");
          return false;
        }
      } catch (err: any) {
        console.error("Failed to create page in DB:", err);
      }
    }

    // Offline / LocalStorage fallback
    const localPagesList = localStorage.getItem("builder-pages-list");
    let pages = [{ name: "Home Page", slug: "home" }];
    if (localPagesList) {
      try {
        pages = JSON.parse(localPagesList);
      } catch (e) {}
    }
    if (!pages.some((p) => p.slug === cleanSlug)) {
      pages.push({ name, slug: cleanSlug });
      localStorage.setItem("builder-pages-list", JSON.stringify(pages));
    }

    await handlePageSwitch(cleanSlug);
    return true;
  };

  // Handle drag completions
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;

    // 1. Drag & Drop: Dragging from left palette sidebar to canvas
    if (activeType === "palette-component") {
      const sectionId = over.data.current?.sectionId;
      const componentType = active.data.current?.componentType;
      
      // Guard: navbar and footer are global-only components managed via Settings.
      // They must not be added to page sections to avoid duplicate rendering.
      if (componentType === "navbar" || componentType === "footer") {
        return;
      }

      if (sectionId && componentType) {
        addComponentToSection(sectionId, componentType);
      }
      return;
    }

    // 2. Drag & Drop: Reordering sections vertically
    if (activeType === "section" && over.data.current?.type === "section") {
      if (active.id !== over.id) {
        reorderSections(active.id.toString(), over.id.toString());
      }
      return;
    }

    // 3. Drag & Drop: Reordering components inside a section
    if (activeType === "component" && over.data.current?.type === "component") {
      const activeSecId = active.data.current?.sectionId;
      const overSecId = over.data.current?.sectionId;
      
      if (activeSecId === overSecId && active.id !== over.id) {
        reorderComponents(activeSecId, active.id.toString(), over.id.toString());
      }
      return;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Loading layout canvas...
        </span>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
        {/* Top Control Header */}
        <Header
          onSave={handleSaveDraft}
          onPublish={handlePublishLive}
          isSaving={isSaving}
          isPublishing={isPublishing}
          isDbConnected={isDbConnected}
          onPageSwitch={handlePageSwitch}
          onCreatePage={handleCreatePage}
        />

        {/* Content Workspace Panels */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <SidebarLeft />
          <Canvas />
          <SidebarRight />
        </div>
      </div>
    </DndContext>
  );
}
