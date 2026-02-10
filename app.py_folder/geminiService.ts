
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PUNE_TRAVEL_DATA = `
PUNE CITY PRICING CONTEXT (Approximations for 2024-25):
- Ola Mini/Uber Go: ₹18-22 per km.
- Ola Sedan/Uber Sedan: ₹22-26 per km.
- Ola SUV/Uber XL: ₹35-45 per km.
- Base Fare: ₹50-100 depending on peak hours.
- Traffic Factor: Increases time by 1.5x during peak (8-11 AM, 5-8 PM).
`;

export const getGeminiResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are 'RAAHI AI', a professional transport assistant for Pune. 
        KNOWLEDGE BASE: ${PUNE_TRAVEL_DATA}`,
      },
    });
    return response.text || "I'm having trouble connecting right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error.";
  }
};

export const getRideEstimates = async (fromCoords: { lat: number, lng: number }, toName: string) => {
  const prompt = `Predict OLA and UBER ride fares and a realistic ROAD-FOLLOWING ROUTE from (${fromCoords.lat}, ${fromCoords.lng}) to '${toName}' in Pune.
  
  CRITICAL: Generate a list of at least 10-15 GPS coordinates that follow the actual major roads of Pune to reach the destination. 
  
  Return a JSON object with:
  - estimatedDistanceKm: number
  - estimatedTimeMins: number
  - routePolyline: Array of { lat: number, lng: number } (MUST follow Pune roads like JM Road, FC Road, Karve Road, etc.)
  - ola: Array of { id: string, name: string, price: number, eta: string }
  - uber: Array of { id: string, name: string, price: number, eta: string }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedDistanceKm: { type: Type.NUMBER },
            estimatedTimeMins: { type: Type.NUMBER },
            routePolyline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                }
              }
            },
            ola: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  eta: { type: Type.STRING }
                }
              }
            },
            uber: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  eta: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Fare Prediction Error:", error);
    return null;
  }
};

export const suggestOptimizedRoute = async (from: string, to: string) => {
  const prompt = `Optimize a route from ${from} to ${to} in Pune. Consider PMPML buses and Pune Metro. Provide a summary including estimated cost and time.`;
  return await getGeminiResponse(prompt);
};
