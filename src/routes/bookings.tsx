import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { isAfter, isBefore } from "date-fns";

import { useGetBookings } from "@/hooks/use-queries";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookingListItem,
  BookingListItemSkeleton,
} from "@/components/composed/booking-list-item";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

function BookingsPageSkeleton() {
  return (
    <div className="container max-w-screen-xl py-8">
      <Skeleton className="mb-6 h-8 w-64" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <BookingListItemSkeleton key={`BookingListItemSkeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}

function BookingsPage() {
  const bookings = useGetBookings();

  const incomingBookings = React.useMemo(() => {
    if (!bookings.data?.length) return [];

    return bookings.data.filter(({ dates }) =>
      isBefore(new Date(), new Date(dates.from)),
    );
  }, [bookings.data]);

  const pastBookings = React.useMemo(() => {
    if (!bookings.data?.length) return [];

    return bookings.data.filter(({ dates }) =>
      isAfter(new Date(), new Date(dates.from)),
    );
  }, [bookings.data]);

  if (bookings.isLoading) return <BookingsPageSkeleton />;

  if (!bookings.data?.length) {
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
