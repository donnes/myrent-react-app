import { z } from "zod";

import { PropertySchema } from "./property";

export const EXTRA_GUESTS_FEE = 10;

export const BookingSchema = z.object({
  id: z.string().uuid(),
  property: PropertySchema,
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  guests: z.number().min(1).max(10),
  totalPrice: z.number(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingSchema = BookingSchema.omit({
  id: true,
  property: true,
}).extend({
  propertyId: z.string().uuid(),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = CreateBookingSchema.partial();

export type UpdateBooking = z.infer<typeof UpdateBookingSchema>;
