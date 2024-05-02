import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, differenceInDays } from "date-fns";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  Booking,
  BookingFormSchema,
  BookingForm as BookingFormType,
  EXTRA_GUESTS_FEE,
} from "@/validators/booking";
import { Property } from "@/validators/property";
import { currency } from "@/lib/formats";
import { useCreateBooking, useUpdateBooking } from "@/hooks/use-mutations";

import { Button } from "@/components/ui/button";
import {
  GuestsControl,
  RangeDatesControl,
} from "@/components/composed/search-bar";

export function BookingForm({
  property,
  booking,
}: {
  property: Property;
  booking?: Booking;
}) {
  const updateMutation = useUpdateBooking();
  const createMutation = useCreateBooking();

  const form = useForm<BookingFormType>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      propertyId: property.id,
      dates: {
        from: booking ? new Date(booking.dates.from) : addDays(new Date(), 1),
        to: booking ? new Date(booking.dates.to) : addDays(new Date(), 7),
      },
      guests: booking?.guests ?? 1,
    },
  });

  const dates = useWatch({
    control: form.control,
    name: "dates",
  });

  const guests = useWatch({
    control: form.control,
    name: "guests",
  });

  const daysCount = React.useMemo(() => {
    return differenceInDays(dates.to, dates.from);
  }, [dates]);

  const extraGuestsFee = React.useMemo(() => {
    return guests > property.guests
      ? (guests - property.guests) * EXTRA_GUESTS_FEE
      : 0;
  }, [guests, property]);

  const subTotalPrice = property.pricePerNight * daysCount;
  const totalPrice = subTotalPrice + extraGuestsFee;

  React.useEffect(() => {
    if (daysCount > 0) {
      form.setValue("totalPrice", totalPrice);
    }
  }, [form, daysCount, totalPrice]);

  function onSubmit(data: BookingFormType) {
    if (booking) {
      const promise = updateMutation.mutateAsync({ id: booking.id, data });
      toast.promise(promise, {
        loading: "Updating your reservation...",
        success: "Your reservation has been updated successfully!",
        error: (error) => {
          if (error instanceof Error) {
            return error.message;
          }
          return "Something went wrong";
        },
      });
    } else {
      const promise = createMutation.mutateAsync(data);
      toast.promise(promise, {
        loading: "Booking your reservation...",
        success: "Your reservation has been booked successfully!",
        error: (error) => {
          if (error instanceof Error) {
            return error.message;
          }
          return "Something went wrong";
        },
      });
    }
  }

  return (
    <div>
      <h2 className="pb-1 font-medium leading-tight">
        {property.location.city}, {property.location.state}
      </h2>

      <ol className="flex gap-x-1 pb-4 text-sm text-zinc-600">
        <li>{property.guests} guests</li>
        <li aria-hidden="true">·</li>
        <li>{property.bedrooms} bedrooms</li>
        <span aria-hidden="true">·</span>
        <li>{property.bathrooms} baths</li>
      </ol>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 pb-4"
      >
        <Controller
          name="dates"
          control={form.control}
          render={({ field }) => (
            <RangeDatesControl
              value={{
                from: new Date(field.value.from),
                to: new Date(field.value.to),
              }}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="guests"
          control={form.control}
          render={({ field }) => (
            <GuestsControl value={field.value} onChange={field.onChange} />
          )}
        />
        <Button
          className="w-full"
          size="lg"
          disabled={
            form.formState.isSubmitting ||
            updateMutation.isPending ||
            createMutation.isPending
          }
        >
          {booking ? "Update Booking" : "Reserve"}
        </Button>
      </form>

      <ul className="flex flex-col gap-y-2">
        <li className="flex items-center justify-between">
          <span className="text-zinc-600 underline">
            {currency(property.pricePerNight)} x {daysCount} nights
          </span>
          <data value={subTotalPrice} className="font-medium">
            {currency(subTotalPrice)}
          </data>
        </li>
        {extraGuestsFee > 0 && (
          <li className="flex items-center justify-between">
            <span className="text-zinc-600 underline">Extra guests fee</span>
            <data value={extraGuestsFee} className="font-medium">
              {currency(extraGuestsFee)}
            </data>
          </li>
        )}
      </ul>

      <hr className="my-6 border-zinc-200" />

      <div className="flex items-center justify-between font-bold">
        <span>Total</span>
        <data value={totalPrice}>{currency(totalPrice)}</data>
      </div>
    </div>
  );
}
