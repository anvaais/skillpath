export enum ProficiencyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert"
}

export interface RoadmapResource {
  title: string;
  type: string; // e.g., "Course", "Book", "Project"
}

export interface RoadmapStep {
  id: string;
  title: string;
  level: ProficiencyLevel;
  duration: string;
  description: string;
  keyConcepts: string[];
  recommendedProjects: string[];
  searchTerms: string[]; // Terms to help user find resources
}

export interface RoadmapResponse {
  field: string;
  overview: string;
  steps: RoadmapStep[];
}

export interface SavedRoadmap extends RoadmapResponse {
  id: string;
  createdAt: number;
}