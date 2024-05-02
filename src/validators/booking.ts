import { z } from "zod";

import { PropertySchema } from "./property";

export const EXTRA_GUESTS_FEE = 10;

export const BookingSchema = z.object({
  id: z.string().uuid(),
  property: PropertySchema,
  dates: z.object({
    from: z.date().or(z.string()),
    to: z.date().or(z.string()),
  }),
  guests: z.number().min(1).max(10),
  totalPrice: z.number(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const BookingFormSchema = BookingSchema.omit({
  property: true,
}).extend({
  id: z.string().uuid().optional(),
  propertyId: z.string().uuid(),
});

export type BookingForm = z.infer<typeof BookingFormSchema>;
