"use client";
import React, { useState, useEffect } from "react";

interface TaskPanelProps {
  task: any;
  lanes: any[];
  onClose: () => void;
  onSave: (changes: any) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskPanel({
  task,
  lanes,
  onClose,
  onSave,
  onDelete,
}: TaskPanelProps) {
  const [local, setLocal] = useState({ ...task });
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocal({ ...task });
    setError("");
    setShowDeleteConfirm(false);
  }, [task]);

  const isNewTask = !task.name || task.name.trim() === "";

  const handleDelete = () => {
    if (onDelete && task.id) {
      onDelete(task.id);
      onClose();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        onSave(local);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [local, onClose, onSave]);

  return (
    <div
      className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 id="panel-title" className="text-lg font-semibold text-gray-900">
            {isNewTask ? "Add Task" : "Edit Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded p-1"
            aria-label="Close panel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            type="text"
            value={local.name}
            onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Enter task name"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={local.start}
              onChange={(e) =>
                setLocal((s) => ({ ...s, start: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={local.end}
              onChange={(e) => setLocal((s) => ({ ...s, end: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lane
          </label>
          <select
            value={local.laneId}
            onChange={(e) =>
              setLocal((s) => ({ ...s, laneId: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {lanes.map((l) => (
              <option value={l.id} key={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <input
            type="text"
            value={local.assignee || ""}
            onChange={(e) =>
              setLocal((s) => ({ ...s, assignee: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Enter assignee"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 space-y-3">
            <div className="text-red-800 font-medium text-sm">
              Are you sure you want to delete this task?
            </div>
            <div className="text-red-600 text-xs">
              This action cannot be undone.
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Validate before saving
              if (!local.name || local.name.trim() === "") {
                setError("Task name is required");
                return;
              }
              if (!local.start || !local.end) {
                setError("Start date and end date are required");
                return;
              }
              if (new Date(local.start) > new Date(local.end)) {
                setError("End date must be after start date");
                return;
              }
              setError("");
              onSave(local);
            }}
            className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-md text-sm font-medium hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {isNewTask ? "Create Task" : "Save"}
          </button>
          {!isNewTask && onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Delete task"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
