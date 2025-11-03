"use client";
import React from "react";
import { differenceInDays, startOfDay, isAfter, isBefore } from "date-fns";

interface TodayMarkerProps {
  startDate: Date;
  endDate: Date;
  dayWidth: number;
}

export default function TodayMarker({
  startDate,
  endDate,
  dayWidth,
}: TodayMarkerProps) {
  const today = startOfDay(new Date());

  const timelineStart = startOfDay(new Date(startDate));
  const timelineEnd = startOfDay(new Date(endDate));

  // Only show if today is within the visible date range
  if (isBefore(today, timelineStart) || isAfter(today, timelineEnd)) {
    return null;
  }

  // Calculate days from timeline start, matching TaskBar calculation exactly
  // Use Math.max(0, ...) to match TaskBar's pattern
  const daysFromStart = Math.max(0, differenceInDays(today, timelineStart));

  // Position at the left edge of today's column
  const position = daysFromStart * dayWidth;

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-20"
      style={{ left: `${position}px` }}
      aria-hidden="true"
      aria-label={`Today: ${today.toLocaleDateString()}`}
    >
      <div className="w-0.5 bg-red-500 h-full opacity-90" />
    </div>
  );
}
