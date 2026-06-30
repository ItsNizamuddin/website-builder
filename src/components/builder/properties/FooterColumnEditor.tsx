"use client";

import React, { useState } from "react";
import { Trash2, Minimize2, ChevronDown } from "lucide-react";

interface FooterColumnEditorProps {
  col: any;
  colIdx: number;
  onUpdate: (updatedCol: any) => void;
  onDelete: () => void;
}

export const FooterColumnEditor: React.FC<FooterColumnEditorProps> = ({ col, colIdx, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
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
              className="bg-white text-xs text-slate-855 border border-slate-200 rounded p-1.5 w-full focus:outline-none focus:border-blue-600 font-semibold"
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
                <span className="text-[9px] text-slate-500 font-bold uppercase">Street Address</span>
                <textarea
                  value={col.address || ""}
                  onChange={(e) => onUpdate({ ...col, address: e.target.value })}
                  className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-12 resize-none font-sans"
                  placeholder="123 Main St"
                />
              </div>
            </div>
          )}

          {colType === "text" && (
            <div className="flex flex-col gap-1 border-t border-slate-100 pt-2.5">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Custom Paragraph</span>
              <textarea
                value={col.text || ""}
                onChange={(e) => onUpdate({ ...col, text: e.target.value })}
                className="bg-white text-xs text-slate-800 border border-slate-200 rounded p-1.5 focus:border-blue-600 focus:outline-none w-full h-20 resize-none font-sans"
                placeholder="Enter custom description or policy text..."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
