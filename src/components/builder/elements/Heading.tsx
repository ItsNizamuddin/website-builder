"use client";

import React from "react";
import { ComponentProps } from "./shared";

export const Heading: React.FC<ComponentProps> = ({ props }) => {
  const { text = "Heading", level = "h2", align = "left", color = "#0f172a", fontSize = "text-3xl", marginTop = "mt-4", marginBottom = "mb-4" } = props;
  const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align as "left" | "center" | "right"] || "text-left";

  return (
    <Tag
      className={`${fontSize} font-bold tracking-tight ${alignClass} ${marginTop} ${marginBottom} transition-colors duration-155`}
      style={{ color }}
    >
      {text}
    </Tag>
  );
};
