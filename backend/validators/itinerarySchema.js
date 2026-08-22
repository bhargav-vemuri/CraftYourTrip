const { z } = require('zod');

const travelInfoSchema = z.object({
  distance: z.string().optional(),
  duration: z.string().optional(),
  mode: z.string().optional()
});

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

const stopSchema = z.object({
  id: z.string(),
  time: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  category: z.string(),
  estimatedCost: z.number().optional().nullable(),
  why: z.string().optional(),
  
  // Enriched fields (Google Places)
  coordinates: coordinatesSchema.optional().nullable(),
  placeId: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  
  // Route fields (Google Routes)
  travelInfo: travelInfoSchema.optional().nullable()
});

const weatherSchema = z.object({
  minTemp: z.number(),
  maxTemp: z.number(),
  precipitationProb: z.number(),
  condition: z.string()
});

const daySchema = z.object({
  day: z.number(),
  title: z.string(),
  summary: z.string().optional(),
  estimatedCost: z.number().optional().nullable(),
  totalTravelTime: z.string().optional().nullable(),
  
  // Enriched fields (Open-Meteo)
  weather: weatherSchema.optional().nullable(),
  
  stops: z.array(stopSchema)
});

const itinerarySchema = z.object({
  tripTitle: z.string(),
  destination: z.string(),
  summary: z.string(),
  budget: z.number().optional().nullable(),
  currency: z.string().default('INR'),
  estimatedTotalCost: z.number().optional().nullable(),
  travelTips: z.array(z.string()).optional(),
  days: z.array(daySchema)
});

module.exports = {
  itinerarySchema,
  stopSchema,
  daySchema
};
