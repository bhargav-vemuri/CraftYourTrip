const validateTripRequest = (req, res, next) => {
  const { prompt, interests } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Destination / Trip description (prompt) is required and cannot be empty.'
    });
  }

  if (interests !== undefined && !Array.isArray(interests)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Interests must be an array.'
    });
  }

  next();
};

module.exports = {
  validateTripRequest
};
