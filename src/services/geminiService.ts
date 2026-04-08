import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTrainerImage(trainerName: string, role: string) {
  try {
    const prompt = `A professional, high-quality studio portrait of a fitness trainer named ${trainerName} who is a ${role}. The style should be modern, athletic, and premium. Cinematic lighting, sharp focus, professional sports photography style.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating trainer image:", error);
    return null;
  }
}
