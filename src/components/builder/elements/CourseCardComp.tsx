"use client";

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { ComponentProps, resolveThemeColor } from "./shared";

export const CourseCardComp: React.FC<ComponentProps> = ({ props, mode }) => {
  const {
    title = "Course Title",
    instructor = "Instructor Name",
    badge = "New",
    price = "$99",
    duration = "10 Hours",
    image = "",
    buttonText = "Enroll Now",
    bgColor = "#ffffff",
    textColor = "#1e293b",
    detailsColor = "#64748b",
    url = "#",
    marginTop = "mt-4",
    marginBottom = "mb-4",
    shadowSize = "shadow-md",
    hoverZoom = true,
    hoverZoomScale = "scale-105",
    borderRadius = "rounded-xl",
    titleFontSize = "text-lg",
    detailsFontSize = "text-xs"
  } = props;

  const handleCtaClick = (e: React.MouseEvent) => {
    if (mode === "edit") e.preventDefault();
  };

  const [isHovered, setIsHovered] = useState(false);
  const resolvedAccent = resolveThemeColor(props.accentColor, "#2563eb", "var(--color-primary)");

  const shadowClass = shadowSize === "none" ? "shadow-none" : shadowSize;
  const zoomClass = hoverZoom ? `group-hover:${hoverZoomScale || "scale-105"}` : "";

  const resolvedBg = props.bgType === "none" ? "transparent" : (props.bgType && props.bgType !== "none" ? "transparent" : bgColor);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${borderRadius} overflow-hidden border smooth-transition flex flex-col justify-between h-full ${shadowClass} group ${marginTop} ${marginBottom}`}
      style={{
        backgroundColor: resolvedBg,
        borderColor: isHovered ? `color-mix(in srgb, ${resolvedAccent} 25%, transparent)` : "#e2e8f0"
      }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {badge && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10 shadow-sm"
            style={{ backgroundColor: resolvedAccent }}
          >
            {badge}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"}
          alt={title}
          className={`w-full h-full object-cover smooth-transition ${zoomClass}`}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className={`flex items-center gap-1.5 ${detailsFontSize} mb-2 font-semibold`} style={{ color: resolvedAccent }}>
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{duration}</span>
        </div>
        <h3
          className={`font-bold ${titleFontSize} leading-snug smooth-transition text-left`}
          style={{ color: isHovered ? resolvedAccent : textColor }}
        >
          {title}
        </h3>
        <p className={`${detailsFontSize} mt-1.5 flex-1 text-left flex flex-wrap gap-1 items-center`} style={{ color: detailsColor }}>
          <span>By {instructor}</span>
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="font-extrabold text-xl" style={{ color: textColor }}>{price}</span>
          <a
            href={url}
            onClick={handleCtaClick}
            className="px-4 py-2 border font-bold rounded-lg text-xs smooth-transition"
            style={{
              backgroundColor: isHovered ? resolvedAccent : `color-mix(in srgb, ${resolvedAccent} 6%, transparent)`,
              color: isHovered ? "#ffffff" : resolvedAccent,
              borderColor: resolvedAccent
            }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};
