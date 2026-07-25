const { generateItinerary } = require('../services/geminiService');
const { validateItineraryJSON } = require('../validators/aiResponseValidator');

const generateTrip = async (req, res) => {
  try {
    const tripDetails = req.body;

    // Call the Gemini service to generate the itinerary
    const itinerary = await generateItinerary(tripDetails);

    // Validate the response schema
    const isValid = validateItineraryJSON(itinerary);
    if (!isValid) {
      console.error("Generated JSON failed schema validation:", itinerary);
      return res.status(500).json({
        success: false,
        message: 'Invalid AI response.'
      });
    }

    return res.status(200).json({
      success: true,
      itinerary
    });
  } catch (error) {
    console.error("Trip generation controller error:", error);
    return res.status(500).json({
      success: false,
      message: 'Invalid AI response.'
    });
  }
};

module.exports = {
  generateTrip
};
