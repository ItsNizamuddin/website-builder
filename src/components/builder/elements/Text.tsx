"use client";

import React from "react";
import { ComponentProps } from "./shared";

export const Text: React.FC<ComponentProps> = ({ props }) => {
  const { text = "Text", align = "left", color = "#475569", fontSize = "text-base", marginTop = "mt-2", marginBottom = "mb-4" } = props;

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align as "left" | "center" | "right"] || "text-left";

  return (
    <p
      className={`whitespace-pre-line leading-relaxed ${fontSize} ${alignClass} ${marginTop} ${marginBottom}`}
      style={{ color }}
    >
      {text}
    </p>
  );
};
