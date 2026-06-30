"use client";

import React from "react";
import { ComponentProps, resolveThemeColor } from "./shared";

export const HeroComp: React.FC<ComponentProps> = ({ props, mode }) => {
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

  const isWrapperBgActive = props.bgType && props.bgType !== "none";
  const resolvedBg = isWrapperBgActive ? "transparent" : resolveThemeColor(props.bgColor, "#2563eb", "var(--color-primary)");
  const resolvedStart = isWrapperBgActive ? "transparent" : resolveThemeColor(props.gradientStart, "#3b82f6", "var(--color-gradient-start)");
  const resolvedEnd = isWrapperBgActive ? "transparent" : resolveThemeColor(props.gradientEnd, "#1e3a8a", "var(--color-gradient-end)");
  const resolvedCtaText = resolveThemeColor(props.ctaTextColor, "#2563eb", "var(--color-primary)");

  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  }[align as "left" | "center" | "right"] || "text-left items-start";

  const handleCtaClick = (e: React.MouseEvent) => {
    if (mode === "edit") e.preventDefault();
  };

  const containerStyle: React.CSSProperties = {
    color: textColor
  };

  let bgClass = "";
  if (props.bgType === "none") {
    containerStyle.background = "transparent";
    containerStyle.backgroundColor = "transparent";
  } else if (isWrapperBgActive) {
    containerStyle.background = "transparent";
    containerStyle.backgroundColor = "transparent";
  } else if (bgStyle === "solid") {
    containerStyle.backgroundColor = resolvedBg;
  } else if (bgStyle === "custom-gradient" || (bgStyle === "preset-gradient" && bgGradient === "from-blue-600 to-indigo-900")) {
    containerStyle.background = `linear-gradient(135deg, ${resolvedStart}, ${resolvedEnd})`;
  } else {
    bgClass = `bg-linear-to-br bg-gradient-to-br ${bgGradient}`;
  }

  const shadowClass = shadowSize === "none" ? "shadow-none" : shadowSize;

  const textAlignClass = {
    left: "text-left mr-auto",
    center: "text-center mx-auto",
    right: "text-right ml-auto"
  }[align as "left" | "center" | "right"] || "text-left mr-auto";

  return (
    <div
      className={`w-full ${borderRadius} p-8 md:p-12 ${bgClass} border border-slate-200/20 ${shadowClass} flex flex-col justify-center ${alignClass} ${marginTop} ${marginBottom}`}
      style={containerStyle}
    >
      <h1
        className={`${titleFontSize} font-extrabold tracking-tight max-w-2xl leading-tight ${textAlignClass}`}
        style={{ color: textColor }}
      >
        {heading}
      </h1>
      <p
        className={`mt-4 ${subtitleFontSize} max-w-xl font-light leading-relaxed opacity-90 ${textAlignClass}`}
        style={{ color: textColor }}
      >
        {subheading}
      </p>
      {buttonText && (
        <a
          href={buttonUrl}
          onClick={handleCtaClick}
          className="mt-8 px-6 py-3 font-bold rounded-lg hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] smooth-transition shadow-lg shadow-black/10 inline-block"
          style={{ backgroundColor: ctaBgColor, color: resolvedCtaText }}
        >
          {buttonText}
        </a>
      )}
    </div>
  );
};
