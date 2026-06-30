"use client";

import React, { useState } from "react";
import { Trash2, Minimize2, ChevronDown, Plus } from "lucide-react";

interface CategoryItemEditorProps {
  category: any;
  onUpdate: (updatedCategory: any) => void;
  onDelete: () => void;
}

export const CategoryItemEditor: React.FC<CategoryItemEditorProps> = ({ category, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

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
                      className="bg-white text-[10px] text-slate-800 border border-slate-200 rounded p-1 focus:border-blue-600 focus:outline-none w-full font-bold uppercase tracking-wide"
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
