import { GoogleGenAI, Type } from "@google/genai";
import { PuzzleData } from "../types";

const generatePuzzle = async (): Promise<PuzzleData> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // Fallback if no API key is present (for development/demo without key)
      return {
        topic: "Training Simulation",
        message: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
        difficulty: "Easy"
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a secret spy message for a WWII enigma decryption game. It should be a coherent sentence related to military movements, espionage, or technology.",
      config: {
        systemInstruction: "You are a puzzle generator. Return only valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "A brief, dramatic title for the intercepted mission (e.g., 'Operation Neptune')."
            },
            message: {
              type: Type.STRING,
              description: "The plaintext secret message. Uppercase, no numbers, minimal punctuation. Max 100 characters."
            },
            difficulty: {
              type: Type.STRING,
              enum: ["Easy", "Medium", "Hard"]
            }
          },
          required: ["topic", "message", "difficulty"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonText) as PuzzleData;
    return {
      ...data,
      message: data.message.toUpperCase().replace(/[^A-Z\s]/g, "") // Sanitize
    };

  } catch (error) {
    console.error("Failed to generate puzzle:", error);
    return {
      topic: "Signal Intercept #404",
      message: "COMMUNICATIONS DOWN USE BACKUP PROTOCOL ALPHA",
      difficulty: "Medium"
    };
  }
};

export { generatePuzzle };
