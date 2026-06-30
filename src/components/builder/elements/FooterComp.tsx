"use client";

import React, { useState } from "react";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { ComponentProps, resolveThemeColor } from "./shared";

export const FooterComp: React.FC<ComponentProps> = ({ props, mode }) => {
  const {
    copyrightText = "© 2026 SkillDeck. All rights reserved.",
    brandName = "SkillDeck",
    brandDescription = "Empowering students with cutting-edge academic learning resources and infrastructure tools.",
    brandNameFontSize = "text-xl",
    linkFontSize = "text-xs",
    descriptionFontSize = "text-xs",
    showBrandColumn = true,
    socialFacebook = "",
    socialTwitter = "",
    socialInstagram = "",
    socialLinkedin = "",
    socialYoutube = "",
    columnsPerRow = "auto",
    columns = [
      {
        type: "links",
        title: "Product",
        links: [{ label: "Features", url: "#" }, { label: "Pricing", url: "#" }]
      },
      {
        type: "links",
        title: "Company",
        links: [{ label: "About", url: "#" }, { label: "Careers", url: "#" }]
      }
    ],
    bgStyle = "gradient",
    bgColor = "#0f172a",
    bgGradient = "from-slate-900 to-slate-950",
    textColor = "#ffffff",
    marginTop = "mt-8",
    marginBottom = "mb-0",
    footerWidth = "floating",
    contentMaxWidth = "6xl",
    showPrivacyPolicy = true,
    privacyPolicyLabel = "Privacy Policy",
    privacyPolicyUrl = "#",
    showTermsOfService = true,
    termsOfServiceLabel = "Terms of Service",
    termsOfServiceUrl = "#",
    useGlobalLogo = true,
    logoImg = "",
    globalLogoImg = "",
    globalLogoText = "",
    showLogoText = true,
    useGlobalLogoImg,
    useGlobalLogoText
  } = props;

  const useImgGlobal = useGlobalLogoImg !== undefined ? useGlobalLogoImg : (useGlobalLogo !== false);

  const logoImgToUse = useImgGlobal ? (globalLogoImg || logoImg) : logoImg;
  const logoTextToUse = brandName || globalLogoText || "SkillDeck";

  const handleLinkClick = (e: React.MouseEvent) => {
    if (mode === "edit") e.preventDefault();
  };

  const isFullWidth = footerWidth === "full-width" || footerWidth === "full";
  const contentMaxWidthClass = {
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full px-4 sm:px-8",
  }[contentMaxWidth as string] || "max-w-6xl";

  const footerStyle: React.CSSProperties = {
    color: textColor
  };
  let bgClass = "";
  if (bgStyle === "solid") {
    footerStyle.backgroundColor = bgColor;
  } else {
    bgClass = `bg-linear-to-b bg-gradient-to-b ${bgGradient}`;
  }

  const footerLayoutClasses = isFullWidth
    ? `w-full py-12 px-4 sm:px-8 border-t border-slate-200/10 flex flex-col gap-8 ${bgClass} ${marginTop} ${marginBottom}`
    : `w-full ${contentMaxWidthClass} mx-auto rounded-2xl p-8 ${bgClass} border border-slate-200/10 shadow-lg flex flex-col gap-8 ${marginTop} ${marginBottom}`;

  const isEdit = mode === "edit";
  const { activeDevice } = useBuilderStore();

  const totalCols = columns.length + (showBrandColumn !== false ? 1 : 0);
  let gridColsDesktop = totalCols;
  if (columnsPerRow && columnsPerRow !== "auto") {
    gridColsDesktop = parseInt(columnsPerRow, 10);
  }

  let editorCols = 1;
  if (isEdit) {
    if (activeDevice === "desktop") {
      editorCols = gridColsDesktop;
    } else if (activeDevice === "tablet") {
      editorCols = gridColsDesktop > 2 ? 2 : gridColsDesktop;
    } else {
      editorCols = 1;
    }
  }

  const isCenteredFooter = props.footerVariant === "centered";
  const isSubscribeFooter = props.footerVariant === "subscribe";

  const contentCentered = (
    <div className="flex flex-col items-center justify-center text-center gap-6 py-4">
      <span className={`font-extrabold ${brandNameFontSize || "text-2xl"} tracking-tight flex items-center justify-center gap-2`} style={{ color: textColor }}>
        {logoImgToUse ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoImgToUse} alt="Logo" className="h-9 w-auto max-w-[160px] object-contain rounded" />
        ) : (
          <GraduationCap className="w-6 h-6" style={{ color: textColor }} />
        )}
        {(!logoImgToUse || showLogoText) && <span>{logoTextToUse}</span>}
      </span>
      <p className={`${descriptionFontSize || "text-xs"} opacity-75 leading-relaxed max-w-md mx-auto`} style={{ color: textColor }}>
        {brandDescription}
      </p>
      <div className={`flex flex-wrap items-center justify-center gap-6 ${linkFontSize || "text-xs"} font-bold pt-2`}>
        {columns.flatMap((col: any) => col.links || []).map((link: any, idx: number) => (
          <a key={idx} href={link.url || "#"} onClick={handleLinkClick} className="opacity-80 hover:opacity-100" style={{ color: textColor }}>
            {link.label || "Link"}
          </a>
        ))}
      </div>
      {(socialFacebook || socialTwitter || socialInstagram || socialLinkedin || socialYoutube) && (
        <div className="flex items-center gap-3 pt-2">
          {socialFacebook && (
            <a href={socialFacebook} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="opacity-75 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center justify-center" style={{ color: textColor }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
          )}
          {socialTwitter && (
            <a href={socialTwitter} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="opacity-75 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center justify-center" style={{ color: textColor }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
          )}
          {socialInstagram && (
            <a href={socialInstagram} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="opacity-75 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center justify-center" style={{ color: textColor }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          )}
        </div>
      )}
      <div className="w-full border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs opacity-60">
        <span>{copyrightText}</span>
        <div className="flex gap-4 mt-2 sm:mt-0">
          {showPrivacyPolicy && <a href={privacyPolicyUrl || "#"} onClick={handleLinkClick} className="hover:underline" style={{ color: textColor }}>{privacyPolicyLabel || "Privacy Policy"}</a>}
          {showTermsOfService && <a href={termsOfServiceUrl || "#"} onClick={handleLinkClick} className="hover:underline" style={{ color: textColor }}>{termsOfServiceLabel || "Terms of Service"}</a>}
        </div>
      </div>
    </div>
  );

  const footerGridClass = `footer-grid-custom-${columns.length}-${columnsPerRow || "auto"}-${showBrandColumn !== false ? "brand" : "nobrand"}`;

  const contentStandard = (
    <>
      <style dangerouslySetInnerHTML={{
        __html: isEdit
          ? `
            .${footerGridClass} {
              display: grid;
              grid-template-columns: repeat(${editorCols}, minmax(0, 1fr));
            }
          `
          : `
            .${footerGridClass} {
              display: grid;
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            @media (min-width: 640px) {
              .${footerGridClass} {
                grid-template-columns: repeat(${gridColsDesktop > 2 ? 2 : gridColsDesktop}, minmax(0, 1fr));
              }
            }
            @media (min-width: 1024px) {
              .${footerGridClass} {
                grid-template-columns: repeat(${gridColsDesktop}, minmax(0, 1fr));
              }
            }
          `
      }} />
      {isSubscribeFooter && (
        <div className="w-full p-6 sm:p-8 bg-blue-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-4">
          <div className="flex flex-col text-left gap-1">
            <h3 className="text-lg font-bold">Subscribe to our newsletter</h3>
            <p className="text-xs text-blue-100">Get the latest updates, articles, and learning resources sent directly to your inbox.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <input type="email" placeholder="Enter your email" className="px-4 py-2.5 rounded-xl bg-white text-slate-800 text-xs outline-none w-full md:w-64" />
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0">Subscribe</button>
          </div>
        </div>
      )}
      <div className={`${footerGridClass} gap-8 text-left`}>
        {/* Branding Info */}
        {showBrandColumn !== false && (
          <div className="flex flex-col gap-3">
            <span className={`font-extrabold ${brandNameFontSize || "text-xl"} tracking-tight flex items-center gap-1.5`} style={{ color: textColor }}>
              {logoImgToUse ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoImgToUse} alt="Logo" className="h-8 w-auto max-w-[150px] object-contain rounded" />
              ) : (
                <GraduationCap className="w-5 h-5" style={{ color: textColor }} />
              )}
              {(!logoImgToUse || showLogoText) && <span>{logoTextToUse}</span>}
            </span>
            <p className={`${descriptionFontSize || "text-xs"} opacity-70 leading-relaxed max-w-xs`} style={{ color: textColor }}>
              {brandDescription}
            </p>
            {/* Social Media Links */}
            {(socialFacebook || socialTwitter || socialInstagram || socialLinkedin || socialYoutube) && (
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {socialFacebook && (
                  <a
                    href={socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="opacity-70 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 flex items-center justify-center"
                    style={{ color: textColor }}
                    title="Facebook"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                )}
                {socialTwitter && (
                  <a
                    href={socialTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="opacity-70 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 flex items-center justify-center"
                    style={{ color: textColor }}
                    title="Twitter"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </a>
                )}
                {socialInstagram && (
                  <a
                    href={socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="opacity-70 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 flex items-center justify-center"
                    style={{ color: textColor }}
                    title="Instagram"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
                {socialLinkedin && (
                  <a
                    href={socialLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="opacity-70 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 flex items-center justify-center"
                    style={{ color: textColor }}
                    title="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
                {socialYoutube && (
                  <a
                    href={socialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="opacity-70 hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 flex items-center justify-center"
                    style={{ color: textColor }}
                    title="YouTube"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2c-.46 1.72-.46 5.33-.46 5.33s0 3.6.46 5.33a2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2c.46-1.72.46-5.33.46-5.33s0-3.6-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Columns of Content */}
        {columns.map((col: any, idx: number) => {
          const colType = col.type || "links";
          return (
            <div key={idx} className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-90" style={{ color: textColor }}>
                {col.title || "Column"}
              </h4>

              {colType === "links" && (
                <ul className="flex flex-col gap-2">
                  {(col.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url || "#"}
                        onClick={handleLinkClick}
                        className={`${linkFontSize || "text-xs"} opacity-75 hover:opacity-100`}
                        style={{ color: textColor }}
                      >
                        {link.label || "Link"}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {colType === "contact" && (
                <ul className="flex flex-col gap-2.5">
                  {col.email && (
                    <li className={`flex items-center gap-2 ${linkFontSize || "text-xs"} opacity-75 hover:opacity-100`}>
                      <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: textColor }} />
                      <a href={`mailto:${col.email}`} onClick={handleLinkClick} style={{ color: textColor }} className="hover:underline">
                        {col.email}
                      </a>
                    </li>
                  )}
                  {col.phone && (
                    <li className={`flex items-center gap-2 ${linkFontSize || "text-xs"} opacity-75 hover:opacity-100`}>
                      <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: textColor }} />
                      <a href={`tel:${col.phone}`} onClick={handleLinkClick} style={{ color: textColor }} className="hover:underline">
                        {col.phone}
                      </a>
                    </li>
                  )}
                  {col.address && (
                    <li className={`flex items-start gap-2 ${linkFontSize || "text-xs"} opacity-75`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: textColor }} />
                      <span className="whitespace-pre-line" style={{ color: textColor }}>
                        {col.address}
                      </span>
                    </li>
                  )}
                </ul>
              )}

              {colType === "text" && (
                <p className={`${descriptionFontSize || "text-xs"} opacity-75 leading-relaxed whitespace-pre-line`} style={{ color: textColor }}>
                  {col.text || ""}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider & Copyright */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs opacity-60" style={{ color: textColor }}>
        <span>{copyrightText}</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          {showPrivacyPolicy && (
            <a href={privacyPolicyUrl || "#"} onClick={handleLinkClick} className="hover:underline" style={{ color: textColor }}>
              {privacyPolicyLabel || "Privacy Policy"}
            </a>
          )}
          {showTermsOfService && (
            <a href={termsOfServiceUrl || "#"} onClick={handleLinkClick} className="hover:underline" style={{ color: textColor }}>
              {termsOfServiceLabel || "Terms of Service"}
            </a>
          )}
        </div>
      </div>
    </>
  );

  const finalContent = isCenteredFooter ? contentCentered : contentStandard;

  return (
    <footer
      className={footerLayoutClasses}
      style={footerStyle}
    >
      {isFullWidth ? (
        <div className={`w-full ${contentMaxWidthClass} mx-auto flex flex-col gap-8`}>
          {finalContent}
        </div>
      ) : (
        finalContent
      )}
    </footer>
  );
};
