"use client";

import React from "react";
import { ComponentProps } from "./shared";

export const ImageComp: React.FC<ComponentProps> = ({ props }) => {
  const {
    src = "",
    alt = "Image",
    borderRadius = "rounded-lg",
    aspectRatio = "aspect-video",
    marginTop = "mt-4",
    marginBottom = "mb-4",
    shadowSize = "shadow-sm",
    hoverZoom = true,
    hoverZoomScale = "scale-105"
  } = props;

  const shadowClass = shadowSize === "none" ? "shadow-none" : shadowSize;
  const zoomClass = hoverZoom ? `group-hover:${hoverZoomScale || "scale-105"}` : "";

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatio} ${borderRadius} ${marginTop} ${marginBottom} border border-slate-200 group ${shadowClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
        alt={alt}
        className={`w-full h-full object-cover smooth-transition ${zoomClass}`}
      />
    </div>
  );
};
