const { z } = require('zod');

const stopSchema = z.object({
  id: z.string(),
  time: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  category: z.string()
});

const daySchema = z.object({
  day: z.number(),
  title: z.string(),
  stops: z.array(stopSchema)
});

const itinerarySchema = z.object({
  tripTitle: z.string(),
  summary: z.string(),
  days: z.array(daySchema)
});

module.exports = {
  itinerarySchema
};
