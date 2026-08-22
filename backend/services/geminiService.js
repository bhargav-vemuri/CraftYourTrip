const Groq = require('groq-sdk');

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY' // Fallback handled gracefully if missing
});

const TIMEOUT_MS = 60000;

const runWithTimeout = async (promise) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error('TIMEOUT');
      err.code = 'TIMEOUT';
      reject(err);
    }, TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]);
};

// Common schema prompt used across generation tools
const EXPECTED_SCHEMA_PROMPT = `
EXPECTED JSON SCHEMA:
{
  "tripTitle": "String (e.g., '3 Days in Tokyo')",
  "destination": "String (The primary city/region)",
  "summary": "String (A brief summary)",
  "budget": Number (Total budget numeric value),
  "currency": "String (e.g., 'INR')",
  "estimatedTotalCost": Number (AI's best guess of total trip cost),
  "travelTips": ["String (Important tip 1)", "String (Tip 2)"],
  "days": [
    {
      "day": Number (e.g., 1),
      "title": "String (Theme for the day)",
      "summary": "String (Day summary)",
      "estimatedCost": Number (Total cost for this day),
      "stops": [
        {
          "id": "String (Unique ID, e.g., 'stop-1-1')",
          "time": "String (e.g., '09:00')",
          "name": "String (Specific name of the place/activity, e.g., 'Fushimi Inari Shrine')",
          "description": "String (Brief description)",
          "duration": "String (e.g., '2 hours')",
          "category": "String (e.g., 'Culture', 'Food', 'Nature')",
          "estimatedCost": Number (Cost for this stop),
          "coordinates": {
            "lat": Number (Approximate latitude of this place),
            "lng": Number (Approximate longitude of this place)
          },
          "why": "String (Why this was recommended)"
        }
      ]
    }
  ]
}
`;

const getCompletion = async (systemInstruction, userPrompt) => {
  if (process.env.GROQ_API_KEY === undefined || process.env.GROQ_API_KEY === '') {
    throw new Error('Groq API key is missing. Please add GROQ_API_KEY to your environment variables.');
  }

  const aiPromise = groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt }
    ],
    model: 'openai/gpt-oss-120b',
    response_format: { type: 'json_object' }
  });

  const result = await runWithTimeout(aiPromise);
  return result.choices[0].message.content;
};

const generateItinerary = async (tripDetails) => {
  const { prompt, budget, duration, travelStyle, interests } = tripDetails;

  const systemInstruction = `
You are an expert AI travel planner. Generate a highly personalized travel itinerary.
Return ONLY valid JSON matching the exact schema provided. Do not include markdown or explanations outside the JSON.
${EXPECTED_SCHEMA_PROMPT}
  `;

  const userPrompt = `
Generate a travel itinerary:
- Destination/Description: ${prompt}
- Budget: ${budget || 'Not specified'} (Currency: INR / ₹ unless specified otherwise).
- Duration: ${duration || 'Not specified'}
- Travel Style: ${travelStyle || 'Not specified'}
- Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'Not specified'}

Be highly specific with place names so they can be looked up on Google Maps. 
Estimate costs realistically.
`;

  try {
    return await getCompletion(systemInstruction, userPrompt);
  } catch (error) {
    if (error.code === 'TIMEOUT') throw error;
    throw new Error(error.message || 'AI generation failed.');
  }
};

const optimizeDay = async (dayContext, constraints) => {
  const systemInstruction = `
You are an AI travel optimizer. You are given a specific day from an itinerary.
Your job is to optimize this day based on the user's constraints (e.g., reorder for better travel time, swap activities to fit budget, etc.).
Return ONLY valid JSON representing the optimized day.
EXPECTED JSON SCHEMA:
{
  "day": Number,
  "title": "String",
  "summary": "String",
  "estimatedCost": Number,
  "stops": [
    {
      "id": "String (Preserve original IDs if keeping the stop, generate new if replacing)",
      "time": "String",
      "name": "String",
      "description": "String",
      "duration": "String",
      "category": "String",
      "estimatedCost": Number,
      "coordinates": { "lat": Number, "lng": Number },
      "why": "String"
    }
  ]
}
  `;

  const userPrompt = `
Original Day:
${JSON.stringify(dayContext, null, 2)}

Constraints/Instructions for Optimization:
${JSON.stringify(constraints, null, 2)}

Provide the optimized day JSON now. Keep it realistic.
  `;

  try {
    return await getCompletion(systemInstruction, userPrompt);
  } catch (error) {
    if (error.code === 'TIMEOUT') throw error;
    throw new Error(error.message || 'AI optimization failed.');
  }
};

const replaceStop = async (stopContext, itineraryContext, userInstruction) => {
  const systemInstruction = `
You are an AI travel assistant. The user wants to replace a specific stop in their itinerary.
Provide a single new stop that fits the criteria.
EXPECTED JSON SCHEMA:
{
  "id": "String (Generate a new unique ID)",
  "time": "String (Keep the same time if applicable, or adjust slightly)",
  "name": "String (New place name)",
  "description": "String",
  "duration": "String",
  "category": "String",
  "estimatedCost": Number,
  "coordinates": { "lat": Number, "lng": Number },
  "why": "String"
}
  `;

  const userPrompt = `
Current Stop to Replace:
${JSON.stringify(stopContext, null, 2)}

Full Trip Context (for relevance):
${JSON.stringify(itineraryContext, null, 2)}

User Instruction:
"${userInstruction || 'Find a better alternative'}"

Provide the replacement stop JSON now.
  `;

  try {
    return await getCompletion(systemInstruction, userPrompt);
  } catch (error) {
    if (error.code === 'TIMEOUT') throw error;
    throw new Error(error.message || 'AI replacement failed.');
  }
};

module.exports = {
  generateItinerary,
  optimizeDay,
  replaceStop
};
