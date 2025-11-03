// app/page.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import seedData from "../data/seed.json";
import Axis from "../components/timeline/Axis";
import Lane from "../components/timeline/Lane";
import Grid from "../components/timeline/Grid";
import TodayMarker from "../components/timeline/TodayMarker";
import TaskPanel from "../components/panel/TaskPanel";
import Toggle from "../components/UI/Toggle";
import { loadState, saveState } from "../lib/storage";
import { parseISO, addDays, startOfWeek, endOfWeek, format } from "date-fns";

export default function Page() {
  const [data, setData] = useState(() => loadState() ?? seedData);
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [axisScrollLeft, setAxisScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      if (!savedTheme) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setAxisScrollLeft(container.scrollLeft);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const { startDate, endDate, days } = useMemo(() => {
    const tasks = data.tasks || [];
    if (tasks.length === 0) {
      const baseDate = mounted ? new Date() : new Date("2024-10-01");
      const s = startOfWeek(baseDate, { weekStartsOn: 1 });
      const e = addDays(s, view === "week" ? 14 : 60);
      return {
        startDate: s,
        endDate: e,
        days: Math.ceil((e.getTime() - s.getTime()) / (24 * 3600 * 1000)) + 1,
      };
    }
    const starts = tasks.map((t) => parseISO(t.start));
    const ends = tasks.map((t) => parseISO(t.end));
    const min = new Date(Math.min(...starts.map((d) => d.getTime())));
    const max = new Date(Math.max(...ends.map((d) => d.getTime())));
    const padding = view === "week" ? 7 : 14;
    const start = addDays(min, -padding);
    const end = addDays(max, padding);
    return {
      startDate: start,
      endDate: end,
      days:
        Math.ceil((end.getTime() - start.getTime()) / (24 * 3600 * 1000)) + 1,
    };
  }, [data, view, mounted]);

  // autosave
  useEffect(() => {
    saveState(data);
  }, [data]);

  // import/export handlers
  const exportJSON = () => {
    const a = document.createElement("a");
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    a.href = URL.createObjectURL(blob);
    a.download = "timeline.json";
    a.click();
  };

  const importJSON = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target.result));
        setData(parsed);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // update a task helper
  const updateTask = (taskId, updater) => {
    setData((prev) => {
      const tasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updater(t) } : t
      );
      return { ...prev, tasks };
    });
  };

  const addTask = () => {
    const id = "t" + Math.random().toString(36).slice(2, 8);
    const newTask = {
      id,
      name: "",
      laneId: data.lanes[0].id,
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      assignee: "",
      deps: [],
    };
    setSelectedTask(newTask);
  };

  const dayWidth = view === "week" ? 80 : 20;
  const totalWidth = days * dayWidth;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gantt / Timeline
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Week / Month • Drag & Resize
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Controls bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[57px] z-20">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Toggle value={view} onChange={(v) => setView(v)} />
              <button
                onClick={addTask}
                className="px-4 py-2 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                + Add Task
              </button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  id="import-json"
                  onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() =>
                    document.getElementById("import-json")?.click()
                  }
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Import JSON
                </button>
              </label>
              <button
                onClick={exportJSON}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Export JSON
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              View: {view}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="top-[0] z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex relative">
            {mounted && (
              <Axis
                startDate={startDate}
                endDate={endDate}
                view={view}
                dayWidth={dayWidth}
                scrollLeft={axisScrollLeft}
                totalWidth={totalWidth}
              />
            )}
          </div>
          <div className="flex relative">
            {/* Left lane panel - sticky */}
            <div className="w-56 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky left-0 z-20">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.lanes.map((l) => (
                  <div
                    key={l.id}
                    className="h-20 flex items-center px-4 bg-white dark:bg-gray-800"
                    style={{ minHeight: "80px" }}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {l.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline canvas */}
            <div
              className="flex-1 overflow-x-auto overflow-y-auto timeline-scroll relative"
              ref={containerRef}
              style={{ width: "calc(100% - 224px)", maxHeight: "600px" }}
              role="region"
              aria-label="Timeline canvas"
              tabIndex={0}
            >
              <div
                style={{
                  width: totalWidth,
                  position: "relative",
                  minHeight: "100%",
                }}
              >
                {mounted && (
                  <>
                    <Grid
                      startDate={startDate}
                      endDate={endDate}
                      view={view}
                      dayWidth={dayWidth}
                      totalWidth={totalWidth}
                    />
                    <div>
                      {data.lanes.map((lane, idx) => (
                        <Lane
                          key={lane.id}
                          lane={lane}
                          tasks={data.tasks.filter((t) => t.laneId === lane.id)}
                          allTasks={data.tasks}
                          startDate={startDate}
                          endDate={endDate}
                          view={view}
                          dayWidth={dayWidth}
                          totalWidth={totalWidth}
                          onUpdateTask={(taskId, updater) =>
                            updateTask(taskId, updater)
                          }
                          onClickTask={(task) => setSelectedTask(task)}
                          onMoveTask={(taskId, newLaneId) => {
                            setData((prev) => ({
                              ...prev,
                              tasks: prev.tasks.map((t) =>
                                t.id === taskId
                                  ? { ...t, laneId: newLaneId }
                                  : t
                              ),
                            }));
                          }}
                        />
                      ))}
                    </div>
                    <TodayMarker startDate={startDate} dayWidth={dayWidth} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskPanel
          task={selectedTask}
          lanes={data.lanes}
          onClose={() => setSelectedTask(null)}
          onSave={(changes) => {
            setData((prev) => {
              const isNewTask = !prev.tasks.some(
                (t) => t.id === selectedTask.id
              );

              if (isNewTask) {
                return {
                  ...prev,
                  tasks: [...prev.tasks, { ...selectedTask, ...changes }],
                };
              } else {
                const tasks = prev.tasks.map((t) =>
                  t.id === selectedTask.id ? { ...t, ...changes } : t
                );
                return { ...prev, tasks };
              }
            });
            setSelectedTask(null);
          }}
          onDelete={(taskId) => {
            setData((prev) => ({
              ...prev,
              tasks: prev.tasks.filter((t) => t.id !== taskId),
            }));
          }}
        />
      )}
    </div>
  );
}
