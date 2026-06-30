"use client";

import React, { useState } from "react";
import { Trash2, Minimize2, ChevronDown } from "lucide-react";

interface LinkItemEditorProps {
  link: any;
  onUpdate: (updatedLink: any) => void;
  onDelete: () => void;
  depth?: number;
}

export const LinkItemEditor: React.FC<LinkItemEditorProps> = ({ link, onUpdate, onDelete, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
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

          {/* Dropdown nested links list */}
          {isDropdown && (
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-3 mt-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Menu Children</span>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addSubItem(e.target.value as any);
                      e.target.value = "";
                    }
                  }}
                  className="bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold rounded px-1.5 py-0.5 cursor-pointer hover:bg-blue-100 smooth-transition"
                >
                  <option value="" disabled>+ Add Sub Item</option>
                  <option value="link">Sub Link</option>
                  <option value="dropdown">Sub Dropdown</option>
                  <option value="button">CTA Button</option>
                  <option value="header">Group Header</option>
                  <option value="divider">Separator Line</option>
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                {(link.items || []).map((subItem: any, subIdx: number) => (
                  <LinkItemEditor
                    key={subIdx}
                    link={subItem}
                    depth={depth + 1}
                    onUpdate={(updated) => handleSubItemUpdate(subIdx, updated)}
                    onDelete={() => handleSubItemDelete(subIdx)}
                  />
                ))}
                {(link.items || []).length === 0 && (
                  <span className="text-[9px] text-slate-400 italic text-center py-2">Empty Dropdown Menu</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
