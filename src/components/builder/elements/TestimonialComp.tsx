"use client";

import React from "react";
import { Quote } from "lucide-react";
import { ComponentProps, resolveThemeColor, getSubElementClass, getSubAlignClass, selectSubElement, selectParentElement, resolveBgColor } from "./shared";
import { useBuilderStore } from "@/store/useBuilderStore";

export const TestimonialComp: React.FC<ComponentProps> = ({ props, mode, id, sectionId }) => {
  const { selectedElement, setSelectedElement } = useBuilderStore();

  const {
    quote = "Testimonial text",
    author = "Name",
    role = "Role",
    company = "Company",
    avatar = "",
    bgColor = "#ffffff",
    textColor = "#334155",
    authorColor = "#0f172a",
    marginTop = "mt-4",
    marginBottom = "mb-4",
    quoteFontSize = "text-base",
    authorFontSize = "text-sm",
    align = "left"
  } = props;

  const resolvedAccent = resolveThemeColor(props.accentColor, "#2563eb", "var(--color-primary)");

  const containerAlignClass = align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start";

  const resolvedBg = resolveBgColor(props.bgType, bgColor);

  const finalQuoteColor = props.quoteColor || textColor;
  const finalDetailsColor = resolveThemeColor(props.detailsColor, resolvedAccent, resolvedAccent);

  return (
    <div
      onClick={(e) => selectParentElement(e, mode, sectionId, id, setSelectedElement)}
      className={`p-6 rounded-xl flex flex-col justify-between h-full ${marginTop} ${marginBottom} shadow-sm border border-slate-200/70 relative group overflow-hidden ${containerAlignClass} cursor-pointer`}
      style={{ backgroundColor: resolvedBg }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none" style={{ backgroundColor: `color-mix(in srgb, ${resolvedAccent} 4%, transparent)` }} />
      <Quote className="w-8 h-8 mb-4" style={{ color: `color-mix(in srgb, ${resolvedAccent} 12%, transparent)` }} />
      
      <p
        onClick={(e) => selectSubElement("quote", e, mode, sectionId, id, setSelectedElement)}
        className={`${quoteFontSize} ${props.quoteFontWeight || "font-normal"} ${props.quoteLineHeight || "leading-relaxed"} italic relative z-10 ${getSubAlignClass(props.quoteAlign, align)} ${props.quoteDecoration || "no-underline"} w-full ${getSubElementClass("quote", mode, id, selectedElement)}`}
        style={{ color: finalQuoteColor }}
      >
        {quote}
      </p>

      <div className={`flex items-center gap-4 mt-6 border-t border-slate-100 pt-4 z-10 w-full ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={props.avatarAlt || author}
          onClick={(e) => selectSubElement("avatar", e, mode, sectionId, id, setSelectedElement)}
          className={`w-10 h-10 rounded-full object-cover shadow-sm border cursor-pointer ${getSubElementClass("avatar", mode, id, selectedElement)}`}
          style={{ borderColor: `color-mix(in srgb, ${resolvedAccent} 12%, transparent)` }}
        />
        <div className={getSubAlignClass(props.authorAlign, align)}>
          <h4
            onClick={(e) => selectSubElement("author", e, mode, sectionId, id, setSelectedElement)}
            className={`${props.authorFontWeight || "font-semibold"} ${authorFontSize} ${props.authorLineHeight || "leading-normal"} ${props.authorDecoration || "no-underline"} ${getSubElementClass("author", mode, id, selectedElement)}`}
            style={{ color: authorColor }}
          >
            {author}
          </h4>
          <p className="text-xs flex flex-wrap items-center gap-1 mt-0.5" style={{ color: finalQuoteColor, opacity: 0.7 }}>
            <span onClick={(e) => selectSubElement("role", e, mode, sectionId, id, setSelectedElement)} className={`${props.detailsFontWeight || "font-normal"} ${props.detailsLineHeight || "leading-normal"} ${props.detailsDecoration || "no-underline"} ${getSubElementClass("role", mode, id, selectedElement)}`}>{role}</span>
            <span>&bull;</span>
            <span
              onClick={(e) => selectSubElement("company", e, mode, sectionId, id, setSelectedElement)}
              className={`font-semibold ${props.detailsFontWeight || "font-normal"} ${props.detailsLineHeight || "leading-normal"} ${props.detailsDecoration || "no-underline"} ${getSubElementClass("company", mode, id, selectedElement)}`}
              style={{ color: finalDetailsColor }}
            >
              {company}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
