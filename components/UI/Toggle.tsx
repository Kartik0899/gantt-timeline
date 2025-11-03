"use client";
import React from "react";

interface ToggleProps {
  value: "week" | "month";
  onChange: (v: "week" | "month") => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange("week")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
          value === "week"
            ? "bg-brand-500 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-pressed={value === "week"}
      >
        Week
      </button>
      <button
        onClick={() => onChange("month")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
          value === "month"
            ? "bg-brand-500 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-pressed={value === "month"}
      >
        Month
      </button>
    </div>
  );
}