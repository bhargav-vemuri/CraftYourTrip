const { generateItinerary } = require('../services/geminiService');
const { extractJSON } = require('../utils/extractJSON');
const { itinerarySchema } = require('../validators/itinerarySchema');

const generateTrip = async (req, res) => {
  try {
    const tripDetails = req.body;

    // Call the Gemini service to generate the itinerary text
    const rawResponseText = await generateItinerary(tripDetails);

    // Extract JSON safely
    const parsedJSON = extractJSON(rawResponseText);
    
    if (!parsedJSON) {
      console.error("Failed to parse JSON from AI response.");
      return res.status(500).json({
        success: false,
        error: 'Unable to parse AI response.'
      });
    }

    // Validate using Zod schema
    const validationResult = itinerarySchema.safeParse(parsedJSON);
    
    if (!validationResult.success) {
      console.error("Zod schema validation failed:", validationResult.error.format());
      return res.status(500).json({
        success: false,
        error: 'AI returned an invalid itinerary.'
      });
    }

    // Return the validated data
    return res.status(200).json({
      success: true,
      itinerary: validationResult.data
    });
    
  } catch (error) {
    if (error.code === 'TIMEOUT') {
      return res.status(504).json({
        success: false,
        error: 'The request timed out.'
      });
    }

    console.error("Trip generation controller error:", error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected backend failure occurred.'
    });
  }
};

module.exports = {
  generateTrip
};
