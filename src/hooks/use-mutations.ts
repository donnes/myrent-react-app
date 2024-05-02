import { useMutation } from "@tanstack/react-query";
import { areIntervalsOverlapping } from "date-fns";

import { CreateBooking, UpdateBooking } from "@/validators/booking";
import { delay } from "@/lib/utils";

import { useGlobalStore } from "./use-global-store";

export function useCreateBooking() {
  const { bookings, createBooking } = useGlobalStore();

  async function mutationFn(data: CreateBooking) {
    // Simulate API request
    await delay();

    const booking = bookings.find(
      ({ property }) => property.id === data.propertyId,
    );

    if (booking) {
      const bookingInterval = {
        start: booking.dates.from,
        end: booking.dates.to,
      };
      const dataInterval = { start: data.dates.from, end: data.dates.to };

      if (areIntervalsOverlapping(bookingInterval, dataInterval)) {
        throw new Error("Date range already booked.");
      }
    }

    createBooking(data);
  }

  return useMutation({
    mutationFn,
  });
}

export function useUpdateBooking() {
  const { bookings, updateBooking } = useGlobalStore();

  async function mutationFn({ id, data }: { id: string; data: UpdateBooking }) {
    // Simulate API request
    await delay();

    const booking = bookings.find(
      ({ property }) => property.id === data.propertyId,
    );

    if (booking && data.dates) {
      const bookingInterval = {
        start: booking.dates.from,
        end: booking.dates.to,
      };
      const dataInterval = { start: data.dates.from, end: data.dates.to };

      if (areIntervalsOverlapping(bookingInterval, dataInterval)) {
        throw new Error("Date range already booked.");
      }
    }

    updateBooking(id, data);
  }

  return useMutation({
    mutationFn,
  });
}
