"use client";
import React, { useState } from "react";
import TaskBar from "./TaskBar";
import { overlappingInclusive } from "../../lib/overlap";

interface LaneProps {
  lane: any;
  tasks: any[];
  allTasks: any[];
  startDate: Date;
  endDate: Date;
  view: "week" | "month";
  dayWidth: number;
  onUpdateTask: (taskId: string, updater: (task: any) => any) => void;
  onClickTask: (task: any) => void;
  onMoveTask?: (taskId: string, newLaneId: string) => void;
  totalWidth?: number;
}

export default function Lane({
  lane,
  tasks,
  allTasks,
  startDate,
  endDate,
  view,
  dayWidth,
  onUpdateTask,
  onClickTask,
  onMoveTask,
  totalWidth,
}: LaneProps) {
  const [dragOver, setDragOver] = useState(false);

  // Check for conflicts in this lane
  const getHasConflict = (task: any) => {
    return tasks.some((other) => {
      if (other.id === task.id) return false;
      return overlappingInclusive(task.start, task.end, other.start, other.end);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (onMoveTask && taskId) {
      onMoveTask(taskId, lane.id);
    }
  };

  return (
    <div
      className={`h-20 relative transition-colors ${
        dragOver ? "bg-purple-50/30 dark:bg-purple-900/20" : ""
      }`}
      style={{
        minHeight: "80px",
        width: totalWidth ? `${totalWidth}px` : "100%",
        position: "relative",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label={`Lane: ${lane.name}`}
    >
      <div
        className={`absolute bottom-0 left-0 border-b border-gray-100 dark:border-gray-700 ${
          dragOver ? "border-purple-300 dark:border-purple-500" : ""
        }`}
        style={{
          left: "0px",
          width: totalWidth ? `${totalWidth}px` : "100%",
        }}
      />

      <div className="relative h-full">
        {tasks.map((task) => (
          <TaskBar
            key={task.id}
            task={task}
            startDate={startDate}
            dayWidth={dayWidth}
            hasConflict={getHasConflict(task)}
            onUpdate={(changes) => {
              onUpdateTask(task.id, () => changes);
            }}
            onClick={() => onClickTask(task)}
            onMoveTask={onMoveTask}
            currentLaneId={lane.id}
          />
        ))}
      </div>
    </div>
  );
}
