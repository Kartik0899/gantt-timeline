"use client";
import React from "react";
import { format, differenceInDays, parseISO } from "date-fns";

interface TodayMarkerProps {
  startDate: Date;
  dayWidth: number;
}

export default function TodayMarker({ startDate, dayWidth }: TodayMarkerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const daysDiff = differenceInDays(today, start);

  const isVisible = daysDiff >= 0;

  if (!isVisible) return null;

  const position = daysDiff * dayWidth; // Left edge of the day

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-20"
      style={{ left: position }}
      aria-hidden="true"
    >
      <div className="w-0.5 bg-red-500 h-full opacity-80" />
    </div>
  );
}
