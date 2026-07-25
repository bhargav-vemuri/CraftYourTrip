const extractJSON = (text) => {
  if (!text || typeof text !== 'string') return null;

  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (err) {
    // If it fails, try to extract from markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (innerErr) {
        return null;
      }
    }
    
    // As a last resort, try to find anything between { and } or [ and ]
    const bracketMatch = text.match(/(\{|\[)[\s\S]*(\}|\])/);
    if (bracketMatch && bracketMatch[0]) {
      try {
        return JSON.parse(bracketMatch[0]);
      } catch (finalErr) {
        return null;
      }
    }

    return null;
  }
};

module.exports = {
  extractJSON
};
