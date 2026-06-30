"use client";

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
