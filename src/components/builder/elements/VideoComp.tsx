"use client";

import React from "react";
import { Play } from "lucide-react";
import { ComponentProps } from "./shared";

export const VideoComp: React.FC<ComponentProps> = ({ props }) => {
  const { src = "", aspectRatio = "aspect-video", marginTop = "mt-4", marginBottom = "mb-4" } = props;

  let embedUrl = src;
  if (src.includes("youtube.com/watch?v=")) {
    const videoId = src.split("v=")[1]?.split("&")[0];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (src.includes("youtu.be/")) {
    const videoId = src.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatio} rounded-lg border border-slate-200 ${marginTop} ${marginBottom} bg-black shadow-md`}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="Video preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <div className="flex flex-col items-center justify-center absolute inset-0 text-slate-400 bg-slate-50">
          <Play className="w-12 h-12 mb-2 stroke-1 text-slate-350" />
          <span className="text-xs font-semibold">Enter a YouTube URL in properties</span>
        </div>
      )}
    </div>
  );
};
