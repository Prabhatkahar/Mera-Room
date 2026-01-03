import { GoogleGenAI } from "@google/genai";
import { Room } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists to avoid immediate crash, handle errors gracefully in calls
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateRoomDescription = async (
  title: string,
  location: string,
  features: string
): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning placeholder.");
    return "API Key missing. Please provide a description manually.";
  }

  try {
    const prompt = `
      You are a professional real estate copywriter. Write a catchy, inviting, and professional description (max 100 words) for a room rental listing with the following details:
      Title: ${title}
      Location: ${location}
      Key Features: ${features}
      
      Do not include markdown formatting like **bold** or *italic* in the output, just plain text suitable for a mobile app description.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error connecting to AI service. Please try again.";
  }
};

export const askAboutRoom = async (
  room: Room,
  question: string
): Promise<string> => {
  if (!ai) {
    return "AI service is currently unavailable (Missing API Key).";
  }

  try {
    const context = `
      Title: ${room.title}
      Location: ${room.location}
      Price: ₹${room.price}/month
      Amenities: ${room.amenities.join(', ')}
      Description: ${room.description}
      Owner Number: ${room.ownerNumber}
    `;

    const prompt = `
      Context: You are a helpful and polite real estate assistant for the "Mera Room" app.
      Here are the specific details of the room the user is looking at:
      ${context}

      User Question: ${question}

      Instructions:
      1. Answer the user's question accurately based strictly on the provided Room Details.
      2. If the answer is not in the details, politely say you don't have that information and suggest contacting the owner.
      3. Keep the answer concise (under 50 words) and friendly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I'm sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Error asking AI:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};
