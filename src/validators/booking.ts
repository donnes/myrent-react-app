import { z } from "zod";

export const BookingSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().min(1).max(10),
  totalPrice: z.number(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingSchema = BookingSchema.extend({});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = CreateBookingSchema.omit({
  id: true,
  propertyId: true,
}).partial();

export type UpdateBooking = z.infer<typeof UpdateBookingSchema>;
