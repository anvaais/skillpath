import { RoadmapResponse, SavedRoadmap } from "../types";

const STORAGE_KEY = 'skillpath_saved_roadmaps';

// Fetch roadmaps from LocalStorage
export const getSavedRoadmaps = async (): Promise<SavedRoadmap[]> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse saved roadmaps", e);
    return [];
  }
};

// Save a roadmap to LocalStorage
export const saveRoadmapToStorage = async (roadmap: RoadmapResponse, userId?: string): Promise<SavedRoadmap | null> => {
  const savedRoadmaps = await getSavedRoadmaps();
  
  // Create new saved object
  const newRoadmap: SavedRoadmap = {
    ...roadmap,
    id: Date.now().toString(), // Simple ID generation
    createdAt: Date.now()
  };

  const updatedList = [newRoadmap, ...savedRoadmaps];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  
  return newRoadmap;
};

// Delete a roadmap from LocalStorage
export const deleteRoadmapFromStorage = async (id: string): Promise<void> => {
  const savedRoadmaps = await getSavedRoadmaps();
  const updatedList = savedRoadmaps.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
};
