"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, GraduationCap, X, Menu, Headset, MessageSquare, Info, ArrowRight, ExternalLink, Phone } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { ComponentProps, resolveThemeColor } from "./shared";

// Helper component for recursive multi-level dropdowns
const DropdownMenu: React.FC<{
  items: any[];
  mode?: "edit" | "preview";
  handleLinkClick: (e: React.MouseEvent) => void;
  depth?: number;
  align?: "left" | "right";
}> = ({ items, mode, handleLinkClick, depth = 0, align = "right" }) => {
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);

  return (
    <div
      className={`absolute ${depth === 0
        ? `${align === "left" ? "left-0" : "right-0"} mt-2.5 w-48 before:content-[''] before:absolute before:w-full before:h-3 before:-top-3 before:left-0 before:bg-transparent`
        : "left-full top-0 ml-1.5 w-48 before:content-[''] before:absolute before:h-full before:w-2.5 before:-left-2.5 before:top-0 before:bg-transparent"
        } bg-white border border-slate-200 rounded-xl shadow-xl py-2 flex flex-col z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
    >
      {(items || []).map((item: any, idx: number) => {
        if (item.type === "divider") {
          return <div key={idx} className="h-px bg-slate-100 my-1.5" />;
        }
        if (item.type === "header") {
          return (
            <div key={idx} className="px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none">
              {item.label}
            </div>
          );
        }
        if (item.type === "button") {
          const isPrimary = item.variant === "primary";
          const isOutline = item.variant === "outline";
          const btnClass = isPrimary
            ? "mx-2 my-1 px-3 py-1.5 text-white rounded-lg text-[11px] font-bold text-center shadow-sm"
            : isOutline
              ? "mx-2 my-1 px-3 py-1.5 border hover-bg-primary-light hover:text-white rounded-lg text-[11px] font-bold text-center"
              : "mx-2 my-1 px-3 py-1.5 hover:bg-slate-50 text-slate-705 rounded-lg text-[11px] font-bold text-center";
          const btnStyle = isPrimary
            ? { backgroundColor: "var(--color-primary)" }
            : isOutline
              ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" }
              : {};
          return (
            <a
              key={idx}
              href={item.url || "#"}
              onClick={handleLinkClick}
              className={`${btnClass} smooth-transition`}
              style={btnStyle}
            >
              {item.label || "Action"}
            </a>
          );
        }

        const isSubDropdown = item.type === "dropdown";
        const isOpen = openSubIndex === idx;

        if (isSubDropdown) {
          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setOpenSubIndex(idx)}
              onMouseLeave={() => setOpenSubIndex(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.nativeEvent) {
                    e.nativeEvent.stopImmediatePropagation();
                  }
                  setOpenSubIndex(isOpen ? null : idx);
                }}
                className="w-full px-4 py-2 text-xs font-bold text-slate-600 hover-text-primary hover:bg-slate-50 smooth-transition flex items-center justify-between cursor-pointer select-none text-left"
              >
                <span>{item.label || "Sub Menu"}</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>
              {isOpen && item.items && (
                <DropdownMenu
                  items={item.items}
                  mode={mode}
                  handleLinkClick={handleLinkClick}
                  depth={depth + 1}
                />
              )}
            </div>
          );
        }

        return (
          <a
            key={idx}
            href={item.url || "#"}
            onClick={handleLinkClick}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover-text-primary smooth-transition block text-left"
          >
            {item.label || "Sub Link"}
          </a>
        );
      })}
    </div>
  );
};

const DEFAULT_CATEGORIES_DATA: any[] = [
  {
    id: "mock-cat-1",
    name: "Project Management",
    description: "Master globally recognized project management methods",
    courses: [
      { title: "PMP® Certification Training PMBOK 8th", details: "Online • 35 Hours", badge: "Trending", url: "#" },
      { title: "CAPM Certification Training", details: "Online • 23 Hours", badge: "", url: "#" },
      { title: "PRINCE2® Foundation And Practitioner Certification Training", details: "Online • 32 Hours", badge: "Accredited", url: "#" },
      { title: "Program Management Professional (PgMP)® Certification", details: "Online • 30 Hours", badge: "Expert", url: "#" }
    ]
  },
  {
    id: "mock-cat-2",
    name: "Agile & Scrum",
    description: "Learn agile frameworks and speed up software delivery",
    courses: [
      { title: "Certified ScrumMaster (CSM)® Certification", details: "Online • 16 Hours", badge: "Popular", url: "#" },
      { title: "PMI-ACP® Certification Prep", details: "Online • 21 Hours", badge: "", url: "#" }
    ]
  },
  {
    id: "mock-cat-3",
    name: "Business Analysis",
    description: "Bridge business needs with technical solutions",
    courses: [
      { title: "CBAP® Certification Training", details: "Online • 35 Hours", badge: "Professional", url: "#" }
    ]
  }
];

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-extrabold" style={{ color: "var(--color-primary)" }}>
            {part}
          </span>
        ) : (
          <span key={i} className="font-normal text-slate-700">{part}</span>
        )
      )}
    </>
  );
};

const getBadgeStyle = (badgeName: string): { bg: string; customStyle?: React.CSSProperties } => {
  if (!badgeName) return { bg: "bg-slate-100 text-slate-600" };
  const styles: { bg: string; customStyle?: React.CSSProperties }[] = [
    { bg: "", customStyle: { backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)", color: "var(--color-primary)" } },
    { bg: "bg-emerald-50 text-emerald-700 border border-emerald-100/50" },
    { bg: "bg-indigo-50 text-indigo-700 border border-indigo-100/50" },
    { bg: "bg-amber-50 text-amber-700 border border-amber-100/50" },
    { bg: "bg-purple-50 text-purple-700 border border-purple-100/50" },
    { bg: "bg-rose-50 text-rose-700 border border-rose-100/50" },
    { bg: "bg-cyan-50 text-cyan-700 border border-cyan-100/50" },
    { bg: "bg-teal-50 text-teal-700 border border-teal-100/50" }
  ];
  let hash = 0;
  const name = badgeName.trim().toLowerCase();
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % styles.length;
  return styles[idx];
};

export const NavbarComp: React.FC<ComponentProps> = ({ props, mode }) => {
  const {
    logoText = "skilldeck",
    showLogo = true,
    logoImg = "",
    logoUrl = "/",
    logoFontSize = "text-lg",
    linkFontSize = "text-xs",
    showCategories = true,
    categoriesText = "All Categories",
    categoriesData: initialCategoriesData = DEFAULT_CATEGORIES_DATA,
    categoriesDropdownWidth = "800px",
    categoriesDropdownHeight = "450px",
    showSearch = true,
    searchPlaceholder = "What you want to learn today?",
    links = [
      { type: "dropdown", label: "Resources", items: [{ label: "Blog", url: "#" }, { label: "Tutorials", url: "#" }] },
      { type: "link", label: "Enterprise", url: "#" },
      { type: "dropdown", label: "Contact Us", items: [{ label: "Support Desk", url: "#" }] }
    ],
    ctaText = "Login / Signup",
    ctaUrl = "#",
    bgStyle = "gradient",
    bgColor = "#ffffff",
    bgGradient = "from-white to-white",
    textColor = "#0f172a",
    ctaColor = "#0f172a",
    contentMaxWidth = "6xl",
    searchWidth = "320px",
    marginTop = "mt-0",
    marginBottom = "mb-0",
    useGlobalLogo = true,
    globalLogoImg = "",
    globalLogoText = "",
    showLogoText = true,
    useGlobalLogoImg,
    useGlobalLogoText,
    itemsGap = "gap-4",
    useBackendCategories = true,
    customCategoriesData = [],
    mobileShowCategories = true,
    mobileShowSearch = true,
    mobileShowHelp = true,
    mobileHelpTitle = "Didn't find what you need?",
    mobileHelpSubtitle = "We'll help you find it",
    mobileHelpBtnText = "Call Us",
    mobileHelpPhone = "tel:+1234567890",
    mobileBgColor = "#ffffff",
    mobileTextColor = "#0f172a",
    mobileCtaBgColor = "",
    mobileCtaTextColor = "#ffffff",
    previewMobileDrawer = false,
    mobileHelpBgColor = "",
    mobileHelpTextColor = "",
    mobileHelpBtnColor = "",
    mobileHelpActionType = "phone",
    mobileHelpIconType = "question",
    mobileHelpBtnIconType = "phone",
    mobileHelpCardStyle = "card"
  } = props;

  const isEdit = mode === "edit";
  const { activeDevice } = useBuilderStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDrawerOpen = mobileMenuOpen || (isEdit && activeDevice !== "desktop" && previewMobileDrawer === true);
  const [openMobileCatIdx, setOpenMobileCatIdx] = useState<number | null>(null);
  const [openMobileDropdownIdx, setOpenMobileDropdownIdx] = useState<number | null>(null);

  const useImgGlobal = useGlobalLogoImg !== undefined ? useGlobalLogoImg : (useGlobalLogo !== false);

  const logoImgToUse = useImgGlobal ? (globalLogoImg || logoImg) : logoImg;
  const logoTextToUse = logoText || globalLogoText || "SkillDeck";

  const [categoriesData, setCategoriesData] = useState<any[]>(initialCategoriesData);

  const categoriesToUse = (useBackendCategories !== false && Array.isArray(categoriesData) && categoriesData.length > 0)
    ? categoriesData
    : (Array.isArray(customCategoriesData) && customCategoriesData.length > 0)
      ? customCategoriesData
      : DEFAULT_CATEGORIES_DATA;

  const hasCategories = Array.isArray(categoriesToUse) && categoriesToUse.length > 0;
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{ courses: any[]; articles: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategoriesData(initialCategoriesData);
  }, [initialCategoriesData]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const mapped = data.categories.map((cat: any) => ({
            id: cat._id,
            name: cat.name,
            description: "Explore our comprehensive course offerings",
            courses: (cat.courses || []).map((course: any) => ({
              title: course.course_name,
              details: `${course.courseCard?.courseMode || "Online"} • ${course.courseCard?.courseDuration || ""}`,
              badge: course.courseCard?.courseTag || "",
              url: `/courses/${course.slug}`
            }))
          }));
          setCategoriesData(mapped);
        }
      })
      .catch((err) => console.error("Error fetching navbar categories:", err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" || !searchQuery.trim()) return;
    if (mode === "preview") {
      alert(`Searching for: ${searchQuery}`);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const closeAll = (e: MouseEvent) => {
      if (mode === "edit" && e.target) {
        let current = e.target as HTMLElement | null;
        while (current) {
          if (
            current.tagName === "ASIDE" ||
            current.id?.includes("sidebar") ||
            (typeof current.className === "string" && (
              current.className.includes("sidebar") ||
              current.className.includes("color-picker") ||
              current.className.includes("preset-swatch")
            ))
          ) {
            return;
          }
          current = current.parentElement;
        }
      }
      setOpenDropdown(null);
      setCategoriesOpen(false);
    };
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, [mode]);

  useEffect(() => {
    if (searchQuery.trim().length < 1 || mode === "edit") {
      setSearchResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const url = `/api/search?q=${encodeURIComponent(searchQuery)}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data) => {
          setSearchResults({
            courses: data.courses || [],
            articles: data.articles || []
          });
        })
        .catch((err) => {
          console.error("Local Search Proxy API Error:", err);
          setSearchResults({ courses: [], articles: [] });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, mode]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (mode === "edit") e.preventDefault();
  };

  const isFullWidth = props.navbarWidth === "full-width" || props.navbarWidth === "full";
  const contentMaxWidthClass = {
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full px-4 sm:px-8",
  }[contentMaxWidth as string] || "max-w-6xl";

  const navStyle: React.CSSProperties = {
    color: textColor
  };
  let bgClass = "";
  if (bgStyle === "solid") {
    navStyle.backgroundColor = bgColor;
  } else {
    bgClass = `bg-gradient-to-r ${bgGradient}`;
  }

  const finalMarginTop = isFullWidth ? "mt-0" : (marginTop || "mt-4");

  const shadowClass = props.navbarVariant === "no-shadow" ? "shadow-none border-b border-slate-200" : "shadow-sm border border-slate-200/80";

  const navLayoutClasses = isFullWidth
    ? `relative w-full py-4 px-4 sm:px-8 border-b border-slate-200/80 flex items-center justify-between ${itemsGap} ${bgClass} ${finalMarginTop} ${marginBottom}`
    : `relative w-full ${contentMaxWidthClass} mx-auto py-4 px-4 sm:px-6 rounded-xl ${shadowClass} flex items-center justify-between ${itemsGap} ${bgClass} ${finalMarginTop} ${marginBottom}`;

  const isCentered = props.navbarVariant === "center";

  const content = (
    <>
      {/* Left items: Logo & Categories */}
      <div className={`flex items-center ${itemsGap} shrink-0`}>
        {/* Logo (Left or Centered) */}
        {showLogo && (
          <a
            href={logoUrl || "#"}
            onClick={handleLinkClick}
            className={`font-extrabold ${logoFontSize} tracking-tight cursor-pointer flex items-center gap-2 shrink-0 hover:opacity-90 ${
              isCentered ? "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20" : ""
            }`}
            style={{ color: textColor }}
          >
            {logoImgToUse ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoImgToUse} alt="Logo" className="h-8 w-auto max-w-[150px] object-contain rounded" />
            ) : (
              <GraduationCap className="w-5 h-5" style={{ color: textColor || "var(--color-primary)" }} />
            )}
            {(!logoImgToUse || showLogoText) && <span>{logoTextToUse}</span>}
          </a>
        )}

        {/* Categories Button as Mega Dropdown */}
        {showCategories && (
          <div
            className={`${categoriesDropdownWidth === "full-width" ? "" : "relative"} z-50 ${
              isEdit ? (activeDevice === "desktop" ? "block" : "hidden") : "hidden lg:block"
            }`}
            onMouseEnter={props.categoriesTrigger !== "click" ? () => {
              setCategoriesOpen(true);
              setOpenDropdown(null);
              setActiveCategoryIdx(0);
            } : undefined}
            onMouseLeave={props.categoriesTrigger !== "click" && mode !== "edit" ? () => setCategoriesOpen(false) : undefined}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                setCategoriesOpen(!categoriesOpen);
                setOpenDropdown(null);
                setActiveCategoryIdx(0);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg smooth-transition shrink-0 select-none cursor-pointer hover:brightness-110"
              style={{
                backgroundColor: props.categoriesBgColor || "#0f172a",
                color: props.categoriesTextColor || "#ffffff"
              }}
            >
              {props.showCategoriesIcon !== false && (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="4" height="4" rx="1" />
                  <rect x="10" y="3" width="4" height="4" rx="1" />
                  <rect x="17" y="3" width="4" height="4" rx="1" />
                  <rect x="3" y="10" width="4" height="4" rx="1" />
                  <rect x="10" y="10" width="4" height="4" rx="1" />
                  <rect x="17" y="10" width="4" height="4" rx="1" />
                  <rect x="3" y="17" width="4" height="4" rx="1" />
                  <rect x="10" y="17" width="4" height="4" rx="1" />
                  <rect x="17" y="17" width="4" height="4" rx="1" />
                </svg>
              )}
              <span>{categoriesText}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-inherit/80 smooth-transition ${categoriesOpen ? "rotate-180 text-inherit" : ""}`} />
            </button>
            {categoriesOpen && hasCategories && (
              <div
                style={categoriesDropdownWidth === "full-width" ? {} : { width: categoriesDropdownWidth }}
                className={`absolute ${categoriesDropdownWidth === "full-width" ? "left-0 right-0" : "left-0"} top-full mt-2.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 before:content-[''] before:absolute before:w-full before:h-10 before:-top-10 before:left-0 before:bg-transparent`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.nativeEvent) {
                    e.nativeEvent.stopImmediatePropagation();
                  }
                }}
              >
                <div
                  style={{ height: categoriesDropdownHeight }}
                  className="flex divide-x divide-slate-100 rounded-2xl overflow-hidden"
                >
                  {/* Left Categories List */}
                  <div className="w-1/3 min-w-[240px] bg-slate-50/50 p-4 overflow-y-auto flex flex-col gap-1 select-none">
                    <span className="text-[10px] font-bold text-slate-400 px-3 mb-2 tracking-wider uppercase">Categories</span>
                    {categoriesToUse.map((cat: any, idx: number) => {
                      const isActive = idx === activeCategoryIdx;
                      return (
                        <div
                          key={cat.id || idx}
                          onMouseEnter={props.categorySwitchMode !== "click" ? () => setActiveCategoryIdx(idx) : undefined}
                          onClick={() => setActiveCategoryIdx(idx)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${isActive
                            ? "text-white shadow-md shadow-black/5"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          style={isActive ? { backgroundColor: "var(--color-primary)" } : {}}
                        >
                          <span>{cat.name || "Category Name"}</span>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Category Details and Courses List */}
                  <div className="w-2/3 p-6 overflow-y-auto flex flex-col gap-5 text-left bg-white">
                    {categoriesToUse[activeCategoryIdx] && (
                      <>
                        {/* Category Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-4">
                            {props.showCategoryIcon !== false && (
                              <div
                                className="p-2 rounded-xl shadow-sm shrink-0"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                                  color: "var(--color-primary)"
                                }}
                              >
                                <GraduationCap className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug">
                                {categoriesToUse[activeCategoryIdx].name || "Category Name"}
                              </h3>
                              {props.showCategoryDesc !== false && (
                                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                                  {categoriesToUse[activeCategoryIdx].description || "Explore our comprehensive course offerings"}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Explore Link */}
                          {props.showCategoryExplore !== false && (
                            <a
                              href="#"
                              onClick={handleLinkClick}
                              className="text-xs font-bold hover:underline flex items-center shrink-0 mt-0 transition-all duration-150"
                            >
                              <span className="text-slate-500">Explore</span>
                              <span className="ml-1" style={{ color: "var(--color-primary)" }}>{categoriesToUse[activeCategoryIdx].name}</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-0.5" style={{ color: "var(--color-primary)" }} />
                            </a>
                          )}
                        </div>
                        {/* Course Listing */}
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col gap-2">
                            {(categoriesToUse[activeCategoryIdx].courses || []).map((course: any, cIdx: number) => {
                              const styleInfo = getBadgeStyle(course.badge || "");
                              const badgeStyle = styleInfo.bg;
                              const badgeCustomStyle = styleInfo.customStyle || {};

                              return (
                                <a
                                  key={cIdx}
                                  href={course.url || "#"}
                                  onClick={handleLinkClick}
                                  className="p-3 rounded-xl border border-slate-100 hover-border-primary hover-bg-primary-light smooth-transition flex items-start justify-between gap-4 group cursor-pointer"
                                >
                                  <div className="flex-1 flex flex-col gap-1 text-left">
                                    {props.showCourseDetails !== false && (
                                      <span className="text-[10px] text-slate-400 font-medium leading-none">
                                        {course.details || "Online Course"}
                                      </span>
                                    )}
                                    {props.showCourseName !== false && (
                                      <h4 className="text-xs font-bold text-slate-800 group-hover-text-primary smooth-transition leading-snug">
                                        {course.title || "Course Title"}
                                      </h4>
                                    )}
                                  </div>
                                  {props.showCourseBadge !== false && course.badge && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${badgeStyle}`}
                                      style={badgeCustomStyle}
                                    >
                                      {course.badge}
                                    </span>
                                  )}
                                </a>
                              );
                            })}
                            {(categoriesToUse[activeCategoryIdx].courses || []).length === 0 && (
                              <div className="text-slate-400 text-xs italic text-center py-6">
                                No courses listed under this category yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {categoriesOpen && !hasCategories && (
              <div
                style={categoriesDropdownWidth === "full-width" ? {} : { width: "320px" }}
                className="absolute left-0 top-full mt-2.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-6 text-center text-slate-400 text-xs font-semibold leading-normal animate-in fade-in duration-150"
              >
                No categories found. Configure your API key in settings to fetch backend courses.
              </div>
            )}
          </div>
        )}

        {/* Navigation Links on Left when Centered */}
        {isCentered && (
          <div className={`${isEdit ? (activeDevice === "desktop" ? "flex" : "hidden") : "hidden lg:flex"} items-center ${itemsGap}`}>
            {links.map((link: any, idx: number) => {
              const isDropdown = link.type === "dropdown";
              const isOpen = openDropdown === idx;
              if (isDropdown) {
                return (
                  <div
                    key={idx}
                    className="relative z-50"
                    onMouseEnter={props.dropdownTrigger !== "click" ? () => setOpenDropdown(idx) : undefined}
                    onMouseLeave={props.dropdownTrigger !== "click" ? () => setOpenDropdown(null) : undefined}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
                        setOpenDropdown(isOpen ? null : idx);
                      }}
                      className={`flex items-center gap-1.5 ${linkFontSize} font-bold hover:opacity-80 smooth-transition cursor-pointer select-none`}
                      style={{ color: textColor }}
                    >
                      <span>{link.label || "Dropdown"}</span>
                      <ChevronDown className="w-3.5 h-3.5 smooth-transition opacity-80" style={{ color: textColor }} />
                    </button>
                    {isOpen && link.items && (
                      <DropdownMenu items={link.items} mode={mode} handleLinkClick={handleLinkClick} />
                    )}
                  </div>
                );
              }
              return (
                <a
                  key={idx}
                  href={link.url || "#"}
                  onClick={handleLinkClick}
                  className={`${linkFontSize} font-bold hover:opacity-80 smooth-transition`}
                  style={{ color: textColor }}
                >
                  {link.label || "Link"}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Middle Item: Search Input (when not centered) */}
      {showSearch && !isCentered && (
        <div
          className={`relative ${
            isEdit ? (activeDevice === "desktop" ? "block" : "hidden") : "hidden lg:block"
          } w-full`}
          style={{ maxWidth: searchWidth }}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 bg-slate-100 border border-slate-200/60 px-3.5 py-2.5 rounded-xl text-slate-400 w-full focus-within:bg-white focus-border-primary focus-ring-primary transition-all duration-150"
          >
            <button
              type="submit"
              disabled={mode === "edit"}
              className="p-0 border-0 bg-transparent text-slate-400 hover-text-primary cursor-pointer disabled:cursor-default disabled:hover:text-slate-400 flex items-center justify-center"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsSearchFocused(false);
                }
              }}
              placeholder={searchPlaceholder}
              disabled={mode === "edit"}
              className="bg-transparent text-xs text-slate-700 outline-none w-0 min-w-0 flex-1 placeholder-slate-400 disabled:cursor-default truncate"
            />
          </form>

          {isSearchFocused && searchQuery.trim().length >= 1 && (
            <div className="absolute top-full left-0 right-0 w-full mt-2.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-3 max-h-[380px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 flex flex-col text-slate-800 scrollbar-thin">
              {loading ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2 select-none">
                  <svg className="animate-spin h-4 w-4" style={{ color: "var(--color-primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Searching...</span>
                </div>
              ) : (() => {
                const courses = searchResults?.courses || [];
                const articles = searchResults?.articles || [];

                if (courses.length === 0 && articles.length === 0) {
                  return (
                    <div className="px-4 py-8 text-center text-xs text-slate-400 font-medium">
                      No matches found for <span className="font-semibold text-slate-650">"{searchQuery}"</span>
                    </div>
                  );
                }

                return (
                  <>
                    {courses.length > 0 && (
                      <div className="flex flex-col text-left">
                        <div className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none bg-slate-50/50">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>Courses</span>
                        </div>
                        <div className="flex flex-col py-1">
                          {courses.map((c: any, idx: number) => (
                            <a
                              key={`course-${idx}`}
                              href={c.url || "#"}
                              onClick={(e) => {
                                handleLinkClick(e);
                                if (mode === "preview") {
                                  alert(`Navigating to course: ${c.title}`);
                                }
                              }}
                              className="px-4 py-2 hover:bg-slate-50 text-[11px] block text-left smooth-transition truncate"
                            >
                              {highlightText(c.title, searchQuery)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {articles.length > 0 && (
                      <div className="flex flex-col text-left border-t border-slate-100 mt-1">
                        <div className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none bg-slate-50/50">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" />
                            <path d="M6 6h10M6 10h10" strokeLinecap="round" />
                          </svg>
                          <span>Resources & Articles</span>
                        </div>
                        <div className="flex flex-col py-1">
                          {articles.map((art: any, idx: number) => (
                            <a
                              key={`art-${idx}`}
                              href={art.url || "#"}
                              onClick={(e) => {
                                handleLinkClick(e);
                                if (mode === "preview") {
                                  alert(`Navigating to article: ${art.title}`);
                                }
                              }}
                              className="px-4 py-2 hover:bg-slate-50 text-[11px] block text-left smooth-transition truncate"
                            >
                              {highlightText(art.title, searchQuery)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={mode === "edit"}
                      className="w-full py-2.5 bg-slate-50 hover-bg-primary-light text-[9px] font-extrabold tracking-wider uppercase text-slate-500 hover-text-primary text-center border-t border-slate-100 smooth-transition cursor-pointer disabled:cursor-default mt-1"
                    >
                      View All Results for "{searchQuery.toUpperCase()}"
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Right Items: Links & CTA */}
      <div className={`flex items-center ${itemsGap} shrink-0 ml-auto`}>
        {/* Search Bar when Centered */}
        {showSearch && isCentered && (
          <div
            className={`relative ${
              isEdit ? (activeDevice === "desktop" ? "block" : "hidden") : "hidden lg:block"
            } w-48`}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl text-slate-400 w-full focus-within:bg-white transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                disabled={mode === "edit"}
                className="bg-transparent text-xs text-slate-700 outline-none w-0 min-w-0 flex-1 placeholder-slate-400 disabled:cursor-default truncate"
              />
            </form>
          </div>
        )}

        {/* Navigation Links with Dropdowns (only if not centered) */}
        {!isCentered && (
          <div className={`${isEdit ? (activeDevice === "desktop" ? "flex" : "hidden") : "hidden lg:flex"} items-center ${itemsGap}`}>
            {links.map((link: any, idx: number) => {
              const isDropdown = link.type === "dropdown";
              const isButton = link.type === "button";
              const isOpen = openDropdown === idx;

              if (isDropdown) {
                return (
                  <div
                    key={idx}
                    className="relative z-50"
                    onMouseEnter={props.dropdownTrigger !== "click" ? () => setOpenDropdown(idx) : undefined}
                    onMouseLeave={props.dropdownTrigger !== "click" ? () => setOpenDropdown(null) : undefined}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent) {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        setOpenDropdown(isOpen ? null : idx);
                      }}
                      className={`flex items-center gap-1.5 ${linkFontSize} font-bold hover:opacity-80 smooth-transition cursor-pointer select-none`}
                      style={{ color: textColor }}
                    >
                      <span>{link.label || "Dropdown"}</span>
                      <ChevronDown className="w-3.5 h-3.5 smooth-transition opacity-80" style={{ color: textColor }} />
                    </button>

                    {isOpen && link.items && (
                      <DropdownMenu
                        items={link.items}
                        mode={mode}
                        handleLinkClick={handleLinkClick}
                      />
                    )}
                  </div>
                );
              }

              if (isButton) {
                const isPrimary = link.variant === "primary";
                const isOutline = link.variant === "outline";
                const btnClass = isPrimary
                  ? "px-4 py-2 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 smooth-transition"
                  : isOutline
                    ? "px-4 py-2 border hover-bg-primary-light rounded-lg text-xs font-bold smooth-transition"
                    : "px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold smooth-transition";
                const btnStyle = isPrimary
                  ? { backgroundColor: "var(--color-primary)" }
                  : isOutline
                    ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" }
                    : {};
                return (
                  <a
                    key={idx}
                    href={link.url || "#"}
                    onClick={handleLinkClick}
                    className={`${btnClass}`}
                    style={btnStyle}
                  >
                    {link.label || "Action"}
                  </a>
                );
              }

              return (
                <a
                  key={idx}
                  href={link.url || "#"}
                  onClick={handleLinkClick}
                  className={`${linkFontSize} font-bold hover:opacity-80 smooth-transition`}
                  style={{ color: textColor }}
                >
                  {link.label || "Link"}
                </a>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        {ctaText && (
          <div className={isEdit ? (activeDevice === "desktop" ? "block" : "hidden") : "hidden lg:block"}>
            <a
              href={ctaUrl}
              onClick={handleLinkClick}
              className="px-4 py-2 border font-bold rounded-lg text-xs hover:bg-blue-50/15 smooth-transition shadow-sm"
              style={{
                color: resolveThemeColor(ctaColor, "#0f172a", "var(--color-primary)"),
                borderColor: resolveThemeColor(ctaColor, "#0f172a", "var(--color-primary)")
              }}
            >
              {ctaText}
            </a>
          </div>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className={`${
            isEdit ? (activeDevice === "desktop" ? "hidden" : "flex") : "flex lg:hidden"
          } items-center justify-center p-2 rounded-xl border cursor-pointer smooth-transition`}
          style={{
            borderColor: `color-mix(in srgb, ${textColor || '#0f172a'} 20%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${textColor || '#0f172a'} 5%, transparent)`,
            color: textColor || "#0f172a"
          }}
        >
          {isDrawerOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );

  return (
    <div className="relative w-full">
      <nav
        className={navLayoutClasses}
        style={navStyle}
      >
        {isFullWidth ? (
          <div className={`w-full ${contentMaxWidthClass} mx-auto flex items-center justify-between gap-3 sm:gap-4 relative`}>
            {content}
          </div>
        ) : (
          content
        )}
      </nav>
      
      {/* Mobile Menu Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className={`${
            isEdit ? (activeDevice === "desktop" ? "hidden" : "fixed") : "fixed lg:hidden"
          } inset-0 bg-black/40 z-9999 flex justify-end items-start animate-in fade-in duration-200`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 text-left"
            onClick={(e) => {
              e.stopPropagation();
              if (e.nativeEvent) {
                e.nativeEvent.stopImmediatePropagation();
              }
            }}
            style={{
              backgroundColor: mobileBgColor || "#ffffff",
              color: mobileTextColor || "#0f172a",
              height: isEdit ? "75vh" : "100%"
            }}
          >
            {/* Drawer Header */}
            <div 
              className="flex items-center justify-between p-4 border-b select-none"
              style={{
                borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 10%, transparent)`
              }}
            >
              <a
                href={logoUrl || "#"}
                onClick={(e) => {
                  handleLinkClick(e);
                  setMobileMenuOpen(false);
                }}
                className="font-extrabold text-base tracking-tight flex items-center gap-2 hover:opacity-90 smooth-transition"
                style={{ color: mobileTextColor || "#0f172a" }}
              >
                {logoImgToUse ? (
                  <img src={logoImgToUse} alt="Logo" className="h-7 w-auto max-w-[120px] object-contain rounded" />
                ) : (
                  <GraduationCap className="w-5 h-5" style={{ color: mobileTextColor || "#0f172a" }} />
                )}
                {(!logoImgToUse || showLogoText) && <span>{logoTextToUse}</span>}
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl border cursor-pointer smooth-transition"
                style={{
                  borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 15%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 5%, transparent)`,
                  color: mobileTextColor || "#0f172a"
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              {mobileShowSearch !== false && (
                <div className="relative w-full">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center gap-2 border px-3.5 py-2.5 rounded-xl w-full transition-all duration-150"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 5%, transparent)`,
                      borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 15%, transparent)`,
                      color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 60%, transparent)`
                    }}
                  >
                    <button
                      type="submit"
                      disabled={mode === "edit"}
                      className="p-0 border-0 bg-transparent text-inherit hover:text-blue-500 cursor-pointer disabled:cursor-default flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.3-4.3" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsSearchFocused(false);
                        }
                      }}
                      placeholder={searchPlaceholder}
                      className="bg-transparent text-xs outline-none w-full placeholder:text-inherit"
                      style={{
                        color: mobileTextColor || "#0f172a"
                      }}
                    />
                  </form>

                  {/* Mobile Search Results Dropdown */}
                  {isSearchFocused && searchQuery.trim().length >= 1 && (
                    <div 
                      className="absolute top-full left-0 right-0 w-full mt-1.5 bg-white border rounded-2xl shadow-xl z-50 py-2.5 max-h-[280px] overflow-y-auto flex flex-col text-slate-800 scrollbar-thin"
                      style={{
                        borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 15%, transparent)`
                      }}
                    >
                      {loading ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2 select-none">
                          <svg className="animate-spin h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Searching...</span>
                        </div>
                      ) : (() => {
                        const courses = searchResults?.courses || [];
                        const articles = searchResults?.articles || [];

                        if (courses.length === 0 && articles.length === 0) {
                          return (
                            <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                              No matches found for <span className="font-semibold">"{searchQuery}"</span>
                            </div>
                          );
                        }

                        return (
                          <>
                            {courses.length > 0 && (
                              <div className="flex flex-col text-left">
                                <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 bg-slate-50/50">
                                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Courses</span>
                                </div>
                                <div className="flex flex-col py-0.5">
                                  {courses.map((c: any, idx: number) => (
                                    <a
                                      key={`course-${idx}`}
                                      href={c.url || "#"}
                                      onClick={(e) => {
                                        handleLinkClick(e);
                                        setMobileMenuOpen(false);
                                        if (mode === "preview") {
                                          alert(`Navigating to course: ${c.title}`);
                                        }
                                      }}
                                      className="px-4 py-1.5 hover:bg-slate-50 text-[11px] block text-left truncate"
                                    >
                                      {highlightText(c.title, searchQuery)}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {articles.length > 0 && (
                              <div className="flex flex-col text-left border-t border-slate-100 mt-1">
                                <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 bg-slate-50/50">
                                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" />
                                    <path d="M6 6h10M6 10h10" strokeLinecap="round" />
                                  </svg>
                                  <span>Resources & Articles</span>
                                </div>
                                <div className="flex flex-col py-0.5">
                                  {articles.map((art: any, idx: number) => (
                                    <a
                                      key={`art-${idx}`}
                                      href={art.url || "#"}
                                      onClick={(e) => {
                                        handleLinkClick(e);
                                        setMobileMenuOpen(false);
                                        if (mode === "preview") {
                                          alert(`Navigating to article: ${art.title}`);
                                        }
                                      }}
                                      className="px-4 py-1.5 hover:bg-slate-50 text-[11px] block text-left truncate"
                                    >
                                      {highlightText(art.title, searchQuery)}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={mode === "edit"}
                              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[9px] font-extrabold tracking-wider uppercase text-slate-500 text-center border-t border-slate-100 smooth-transition cursor-pointer disabled:cursor-default mt-1"
                              onClick={(e) => {
                                handleSearchSubmit(e);
                                setMobileMenuOpen(false);
                              }}
                            >
                              View All Results
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Unified Menu Stack */}
              <div 
                className="flex flex-col text-left divide-y"
                style={{
                  borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 8%, transparent)`
                }}
              >
                {/* Item 1: Categories Accordion (if enabled) */}
                {mobileShowCategories !== false && (
                  <div className="flex flex-col py-1">
                    {/* Categories Accordion Header Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent) {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        setCategoriesOpen(!categoriesOpen);
                        setOpenMobileCatIdx(null); // Reset category selection when collapsing/expanding
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-3 text-xs font-bold text-left cursor-pointer select-none transition-colors"
                      style={{
                        color: mobileTextColor || "#0f172a"
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {props.showCategoriesIcon !== false && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="4" height="4" rx="1" />
                            <rect x="10" y="3" width="4" height="4" rx="1" />
                            <rect x="17" y="3" width="4" height="4" rx="1" />
                            <rect x="3" y="10" width="4" height="4" rx="1" />
                            <rect x="10" y="10" width="4" height="4" rx="1" />
                            <rect x="17" y="10" width="4" height="4" rx="1" />
                            <rect x="3" y="17" width="4" height="4" rx="1" />
                            <rect x="10" y="17" width="4" height="4" rx="1" />
                            <rect x="17" y="17" width="4" height="4" rx="1" />
                          </svg>
                        )}
                        <span>{categoriesText}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 40%, transparent)` }} />
                    </button>

                    {/* Categories Accordion Level 2 Content */}
                    {categoriesOpen && (
                      <div className="flex flex-col pb-2 pl-3 divide-y divide-slate-100/50">
                        {hasCategories ? (
                          categoriesToUse.map((cat: any, idx: number) => {
                            const isCatOpen = openMobileCatIdx === idx;
                            return (
                              <div key={cat.id || idx} className="flex flex-col py-1">
                                {/* Level 2: Category Name (Accordion Header) */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (e.nativeEvent) {
                                      e.nativeEvent.stopImmediatePropagation();
                                    }
                                    setOpenMobileCatIdx(isCatOpen ? null : idx);
                                  }}
                                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-left cursor-pointer select-none transition-colors"
                                  style={{
                                    color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 90%, transparent)`
                                  }}
                                >
                                  <span>{cat.name}</span>
                                  <ChevronDown className="w-3 h-3 transition-transform duration-200" style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 30%, transparent)`, transform: isCatOpen ? "rotate(180deg)" : "none" }} />
                                </button>

                                {/* Level 3: Course Links */}
                                {isCatOpen && (
                                  <div className="pl-6 pr-2.5 py-1.5 flex flex-col gap-2">
                                    {(cat.courses || []).map((course: any, cIdx: number) => (
                                      <a
                                        key={cIdx}
                                        href={course.url || "#"}
                                        onClick={(e) => {
                                          handleLinkClick(e);
                                          setMobileMenuOpen(false);
                                        }}
                                        className="py-1 text-[11px] font-medium block text-left transition-colors"
                                        style={{
                                          color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 70%, transparent)`
                                        }}
                                      >
                                        {course.title}
                                      </a>
                                    ))}
                                    {(cat.courses || []).length === 0 && (
                                      <span className="text-[10px] italic py-1 text-left" style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 40%, transparent)` }}>No courses listed</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 text-[11px] italic text-left" style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 45%, transparent)` }}>
                            No categories configured.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Item 2+: Standard Navigation Links */}
                {links.map((link: any, idx: number) => {
                  if (link.type === "divider") return <div key={idx} className="h-px my-1" style={{ backgroundColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 10%, transparent)` }} />;
                  if (link.type === "header") return <span key={idx} className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-2.5 select-none" style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 40%, transparent)` }}>{link.label}</span>;
                  
                  const isDropdown = link.type === "dropdown";
                  if (isDropdown) {
                    const isDropdownOpen = openMobileDropdownIdx === idx;
                    return (
                      <div key={idx} className="flex flex-col py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.nativeEvent) {
                              e.nativeEvent.stopImmediatePropagation();
                            }
                            setOpenMobileDropdownIdx(isDropdownOpen ? null : idx);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-3 text-xs font-bold text-left cursor-pointer select-none transition-colors"
                          style={{
                            color: mobileTextColor || "#0f172a"
                          }}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 40%, transparent)`, transform: isDropdownOpen ? "rotate(180deg)" : "none" }} />
                        </button>
                        {isDropdownOpen && link.items && (
                          <div className="pl-6 pr-2.5 pb-2.5 flex flex-col gap-2">
                            {link.items.map((item: any, sIdx: number) => (
                              <a
                                key={sIdx}
                                href={item.url || "#"}
                                onClick={(e) => {
                                  handleLinkClick(e);
                                  setMobileMenuOpen(false);
                                }}
                                className="text-[11px] font-medium block text-left py-1"
                                style={{
                                  color: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 80%, transparent)`
                                }}
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={idx}
                      href={link.url || "#"}
                      onClick={(e) => {
                        handleLinkClick(e);
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-3 text-xs font-bold block text-left transition-colors"
                      style={{
                        color: mobileTextColor || "#0f172a"
                      }}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            {((mobileShowHelp !== false) || (ctaText && ctaText.trim() !== "")) && (
              <div 
                className="p-4 border-t flex flex-col gap-3 shrink-0"
                style={{
                  borderColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 10%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${mobileTextColor || '#0f172a'} 3%, transparent)`
                }}
              >
                {/* Help Widget / Didn't find what you need? */}
                {mobileShowHelp !== false && (() => {
                  const helpHref = mobileHelpActionType === "phone"
                    ? (mobileHelpPhone.startsWith("tel:") ? mobileHelpPhone : `tel:${mobileHelpPhone}`)
                    : mobileHelpPhone;

                  const isFlat = mobileHelpCardStyle === "flat";
                  const containerClass = isFlat
                    ? "flex items-center gap-3 py-3 w-full border-t text-left"
                    : "flex items-center gap-3 p-3.5 rounded-2xl border shadow-xs text-left";

                  const containerStyle: React.CSSProperties = isFlat
                    ? {
                        backgroundColor: "transparent",
                        borderColor: `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 10%, transparent)`
                      }
                    : {
                        backgroundColor: mobileHelpBgColor || mobileBgColor || "#ffffff",
                        borderColor: `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 15%, transparent)`
                      };

                  return (
                    <div className={containerClass} style={containerStyle}>
                      {mobileHelpIconType !== "none" && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 animate-in fade-in"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 8%, transparent)`
                          }}
                        >
                          {mobileHelpIconType === "question" && (
                            <span className="font-extrabold text-sm" style={{ color: mobileHelpTextColor || mobileTextColor || "#0f172a" }}>?</span>
                          )}
                          {mobileHelpIconType === "headset" && (
                            <Headset className="w-4 h-4" style={{ color: mobileHelpTextColor || mobileTextColor || "#0f172a" }} />
                          )}
                          {mobileHelpIconType === "message" && (
                            <MessageSquare className="w-4 h-4" style={{ color: mobileHelpTextColor || mobileTextColor || "#0f172a" }} />
                          )}
                          {mobileHelpIconType === "info" && (
                            <Info className="w-4 h-4" style={{ color: mobileHelpTextColor || mobileTextColor || "#0f172a" }} />
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1 text-left select-none">
                        <h4 className="text-[11px] font-extrabold leading-none" style={{ color: mobileHelpTextColor || mobileTextColor || "#0f172a" }}>{mobileHelpTitle}</h4>
                        <p className="text-[10px] font-semibold mt-1 leading-none" style={{ color: `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 60%, transparent)` }}>{mobileHelpSubtitle}</p>
                      </div>

                      <a
                        href={helpHref}
                        className="px-3 py-1.5 border rounded-xl text-[10px] font-bold flex items-center gap-1 shrink-0 smooth-transition cursor-pointer"
                        style={{
                          borderColor: mobileHelpBtnColor || `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 15%, transparent)`,
                          color: mobileHelpBtnColor || mobileHelpTextColor || mobileTextColor || "#0f172a"
                        }}
                      >
                        {mobileHelpBtnIconType === "phone" && (
                          <Phone className="w-3 h-3" style={{ color: mobileHelpBtnColor || `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 40%, transparent)` }} />
                        )}
                        {mobileHelpBtnIconType === "arrow" && (
                          <ArrowRight className="w-3 h-3" style={{ color: mobileHelpBtnColor || `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 40%, transparent)` }} />
                        )}
                        {mobileHelpBtnIconType === "external" && (
                          <ExternalLink className="w-3 h-3" style={{ color: mobileHelpBtnColor || `color-mix(in srgb, ${mobileHelpTextColor || mobileTextColor || '#0f172a'} 40%, transparent)` }} />
                        )}
                        <span>{mobileHelpBtnText}</span>
                      </a>
                    </div>
                  );
                })()}

                {/* Action Button */}
                {ctaText && (
                  <a
                    href={ctaUrl}
                    onClick={(e) => {
                      handleLinkClick(e);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-3 font-extrabold rounded-2xl text-xs hover:brightness-105 active:scale-[0.98] smooth-transition cursor-pointer select-none shadow-md shadow-black/5"
                    style={{
                      backgroundColor: mobileCtaBgColor || resolveThemeColor(ctaColor, "#2563eb", "var(--color-primary)"),
                      color: mobileCtaTextColor || "#ffffff"
                    }}
                  >
                    {ctaText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
