import { GoogleGenAI } from "@google/genai";

// Note: In a real app, API Key should be securely handled. 
// For this demo environment, we assume process.env.API_KEY is available.

const apiKey = process.env.API_KEY || ''; 

// We only initialize if a key exists to prevent errors in non-configured environments.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateDescription = async (title: string, keywords: string, language: 'en' | 'es'): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock description.");
    return language === 'en' 
      ? `(AI Placeholder) Detailed description about ${title} focusing on ${keywords}.` 
      : `(Placeholder IA) Descripción detallada sobre ${title} enfocada en ${keywords}.`;
  }

  try {
    const prompt = language === 'en' 
      ? `Write a professional construction project description for a project titled "${title}". Keywords: ${keywords}. Keep it under 50 words.`
      : `Escribe una descripción profesional de construcción para un proyecto titulado "${title}". Palabras clave: ${keywords}. Mantenlo en menos de 50 palabras.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description.";
  }
};
