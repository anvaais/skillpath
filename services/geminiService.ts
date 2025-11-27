import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RoadmapResponse } from "../types";

// Declare process to satisfy TypeScript since Vite injects this variable during build
declare const process: any;

const roadmapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    field: { type: Type.STRING, description: "The name of the field or skill." },
    overview: { type: Type.STRING, description: "A brief inspiring overview of the learning path." },
    steps: {
      type: Type.ARRAY,
      description: "An ordered list of steps from beginner to expert.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique simple identifier (e.g., 'step-1')." },
          title: { type: Type.STRING, description: "The title of this learning stage." },
          level: { 
            type: Type.STRING, 
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
            description: "The proficiency level of this step."
          },
          duration: { type: Type.STRING, description: "Estimated time to complete this step (e.g., '2-4 weeks')." },
          description: { type: Type.STRING, description: "Detailed explanation of what to learn in this step." },
          keyConcepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-5 specific concepts to master."
          },
          recommendedProjects: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1-2 practical project ideas to apply knowledge."
          },
          searchTerms: {
             type: Type.ARRAY,
             items: { type: Type.STRING },
             description: "Keywords to search for tutorials/docs (e.g. 'Python for data science free course')."
          }
        },
        required: ["id", "title", "level", "duration", "description", "keyConcepts", "recommendedProjects", "searchTerms"]
      }
    }
  },
  required: ["field", "overview", "steps"]
};

export const generateRoadmap = async (scope: string): Promise<RoadmapResponse> => {
  // Validate API Key presence
  // Note: Vite replaces process.env.API_KEY with the actual string during build.
  // If it's empty, it means the environment variable was missing at build time.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.length === 0 || apiKey === '""') {
    throw new Error("API Key is missing. Please add API_KEY to your application settings (e.g., Vercel Environment Variables).");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const prompt = `Create a comprehensive, step-by-step learning roadmap for: "${scope}". 
    
    The roadmap should take a complete novice to an expert level. 
    Break it down into logical steps. 
    Be specific about technologies, methodologies, and theories relevant to the field.
    Ensure the duration is realistic for a self-taught learner.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        systemInstruction: "You are a world-class curriculum designer and career coach. Your goal is to create clear, actionable, and highly structured learning paths. Avoid vague advice. Focus on concrete skills and projects.",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as RoadmapResponse;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};