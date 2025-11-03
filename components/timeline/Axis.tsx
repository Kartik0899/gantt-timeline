"use client";
import React, { useRef, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  addWeeks,
  differenceInDays,
} from "date-fns";

interface AxisProps {
  startDate: Date;
  endDate: Date;
  view: "week" | "month";
  dayWidth: number;
  scrollLeft?: number;
  totalWidth: number;
}

export default function Axis({
  startDate,
  endDate,
  view,
  dayWidth,
  scrollLeft = 0,
  totalWidth,
}: AxisProps) {
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current && scrollLeft !== undefined) {
      scrollableRef.current.style.transform = `translateX(-${scrollLeft}px)`;
      scrollableRef.current.style.willChange = "transform";
    }
  }, [scrollLeft]);
  if (view === "week") {
    const days: Date[] = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    let cur = new Date(start);
    while (cur <= end) {
      days.push(new Date(cur));
      cur = new Date(cur.getTime() + 24 * 3600 * 1000);
    }

    return (
      <div className="flex border-b border-gray-200 bg-white w-full relative">
        <div className="w-56 flex-shrink-0 bg-transparent pointer-events-none"></div>
        <div
          className="flex-1 overflow-x-hidden relative"
          style={{ width: "calc(100% - 224px)" }}
        >
          <div
            ref={scrollableRef}
            className="flex"
            style={{ width: totalWidth }}
          >
            {days.map((d, i) => (
              <div
                key={d.getTime()}
                className="border-r border-gray-200 flex-shrink-0"
                style={{ width: dayWidth }}
              >
                <div className="px-2 py-2 text-xs">
                  <div className="font-medium text-gray-700">
                    {format(d, "EEE")}
                  </div>
                  <div className="text-gray-500 text-[10px] mt-0.5">
                    {format(d, "MMM d")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );

    return (
      <div className="flex border-b border-gray-200 bg-white w-full relative">
        <div className="w-56 flex-shrink-0 bg-transparent pointer-events-none"></div>
        <div
          className="flex-1 overflow-x-hidden relative"
          style={{ width: "calc(100% - 224px)" }}
        >
          <div
            ref={scrollableRef}
            className="flex"
            style={{ width: totalWidth }}
          >
            {weeks.map((weekStart, i) => {
              const weekEnd = addWeeks(weekStart, 1);
              const weekDays = differenceInDays(weekEnd, weekStart);
              const weekWidth = weekDays * dayWidth;

              return (
                <div
                  key={weekStart.getTime()}
                  className="border-r border-gray-200 flex-shrink-0"
                  style={{ width: weekWidth }}
                >
                  <div className="px-3 py-2 text-xs">
                    <div className="font-medium text-gray-700">
                      {format(weekStart, "MMM d")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
