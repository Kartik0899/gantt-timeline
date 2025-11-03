"use client";
import React from "react";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  addWeeks,
  differenceInDays,
  startOfDay,
  endOfDay,
} from "date-fns";

interface GridProps {
  startDate: Date;
  endDate: Date;
  view: "week" | "month";
  dayWidth: number;
  totalWidth?: number;
}

export default function Grid({
  startDate,
  endDate,
  view,
  dayWidth,
  totalWidth,
}: GridProps) {
  if (view === "week") {
    // Week view: vertical lines for each day
    const normalizedStart = startOfDay(startDate);
    const normalizedEnd = startOfDay(endDate);

    // eachDayOfInterval includes both start and end, but we want to be explicit
    const intervalEnd = new Date(normalizedEnd);
    intervalEnd.setDate(intervalEnd.getDate() + 1);
    intervalEnd.setHours(0, 0, 0, 0);

    const days = eachDayOfInterval({
      start: normalizedStart,
      end: normalizedEnd,
    });

    const calculatedWidth = days.length * dayWidth;
    const gridWidth = totalWidth || calculatedWidth;
    const numDaysNeeded = Math.ceil(gridWidth / dayWidth);

    const allDays = [...days];
    if (numDaysNeeded > days.length) {
      let lastDay = new Date(days[days.length - 1]);
      for (let i = days.length; i < numDaysNeeded; i++) {
        lastDay = new Date(lastDay.getTime() + 24 * 3600 * 1000);
        allDays.push(lastDay);
      }
    }

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          width: `${gridWidth}px`,
          height: "100%",
        }}
      >
        {allDays.map((d, i) => {
          const left = i * dayWidth;
          return (
            <div
              key={`grid-${d.getTime()}-${i}`}
              className="absolute top-0 bottom-0 border-r border-gray-100 opacity-60"
              style={{ left: `${left}px` }}
              aria-hidden="true"
            />
          );
        })}
        <div
          key="final-grid-line"
          className="absolute top-0 bottom-0 border-r border-gray-100 opacity-60"
          style={{ left: `${gridWidth}px` }}
          aria-hidden="true"
        />
      </div>
    );
  } else {
    // Month view: vertical lines for each week
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );

    // Calculate total width for month view
    const monthWidth = weeks.reduce((sum, w) => {
      const wEnd = addWeeks(w, 1);
      return sum + differenceInDays(wEnd, w) * dayWidth;
    }, 0);
    const gridWidth = totalWidth || monthWidth;

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          width: `${gridWidth}px`,
          height: "100%",
        }}
      >
        {weeks.map((weekStart, i) => {
          const weekEnd = addWeeks(weekStart, 1);
          const left = weeks.slice(0, i).reduce((sum, w) => {
            const wEnd = addWeeks(w, 1);
            return sum + differenceInDays(wEnd, w) * dayWidth;
          }, 0);

          return (
            <div
              key={weekStart.getTime()}
              className="absolute top-0 bottom-0 border-r border-gray-100 opacity-60"
              style={{ left: `${left}px` }}
              aria-hidden="true"
            />
          );
        })}

        {weeks.length > 0 && (
          <div
            key="final-week-grid-line"
            className="absolute top-0 bottom-0 border-r border-gray-100 opacity-60"
            style={{
              left: `${weeks.reduce((sum, w) => {
                const wEnd = addWeeks(w, 1);
                return sum + differenceInDays(wEnd, w) * dayWidth;
              }, 0)}px`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
}
