"use client";

import React from "react";
import { Quote } from "lucide-react";
import { ComponentProps, resolveThemeColor } from "./shared";

export const TestimonialComp: React.FC<ComponentProps> = ({ props }) => {
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

  const textAlignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const containerAlignClass = align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start";

  const resolvedBg = props.bgType === "none" ? "transparent" : (props.bgType && props.bgType !== "none" ? "transparent" : bgColor);

  return (
    <div
      className={`p-6 rounded-xl flex flex-col justify-between h-full ${marginTop} ${marginBottom} shadow-sm border border-slate-200/70 relative group overflow-hidden ${containerAlignClass}`}
      style={{ backgroundColor: resolvedBg }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none" style={{ backgroundColor: `color-mix(in srgb, ${resolvedAccent} 4%, transparent)` }} />
      <Quote className="w-8 h-8 mb-4" style={{ color: `color-mix(in srgb, ${resolvedAccent} 12%, transparent)` }} />
      
      <p
        className={`${quoteFontSize} italic leading-relaxed relative z-10 ${textAlignClass} w-full`}
        style={{ color: textColor }}
      >
        {quote}
      </p>

      <div className={`flex items-center gap-4 mt-6 border-t border-slate-100 pt-4 z-10 w-full ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={author}
          className="w-10 h-10 rounded-full object-cover shadow-sm border"
          style={{ borderColor: `color-mix(in srgb, ${resolvedAccent} 12%, transparent)` }}
        />
        <div className={textAlignClass}>
          <h4
            className={`font-semibold ${authorFontSize}`}
            style={{ color: authorColor }}
          >
            {author}
          </h4>
          <p className="text-xs flex flex-wrap items-center gap-1 mt-0.5" style={{ color: textColor, opacity: 0.7 }}>
            <span>{role}</span>
            <span>&bull;</span>
            <span
              className="font-semibold"
              style={{ color: resolvedAccent }}
            >
              {company}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
