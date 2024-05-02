import { useMutation, useQueryClient } from "@tanstack/react-query";
import { areIntervalsOverlapping } from "date-fns";

import { CreateBooking, UpdateBooking } from "@/validators/booking";
import { delay } from "@/lib/utils";

import { useGlobalStore } from "./use-global-store";
import { queryKeys } from "./use-queries";

export function useCreateBooking() {
  const { bookings, createBooking } = useGlobalStore();

  async function mutationFn(data: CreateBooking) {
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

    // Simulate API request
    await delay();

    createBooking(data);
  }

  return useMutation({
    mutationFn,
  });
}

export function useUpdateBooking() {
  const { bookings, updateBooking } = useGlobalStore();

  async function mutationFn({ id, data }: { id: string; data: UpdateBooking }) {
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

    // Simulate API request
    await delay();

    updateBooking(id, data);
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
