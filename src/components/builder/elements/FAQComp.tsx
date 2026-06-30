"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ComponentProps, resolveThemeColor } from "./shared";

export const FAQComp: React.FC<ComponentProps> = ({ props }) => {
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

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const resolvedAccent = resolveThemeColor(props.accentColor, "#2563eb", "var(--color-primary)");

  return (
    <div className={`w-full flex flex-col gap-3 ${marginTop} ${marginBottom}`}>
      {(items || []).map((item: any, idx: number) => {
        const isOpen = openIndex === idx;
        const resolvedBg = props.bgType === "none" ? "transparent" : (props.bgType && props.bgType !== "none" ? "transparent" : bgColor);
        return (
          <div
            key={idx}
            className="border rounded-xl overflow-hidden shadow-sm smooth-transition"
            style={{ backgroundColor: resolvedBg, borderColor: isOpen ? `color-mix(in srgb, ${resolvedAccent} 18%, transparent)` : "#e2e8f0" }}
          >
            <button
              onClick={() => toggle(idx)}
              className={`w-full flex items-center justify-between p-4 text-left ${questionFontSize} font-semibold smooth-transition cursor-pointer`}
              style={{ color: textColor }}
            >
              <span className="flex-1">
                {item.question || "New Question?"}
              </span>
              <ChevronDown
                className={`w-4 h-4 smooth-transition shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
                style={{ color: resolvedAccent }}
              />
            </button>
            <div
              className={`smooth-transition overflow-hidden ${isOpen ? "max-h-48 border-t" : "max-h-0"}`}
              style={{ borderColor: `color-mix(in srgb, ${resolvedAccent} 8%, transparent)` }}
            >
              <div
                className={`p-4 ${answerFontSize} leading-relaxed text-left`}
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
