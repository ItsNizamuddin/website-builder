"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { useBuilderStore } from "@/store/useBuilderStore";

interface CourseCardPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const CourseCardProperties: React.FC<CourseCardPropertiesProps> = ({ component, handlePropChange }) => {
  const { selectedElement } = useBuilderStore();
  const subKey = selectedElement?.subElementKey;

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {subKey ? `Course: ${subKey}` : "Course Details"}
      </span>

      {/* Course Title */}
      {(!subKey || subKey === "title") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Tag (Level)</label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const tag = `h${num}`;
                const activeTag = component.props.titleTag || "h3";
                const sizeMap: Record<number, string> = {
                  1: "text-3xl",
                  2: "text-2xl",
                  3: "text-xl",
                  4: "text-lg",
                  5: "text-base",
                  6: "text-sm",
                };
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      handlePropChange("titleTag", tag);
                      handlePropChange("titleFontSize", sizeMap[num]);
                    }}
                    className={`py-1 text-[10px] rounded-md font-bold smooth-transition border-0 cursor-pointer ${
                      activeTag === tag
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    H{num}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Course Title Text</label>
            <input
              type="text"
              value={component.props.title || ""}
              onChange={(e) => handlePropChange("title", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            />
          </div>
        </div>
      )}

      {/* Instructor */}
      {(!subKey || subKey === "instructor") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Instructor</label>
          <input
            type="text"
            value={component.props.instructor || ""}
            onChange={(e) => handlePropChange("instructor", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Price */}
      {(!subKey || subKey === "price") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price</label>
          <input
            type="text"
            value={component.props.price || ""}
            onChange={(e) => handlePropChange("price", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Duration */}
      {(!subKey || subKey === "duration") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Duration</label>
          <input
            type="text"
            value={component.props.duration || ""}
            onChange={(e) => handlePropChange("duration", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Badge */}
      {(!subKey || subKey === "badge") && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-150">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Badge</label>
          <input
            type="text"
            value={component.props.badge || ""}
            onChange={(e) => handlePropChange("badge", e.target.value)}
            className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Course Image URL */}
      {(!subKey || subKey === "image") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Course Image Settings</span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Course Image URL</label>
            <input
              type="text"
              value={component.props.image || ""}
              onChange={(e) => handlePropChange("image", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Alt Description Text</label>
            <input
              type="text"
              value={component.props.imageAlt || ""}
              onChange={(e) => handlePropChange("imageAlt", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full"
              placeholder="Alt description for course image"
            />
          </div>
        </div>
      )}

      {/* CTA Button Text field */}
      {(!subKey || subKey === "button") && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-top-1 duration-150">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link Settings</span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Button Call to Action</label>
            <input
              type="text"
              value={component.props.buttonText || ""}
              onChange={(e) => handlePropChange("buttonText", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link Destination URL</label>
            <input
              type="text"
              value={component.props.url || ""}
              onChange={(e) => handlePropChange("url", e.target.value)}
              className="bg-white text-sm text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-blue-600 focus:outline-none w-full font-mono"
              placeholder="#"
            />
          </div>
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={component.props.buttonOpenInNewTab === true}
                onChange={(e) => handlePropChange("buttonOpenInNewTab", e.target.checked)}
                className="w-3.5 h-3.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Open in new tab</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
