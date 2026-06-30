"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";

interface ColorPickerProps {
  label: string;
  propKey: string;
  rawVal: string;
  defaultValue: string;
  onChange: (key: string, value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  propKey,
  rawVal = "",
  defaultValue,
  onChange,
}) => {
  const { primaryColor, secondaryColor, gradientStart, gradientEnd } = useBuilderStore();

  let hexValue = rawVal;
  if (rawVal === "var(--color-primary)") hexValue = primaryColor || "#2563eb";
  else if (rawVal === "var(--color-secondary)") hexValue = secondaryColor || "#1e3a8a";
  else if (rawVal === "var(--color-gradient-start)") hexValue = gradientStart || "#3b82f6";
  else if (rawVal === "var(--color-gradient-end)") hexValue = gradientEnd || "#1e3a8a";

  if (!hexValue || !hexValue.startsWith("#") || hexValue.length !== 7) {
    hexValue = defaultValue.startsWith("#") ? defaultValue : "#ffffff";
  }

  const presets = [
    { name: "Primary", varName: "var(--color-primary)", color: primaryColor || "#2563eb" },
    { name: "Secondary", varName: "var(--color-secondary)", color: secondaryColor || "#1e3a8a" },
    { name: "Grad Start", varName: "var(--color-gradient-start)", color: gradientStart || "#3b82f6" },
    { name: "Grad End", varName: "var(--color-gradient-end)", color: gradientEnd || "#1e3a8a" },
  ];

  const displayVal = rawVal.startsWith("var(--")
    ? rawVal.replace("var(--color-", "").replace(")", "").toUpperCase()
    : rawVal;

  return (
    <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs text-slate-700 font-semibold">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hexValue}
            onChange={(e) => onChange(propKey, e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
          />
          <span className="text-xs font-mono text-slate-500 font-semibold">{displayVal}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-slate-200/50 pt-2 mt-0.5">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Presets</span>
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((preset) => {
            const isSelected = rawVal === preset.varName;
            return (
              <button
                key={preset.varName}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(propKey, preset.varName);
                }}
                className={`w-5 h-5 rounded-full border smooth-transition hover:scale-110 flex items-center justify-center relative group shadow-sm`}
                style={{
                  backgroundColor: preset.color,
                  borderColor: isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.3)"
                }}
                title={preset.name}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-[8px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
