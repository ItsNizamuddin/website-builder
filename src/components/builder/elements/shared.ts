"use client";

import React from "react";

export interface ComponentProps {
  props: Record<string, any>;
  mode?: "edit" | "preview";
  id?: string;
  sectionId?: string;
}

export const resolveThemeColor = (colorVal: string | undefined, defaultHex: string, cssVar: string) => {
  if (!colorVal || colorVal === defaultHex) {
    return cssVar;
  }
  return colorVal;
};

export const getSubElementClass = (
  key: string,
  mode: "edit" | "preview" | undefined,
  elementId: string | undefined,
  selectedElement: { elementId?: string; subElementKey?: string } | null | undefined
) => {
  if (mode !== "edit") return "";
  const isSelected = selectedElement?.elementId === elementId && selectedElement?.subElementKey === key;
  return `smooth-transition ${
    isSelected
      ? "ring-2 ring-blue-500 bg-blue-500/5 p-1 rounded-sm"
      : "hover:ring-1 hover:ring-blue-400 hover:ring-dashed p-1 rounded-sm"
  }`;
};

export const getSubAlignClass = (subAlign: string | undefined, parentAlign: string = "left") => {
  const val = subAlign || parentAlign;
  return val === "center" ? "text-center" : val === "right" ? "text-right" : "text-left";
};

export const selectSubElement = (
  key: string,
  e: React.MouseEvent,
  mode: "edit" | "preview" | undefined,
  sectionId: string | undefined,
  elementId: string | undefined,
  setSelectedElement: (element: any) => void
) => {
  if (mode !== "edit") return;
  e.stopPropagation();
  setSelectedElement({
    type: "component",
    sectionId,
    elementId,
    subElementKey: key
  });
};

export const selectParentElement = (
  e: React.MouseEvent,
  mode: "edit" | "preview" | undefined,
  sectionId: string | undefined,
  elementId: string | undefined,
  setSelectedElement: (element: any) => void
) => {
  if (mode !== "edit") return;
  e.stopPropagation();
  setSelectedElement({
    type: "component",
    sectionId,
    elementId
  });
};

export const resolveBgColor = (bgType: string | undefined, bgColor: string) => {
  if (bgType === "color") return bgColor;
  if (bgType === "none") return "transparent";
  if (!bgType) return bgColor; // no bgType set → use component default
  return "transparent"; // gradient/image handled separately
};
