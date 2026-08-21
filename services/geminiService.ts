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

// Structured Phase 3 admin AI assistant. Takes only facts the admin has
// already entered (never invents customer names, ratings, licenses,
// warranty terms, or technical work that wasn't provided). Output is
// always a DRAFT the admin must review/edit before publishing.
export interface ProjectContentInput {
  projectType: string;
  service: string;
  location: string;
  problem: string;
  workPerformed: string;
  language: 'en' | 'es';
}

export interface ProjectContentDraft {
  shortDescription: string;
  fullDescription: string;
  problemSection: string;
  solutionSection: string;
}

export const generateProjectContent = async (input: ProjectContentInput): Promise<ProjectContentDraft> => {
  const { projectType, service, location, problem, workPerformed, language } = input;

  if (!ai) {
    console.warn('Gemini API Key not found. Returning mock structured draft.');
    if (language === 'en') {
      return {
        shortDescription: `(AI Draft) ${service} project in ${location}.`,
        fullDescription: `(AI Draft) Our team completed a ${projectType} project in ${location} focused on ${service}. ${workPerformed}`.trim(),
        problemSection: `(AI Draft) ${problem}`,
        solutionSection: `(AI Draft) ${workPerformed}`,
      };
    }
    return {
      shortDescription: `(Borrador IA) Proyecto de ${service} en ${location}.`,
      fullDescription: `(Borrador IA) Nuestro equipo completó un proyecto de ${projectType} en ${location} enfocado en ${service}. ${workPerformed}`.trim(),
      problemSection: `(Borrador IA) ${problem}`,
      solutionSection: `(Borrador IA) ${workPerformed}`,
    };
  }

  try {
    const prompt = language === 'en'
      ? `You are writing DRAFT marketing copy for a plastering contractor's project page. Use ONLY the facts provided below — do not invent customer names, ratings, licenses, warranty terms, or work that isn't described.
Project type: ${projectType}
Service: ${service}
Location: ${location}
Problem: ${problem}
Work performed: ${workPerformed}

Return exactly four labeled sections, each on its own line, in this format:
SHORT: <one sentence, under 20 words>
FULL: <2-3 sentences, under 70 words>
PROBLEM: <1-2 sentences describing the problem>
SOLUTION: <1-2 sentences describing the solution/work performed>`
      : `Estás escribiendo un BORRADOR de texto de marketing para la página de un proyecto de una empresa de enyesado. Usa SOLO los datos proporcionados a continuación — no inventes nombres de clientes, calificaciones, licencias, garantías, ni trabajo que no se describe.
Tipo de proyecto: ${projectType}
Servicio: ${service}
Ubicación: ${location}
Problema: ${problem}
Trabajo realizado: ${workPerformed}

Devuelve exactamente cuatro secciones etiquetadas, cada una en su propia línea, en este formato:
SHORT: <una oración, menos de 20 palabras>
FULL: <2-3 oraciones, menos de 70 palabras>
PROBLEM: <1-2 oraciones describiendo el problema>
SOLUTION: <1-2 oraciones describiendo la solución/trabajo realizado>`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || '';
    const extract = (label: string) => {
      const match = text.match(new RegExp(`${label}:\\s*(.+)`, 'i'));
      return match ? match[1].trim() : '';
    };

    return {
      shortDescription: extract('SHORT') || `${service} project in ${location}`,
      fullDescription: extract('FULL') || workPerformed,
      problemSection: extract('PROBLEM') || problem,
      solutionSection: extract('SOLUTION') || workPerformed,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      shortDescription: `${service} project in ${location}`,
      fullDescription: workPerformed,
      problemSection: problem,
      solutionSection: workPerformed,
    };
  }
};
