
import { GoogleGenAI } from "@google/genai";

/**
 * Example function to generate content based on cross-device context
 */
export const generateContextualAdvice = async (deviceContext: string, userPrompt: string) => {
  // Fix: Instantiate GoogleGenAI directly with process.env.API_KEY per request for the latest key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is interacting with a ${deviceContext}. Prompt: ${userPrompt}`,
      config: {
        systemInstruction: "You are a cross-device interaction specialist. Provide concise, helpful UX advice or functional outputs based on the current device simulator being used."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch response from Gemini. Please check your connection.";
  }
};
