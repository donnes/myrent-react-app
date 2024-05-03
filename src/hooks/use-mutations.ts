import { useMutation } from "@tanstack/react-query";
import { areIntervalsOverlapping } from "date-fns";

import { BookingForm } from "@/validators/booking";

import { useGlobalStore } from "./use-global-store";

export function useCreateBooking() {
  const { bookings, createBooking } = useGlobalStore();

  async function mutationFn(data: BookingForm) {
    // In a real-world scenario
    // those validations would be made in the backend

    const dataInterval = { start: data.dates.from, end: data.dates.to };

    const overlappingBookings = bookings.filter(({ dates }) => {
      const bookingInterval = {
        start: dates.from,
        end: dates.to,
      };

      return areIntervalsOverlapping(bookingInterval, dataInterval);
    });

    if (overlappingBookings.length > 0) {
      throw new Error("Date range already booked.");
    }

    // In a real-world scenario, it would be a API request
    createBooking(data);
  }

  return useMutation({
    mutationFn,
  });
}

export function useUpdateBooking() {
  const { bookings, updateBooking } = useGlobalStore();

  async function mutationFn({ id, data }: { id: string; data: BookingForm }) {
    // In a real-world scenario
    // those validations would be made in the backend

    const dataInterval = { start: data.dates.from, end: data.dates.to };

    // As we're updating a booking
    // we don't want to include the booking itself
    // in the overlapping validation
    const overlappingBookings = bookings
      .filter((booking) => booking.id !== id)
      .filter(({ dates }) => {
        const bookingInterval = {
          start: dates.from,
          end: dates.to,
        };

        return areIntervalsOverlapping(bookingInterval, dataInterval);
      });

    if (overlappingBookings.length > 0) {
      throw new Error("Date range already booked.");
    }

    // In a real-world scenario, it would be a API request
    updateBooking(id, data);
  }

  return useMutation({
    mutationFn,
  });
}

export function useCancelBooking() {
  const { deleteBooking } = useGlobalStore();

  async function mutationFn(id: string) {
    // In a real-world scenario, it would be a API request
    deleteBooking(id);
  }

  return useMutation({
    mutationFn,
  });
}
