import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (
  destination,
  duration,
  interests
) => {
  const systemInstruction = `You are a professional, helpful, and creative Travel Planner AI. Your goal is to create detailed, day-by-day travel itineraries based on the user's input. Always use real-time, current information when suggesting activities, attractions, and estimated costs.
  
You must output a JSON array of objects, where each object represents a day in the itinerary.

IMPORTANT: The entire response, including all text in the JSON output (titles, descriptions, etc.), must be in Bahasa Indonesia. All cost estimates must be in the local currency of the destination (e.g., use IDR for Indonesia).`;

  const userPrompt = `Buat rencana perjalanan rinci untuk perjalanan ke ${destination} selama ${duration} hari. Minat wisatawan adalah ${interests}.`;
  
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.NUMBER, description: "The day number of the itinerary." },
        title: { type: Type.STRING, description: "A catchy title for the day's plan." },
        activities: {
          type: Type.ARRAY,
          description: "A list of activities for the day.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the activity or attraction." },
              description: { type: Type.STRING, description: "A brief description of the activity." },
              hours: { type: Type.STRING, description: "Operating hours, e.g., '9:00 AM - 5:00 PM'." },
              cost: { type: Type.STRING, description: "Estimated cost, e.g., 'Rp 300.000' or 'Gratis'." },
            },
            required: ['name', 'description', 'hours', 'cost'],
          },
        },
      },
      required: ['day', 'title', 'activities'],
    },
  };


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const itineraryJson = response.text;
    if (!itineraryJson) {
        throw new Error("Received an empty response from the AI.");
    }

    // Sometimes the model might wrap the JSON in ```json ... ```
    const cleanedJson = itineraryJson.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    
    const itineraryData = JSON.parse(cleanedJson);
    return itineraryData;
    
  } catch (error) {
    console.error("Error generating itinerary:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the itinerary from the AI. The format might be incorrect. Please try again.");
    }
    throw new Error(
      "Failed to generate itinerary. Please try again."
    );
  }
};