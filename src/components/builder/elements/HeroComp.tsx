"use client";

import React from "react";
import { ComponentProps, resolveThemeColor, getSubElementClass, getSubAlignClass, selectSubElement, selectParentElement } from "./shared";
import { useBuilderStore } from "@/store/useBuilderStore";

export const HeroComp: React.FC<ComponentProps> = ({ props, mode, id, sectionId }) => {
  const { selectedElement, setSelectedElement } = useBuilderStore();

  const {
    heading = "Hero Title",
    subheading = "Subheading",
    buttonText = "CTA Button",
    buttonUrl = "#",
    bgStyle = "preset-gradient",
    bgGradient = "from-blue-600 to-indigo-900",
    textColor = "#ffffff",
    ctaBgColor = "#ffffff",
    align = "left",
    marginTop = "mt-0",
    marginBottom = "mb-0",
    shadowSize = "shadow-xl",
    borderRadius = "rounded-2xl",
    titleFontSize = "text-4xl",
    subtitleFontSize = "text-lg"
  } = props;

  const resolvedBg = resolveThemeColor(props.bgColor, "#2563eb", "var(--color-primary)");
  const resolvedStart = resolveThemeColor(props.gradientStart, "#3b82f6", "var(--color-gradient-start)");
  const resolvedEnd = resolveThemeColor(props.gradientEnd, "#1e3a8a", "var(--color-gradient-end)");
  const resolvedCtaText = resolveThemeColor(props.ctaTextColor, "#2563eb", "var(--color-primary)");

  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  }[align as "left" | "center" | "right"] || "text-left items-start";

  const handleCtaClick = (e: React.MouseEvent) => {
    if (mode === "edit") {
      e.preventDefault();
      selectSubElement("buttonText", e, mode, sectionId, id, setSelectedElement);
    }
  };

  const containerStyle: React.CSSProperties = {
    color: textColor
  };

  let bgClass = "";
  const bgType = props.bgType;

  if (bgType === "none") {
    containerStyle.background = "transparent";
    containerStyle.backgroundColor = "transparent";
  } else if (bgType === "color") {
    containerStyle.backgroundColor = resolvedBg;
  } else if (bgType === "gradient") {
    containerStyle.background = `linear-gradient(135deg, ${resolvedStart}, ${resolvedEnd})`;
  } else if (bgType === "image" && props.bgImage) {
    containerStyle.backgroundImage = `url(${props.bgImage})`;
    containerStyle.backgroundSize = "cover";
    containerStyle.backgroundPosition = "center";
  } else if (bgStyle === "solid") {
    containerStyle.backgroundColor = resolvedBg;
  } else if (bgStyle === "custom-gradient" || (bgStyle === "preset-gradient" && bgGradient === "from-blue-600 to-indigo-900")) {
    containerStyle.background = `linear-gradient(135deg, ${resolvedStart}, ${resolvedEnd})`;
  } else {
    bgClass = `bg-linear-to-br bg-gradient-to-br ${bgGradient}`;
  }

  const shadowClass = shadowSize === "none" ? "shadow-none" : shadowSize;

  const finalTitleColor = props.titleColor || textColor;
  const finalSubtitleColor = props.subtitleColor || textColor;

  const gapMap = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
    "12": "gap-12",
  };
  const gapClass = gapMap[props.contentGap as keyof typeof gapMap] || "gap-4";
  const TitleTag = (props.titleTag || "h1") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <div
      onClick={(e) => selectParentElement(e, mode, sectionId, id, setSelectedElement)}
      className={`w-full ${borderRadius} p-8 md:p-12 ${bgClass} border border-slate-200/20 ${shadowClass} flex flex-col justify-center ${gapClass} ${alignClass} ${marginTop} ${marginBottom} cursor-pointer`}
      style={containerStyle}
    >
      <TitleTag
        onClick={(e) => selectSubElement("heading", e, mode, sectionId, id, setSelectedElement)}
        className={`${titleFontSize} ${props.titleFontWeight || "font-extrabold"} tracking-tight max-w-2xl ${props.titleLineHeight || "leading-tight"} ${getSubAlignClass(props.titleAlign, align)} ${props.titleDecoration || "no-underline"} ${getSubElementClass("heading", mode, id, selectedElement)}`}
        style={{ color: finalTitleColor }}
      >
        {heading}
      </TitleTag>
      {(() => {
        const SubheadingTag = (props.subheadingTag || "p") as "p" | "h2" | "h3" | "h4" | "h5" | "h6";
        return (
          <SubheadingTag
            onClick={(e) => selectSubElement("subheading", e, mode, sectionId, id, setSelectedElement)}
            className={`${subtitleFontSize} ${props.subtitleFontWeight || "font-light"} ${props.subtitleLineHeight || "leading-relaxed"} opacity-90 ${getSubAlignClass(props.subtitleAlign, align)} ${props.subtitleDecoration || "no-underline"} ${getSubElementClass("subheading", mode, id, selectedElement)}`}
            style={{ color: finalSubtitleColor }}
          >
            {subheading}
          </SubheadingTag>
        );
      })()}
      {buttonText && (
        <div className={getSubElementClass("buttonText", mode, id, selectedElement)}>
          <a
            href={buttonUrl}
            onClick={handleCtaClick}
            target={props.buttonOpenInNewTab ? "_blank" : undefined}
            rel={props.buttonOpenInNewTab ? "noopener noreferrer" : undefined}
            className="px-6 py-3 font-bold rounded-lg hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] smooth-transition shadow-lg shadow-black/10 inline-block cursor-pointer"
            style={{ backgroundColor: ctaBgColor, color: resolvedCtaText }}
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  );
};
