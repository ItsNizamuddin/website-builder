"use client";

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { ComponentProps, resolveThemeColor, getSubElementClass, getSubAlignClass, selectSubElement, selectParentElement, resolveBgColor } from "./shared";
import { useBuilderStore } from "@/store/useBuilderStore";

export const CourseCardComp: React.FC<ComponentProps> = ({ props, mode, id, sectionId }) => {
  const { selectedElement, setSelectedElement } = useBuilderStore();

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
    if (mode === "edit") {
      e.preventDefault();
      selectSubElement("button", e, mode, sectionId, id, setSelectedElement);
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const resolvedAccent = resolveThemeColor(props.accentColor, "#2563eb", "var(--color-primary)");

  const shadowClass = shadowSize === "none" ? "shadow-none" : shadowSize;
  const zoomClass = hoverZoom ? `group-hover:${hoverZoomScale || "scale-105"}` : "";

  const resolvedBg = resolveBgColor(props.bgType, bgColor);

  const finalTitleColor = props.titleColor || textColor;
  const finalPriceColor = props.priceColor || textColor;
  const finalBadgeBgColor = resolveThemeColor(props.badgeBgColor, resolvedAccent, resolvedAccent);
  const finalCtaBgColor = resolveThemeColor(props.ctaBgColor, resolvedAccent, resolvedAccent);

  return (
    <div
      onClick={(e) => selectParentElement(e, mode, sectionId, id, setSelectedElement)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${borderRadius} overflow-hidden border smooth-transition flex flex-col justify-between h-full ${shadowClass} group ${marginTop} ${marginBottom} cursor-pointer`}
      style={{
        backgroundColor: resolvedBg,
        borderColor: isHovered ? `color-mix(in srgb, ${resolvedAccent} 25%, transparent)` : "#e2e8f0"
      }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {badge && (
          <span
            onClick={(e) => selectSubElement("badge", e, mode, sectionId, id, setSelectedElement)}
            className={`absolute top-3 left-3 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10 shadow-sm ${getSubElementClass("badge", mode, id, selectedElement)}`}
            style={{ backgroundColor: finalBadgeBgColor }}
          >
            {badge}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"}
          alt={props.imageAlt || title}
          onClick={(e) => selectSubElement("image", e, mode, sectionId, id, setSelectedElement)}
          className={`w-full h-full object-cover smooth-transition cursor-pointer ${zoomClass} ${getSubElementClass("image", mode, id, selectedElement)}`}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div 
          onClick={(e) => selectSubElement("duration", e, mode, sectionId, id, setSelectedElement)}
          className={`flex items-center gap-1.5 ${detailsFontSize} ${props.detailsFontWeight || "font-semibold"} ${props.detailsLineHeight || "leading-normal"} ${getSubAlignClass(props.detailsAlign, "left")} ${props.detailsDecoration || "no-underline"} mb-2 ${getSubElementClass("duration", mode, id, selectedElement)}`} 
          style={{ color: resolvedAccent }}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{duration}</span>
        </div>
        {(() => {
          const TitleTag = (props.titleTag || "h3") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
          return (
            <TitleTag
              onClick={(e) => selectSubElement("title", e, mode, sectionId, id, setSelectedElement)}
              className={`${titleFontSize} ${props.titleFontWeight || "font-bold"} ${props.titleLineHeight || "leading-snug"} ${getSubAlignClass(props.titleAlign, "left")} ${props.titleDecoration || "no-underline"} smooth-transition ${getSubElementClass("title", mode, id, selectedElement)}`}
              style={{ color: isHovered ? finalCtaBgColor : finalTitleColor }}
            >
              {title}
            </TitleTag>
          );
        })()}
        <p 
          onClick={(e) => selectSubElement("instructor", e, mode, sectionId, id, setSelectedElement)}
          className={`${detailsFontSize} ${props.detailsFontWeight || "font-normal"} ${props.detailsLineHeight || "leading-normal"} ${getSubAlignClass(props.detailsAlign, "left")} ${props.detailsDecoration || "no-underline"} mt-1.5 flex-1 flex flex-wrap gap-1 items-center ${getSubElementClass("instructor", mode, id, selectedElement)}`} 
          style={{ color: detailsColor }}
        >
          <span>By {instructor}</span>
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span 
            onClick={(e) => selectSubElement("price", e, mode, sectionId, id, setSelectedElement)}
            className={`${props.priceFontWeight || "font-extrabold"} text-xl ${props.priceLineHeight || "leading-normal"} ${getSubAlignClass(props.priceAlign, "left")} ${props.priceDecoration || "no-underline"} ${getSubElementClass("price", mode, id, selectedElement)}`} 
            style={{ color: finalPriceColor }}
          >
            {price}
          </span>
          <div className={getSubElementClass("button", mode, id, selectedElement)}>
            <a
              href={url}
              onClick={handleCtaClick}
              target={props.buttonOpenInNewTab ? "_blank" : undefined}
              rel={props.buttonOpenInNewTab ? "noopener noreferrer" : undefined}
              className="px-4 py-2 border font-bold rounded-lg text-xs smooth-transition inline-block"
              style={{
                backgroundColor: isHovered ? finalCtaBgColor : `color-mix(in srgb, ${finalCtaBgColor} 6%, transparent)`,
                color: isHovered ? "#ffffff" : finalCtaBgColor,
                borderColor: finalCtaBgColor
              }}
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
