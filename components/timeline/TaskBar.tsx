"use client";
import React, { useState, useRef, useEffect } from "react";
import { parseISO, differenceInDays, format, addDays } from "date-fns";

interface TaskBarProps {
  task: any;
  startDate: Date;
  dayWidth: number;
  hasConflict: boolean;
  onUpdate: (changes: any) => void;
  onClick: () => void;
  onDragEnd?: () => void;
  onMoveTask?: (taskId: string, newLaneId: string) => void;
  currentLaneId?: string;
}

export default function TaskBar({
  task,
  startDate,
  dayWidth,
  hasConflict,
  onUpdate,
  onClick,
  onDragEnd,
  onMoveTask,
  currentLaneId,
}: TaskBarProps) {
  const [isDragging, setIsDragging] = useState(false);

  const [localTask, setLocalTask] = useState(task);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    startDate: string;
    endDate: string;
  } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  // Calculate position and width
  const taskStart = parseISO(localTask.start);
  taskStart.setHours(0, 0, 0, 0);
  const taskEnd = parseISO(localTask.end);
  taskEnd.setHours(23, 59, 59, 999);
  const timelineStart = new Date(startDate);
  timelineStart.setHours(0, 0, 0, 0);

  const daysFromStart = Math.max(0, differenceInDays(taskStart, timelineStart));
  const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);

  const left = daysFromStart * dayWidth;
  const width = Math.max(dayWidth, duration * dayWidth - 2);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".lane-switch-handle")) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startDate: localTask.start,
      endDate: localTask.end,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaDays = Math.round(deltaX / dayWidth);

    if (deltaDays !== 0) {
      const newStart = format(
        addDays(parseISO(dragStartRef.current.startDate), deltaDays),
        "yyyy-MM-dd"
      );
      const newEnd = format(
        addDays(parseISO(dragStartRef.current.endDate), deltaDays),
        "yyyy-MM-dd"
      );

      setLocalTask({ ...localTask, start: newStart, end: newEnd });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      onUpdate({
        ...localTask,
        start: localTask.start,
        end: localTask.end,
      });
      if (onDragEnd) onDragEnd();
    }
    dragStartRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onClick();
      return;
    }
    if (e.key === "Escape") {
      barRef.current?.blur();
      return;
    }

    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const delta = e.key === "ArrowLeft" ? -1 : 1;
      const multiplier = e.shiftKey ? 7 : 1;
      const days = delta * multiplier;

      const newStart = format(
        addDays(parseISO(localTask.start), days),
        "yyyy-MM-dd"
      );
      const newEnd = format(
        addDays(parseISO(localTask.end), days),
        "yyyy-MM-dd"
      );

      const updated = { ...localTask, start: newStart, end: newEnd };
      setLocalTask(updated);
      onUpdate(updated);
    }
  };

  return (
    <div
      ref={barRef}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${localTask.name}, ${format(
        parseISO(localTask.start),
        "MMM d"
      )} to ${format(parseISO(localTask.end), "MMM d")}. ${
        hasConflict ? "Warning: This task overlaps with another task." : ""
      }`}
      aria-describedby={hasConflict ? `conflict-${task.id}` : undefined}
      onKeyDown={handleKeyDown}
      draggable={false}
      onClick={(e) => {
        if (
          !isDragging &&
          !(e.target as HTMLElement).closest(".lane-switch-handle")
        ) {
          onClick();
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`group absolute top-3 h-14 rounded-lg shadow-lg cursor-move transition-all duration-200 ${
        hasConflict ? "ring-2 ring-red-500 ring-opacity-75" : ""
      } ${isDragging ? "opacity-90 z-30 shadow-2xl scale-105" : "z-10"} ${
        isDragging ? "" : "hover:shadow-xl hover:brightness-110"
      } focus:outline-none focus:ring-3 focus:ring-brand-500 focus:ring-offset-2`}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, dayWidth)}px`,
        background: "linear-gradient(90deg, #a855f7 0%, #9333ea 100%)",
        borderRadius: "6px",
      }}
    >
      <div className="flex items-center justify-between h-full px-3 text-white pointer-events-none relative">
        {/* Lane switch handle - visible on hover */}
        <div
          className="lane-switch-handle absolute left-1 top-1 w-6 h-6 bg-white/20 hover:bg-white/30 rounded cursor-ns-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto z-20"
          draggable={true}
          onDragStart={(e: React.DragEvent) => {
            if (onMoveTask && currentLaneId) {
              e.stopPropagation();
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", task.id);
              e.dataTransfer.setData("application/lane", currentLaneId);
              // Make the drag image look good
              if (barRef.current) {
                e.dataTransfer.setDragImage(barRef.current, 0, 0);
              }
            }
          }}
          title="Drag vertically to move between lanes"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </div>

        <div className="text-sm font-semibold truncate flex-1">
          {localTask.name}
        </div>
        {localTask.assignee && (
          <div className="text-xs opacity-90 ml-2 font-medium bg-white/20 px-2 py-0.5 rounded">
            {localTask.assignee}
          </div>
        )}
        {hasConflict && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            ⚠
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] bottom-full mb-2">
        <div className="bg-gray-900 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-xl">
          <div className="font-medium">{localTask.name}</div>
          <div className="text-gray-300 text-[11px] mt-0.5">
            {format(parseISO(localTask.start), "MMM d")} -{" "}
            {format(parseISO(localTask.end), "MMM d")}
          </div>
          {localTask.assignee && (
            <div className="text-gray-300 text-[11px] mt-0.5">
              Assignee: {localTask.assignee}
            </div>
          )}
          {hasConflict && (
            <div className="text-red-400 text-[11px] mt-1 font-medium flex items-center gap-1">
              <span>⚠</span> Overlaps with another task
            </div>
          )}
        </div>
      </div>

      {/* Conflict indicator for screen readers */}
      {hasConflict && (
        <div id={`conflict-${task.id}`} className="sr-only">
          Warning: This task overlaps with another task in the same lane.
        </div>
      )}
    </div>
  );
}
