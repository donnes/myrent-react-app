import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { isAfter, isBefore } from "date-fns";

import { useGlobalStore } from "@/hooks/use-global-store";

import { Button } from "@/components/ui/button";
import { BookingListItem } from "@/components/composed/booking-list-item";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const { bookings } = useGlobalStore();

  const incomingBookings = React.useMemo(() => {
    if (!bookings.length) return [];

    return bookings.filter(({ dates }) =>
      isBefore(new Date(), new Date(dates.from)),
    );
  }, [bookings]);

  const pastBookings = React.useMemo(() => {
    if (!bookings.length) return [];

    return bookings.filter(({ dates }) =>
      isAfter(new Date(), new Date(dates.from)),
    );
  }, [bookings]);

  if (!bookings.length) {
    return (
      <div className="container max-w-screen-xl py-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="pb-4 text-xl font-medium">
            You don't have any bookings yet
          </h1>

          <Button size="lg" asChild>
            <Link to="/">Start Booking</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8">
      {incomingBookings.length > 0 && (
        <>
          <h2 className="pb-6 text-2xl font-semibold leading-tight">
            Incoming Bookings
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {incomingBookings.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} isEditable />
            ))}
          </div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h2 className="py-6 text-2xl font-semibold leading-tight">
            Past Bookings
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pastBookings.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
