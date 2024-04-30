import { z } from "zod";

const PropertySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  pricePerNight: z.number(),
  amenities: z.record(z.string(), z.boolean()),
  rating: z.number(),
  reviews: z.number(),
  guests: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
});

export type Property = z.infer<typeof PropertySchema>;