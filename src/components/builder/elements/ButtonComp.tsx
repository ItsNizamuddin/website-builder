"use client";

import React from "react";
import { ComponentProps, resolveThemeColor } from "./shared";

export const ButtonComp: React.FC<ComponentProps> = ({ props, mode }) => {
  const { text = "Button", url = "#", variant = "primary", textColor = "#ffffff", size = "md", borderRadius = "rounded-md", align = "left", marginTop = "mt-4", marginBottom = "mb-4", fontSize } = props;
  const resolvedColor = resolveThemeColor(props.color, "#2563eb", "var(--color-primary)");
  const resolvedSecondary = resolveThemeColor(props.secondaryColor, "#1e3a8a", "var(--color-secondary)");

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align as "left" | "center" | "right"] || "text-left";

  const baseStyle = "inline-flex items-center justify-center font-semibold smooth-transition active:scale-95 cursor-pointer shadow-sm";
  const sizeClass = {
    sm: "px-3 py-1.5",
    md: "px-5 py-2.5",
    lg: "px-7 py-3"
  }[size as "sm" | "md" | "lg"] || "px-5 py-2.5";

  const resolvedFontSize = fontSize || {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }[size as "sm" | "md" | "lg"] || "text-base";

  const buttonStyle: React.CSSProperties = {};
  let variantClass = "";

  if (variant === "primary") {
    buttonStyle.backgroundColor = resolvedColor;
    buttonStyle.color = textColor;
    variantClass = "hover:brightness-105 shadow-sm shadow-black/10";
  } else if (variant === "secondary") {
    buttonStyle.backgroundColor = resolvedSecondary;
    buttonStyle.color = textColor;
    variantClass = "hover:brightness-110 border border-slate-700/30";
  } else {
    buttonStyle.borderColor = resolvedColor;
    buttonStyle.color = resolvedColor;
    buttonStyle.backgroundColor = "transparent";
    variantClass = "hover-bg-primary-light";
  }

  const handleClick = (e: React.MouseEvent) => {
    if (mode === "edit") {
      e.preventDefault();
    }
  };

  return (
    <div className={`${alignClass} ${marginTop} ${marginBottom}`}>
      <a
        href={url}
        onClick={handleClick}
        className={`${baseStyle} ${sizeClass} ${resolvedFontSize} ${borderRadius} ${variantClass}`}
        style={buttonStyle}
      >
        {text}
      </a>
    </div>
  );
};
