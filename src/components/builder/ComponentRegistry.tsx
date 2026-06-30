"use client";

import React from "react";
import { ComponentNode } from "@/types/builder";
import { Heading } from "./elements/Heading";
import { Text } from "./elements/Text";
import { ImageComp } from "./elements/ImageComp";
import { ButtonComp } from "./elements/ButtonComp";
import { VideoComp } from "./elements/VideoComp";
import { HeroComp } from "./elements/HeroComp";
import { TestimonialComp } from "./elements/TestimonialComp";
import { FAQComp } from "./elements/FAQComp";
import { CourseCardComp } from "./elements/CourseCardComp";
import { NavbarComp } from "./elements/NavbarComp";
import { FooterComp } from "./elements/FooterComp";

interface RegistryProps {
  node: ComponentNode;
  mode?: "edit" | "preview";
  sectionId?: string;
}

export const RenderComponent: React.FC<RegistryProps> = ({ node, mode = "preview", sectionId }) => {
  const {
    marginLeft = "",
    marginRight = "",
    paddingTop = "",
    paddingBottom = "",
    paddingLeft = "",
    paddingRight = "",
    alignX = "",
    alignY = "",
    gap = "",
    width = "",
    height = "",
    bgType = "none",
    bgColor = "",
    bgImage = "",
    bgImageSize = "cover",
    bgImageBlur = "0px",
    bgOverlayOpacity = "0",
    gradientStart = "#3b82f6",
    gradientEnd = "#1e3a8a",
    backdropBlur = "none",
    borderStyle = "none",
    borderWidth = "",
    borderColor = "",
    position = "relative",
    zIndex = "",
    opacity = "",
    hoverScale = "",
    transitionSpeed = "duration-150",
    fontWeight = "",
    textDecoration = "",
    lineHeight = "",
  } = node.props;

  const getComp = () => {
    switch (node.type) {
      case "navbar":
        return <NavbarComp props={node.props} mode={mode} />;
      case "footer":
        return <FooterComp props={node.props} mode={mode} />;
      case "heading":
        return <Heading props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "text":
        return <Text props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "image":
        return <ImageComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "button":
        return <ButtonComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "video":
        return <VideoComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "hero":
        return <HeroComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "testimonial":
        return <TestimonialComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "faq":
        return <FAQComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      case "courseCard":
        return <CourseCardComp props={node.props} mode={mode} id={node.id} sectionId={sectionId} />;
      default:
        return <div className="text-red-500">Unknown component type: {node.type}</div>;
    }
  };

  const spacingClasses = [
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  ].filter(Boolean).join(" ");

  const sizeClasses = [width, height].filter(Boolean).join(" ");
  const positionClasses = [position, zIndex].filter(Boolean).join(" ");

  const borderClasses = (borderStyle && borderStyle !== "none")
    ? `${borderWidth || "border"} border-${borderStyle}`
    : "";

  const effectClasses = [
    opacity,
    hoverScale,
    hoverScale ? "transition-all ease-in-out" : "",
    hoverScale ? transitionSpeed : "",
    backdropBlur !== "none" ? backdropBlur : "",
  ].filter(Boolean).join(" ");

  const typographyClasses = [
    fontWeight,
    textDecoration,
    lineHeight,
  ].filter(Boolean).join(" ");

  let layoutClasses = "";
  if (alignX || alignY || gap) {
    layoutClasses = "flex flex-col";
    if (alignX === "center") layoutClasses += " items-center text-center";
    else if (alignX === "right") layoutClasses += " items-end text-right";
    else if (alignX === "stretch") layoutClasses += " items-stretch w-full";
    else if (alignX === "left") layoutClasses += " items-start text-left";

    if (alignY === "center") layoutClasses += " justify-center";
    else if (alignY === "bottom") layoutClasses += " justify-end";
    else if (alignY === "stretch") layoutClasses += " justify-stretch";

    if (gap) {
      layoutClasses += ` gap-${gap}`;
    }
  }

  // Build inline styles for wrapper container
  const inlineStyle: React.CSSProperties = {};

  if (borderStyle && borderStyle !== "none" && borderColor) {
    inlineStyle.borderColor = borderColor;
  }

  // Build background layer configuration
  const showBgLayer = bgType === "color" || bgType === "gradient" || bgType === "image";
  const bgLayerStyle: React.CSSProperties = {};
  if (bgType === "color" && bgColor) {
    bgLayerStyle.backgroundColor = bgColor;
  } else if (bgType === "gradient") {
    bgLayerStyle.background = `linear-gradient(135deg, ${gradientStart || "#3b82f6"}, ${gradientEnd || "#1e3a8a"})`;
  } else if (bgType === "image" && bgImage) {
    bgLayerStyle.backgroundImage = `url(${bgImage})`;
    bgLayerStyle.backgroundSize = bgImageSize;
    bgLayerStyle.backgroundPosition = "center";
    bgLayerStyle.backgroundRepeat = "no-repeat";

    // Apply background image blur if specified
    if (bgImageBlur && bgImageBlur !== "0px" && bgImageBlur !== "0") {
      bgLayerStyle.filter = `blur(${bgImageBlur})`;
      // Scale image slightly to hide blurred boundaries bleeding
      bgLayerStyle.transform = "scale(1.08)";
    }
  }

  const showBackdropBlur = backdropBlur !== "none";

  return (
    <div
      className={`w-full relative ${node.type === "navbar" ? "" : "overflow-hidden"} ${spacingClasses} ${sizeClasses} ${positionClasses} ${borderClasses} ${effectClasses} ${layoutClasses} ${typographyClasses}`}
      style={inlineStyle}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-text-primary:hover { color: var(--color-primary) !important; }
        .hover-bg-primary:hover { background-color: var(--color-primary) !important; }
        .hover-border-primary:hover { border-color: var(--color-primary) !important; }
        .hover-border-secondary:hover { border-color: var(--color-secondary) !important; }
        .focus-border-primary:focus-within { border-color: var(--color-primary) !important; }
        .focus-ring-primary:focus-within { box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 15%, transparent) !important; }
        .hover-bg-primary-light:hover { background-color: color-mix(in srgb, var(--color-primary) 8%, transparent) !important; }
        .group:hover .group-hover-text-primary { color: var(--color-primary) !important; }
      `}} />
      
      {/* 1. Absolute Background Image/Color Layer */}
      {showBgLayer && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-[inherit]">
          <div 
            className="w-full h-full smooth-transition"
            style={bgLayerStyle}
          />
          {/* Overlay dark shade to ensure readability of foreground text */}
          {bgType === "image" && bgOverlayOpacity && bgOverlayOpacity !== "0" && (
            <div 
              className="absolute inset-0 pointer-events-none bg-black"
              style={{ opacity: parseFloat(bgOverlayOpacity) }}
            />
          )}
        </div>
      )}

      {/* 2. Glassmorphism backdrop blur layer */}
      {showBackdropBlur && (
        <div 
          className={`absolute inset-0 -z-5 pointer-events-none rounded-[inherit] ${backdropBlur}`}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}
        />
      )}
      {getComp()}
    </div>
  );
};

export { Heading, Text, ImageComp, ButtonComp, VideoComp, HeroComp, TestimonialComp, FAQComp, CourseCardComp, NavbarComp, FooterComp };
