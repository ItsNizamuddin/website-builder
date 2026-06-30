"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useBuilderStore } from "@/store/useBuilderStore";
import { Undo, Redo, Monitor, Tablet, Smartphone, Save, Eye, Send, Check, X, Loader2, ChevronDown, FileText, Plus } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

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
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md px-5 flex items-center justify-between shrink-0 select-none z-50 shadow-xs">
      {/* Project Status Configuration */}
      <div className="flex items-center gap-3.5">

        {/* Database Status Badge */}
        <span
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDbConnected
            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            }`}
        >
          {isDbConnected ? "Cloud Sync" : "Local Storage"}
        </span>
      </div>

      {/* Breakpoint / Device Viewport Toggles */}
      <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/80 p-1 rounded-xl">
        <button
          onClick={() => setActiveDevice("desktop")}
          title="Desktop layout preview"
          className={`p-1.5 rounded-lg smooth-transition ${activeDevice === "desktop"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
            }`}
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveDevice("tablet")}
          title="Tablet layout preview"
          className={`p-1.5 rounded-lg smooth-transition ${activeDevice === "tablet"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
            }`}
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveDevice("mobile")}
          title="Mobile layout preview"
          className={`p-1.5 rounded-lg smooth-transition ${activeDevice === "mobile"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
            }`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Editor History and Save Actions */}
      <div className="flex items-center gap-2.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2.5 mr-0.5">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none smooth-transition"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none smooth-transition"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Preview in Tab */}
        <a
          href="/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl smooth-transition shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </a>

        {/* Save Draft */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl smooth-transition disabled:opacity-50 shadow-xs"
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
          className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-xl smooth-transition disabled:opacity-50 shadow-xs shadow-blue-500/20 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
        </button>
      </div>

      {/* Create Page Modal overlay */}
      {mounted && isCreatePageOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 text-slate-800">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Create New Page</span>
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium leading-normal">
                  Add a new page layout to your website project.
                </span>
              </div>
              <button
                onClick={() => setIsCreatePageOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 smooth-transition cursor-pointer"
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
                <label className="text-[10px] text-slate-500 font-semibold">URL Path (Slug)</label>
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
                  className="px-4 py-2 border border-slate-200 text-slate-6 shadow-none font-bold rounded-xl text-xs smooth-transition cursor-pointer"
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
