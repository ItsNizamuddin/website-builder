"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ComponentProps, resolveThemeColor, getSubElementClass, getSubAlignClass, selectSubElement, selectParentElement, resolveBgColor } from "./shared";
import { useBuilderStore } from "@/store/useBuilderStore";

export const FAQComp: React.FC<ComponentProps> = ({ props, mode, id, sectionId }) => {
  const { selectedElement, setSelectedElement } = useBuilderStore();

  const {
    items = [],
    bgColor = "#ffffff",
    textColor = "#1e293b",
    answerColor = "#475569",
    marginTop = "mt-4",
    marginBottom = "mb-4",
    questionFontSize = "text-sm",
    answerFontSize = "text-xs"
  } = props;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number, e: React.MouseEvent) => {
    if (mode === "edit") {
      selectSubElement("question", e, mode, sectionId, id, setSelectedElement);
    } else {
      setOpenIndex(openIndex === idx ? null : idx);
    }
  };

  const resolvedAccent = resolveThemeColor(props.accentColor, "#2563eb", "var(--color-primary)");

  const finalQuestionColor = props.questionColor || textColor;

  return (
    <div
      onClick={(e) => selectParentElement(e, mode, sectionId, id, setSelectedElement)}
      className={`w-full flex flex-col gap-3 ${marginTop} ${marginBottom} cursor-pointer`}
    >
      {(items || []).map((item: any, idx: number) => {
        // In edit mode, we can expand all or show active selection
        const isOpen = mode === "edit" ? true : openIndex === idx;
        const resolvedBg = resolveBgColor(props.bgType, bgColor);
        return (
          <div
            key={idx}
            className="border rounded-xl overflow-hidden shadow-sm smooth-transition"
            style={{ backgroundColor: resolvedBg, borderColor: isOpen ? `color-mix(in srgb, ${resolvedAccent} 18%, transparent)` : "#e2e8f0" }}
          >
            <div
              onClick={(e) => toggle(idx, e)}
              className={`w-full flex items-center justify-between p-4 ${getSubAlignClass(props.questionAlign, "left")} ${questionFontSize} ${props.questionFontWeight || "font-semibold"} ${props.questionLineHeight || "leading-normal"} ${props.questionDecoration || "no-underline"} smooth-transition cursor-pointer ${getSubElementClass("question", mode, id, selectedElement)}`}
              style={{ color: finalQuestionColor }}
            >
              <span className="flex-1">
                {item.question || "New Question?"}
              </span>
              <ChevronDown
                className={`w-4 h-4 smooth-transition shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
                style={{ color: resolvedAccent }}
              />
            </div>
            <div
              className={`smooth-transition overflow-hidden ${isOpen ? "max-h-48 border-t" : "max-h-0"}`}
              style={{ borderColor: `color-mix(in srgb, ${resolvedAccent} 8%, transparent)` }}
            >
              <div
                onClick={(e) => selectSubElement("answer", e, mode, sectionId, id, setSelectedElement)}
                className={`p-4 ${answerFontSize} ${props.answerFontWeight || "font-normal"} ${props.answerLineHeight || "leading-relaxed"} ${getSubAlignClass(props.answerAlign, "left")} ${props.answerDecoration || "no-underline"} ${getSubElementClass("answer", mode, id, selectedElement)}`}
                style={{ color: answerColor, backgroundColor: `color-mix(in srgb, ${resolvedAccent} 2%, transparent)` }}
              >
                {item.answer || "Answer details will go here."}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
