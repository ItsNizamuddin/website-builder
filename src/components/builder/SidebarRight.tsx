

"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { ComponentNode } from "@/types/builder";
import { Trash2, Settings, Plus, Minimize2, Move, ChevronDown } from "lucide-react";

// Modern Toggle Switch Component
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}> = ({ checked, onChange, label, id }) => {
  return (
    <div className="flex items-center justify-between py-1.5 px-0.5">
      <span className="text-xs font-semibold text-slate-700 select-none">{label}</span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-100 ${checked ? "bg-blue-600" : "bg-slate-200"
          }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4" : "translate-x-0"
            }`}
        />
      </button>
    </div>
  );
};

// Collapsible Navigation Link Editor Component
const LinkItemEditor: React.FC<{
  link: any;
  onUpdate: (updatedLink: any) => void;
  onDelete: () => void;
  depth?: number;
}> = ({ link, onUpdate, onDelete, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDropdown = link.type === "dropdown";
  const isButton = link.type === "button";

  const handleFieldChange = (key: string, value: any) => {
    onUpdate({ ...link, [key]: value });
  };

  const handleSubItemUpdate = (subIdx: number, updatedSubItem: any) => {
    const items = [...(link.items || [])];
    items[subIdx] = updatedSubItem;
    handleFieldChange("items", items);
  };

  const handleSubItemDelete = (subIdx: number) => {
    const items = (link.items || []).filter((_: any, i: number) => i !== subIdx);
    handleFieldChange("items", items);
  };

  const addSubItem = (type: "link" | "dropdown" | "button" | "divider" | "header") => {
    const items = [...(link.items || [])];
    const newItem: any = { type, label: type === "divider" ? "" : `Sub ${type}` };
    if (type === "link" || type === "button") newItem.url = "#";
    if (type === "dropdown") newItem.items = [];
    items.push(newItem);
    handleFieldChange("items", items);
  };

  const typeLabels: Record<string, string> = {
    link: "Text Link",
    dropdown: "Dropdown Menu",
    button: "CTA Button",
    header: "Group Header",
    divider: "Separator",
  };

  const borderClass = depth === 0
    ? "border border-slate-200 bg-white"
    : "border-l-2 border-blue-400 bg-slate-50/50 pl-3 ml-2";

  return (
    <div className={`rounded-xl overflow-hidden shadow-xs text-left ${borderClass}`}>
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
              {link.label || (link.type === "divider" ? "--- Separator ---" : "Untitled Item")}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              {typeLabels[link.type || "link"]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded smooth-transition"
            title="Delete Item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded smooth-transition"
          >
            {isOpen ? <Minimize2 className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isOpen && (
        <div className="p-3.5 border-t border-slate-100 bg-white flex flex-col gap-3">
          {/* Type selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Item Type</span>
            <select
              value={link.type || "link"}
              onChange={(e) => {
                const nextType = e.target.value;
                const updated: any = { ...link, type: nextType };
                if (nextType === "dropdown") {
                  updated.items = link.items || [];
                } else {
                  delete updated.items;
                }
                if (nextType === "button") {
                  updated.variant = link.variant || "primary";
                } else {
                  delete updated.variant;
                }
                onUpdate(updated);
              }}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
            >
              <option value="link">Text Link</option>
              <option value="dropdown">Dropdown Menu</option>
              <option value="button">CTA Button</option>
              {depth > 0 && <option value="header">Group Header</option>}
              {depth > 0 && <option value="divider">Separator Line</option>}
            </select>
          </div>

          {/* Label and URL inputs (if not divider) */}
          {link.type !== "divider" && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Label Text</span>
              <input
                type="text"
                value={link.label || ""}
                onChange={(e) => handleFieldChange("label", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                placeholder="Label"
              />
            </div>
          )}

          {/* URL input (for link or button) */}
          {(link.type === "link" || link.type === "button") && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Destination URL</span>
              <input
                type="text"
                value={link.url || ""}
                onChange={(e) => handleFieldChange("url", e.target.value)}
                className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                placeholder="#"
              />
            </div>
          )}

          {/* Button Variant (for button type) */}
          {link.type === "button" && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Button Style</span>
              <select
                value={link.variant || "primary"}
                onChange={(e) => handleFieldChange("variant", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
              >
                <option value="primary">Primary (Blue Solid)</option>
                <option value="outline">Outline (Border)</option>
                <option value="text">Text Only</option>
              </select>
            </div>
          )}

          {/* Dropdown nested items */}
          {isDropdown && (
            <div className="border-t border-slate-200/60 mt-2.5 pt-2.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Sub-Items</span>
                {depth < 2 ? (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addSubItem(e.target.value as any);
                        e.target.value = "";
                      }
                    }}
                    className="text-[9px] bg-blue-50 border border-blue-200 text-blue-600 px-1.5 py-0.5 rounded hover:bg-blue-100 font-bold smooth-transition cursor-pointer"
                  >
                    <option value="" disabled>+ Add...</option>
                    <option value="link">Link</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="button">Button</option>
                    <option value="header">Header</option>
                    <option value="divider">Divider</option>
                  </select>
                ) : (
                  <span className="text-[8px] text-slate-400 italic">Max Depth Reached</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {(link.items || []).map((subItem: any, subIdx: number) => (
                  <LinkItemEditor
                    key={subIdx}
                    link={subItem}
                    onUpdate={(updated) => handleSubItemUpdate(subIdx, updated)}
                    onDelete={() => handleSubItemDelete(subIdx)}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Collapsible Category Editor Component
const CategoryItemEditor: React.FC<{
  category: any;
  onUpdate: (updatedCategory: any) => void;
  onDelete: () => void;
}> = ({ category, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFieldChange = (key: string, value: any) => {
    onUpdate({ ...category, [key]: value });
  };

  const handleCourseUpdate = (courseIdx: number, updatedCourse: any) => {
    const courses = [...(category.courses || [])];
    courses[courseIdx] = updatedCourse;
    handleFieldChange("courses", courses);
  };

  const handleCourseDelete = (courseIdx: number) => {
    const courses = (category.courses || []).filter((_: any, i: number) => i !== courseIdx);
    handleFieldChange("courses", courses);
  };

  const addCourse = () => {
    const courses = [...(category.courses || [])];
    courses.push({ title: "New Course", details: "Online • 10 Hours", badge: "", url: "#" });
    handleFieldChange("courses", courses);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-xs text-left border border-slate-200 bg-white">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
              {category.name || "New Category"}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              Category
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded smooth-transition"
            title="Delete Category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded smooth-transition"
          >
            {isOpen ? <Minimize2 className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isOpen && (
        <div className="p-3.5 border-t border-slate-100 bg-white flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Category Name</span>
            <input
              type="text"
              value={category.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
              placeholder="e.g. Project Management"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Description</span>
            <input
              type="text"
              value={category.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-medium"
              placeholder="e.g. Master recognized methodologies"
            />
          </div>

          {/* Courses sub-header */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1.5">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Courses Link List</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                addCourse();
              }}
              className="flex items-center gap-1 text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded hover:bg-emerald-100 smooth-transition font-bold"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Add Course</span>
            </button>
          </div>

          {/* Course items */}
          <div className="flex flex-col gap-2">
            {(category.courses || []).map((course: any, cIdx: number) => (
              <div key={cIdx} className="p-2.5 border border-slate-100 rounded-lg bg-slate-50/50 flex flex-col gap-2 relative group/course">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCourseDelete(cIdx);
                  }}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded opacity-0 group-hover/course:opacity-100 smooth-transition"
                  title="Remove Course"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="flex flex-col gap-1 pr-6">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Course Name</span>
                  <input
                    type="text"
                    value={course.title || ""}
                    onChange={(e) => handleCourseUpdate(cIdx, { ...course, title: e.target.value })}
                    className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1 focus:border-blue-600 focus:outline-none w-full font-semibold"
                    placeholder="Course Title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Details (Mode/Hours)</span>
                    <input
                      type="text"
                      value={course.details || ""}
                      onChange={(e) => handleCourseUpdate(cIdx, { ...course, details: e.target.value })}
                      className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:border-blue-600 focus:outline-none w-full font-medium"
                      placeholder="Online • 35 Hours"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Tag/Badge Label</span>
                    <input
                      type="text"
                      value={course.badge || ""}
                      onChange={(e) => handleCourseUpdate(cIdx, { ...course, badge: e.target.value })}
                      className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:border-blue-600 focus:outline-none w-full font-bold uppercase tracking-wide text-blue-600"
                      placeholder="e.g. Popular"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Destination Link URL</span>
                  <input
                    type="text"
                    value={course.url || ""}
                    onChange={(e) => handleCourseUpdate(cIdx, { ...course, url: e.target.value })}
                    className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:border-blue-600 focus:outline-none w-full font-mono"
                    placeholder="#"
                  />
                </div>
              </div>
            ))}
            {(category.courses || []).length === 0 && (
              <span className="text-[10px] text-slate-400 italic text-center py-2">No courses added yet.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Collapsible Footer Column Editor Component
const FooterColumnEditor: React.FC<{
  col: any;
  colIdx: number;
  onUpdate: (updatedCol: any) => void;
  onDelete: () => void;
}> = ({ col, colIdx, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const colType = col.type || "links";

  const handleLinkChange = (linkIdx: number, key: string, value: string) => {
    const links = [...(col.links || [])];
    links[linkIdx] = { ...links[linkIdx], [key]: value };
    onUpdate({ ...col, links });
  };

  const addLink = () => {
    const links = [...(col.links || [])];
    links.push({ label: "New Link", url: "#" });
    onUpdate({ ...col, links });
  };

  const deleteLink = (linkIdx: number) => {
    const links = (col.links || []).filter((_: any, i: number) => i !== linkIdx);
    onUpdate({ ...col, links });
  };

  const handleTypeChange = (newType: string) => {
    const updated: any = { ...col, type: newType };
    if (newType === "links" && !col.links) {
      updated.links = [{ label: "New Link", url: "#" }];
    } else if (newType === "contact") {
      updated.email = col.email || "";
      updated.phone = col.phone || "";
      updated.address = col.address || "";
    } else if (newType === "text") {
      updated.text = col.text || "";
    }
    onUpdate(updated);
  };

  const typeLabel = {
    links: "Links List",
    contact: "Contact Info",
    text: "Custom Text"
  }[colType as "links" | "contact" | "text"] || "Links List";

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
              {col.title || `Column ${colIdx + 1}`}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              {typeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded smooth-transition"
            title="Delete Column"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded smooth-transition"
          >
            {isOpen ? <Minimize2 className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div className="p-3.5 border-t border-slate-100 bg-white flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Column Type</span>
            <select
              value={colType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
            >
              <option value="links">Links List</option>
              <option value="contact">Contact Info</option>
              <option value="text">Custom Text Paragraph</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Column Title</span>
            <input
              type="text"
              value={col.title || ""}
              onChange={(e) => onUpdate({ ...col, title: e.target.value })}
              className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
            />
          </div>

          {colType === "links" && (
            <>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Links List</span>
                <button
                  onClick={addLink}
                  className="text-[9px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded-md hover:bg-blue-100 smooth-transition font-bold"
                >
                  + Add Link
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {(col.links || []).map((link: any, linkIdx: number) => (
                  <div key={linkIdx} className="bg-slate-50 p-2 rounded-lg border border-slate-200/50 flex gap-2 items-center relative pr-8">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label || ""}
                      onChange={(e) => handleLinkChange(linkIdx, "label", e.target.value)}
                      className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1.5 w-1/2 focus:border-blue-600 focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url || ""}
                      onChange={(e) => handleLinkChange(linkIdx, "url", e.target.value)}
                      className="bg-white text-[11px] text-slate-800 border border-slate-200 rounded p-1.5 w-1/2 focus:border-blue-600 focus:outline-none font-mono"
                    />
                    <button
                      onClick={() => deleteLink(linkIdx)}
                      className="absolute right-1 text-slate-400 hover:text-red-500 p-1 rounded"
                      title="Remove Link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {colType === "contact" && (
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Email Address</span>
                <input
                  type="email"
                  value={col.email || ""}
                  onChange={(e) => onUpdate({ ...col, email: e.target.value })}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full"
                  placeholder="hello@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Phone Number</span>
                <input
                  type="text"
                  value={col.phone || ""}
                  onChange={(e) => onUpdate({ ...col, phone: e.target.value })}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Office Address</span>
                <textarea
                  value={col.address || ""}
                  onChange={(e) => onUpdate({ ...col, address: e.target.value })}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-14 resize-none font-sans"
                  placeholder="123 Main St, New York, NY"
                />
              </div>
            </div>
          )}

          {colType === "text" && (
            <div className="flex flex-col gap-1 border-t border-slate-100 pt-2.5">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Paragraph Text</span>
              <textarea
                value={col.text || ""}
                onChange={(e) => onUpdate({ ...col, text: e.target.value })}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-24 resize-none font-sans"
                placeholder="Enter description or disclaimer..."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SidebarRight: React.FC = () => {
  const {
    present,
    selectedElement,
    updateComponentProps,
    removeComponent,
    updateSectionLayout,
    updateSectionStyle,
    removeSection,
    activeDevice,
    globalHeader,
    globalFooter,
    primaryColor,
    secondaryColor,
    gradientStart,
    gradientEnd,
    logoText: globalLogoText,
  } = useBuilderStore();

  const [activeCategoryEditIdx, setActiveCategoryEditIdx] = React.useState<number>(0);
  const [navbarTab, setNavbarTab] = React.useState<"design" | "categories" | "links" | "mobile">("design");
  const [footerTab, setFooterTab] = React.useState<"design" | "links">("design");

  React.useEffect(() => {
    setNavbarTab("design");
    setFooterTab("design");
  }, [selectedElement?.elementId, selectedElement?.type]);

  if (!selectedElement) {
    return (
      <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full p-6 text-slate-400 select-none justify-center items-center text-center shadow-sm">
        <Settings className="w-8 h-8 text-slate-350 mb-3 stroke-1 animate-pulse" />
        <p className="text-sm font-semibold text-slate-700">No element selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
          Click on a section or component in the canvas to adjust its properties.
        </p>
      </aside>
    );
  }

  const { type, sectionId, elementId } = selectedElement;

  // 1. SECTION CONFIGURATIONS
  if (type === "section") {
    if (!sectionId) return null;
    const section = present.sections.find((s) => s.id === sectionId);
    if (!section) return null;

    const sectionStyle = section.style || {};

    const layoutOptions = [
      { value: "1-col", label: "1 Column" },
      { value: "2-col", label: "2 Columns" },
      { value: "3-col", label: "3 Columns" },
      { value: "4-col", label: "4 Columns" },
      { value: "70-30", label: "70 / 30 Layout" },
      { value: "30-70", label: "30 / 70 Layout" },
      { value: "25-75", label: "25 / 75 Layout" },
    ];

    const handleLayoutChange = (device: "desktop" | "tablet" | "mobile", value: string) => {
      updateSectionLayout(sectionId, { [device]: value });
    };

    const handleStyleChange = (key: string, value: any) => {
      updateSectionStyle(sectionId, { [key]: value });
    };

    const renderSectionColorPicker = (label: string, styleKey: string, defaultValue: string) => {
      const rawVal = sectionStyle[styleKey] ?? defaultValue;

      let hexValue = rawVal;
      if (rawVal === "var(--color-primary)") hexValue = primaryColor || "#2563eb";
      else if (rawVal === "var(--color-secondary)") hexValue = secondaryColor || "#1e3a8a";
      else if (rawVal === "var(--color-gradient-start)") hexValue = gradientStart || "#3b82f6";
      else if (rawVal === "var(--color-gradient-end)") hexValue = gradientEnd || "#1e3a8a";

      if (!hexValue || !hexValue.startsWith("#") || hexValue.length !== 7) {
        hexValue = defaultValue.startsWith("#") ? defaultValue : "#ffffff";
      }

      const presets = [
        { name: "Primary", varName: "var(--color-primary)", color: primaryColor || "#2563eb" },
        { name: "Secondary", varName: "var(--color-secondary)", color: secondaryColor || "#1e3a8a" },
        { name: "Grad Start", varName: "var(--color-gradient-start)", color: gradientStart || "#3b82f6" },
        { name: "Grad End", varName: "var(--color-gradient-end)", color: gradientEnd || "#1e3a8a" },
      ];

      const displayVal = rawVal.startsWith("var(--")
        ? rawVal.replace("var(--color-", "").replace(")", "").toUpperCase()
        : rawVal;

      return (
        <div className="flex flex-col gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexValue}
                onChange={(e) => handleStyleChange(styleKey, e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-xs font-mono text-slate-500 font-bold">{displayVal}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t border-slate-200/50 pt-2 mt-0.5">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Presets</span>
            <div className="flex items-center gap-2 flex-wrap">
              {presets.map((preset) => {
                const isSelected = rawVal === preset.varName;
                return (
                  <button
                    key={preset.varName}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStyleChange(styleKey, preset.varName);
                    }}
                    className="w-4 h-4 rounded-full border smooth-transition hover:scale-110 flex items-center justify-center relative group shadow-xs"
                    style={{
                      backgroundColor: preset.color,
                      borderColor: isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.3)"
                    }}
                    title={preset.name}
                  >
                    {isSelected && (
                      <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    return (
      <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto z-45 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Section Properties</span>
          </h2>
          <button
            onClick={() => removeSection(sectionId)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 smooth-transition border border-red-500/20"
            title="Delete Section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Section ID info */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Section ID</span>
            <code className="text-xs text-slate-650 font-mono bg-slate-50 border border-slate-150 p-2 rounded-lg break-all">
              {sectionId}
            </code>
          </div>

          {/* 1. LAYOUT SETTINGS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Layout & Grids</span>

            {/* Container Max Width */}
            <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Section Max Width</label>
              <select
                value={sectionStyle.containerWidth || "boxed"}
                onChange={(e) => handleStyleChange("containerWidth", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              >
                <option value="boxed">Boxed (1152px - Default)</option>
                <option value="narrow">Narrow (1024px)</option>
                <option value="wide">Wide (1280px)</option>
                <option value="full">Full Width (100%)</option>
              </select>
            </div>

            {/* Desktop Layout */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Desktop Grid Columns</span>
              </label>
              <select
                value={section.layout.desktop}
                onChange={(e) => handleLayoutChange("desktop", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tablet Layout */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Tablet Grid Columns</span>
              </label>
              <select
                value={section.layout.tablet}
                onChange={(e) => handleLayoutChange("tablet", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Layout */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Mobile Grid Columns</span>
              </label>
              <select
                value={section.layout.mobile}
                onChange={(e) => handleLayoutChange("mobile", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. SPACING SETTINGS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Spacing (Margins & Padding)</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
              {/* Padding Top */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Top</span>
                <select
                  value={sectionStyle.paddingTop || "medium"}
                  onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (80px)</option>
                  <option value="xxl">Huge (128px)</option>
                </select>
              </div>

              {/* Padding Bottom */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Bottom</span>
                <select
                  value={sectionStyle.paddingBottom || "medium"}
                  onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (80px)</option>
                  <option value="xxl">Huge (128px)</option>
                </select>
              </div>

              {/* Padding Left/Right */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Padding - Horizontal</span>
                <select
                  value={sectionStyle.paddingLeftRight || "medium"}
                  onChange={(e) => handleStyleChange("paddingLeftRight", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (12px)</option>
                  <option value="medium">Medium (24px - Default)</option>
                  <option value="large">Large (48px)</option>
                  <option value="xl">Extra Large (64px)</option>
                </select>
              </div>

              <div className="h-px bg-slate-200/50 my-1" />

              {/* Margin Top */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Margin - Top</span>
                <select
                  value={sectionStyle.marginTop || "none"}
                  onChange={(e) => handleStyleChange("marginTop", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (32px)</option>
                  <option value="large">Large (64px)</option>
                  <option value="xl">Extra Large (96px)</option>
                </select>
              </div>

              {/* Margin Bottom */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Margin - Bottom</span>
                <select
                  value={sectionStyle.marginBottom || "none"}
                  onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (32px)</option>
                  <option value="large">Large (64px)</option>
                  <option value="xl">Extra Large (96px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. BACKGROUND STYLING */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Background Styling</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Background Type</span>
                <select
                  value={sectionStyle.bgType || "none"}
                  onChange={(e) => handleStyleChange("bgType", e.target.value)}
                  className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">None (Transparent / Theme Default)</option>
                  <option value="color">Solid Color</option>
                  <option value="gradient">Preset Gradient</option>
                  <option value="image">Background Image</option>
                </select>
              </div>

              {/* Solid Color Picker */}
              {sectionStyle.bgType === "color" && renderSectionColorPicker("Solid Color", "bgColor", "#ffffff")}

              {/* Preset Gradients */}
              {sectionStyle.bgType === "gradient" && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gradients Presets</span>
                  <select
                    value={sectionStyle.bgGradient || "from-white to-white"}
                    onChange={(e) => handleStyleChange("bgGradient", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    <option value="from-white to-white">White (Solid)</option>
                    <option value="from-slate-900 via-slate-950 to-black">Charcoal Dark</option>
                    <option value="from-blue-600 via-blue-700 to-indigo-900">SkillDeck Blue</option>
                    <option value="from-emerald-600 via-teal-700 to-cyan-800">Emerald Fresh</option>
                    <option value="from-orange-500 via-red-500 to-indigo-650">Sunset Glow</option>
                    <option value="from-purple-600 to-blue-500">Royal Lavender</option>
                    <option value="from-rose-500 to-orange-500">Warm Ember</option>
                    <option value="from-slate-100 to-slate-200">Clean Light Slate</option>
                  </select>
                </div>
              )}

              {/* Background Image Options */}
              {sectionStyle.bgType === "image" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Image URL</span>
                    <input
                      type="text"
                      value={sectionStyle.bgImage || ""}
                      onChange={(e) => handleStyleChange("bgImage", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Image Size</span>
                      <select
                        value={sectionStyle.bgImageSize || "cover"}
                        onChange={(e) => handleStyleChange("bgImageSize", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain (Fit)</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Position</span>
                      <select
                        value={sectionStyle.bgImagePosition || "center"}
                        onChange={(e) => handleStyleChange("bgImagePosition", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. BORDERS & CORNERS */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Borders & Corners</span>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
              {/* Rounded Corners */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rounded Corners</span>
                <select
                  value={sectionStyle.borderRadius || "none"}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">Sharp Corners (None)</option>
                  <option value="sm">Rounded Small</option>
                  <option value="md">Rounded Medium</option>
                  <option value="lg">Rounded Large</option>
                  <option value="xl">Rounded XL</option>
                  <option value="2xl">Rounded 2XL</option>
                  <option value="3xl">Rounded 3XL</option>
                  <option value="full">Pill / Circle</option>
                </select>
              </div>

              {/* Border Position */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Border Position</span>
                <select
                  value={sectionStyle.borderPosition || "none"}
                  onChange={(e) => handleStyleChange("borderPosition", e.target.value)}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="none">No Border</option>
                  <option value="all">All Sides</option>
                  <option value="top">Top border only</option>
                  <option value="bottom">Bottom border only</option>
                  <option value="y">Top & Bottom borders</option>
                </select>
              </div>

              {sectionStyle.borderPosition && sectionStyle.borderPosition !== "none" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Border Style</span>
                      <select
                        value={sectionStyle.borderStyle || "solid"}
                        onChange={(e) => handleStyleChange("borderStyle", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Border Width</span>
                      <select
                        value={sectionStyle.borderWidth || "1px"}
                        onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                        className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-600 font-semibold"
                      >
                        <option value="1px">1px</option>
                        <option value="2px">2px</option>
                        <option value="4px">4px</option>
                      </select>
                    </div>
                  </div>

                  {renderSectionColorPicker("Border Color", "borderColor", "#e2e8f0")}
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. COMPONENT CONFIGURATIONS
  let component: ComponentNode | null = null;
  if (type === "globalHeader") {
    component = globalHeader;
  } else if (type === "globalFooter") {
    component = globalFooter;
  } else {
    const section = present.sections.find((s) => s.id === sectionId);
    component = section?.children.find((c) => c.id === elementId) || null;
  }

  if (!component) return null;

  const handlePropChange = (key: string, value: any) => {
    if (type === "globalHeader") {
      useBuilderStore.setState((state) => ({
        globalHeader: state.globalHeader
          ? { ...state.globalHeader, props: { ...state.globalHeader.props, [key]: value } }
          : null,
        isSaved: false,
      }));
    } else if (type === "globalFooter") {
      useBuilderStore.setState((state) => ({
        globalFooter: state.globalFooter
          ? { ...state.globalFooter, props: { ...state.globalFooter.props, [key]: value } }
          : null,
        isSaved: false,
      }));
    } else if (sectionId && elementId) {
      updateComponentProps(sectionId, elementId, { [key]: value });
    }
  };

  const renderColorPicker = (label: string, propKey: string, defaultValue: string) => {
    const rawVal = component.props[propKey] ?? defaultValue;

    let hexValue = rawVal;
    if (rawVal === "var(--color-primary)") hexValue = primaryColor || "#2563eb";
    else if (rawVal === "var(--color-secondary)") hexValue = secondaryColor || "#1e3a8a";
    else if (rawVal === "var(--color-gradient-start)") hexValue = gradientStart || "#3b82f6";
    else if (rawVal === "var(--color-gradient-end)") hexValue = gradientEnd || "#1e3a8a";

    if (!hexValue || !hexValue.startsWith("#") || hexValue.length !== 7) {
      hexValue = defaultValue.startsWith("#") ? defaultValue : "#ffffff";
    }

    const presets = [
      { name: "Primary", varName: "var(--color-primary)", color: primaryColor || "#2563eb" },
      { name: "Secondary", varName: "var(--color-secondary)", color: secondaryColor || "#1e3a8a" },
      { name: "Grad Start", varName: "var(--color-gradient-start)", color: gradientStart || "#3b82f6" },
      { name: "Grad End", varName: "var(--color-gradient-end)", color: gradientEnd || "#1e3a8a" },
    ];

    const displayVal = rawVal.startsWith("var(--")
      ? rawVal.replace("var(--color-", "").replace(")", "").toUpperCase()
      : rawVal;

    return (
      <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs text-slate-705 font-semibold text-slate-700">{label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexValue}
              onChange={(e) => handlePropChange(propKey, e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-xs font-mono text-slate-500 font-semibold">{displayVal}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-t border-slate-200/50 pt-2 mt-0.5">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Presets</span>
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((preset) => {
              const isSelected = rawVal === preset.varName;
              return (
                <button
                  key={preset.varName}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePropChange(propKey, preset.varName);
                  }}
                  className={`w-5 h-5 rounded-full border smooth-transition hover:scale-110 flex items-center justify-center relative group shadow-sm`}
                  style={{
                    backgroundColor: preset.color,
                    borderColor: isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.3)"
                  }}
                  title={preset.name}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-[8px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const handleFaqItemChange = (index: number, key: string, value: string) => {
    const items = [...(component.props.items || [])];
    items[index] = { ...items[index], [key]: value };
    handlePropChange("items", items);
  };

  const addFaqItem = () => {
    const items = [...(component.props.items || [])];
    items.push({ question: "New Question?", answer: "New Answer text." });
    handlePropChange("items", items);
  };

  const removeFaqItem = (index: number) => {
    const items = (component.props.items || []).filter((_: any, i: number) => i !== index);
    handlePropChange("items", items);
  };

  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden z-45 shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 select-none">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Edit: {component.type}</span>
        </h2>
        {type !== "globalHeader" && type !== "globalFooter" && (
          <button
            onClick={() => sectionId && elementId && removeComponent(sectionId, elementId)}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-650 smooth-transition border border-red-500/20"
            title="Delete Component"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-5">
        {/* TEXT AND GENERAL CONTENT PROPS */}
        {("text" in component.props) && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {component.type === "button" ? "Button Label" : "Text Content"}
            </label>
            {component.type === "button" ? (
              <input
                type="text"
                value={component.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
              />
            ) : (
              <textarea
                value={component.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:outline-none w-full h-24 resize-none font-sans"
              />
            )}
          </div>
        )}

        {/* HEADING LEVEL PROP */}
        {component.type === "heading" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Heading Size</label>
            <select
              value={component.props.level || "h2"}
              onChange={(e) => handlePropChange("level", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
            >
              <option value="h1">Heading 1 (h1)</option>
              <option value="h2">Heading 2 (h2)</option>
              <option value="h3">Heading 3 (h3)</option>
            </select>
          </div>
        )}

        {/* IMAGE / VIDEO SRC PROP */}
        {("src" in component.props) && component.type !== "button" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {component.type === "image" ? "Image URL" : "Embed Video URL"}
            </label>
            <input
              type="text"
              value={component.props.src || ""}
              onChange={(e) => handlePropChange("src", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
            />
          </div>
        )}

        {/* IMAGE ALT PROP */}
        {("alt" in component.props) && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Alt Text</label>
            <input
              type="text"
              value={component.props.alt || ""}
              onChange={(e) => handlePropChange("alt", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
            />
          </div>
        )}

        {/* IMAGE CUSTOM STYLE PROPS */}
        {component.type === "image" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aspect Ratio</label>
              <select
                value={component.props.aspectRatio || "aspect-video"}
                onChange={(e) => handlePropChange("aspectRatio", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="aspect-auto">Auto (Natural)</option>
                <option value="aspect-video">16:9 Video (Default)</option>
                <option value="aspect-square">1:1 Square</option>
                <option value="aspect-[4/3]">4:3 Standard</option>
                <option value="aspect-[3/2]">3:2 Photo</option>
                <option value="aspect-[21/9]">21:9 Ultrawide</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Border Radius</label>
              <select
                value={component.props.borderRadius || "rounded-lg"}
                onChange={(e) => handlePropChange("borderRadius", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="rounded-none">Sharp Corners (0)</option>
                <option value="rounded-sm">Rounded SM</option>
                <option value="rounded-md">Rounded MD</option>
                <option value="rounded-lg">Rounded LG</option>
                <option value="rounded-xl">Rounded XL</option>
                <option value="rounded-2xl">Rounded 2XL</option>
                <option value="rounded-full">Pill / Circle</option>
              </select>
            </div>
          </>
        )}

        {/* VIDEO CUSTOM STYLE PROPS */}
        {component.type === "video" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aspect Ratio</label>
            <select
              value={component.props.aspectRatio || "aspect-video"}
              onChange={(e) => handlePropChange("aspectRatio", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
            >
              <option value="aspect-video">16:9 Video (Default)</option>
              <option value="aspect-square">1:1 Square</option>
              <option value="aspect-[4/3]">4:3 Standard</option>
              <option value="aspect-[21/9]">21:9 Ultrawide</option>
            </select>
          </div>
        )}

        {/* BUTTON SPECIFIC PROPS */}
        {component.type === "button" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link URL</label>
              <input
                type="text"
                value={component.props.url || ""}
                onChange={(e) => handlePropChange("url", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Button Variant</label>
              <select
                value={component.props.variant || "primary"}
                onChange={(e) => handlePropChange("variant", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="primary">Primary (Blue Solid)</option>
                <option value="secondary">Secondary (Dark slate)</option>
                <option value="outline">Outline (Border)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Button Size</label>
              <select
                value={component.props.size || "md"}
                onChange={(e) => handlePropChange("size", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Border Radius</label>
              <select
                value={component.props.borderRadius || "rounded-md"}
                onChange={(e) => handlePropChange("borderRadius", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="rounded-none">Sharp Corners (0)</option>
                <option value="rounded-sm">Rounded SM (2px)</option>
                <option value="rounded-md">Rounded MD (4px)</option>
                <option value="rounded-lg">Rounded LG (8px)</option>
                <option value="rounded-xl">Rounded XL (12px)</option>
                <option value="rounded-2xl">Rounded 2XL (16px)</option>
                <option value="rounded-full">Pill / Circle</option>
              </select>
            </div>

            {/* Button Custom Text Color picker */}
            {renderColorPicker("Custom Text Color", "textColor", "#ffffff")}
          </>
        )}

        {/* DYNAMIC STYLING DESIGN SYSTEM CONTROLS */}
        {(component.type === "heading" || component.type === "text" || component.type === "button" || component.type === "image" || component.type === "video") && (
          <div className="border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Style Settings</span>

            {/* Color Picker (for Text, Heading, Buttons) */}
            {("color" in component.props) && renderColorPicker("Text/Theme Color", "color", "#000000")}

            {/* Text Alignment */}
            {("align" in component.props) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-medium">Text Alignment</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200 p-1 rounded-lg">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => handlePropChange("align", a)}
                      className={`py-1.5 text-xs rounded-md font-semibold capitalize smooth-transition ${component.props.align === a
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                        }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Font Sizes (Tailwind style) */}
            {("fontSize" in component.props) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-medium">Font Size</label>
                <select
                  value={component.props.fontSize || "text-base"}
                  onChange={(e) => handlePropChange("fontSize", e.target.value)}
                  className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
                >
                  <option value="text-xs">Extra Small (xs)</option>
                  <option value="text-sm">Small (sm)</option>
                  <option value="text-base">Base/Medium (base)</option>
                  <option value="text-lg">Large (lg)</option>
                  <option value="text-xl">Extra Large (xl)</option>
                  <option value="text-2xl">2X Large (2xl)</option>
                  <option value="text-3xl">3X Large (3xl)</option>
                  <option value="text-4xl">4X Large (4xl)</option>
                  <option value="text-5xl">5X Large (5xl)</option>
                </select>
              </div>
            )}

            {/* Spacing Margins */}
            {("marginTop" in component.props) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-medium">Spacing - Top</label>
                <select
                  value={component.props.marginTop || "mt-4"}
                  onChange={(e) => handlePropChange("marginTop", e.target.value)}
                  className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
                >
                  <option value="mt-0">None (0)</option>
                  <option value="mt-2">Small (8px)</option>
                  <option value="mt-4">Medium (16px)</option>
                  <option value="mt-6">Large (24px)</option>
                  <option value="mt-8">Extra Large (32px)</option>
                  <option value="mt-12">Huge (48px)</option>
                  <option value="mt-16">Super (64px)</option>
                </select>
              </div>
            )}

            {/* Spacing Margins Bottom */}
            {("marginBottom" in component.props) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom</label>
                <select
                  value={component.props.marginBottom || "mb-4"}
                  onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                  className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
                >
                  <option value="mb-0">None (0)</option>
                  <option value="mb-2">Small (8px)</option>
                  <option value="mb-4">Medium (16px)</option>
                  <option value="mb-6">Large (24px)</option>
                  <option value="mb-8">Extra Large (32px)</option>
                  <option value="mb-12">Huge (48px)</option>
                  <option value="mb-16">Super (64px)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* NAVBAR COMPONENT EXTRAS */}
        {component.type === "navbar" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Navbar Settings</span>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl mb-1 gap-0.5 select-none flex-wrap">
              <button
                type="button"
                onClick={() => setNavbarTab("design")}
                className={`flex-1 py-1 rounded-lg text-center text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${navbarTab === "design"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Style
              </button>
              <button
                type="button"
                onClick={() => setNavbarTab("categories")}
                className={`flex-1 py-1 rounded-lg text-center text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${navbarTab === "categories"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => setNavbarTab("links")}
                className={`flex-1 py-1 rounded-lg text-center text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${navbarTab === "links"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Links
              </button>
              <button
                type="button"
                onClick={() => setNavbarTab("mobile")}
                className={`flex-1 py-1 rounded-lg text-center text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${navbarTab === "mobile"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Mobile
              </button>
            </div>

            {/* TAB CONTENT: DESIGN & STYLE */}
            {navbarTab === "design" && (
              <div className="flex flex-col gap-4">
                {/* Theme & Colors */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Theme & Colors</span>
                  {renderColorPicker("Text & Links", "textColor", "#0f172a")}
                  {renderColorPicker("CTA Button", "ctaColor", "#0f172a")}
                  <div className="flex flex-col gap-1">
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
                  {component.props.bgStyle === "solid" && renderColorPicker("Background Color", "bgColor", "#ffffff")}
                  {component.props.bgStyle !== "solid" && (
                    <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
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
              <div className="flex flex-col gap-4">
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
                        {renderColorPicker("Button Background", "categoriesBgColor", "#0f172a")}
                        {renderColorPicker("Button Text", "categoriesTextColor", "#ffffff")}
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
              <div className="flex flex-col gap-4">
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
                          placeholder={globalLogoText || "SkillDeck"}
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
                  <div className="flex flex-col gap-1.5">
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
                      className="bg-white text-sm text-slate-805 border border-slate-205 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MOBILE DRAWER */}
            {navbarTab === "mobile" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
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

                    <div className="flex flex-col gap-2 border-t border-slate-200/60 pt-3 mt-1">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Help Card Custom Colors</span>
                      {renderColorPicker("Card Background", "mobileHelpBgColor", "#ffffff")}
                      {renderColorPicker("Card Text & Icon", "mobileHelpTextColor", "#0f172a")}
                      {renderColorPicker("Call Button Color", "mobileHelpBtnColor", "#0f172a")}
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Mobile Drawer Styling</span>
                  {renderColorPicker("Drawer Background", "mobileBgColor", "#ffffff")}
                  {renderColorPicker("Drawer Text & Icons", "mobileTextColor", "#0f172a")}
                  {renderColorPicker("Mobile CTA Background", "mobileCtaBgColor", "var(--color-primary)")}
                  {renderColorPicker("Mobile CTA Text Color", "mobileCtaTextColor", "#ffffff")}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOTER COMPONENT EXTRAS */}
        {component.type === "footer" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Footer Settings</span>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-1 gap-1 select-none">
              <button
                type="button"
                onClick={() => setFooterTab("design")}
                className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${footerTab === "design"
                  ? "bg-white text-blue-605 shadow-xs"
                  : "text-slate-400 hover:text-slate-650"
                  }`}
              >
                Style
              </button>
              <button
                type="button"
                onClick={() => setFooterTab("links")}
                className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${footerTab === "links"
                  ? "bg-white text-blue-605 shadow-xs"
                  : "text-slate-400 hover:text-slate-650"
                  }`}
              >
                Links & Copyright
              </button>
            </div>

            {/* TAB CONTENT: STYLE & DESIGN */}
            {footerTab === "design" && (
              <div className="flex flex-col gap-4">
                {/* Theme & Colors */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Theme & Colors</span>

                  {/* Text/Link Color */}
                  {renderColorPicker("Text & Links", "textColor", "#ffffff")}

                  {/* Background Style */}
                  <div className="flex flex-col gap-1">
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

                  {/* Solid Background Color Input */}
                  {component.props.bgStyle === "solid" && renderColorPicker("Background Color", "bgColor", "#0f172a")}

                  {/* Preset Gradient Input */}
                  {component.props.bgStyle !== "solid" && (
                    <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
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
              <div className="flex flex-col gap-5">
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
                            className="bg-white text-xs text-slate-850 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
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
                          placeholder={globalLogoText || "SkillDeck"}
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

                {/* Social Media Links */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    Social Media Profiles
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 text-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Facebook URL"
                        value={component.props.socialFacebook || ""}
                        onChange={(e) => handlePropChange("socialFacebook", e.target.value)}
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 text-slate-800 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Twitter URL"
                        value={component.props.socialTwitter || ""}
                        onChange={(e) => handlePropChange("socialTwitter", e.target.value)}
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 text-pink-600 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Instagram URL"
                        value={component.props.socialInstagram || ""}
                        onChange={(e) => handlePropChange("socialInstagram", e.target.value)}
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 text-blue-700 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="LinkedIn URL"
                        value={component.props.socialLinkedin || ""}
                        onChange={(e) => handlePropChange("socialLinkedin", e.target.value)}
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 text-red-600 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2c-.46 1.72-.46 5.33-.46 5.33s0 3.6.46 5.33a2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2c.46-1.72.46-5.33.46-5.33s0-3.6-.46-5.33z" />
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="YouTube URL"
                        value={component.props.socialYoutube || ""}
                        onChange={(e) => handlePropChange("socialYoutube", e.target.value)}
                        className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-mono text-[10px]"
                      />
                    </div>
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
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Link Label</span>
                        <input
                          type="text"
                          value={component.props.privacyPolicyLabel ?? "Privacy Policy"}
                          onChange={(e) => handlePropChange("privacyPolicyLabel", e.target.value)}
                          className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                          placeholder="Privacy Policy"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Destination URL</span>
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
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Link Label</span>
                        <input
                          type="text"
                          value={component.props.termsOfServiceLabel ?? "Terms of Service"}
                          onChange={(e) => handlePropChange("termsOfServiceLabel", e.target.value)}
                          className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full font-semibold"
                          placeholder="Terms of Service"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Destination URL</span>
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
        )}

        {/* HERO COMPONENT EXTRAS */}
        {component.type === "hero" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hero Properties</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Hero Heading</label>
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => handlePropChange("heading", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Subheading</label>
              <textarea
                value={component.props.subheading || ""}
                onChange={(e) => handlePropChange("subheading", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-16 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">CTA Button Text</label>
              <input
                type="text"
                value={component.props.buttonText || ""}
                onChange={(e) => handlePropChange("buttonText", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">CTA Link URL</label>
              <input
                type="text"
                value={component.props.buttonUrl || ""}
                onChange={(e) => handlePropChange("buttonUrl", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
              />
            </div>
            {/* Background Settings */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Background Style</span>

              <div className="flex flex-col gap-1">
                <select
                  value={component.props.bgStyle || "preset-gradient"}
                  onChange={(e) => handlePropChange("bgStyle", e.target.value)}
                  className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="preset-gradient">Preset Gradient</option>
                  <option value="custom-gradient">Custom Gradient</option>
                  <option value="solid">Solid Color</option>
                </select>
              </div>

              {/* Solid Background Color */}
              {component.props.bgStyle === "solid" && renderColorPicker("Background Color", "bgColor", primaryColor)}

              {/* Preset Gradient Selector */}
              {component.props.bgStyle === "preset-gradient" && (
                <div className="flex flex-col gap-1">
                  <select
                    value={component.props.bgGradient || "from-blue-600 to-indigo-900"}
                    onChange={(e) => handlePropChange("bgGradient", e.target.value)}
                    className="bg-white text-xs text-slate-805 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    <option value="from-blue-600 to-indigo-900">SkillDeck Blue (Default)</option>
                    <option value="from-emerald-600 via-teal-700 to-cyan-800">Emerald Fresh</option>
                    <option value="from-indigo-600 to-pink-500">Sunset Indigo</option>
                    <option value="from-slate-800 to-slate-900">Charcoal Dark</option>
                    <option value="from-slate-100 to-slate-200 text-slate-900">Clean Light Slate</option>
                  </select>
                </div>
              )}

              {/* Custom Gradient Start/End */}
              {component.props.bgStyle === "custom-gradient" && (
                <div className="flex flex-col gap-2">
                  {renderColorPicker("Start Color", "gradientStart", gradientStart)}
                  {renderColorPicker("End Color", "gradientEnd", gradientEnd)}
                </div>
              )}
            </div>

            {/* Colors & Button Customization */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Text & CTA Styling</span>

              {/* Content Text Color */}
              {renderColorPicker("Text Color", "textColor", "#ffffff")}

              {/* Button Bg Color */}
              {renderColorPicker("Button BG", "ctaBgColor", "#ffffff")}

              {/* Button Text Color */}
              {renderColorPicker("Button Text", "ctaTextColor", primaryColor)}
            </div>

            {/* Align */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Text Alignment</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200 p-1 rounded-lg">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => handlePropChange("align", a)}
                    className={`py-1.5 text-xs rounded-md font-semibold capitalize smooth-transition ${component.props.align === a
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                      }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing Margins */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top</label>
              <select
                value={component.props.marginTop || "mt-0"}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mt-0">None (0)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px)</option>
                <option value="mt-12">Huge (48px)</option>
                <option value="mt-16">Super (64px)</option>
              </select>
            </div>

            {/* Spacing Margins Bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom</label>
              <select
                value={component.props.marginBottom || "mb-0"}
                onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mb-0">None (0)</option>
                <option value="mb-2">Small (8px)</option>
                <option value="mb-4">Medium (16px)</option>
                <option value="mb-6">Large (24px)</option>
                <option value="mb-8">Extra Large (32px)</option>
                <option value="mb-12">Huge (48px)</option>
                <option value="mb-16">Super (64px)</option>
              </select>
            </div>
          </div>
        )}

        {/* TESTIMONIAL COMPONENT EXTRAS */}
        {component.type === "testimonial" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Testimonial</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Quote</label>
              <textarea
                value={component.props.quote || ""}
                onChange={(e) => handlePropChange("quote", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full h-16 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Author Name</label>
              <input
                type="text"
                value={component.props.author || ""}
                onChange={(e) => handlePropChange("author", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Role/Designation</label>
              <input
                type="text"
                value={component.props.role || ""}
                onChange={(e) => handlePropChange("role", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Company</label>
              <input
                type="text"
                value={component.props.company || ""}
                onChange={(e) => handlePropChange("company", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Avatar URL</label>
              <input
                type="text"
                value={component.props.avatar || ""}
                onChange={(e) => handlePropChange("avatar", e.target.value)}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
              />
            </div>
            {/* Testimonial Theme & Colors */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Card Styling & Colors</span>

              {/* Card BG Color */}
              {renderColorPicker("Card BG Color", "bgColor", "#ffffff")}

              {/* Quote/Text Color */}
              {renderColorPicker("Quote Color", "textColor", "#334155")}

              {/* Author/Role Color */}
              {renderColorPicker("Author Text", "authorColor", "#0f172a")}

              {/* Accent Color */}
              {renderColorPicker("Accent Color", "accentColor", primaryColor)}
            </div>

            {/* Spacing Margins */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top</label>
              <select
                value={component.props.marginTop || "mt-4"}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mt-0">None (0)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px)</option>
                <option value="mt-12">Huge (48px)</option>
                <option value="mt-16">Super (64px)</option>
              </select>
            </div>

            {/* Spacing Margins Bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom</label>
              <select
                value={component.props.marginBottom || "mb-4"}
                onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mb-0">None (0)</option>
                <option value="mb-2">Small (8px)</option>
                <option value="mb-4">Medium (16px)</option>
                <option value="mb-6">Large (24px)</option>
                <option value="mb-8">Extra Large (32px)</option>
                <option value="mb-12">Huge (48px)</option>
                <option value="mb-16">Super (64px)</option>
              </select>
            </div>
          </div>
        )}

        {/* FAQ LIST ITEMS PROPS */}
        {component.type === "faq" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accordion Items</span>
              <button
                onClick={addFaqItem}
                className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 smooth-transition font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {(component.props.items || []).map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-2 relative shadow-sm">
                  <button
                    onClick={() => removeFaqItem(idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 smooth-transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">Item {idx + 1} - Question</span>
                    <input
                      type="text"
                      value={item.question || ""}
                      onChange={(e) => handleFaqItemChange(idx, "question", e.target.value)}
                      className="bg-white text-xs text-slate-850 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">Answer Details</span>
                    <textarea
                      value={item.answer || ""}
                      onChange={(e) => handleFaqItemChange(idx, "answer", e.target.value)}
                      className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-14 resize-none font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Style Settings */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] text-slate-500 font-bold uppercase">FAQ Colors</span>

              {/* Card Bg Color */}
              {renderColorPicker("Panel BG Color", "bgColor", "#ffffff")}

              {/* Question Color */}
              {renderColorPicker("Question Text", "textColor", "#1e293b")}

              {/* Answer Color */}
              {renderColorPicker("Answer Text", "answerColor", "#475569")}

              {/* Accent Color */}
              {renderColorPicker("Accent Indicator", "accentColor", primaryColor)}
            </div>

            {/* Spacing Margins */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top</label>
              <select
                value={component.props.marginTop || "mt-4"}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mt-0">None (0)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px)</option>
                <option value="mt-12">Huge (48px)</option>
                <option value="mt-16">Super (64px)</option>
              </select>
            </div>

            {/* Spacing Margins Bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom</label>
              <select
                value={component.props.marginBottom || "mb-4"}
                onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mb-0">None (0)</option>
                <option value="mb-2">Small (8px)</option>
                <option value="mb-4">Medium (16px)</option>
                <option value="mb-6">Large (24px)</option>
                <option value="mb-8">Extra Large (32px)</option>
                <option value="mb-12">Huge (48px)</option>
                <option value="mb-16">Super (64px)</option>
              </select>
            </div>
          </div>
        )}

        {/* COURSE CARD COMPONENT EXTRAS */}
        {component.type === "courseCard" && (
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Course Details</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Course Title</label>
              <input
                type="text"
                value={component.props.title || ""}
                onChange={(e) => handlePropChange("title", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Instructor</label>
              <input
                type="text"
                value={component.props.instructor || ""}
                onChange={(e) => handlePropChange("instructor", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex-row flex gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] text-slate-500 font-medium">Price</label>
                <input
                  type="text"
                  value={component.props.price || ""}
                  onChange={(e) => handlePropChange("price", e.target.value)}
                  className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] text-slate-500 font-medium">Duration</label>
                <input
                  type="text"
                  value={component.props.duration || ""}
                  onChange={(e) => handlePropChange("duration", e.target.value)}
                  className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Badge</label>
              <input
                type="text"
                value={component.props.badge || ""}
                onChange={(e) => handlePropChange("badge", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Course Image URL</label>
              <input
                type="text"
                value={component.props.image || ""}
                onChange={(e) => handlePropChange("image", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Button Call to Action</label>
              <input
                type="text"
                value={component.props.buttonText || ""}
                onChange={(e) => handlePropChange("buttonText", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Link Destination URL</label>
              <input
                type="text"
                value={component.props.url || ""}
                onChange={(e) => handlePropChange("url", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono text-xs"
                placeholder="#"
              />
            </div>

            {/* Course Card Colors */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Card Colors</span>

              {/* Card BG Color */}
              {renderColorPicker("Card BG Color", "bgColor", "#ffffff")}

              {/* Title & Price Color */}
              {renderColorPicker("Title & Price", "textColor", "#1e293b")}

              {/* Details Text Color */}
              {renderColorPicker("Details Color", "detailsColor", "#64748b")}

              {/* Accent Color */}
              {renderColorPicker("Accent Color", "accentColor", primaryColor)}
            </div>

            {/* Spacing Margins */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Top</label>
              <select
                value={component.props.marginTop || "mt-4"}
                onChange={(e) => handlePropChange("marginTop", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mt-0">None (0)</option>
                <option value="mt-2">Small (8px)</option>
                <option value="mt-4">Medium (16px)</option>
                <option value="mt-6">Large (24px)</option>
                <option value="mt-8">Extra Large (32px)</option>
                <option value="mt-12">Huge (48px)</option>
                <option value="mt-16">Super (64px)</option>
              </select>
            </div>

            {/* Spacing Margins Bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-medium">Spacing - Bottom</label>
              <select
                value={component.props.marginBottom || "mb-4"}
                onChange={(e) => handlePropChange("marginBottom", e.target.value)}
                className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-medium"
              >
                <option value="mb-0">None (0)</option>
                <option value="mb-2">Small (8px)</option>
                <option value="mb-4">Medium (16px)</option>
                <option value="mb-6">Large (24px)</option>
                <option value="mb-8">Extra Large (32px)</option>
                <option value="mb-12">Huge (48px)</option>
                <option value="mb-16">Super (64px)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 select-none flex items-center justify-between text-[10px] text-slate-500 font-semibold">
        <span className="flex items-center gap-1">
          <Move className="w-3 h-3 text-blue-600" />
          <span>Active view: {activeDevice}</span>
        </span>
        <span>ID: {elementId?.substring(0, 8)}...</span>
      </div>
    </aside>
  );
};
