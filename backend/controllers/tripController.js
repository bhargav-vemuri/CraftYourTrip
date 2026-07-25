const generateTrip = (req, res) => {
  const { prompt, budget, duration, travelStyle, interests } = req.body;

  // We have successfully received and validated the request.
  // We simply return a success response as requested in Stage 3.
  
  return res.status(200).json({
    success: true,
    message: 'Trip request received successfully.',
    receivedData: {
      prompt,
      budget,
      duration,
      travelStyle,
      interests
    }
  });
};

module.exports = {
  generateTrip
};
