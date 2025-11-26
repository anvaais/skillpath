import { RoadmapResponse, SavedRoadmap } from "../types";

const STORAGE_KEY = 'skillpath_saved_roadmaps';

// Helper to get roadmaps from local storage
const getStoredRoadmaps = (): SavedRoadmap[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse saved roadmaps", e);
    return [];
  }
};

// Fetch roadmaps (simulating async to keep interface consistent)
export const getSavedRoadmaps = async (): Promise<SavedRoadmap[]> => {
  return getStoredRoadmaps();
};

// Save a roadmap to local storage
export const saveRoadmapToStorage = async (roadmap: RoadmapResponse): Promise<SavedRoadmap | null> => {
  const current = getStoredRoadmaps();
  
  // Create new saved object
  const newSaved: SavedRoadmap = {
    ...roadmap,
    id: crypto.randomUUID(), // Generate a local ID
    createdAt: Date.now()
  };

  const updated = [newSaved, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  return newSaved;
};

// Delete a roadmap from local storage
export const deleteRoadmapFromStorage = async (id: string): Promise<void> => {
  const current = getStoredRoadmaps();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
