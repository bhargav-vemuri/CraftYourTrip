const axios = require('axios');

/**
 * Maps Open-Meteo WMO weather codes to emoji/descriptions
 */
const getWeatherCondition = (code) => {
  if (code === 0) return '☀️ Clear sky';
  if (code === 1 || code === 2 || code === 3) return '⛅ Partly cloudy';
  if (code === 45 || code === 48) return '🌫️ Foggy';
  if (code >= 51 && code <= 55) return '🌧️ Drizzle';
  if (code >= 61 && code <= 65) return '🌧️ Rain';
  if (code >= 71 && code <= 77) return '❄️ Snow';
  if (code >= 80 && code <= 82) return '🌧️ Rain showers';
  if (code >= 95 && code <= 99) return '⛈️ Thunderstorm';
  return '☁️ Cloudy';
};

/**
 * Retrieves a daily forecast for the destination.
 * Using Open-Meteo which requires no API key.
 */
const getWeather = async (lat, lng, days = 3) => {
  if (!lat || !lng) return null;

  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: Math.min(days + 2, 16) // Pad slightly, max 16 days
      },
      timeout: 3000
    });

    const daily = response.data.daily;
    if (!daily) return null;

    // Return array mapped to each day
    const forecast = [];
    for (let i = 0; i < daily.time.length; i++) {
      forecast.push({
        minTemp: Math.round(daily.temperature_2m_min[i]),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        precipitationProb: daily.precipitation_probability_max[i],
        condition: getWeatherCondition(daily.weather_code[i])
      });
    }

    return forecast;
  } catch (error) {
    console.error(`Failed to fetch weather:`, error.message);
    return null; // Graceful degradation
  }
};

module.exports = {
  getWeather
};
