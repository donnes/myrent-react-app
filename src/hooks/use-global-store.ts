import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Booking, CreateBooking, UpdateBooking } from "@/validators/booking";

interface GlobalState {
  bookings: Array<Booking>;
  createBooking: (booking: CreateBooking) => void;
  updateBooking: (id: string, booking: UpdateBooking) => void;
  deleteBooking: (id: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      bookings: [],
      createBooking(newBooking) {
        return set((state) => ({ bookings: [newBooking, ...state.bookings] }));
      },
      updateBooking(id, updatedBooking) {
        return set((state) => ({
          bookings: state.bookings.map((booking) => {
            if (booking.id === id) {
              return {
                ...booking,
                ...updatedBooking,
              };
            }
            return booking;
          }),
        }));
      },
      deleteBooking(id) {
        return set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        }));
      },
    }),
    {
      name: "global-storage",
    },
  ),
);
