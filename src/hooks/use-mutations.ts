import { useMutation, useQueryClient } from "@tanstack/react-query";
import { areIntervalsOverlapping } from "date-fns";

import { BookingForm } from "@/validators/booking";
import { delay } from "@/lib/utils";

import { useGlobalStore } from "./use-global-store";
import { queryKeys } from "./use-queries";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { bookings, createBooking } = useGlobalStore();

  async function mutationFn(data: BookingForm) {
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

    createBooking(data);

    // Simulate API request
    await delay();

    queryClient.refetchQueries({
      queryKey: [queryKeys.getBookings],
    });
  }

  return useMutation({
    mutationFn,
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  const { bookings, updateBooking } = useGlobalStore();

  async function mutationFn({ id, data }: { id: string; data: BookingForm }) {
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

    updateBooking(id, data);

    // Simulate API request
    await delay();

    queryClient.refetchQueries({
      queryKey: [queryKeys.getBookings],
    });
  }

  return useMutation({
    mutationFn,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { deleteBooking } = useGlobalStore();

  async function mutationFn(id: string) {
    deleteBooking(id);

    // Simulate API request
    await delay();

    queryClient.refetchQueries({
      queryKey: [queryKeys.getBookings],
    });
  }

  return useMutation({
    mutationFn,
  });
}
