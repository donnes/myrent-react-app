import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { properties } from "@/fixtures/data";
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
      createBooking({ propertyId, ...newBooking }) {
        const property = properties.find(({ id }) => id === propertyId);

        if (!property) return;

        return set((state) => ({
          bookings: [
            {
              id: uuidv4(),
              property,
              ...newBooking,
            },
            ...state.bookings,
          ],
        }));
      },
      updateBooking(id, updatedBooking) {
        delete updatedBooking.propertyId;

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
