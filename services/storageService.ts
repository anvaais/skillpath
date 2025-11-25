import { RoadmapResponse, SavedRoadmap } from "../types";

const STORAGE_KEY = "skillpath_saved_roadmaps";

export const getSavedRoadmaps = (): SavedRoadmap[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRoadmapToStorage = (roadmap: RoadmapResponse): SavedRoadmap => {
  const saved = getSavedRoadmaps();
  // Check if a roadmap with the same field already exists to avoid duplicates
  const existing = saved.find(r => r.field.toLowerCase() === roadmap.field.toLowerCase());
  
  if (existing) {
    return existing;
  }

  const newEntry: SavedRoadmap = {
    ...roadmap,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    createdAt: Date.now(),
  };
  
  const updated = [newEntry, ...saved];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

export const deleteRoadmapFromStorage = (id: string): SavedRoadmap[] => {
  const saved = getSavedRoadmaps();
  const updated = saved.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const isRoadmapSaved = (field: string): boolean => {
    const saved = getSavedRoadmaps();
    return saved.some(r => r.field.toLowerCase() === field.toLowerCase());
};