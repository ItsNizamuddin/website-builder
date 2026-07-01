import React from "react";

export interface SectionStylesOutput {
  outerClasses: string;
  outerInlineStyle: React.CSSProperties;
  innerClasses: string;
}

export function getSectionStyles(sectionStyle: Record<string, any> = {}): SectionStylesOutput {
  const outerClasses: string[] = [];
  const outerInlineStyle: React.CSSProperties = {};

  // Background Styles
  const bgType = sectionStyle.bgType || "none";
  if (bgType === "color") {
    outerInlineStyle.backgroundColor = sectionStyle.bgColor || "#ffffff";
  } else if (bgType === "gradient") {
    const preset = sectionStyle.bgGradient || "from-white to-white";
    if (preset.startsWith("from-")) {
      outerClasses.push(`bg-gradient-to-r ${preset}`);
    } else {
      outerInlineStyle.backgroundImage = preset;
    }
  } else if (bgType === "image" && sectionStyle.bgImage) {
    outerInlineStyle.backgroundImage = `url(${sectionStyle.bgImage})`;
    outerInlineStyle.backgroundSize = sectionStyle.bgImageSize || "cover";
    outerInlineStyle.backgroundPosition = sectionStyle.bgImagePosition || "center";
    outerInlineStyle.backgroundRepeat = "no-repeat";
  } else {
    // No background set — render transparently, don't force white bg
    // (component inside the section manages its own background)
  }

  // Spacing margins (external spacing around the section card)
  const mt = sectionStyle.marginTop || "none";
  const mb = sectionStyle.marginBottom || "none";
  const marginClasses = {
    none: "mt-0",
    small: "mt-4",
    medium: "mt-8",
    large: "mt-16",
    xl: "mt-24",
  };
  outerClasses.push(marginClasses[mt as keyof typeof marginClasses] || "mt-0");
  outerClasses.push(marginClasses[mb as keyof typeof marginClasses] || "mb-0");

  // Rounded Corners (border radius)
  // Default is none for standard layout blocks unless specified
  const borderRadius = sectionStyle.borderRadius || "none";
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };
  outerClasses.push(radiusClasses[borderRadius as keyof typeof radiusClasses] || "rounded-none");

  // Borders
  const borderStyle = sectionStyle.borderStyle || "none";
  if (borderStyle !== "none") {
    const borderWidth = sectionStyle.borderWidth || "1px";
    const borderColor = sectionStyle.borderColor || "#e2e8f0";
    const borderPosition = sectionStyle.borderPosition || "all";

    if (borderPosition === "all") {
      outerInlineStyle.borderStyle = borderStyle;
      outerInlineStyle.borderWidth = borderWidth;
      outerInlineStyle.borderColor = borderColor;
    } else if (borderPosition === "top") {
      outerInlineStyle.borderTopStyle = borderStyle;
      outerInlineStyle.borderTopWidth = borderWidth;
      outerInlineStyle.borderTopColor = borderColor;
    } else if (borderPosition === "bottom") {
      outerInlineStyle.borderBottomStyle = borderStyle;
      outerInlineStyle.borderBottomWidth = borderWidth;
      outerInlineStyle.borderBottomColor = borderColor;
    } else if (borderPosition === "y") {
      outerInlineStyle.borderTopStyle = borderStyle;
      outerInlineStyle.borderTopWidth = borderWidth;
      outerInlineStyle.borderTopColor = borderColor;
      outerInlineStyle.borderBottomStyle = borderStyle;
      outerInlineStyle.borderBottomWidth = borderWidth;
      outerInlineStyle.borderBottomColor = borderColor;
    }
  } else {
    // No custom border — render with no border by default.
    // Sections with their own background (hero, etc.) should render flush.
  }

  // Spacing padding (applies to inner content wrapper)
  // Default is 'none' so sections render flush unless user explicitly sets padding
  const pt = sectionStyle.paddingTop || "none";
  const pb = sectionStyle.paddingBottom || "none";
  const plr = sectionStyle.paddingLeftRight || "none";

  const ptClasses = {
    none: "pt-0",
    small: "pt-3",
    medium: "pt-6",
    large: "pt-12",
    xl: "pt-20",
    xxl: "pt-32",
  };
  const pbClasses = {
    none: "pb-0",
    small: "pb-3",
    medium: "pb-6",
    large: "pb-12",
    xl: "pb-20",
    xxl: "pb-32",
  };
  const plrClasses = {
    none: "px-0",
    small: "px-3",
    medium: "px-6",
    large: "px-12",
    xl: "px-16",
  };

  const innerClasses: string[] = ["w-full"];
  innerClasses.push(ptClasses[pt as keyof typeof ptClasses] || "pt-6");
  innerClasses.push(pbClasses[pb as keyof typeof pbClasses] || "pb-6");
  innerClasses.push(plrClasses[plr as keyof typeof plrClasses] || "px-6");

  // Inner Container Width (max-width limit)
  const containerWidth = sectionStyle.containerWidth || "boxed";
  const widthClasses = {
    boxed: "max-w-6xl mx-auto",
    narrow: "max-w-4xl mx-auto",
    wide: "max-w-7xl mx-auto",
    full: "max-w-full",
  };
  innerClasses.push(widthClasses[containerWidth as keyof typeof widthClasses] || "max-w-6xl mx-auto");

  return {
    outerClasses: outerClasses.join(" "),
    outerInlineStyle,
    innerClasses: innerClasses.join(" "),
  };
}
