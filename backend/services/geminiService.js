const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateItinerary = async (tripDetails) => {
  const { prompt, budget, duration, travelStyle, interests } = tripDetails;
  
  // Use gemini-1.5-flash which is fast and reliable for JSON
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const systemInstruction = `
You are an expert AI travel planner. Your task is to generate a personalized itinerary based on the user's request.
You MUST return ONLY valid JSON matching the exact schema provided below. Do not include any markdown formatting, explanation, or code blocks outside of the JSON object.

EXPECTED JSON SCHEMA:
{
  "tripTitle": "String (e.g., '3 Days in Tokyo')",
  "summary": "String (A brief summary of the itinerary focusing on the user's interests)",
  "days": [
    {
      "day": Number (e.g., 1, 2, 3),
      "title": "String (Theme or focus for the day)",
      "stops": [
        {
          "id": "String (A unique identifier, e.g., 'stop-1-1')",
          "time": "String (e.g., '09:00')",
          "name": "String (Name of the place/activity)",
          "description": "String (Brief description of what to do there)",
          "duration": "String (e.g., '2 hours')",
          "category": "String (e.g., 'Culture', 'Food', 'Nature', 'Adventure')"
        }
      ]
    }
  ]
}
`;

  const userPrompt = `
Generate a travel itinerary with the following details:
- Destination/Description: ${prompt}
- Budget: ${budget || 'Not specified'}
- Duration: ${duration || 'Not specified'}
- Travel Style: ${travelStyle || 'Not specified'}
- Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'Not specified'}

Return ONLY valid JSON matching the requested schema.
`;

  try {
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + '\n\n' + userPrompt }] }
      ]
    });
    
    const responseText = result.response.text();
    // Parse the JSON to ensure it's valid before returning
    const parsedJSON = JSON.parse(responseText);
    return parsedJSON;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('AI generation failed or returned invalid JSON.');
  }
};

module.exports = {
  generateItinerary
};
