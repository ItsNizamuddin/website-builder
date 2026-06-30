"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { ComponentNode } from "@/types/builder";
import { ColorPicker } from "./ColorPicker";
import { useBuilderStore } from "@/store/useBuilderStore";

interface FaqPropertiesProps {
  component: ComponentNode;
  handlePropChange: (key: string, value: any) => void;
}

export const FaqProperties: React.FC<FaqPropertiesProps> = ({ component, handlePropChange }) => {
  const { primaryColor } = useBuilderStore();

  const addFaqItem = () => {
    const items = [...(component.props.items || [])];
    items.push({ question: "New Question?", answer: "Answer details go here." });
    handlePropChange("items", items);
  };

  const removeFaqItem = (idx: number) => {
    const items = (component.props.items || []).filter((_: any, i: number) => i !== idx);
    handlePropChange("items", items);
  };

  const handleFaqItemChange = (idx: number, key: string, value: string) => {
    const items = [...(component.props.items || [])];
    items[idx] = { ...items[idx], [key]: value };
    handlePropChange("items", items);
  };

  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 text-left animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accordion Items</span>
        <button
          onClick={addFaqItem}
          className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 smooth-transition font-semibold cursor-pointer"
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
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 smooth-transition cursor-pointer"
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




    </div>
  );
};
