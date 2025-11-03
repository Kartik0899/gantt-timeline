import { TimelineData } from "../types";

const STORAGE_KEY = "gantt_state_v1";

export function saveState(obj: TimelineData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function loadState(): TimelineData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TimelineData;
  } catch (e) {
    console.error("Failed to load state", e);
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
