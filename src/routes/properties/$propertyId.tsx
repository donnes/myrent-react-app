import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, differenceInDays } from "date-fns";
import { Star } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { amenitiesDictionary } from "@/fixtures/dictionaries";
import {
  CreateBooking,
  CreateBookingSchema,
  EXTRA_GUESTS_FEE,
} from "@/validators/booking";
import { Property } from "@/validators/property";
import { currency } from "@/lib/formats";
import { useCreateBooking } from "@/hooks/use-mutations";
import { useGetProperty } from "@/hooks/use-queries";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AmenitiesIcon } from "@/components/composed/property-icons";
import {
  GuestsControl,
  RangeDatesControl,
} from "@/components/composed/search-bar";

export const Route = createFileRoute("/properties/$propertyId")({
  component: PropertyPage,
});

function BookingBox({ property }: { property: Property }) {
  const mutation = useCreateBooking();

  const form = useForm<CreateBooking>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      propertyId: property.id,
      dates: {
        from: addDays(new Date(), 1),
        to: addDays(new Date(), 7),
      },
      guests: 1,
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

  function onSubmit(data: CreateBooking) {
    const promise = mutation.mutateAsync(data);

    toast.promise(promise, {
      loading: "Booking your reservation...",
      success: () => "Your reservation has been booked successfully!",
      error: mutation.error?.message,
    });
  }

  return (
    <div className="sticky top-20 hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-lg md:block">
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
            <RangeDatesControl value={field.value} onChange={field.onChange} />
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
          disabled={form.formState.isSubmitting}
        >
          Reserve
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

function PropertyPageSkeleton() {
  return (
    <div className="container max-w-screen-xl py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-y-4">
          <Skeleton className="aspect-video overflow-hidden rounded-xl" />

          <div>
            <div className="mb-1 flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="mb-1 h-9 w-72" />
            <Skeleton className="h-6 w-60" />
          </div>
          <div className="pb-4">
            <Skeleton className="mb-2 h-5 w-36" />
            <Skeleton className="mb-1 h-4 w-[70%]" />
            <Skeleton className="mb-1 h-4 w-[70%]" />
            <Skeleton className="mb-1 h-4 w-[70%]" />
            <Skeleton className="mb-1 h-4 w-[80%]" />
            <Skeleton className="mb-1 h-4 w-[80%]" />
          </div>
        </div>

        <Skeleton className="h-96 w-80" />
      </div>
    </div>
  );
}

function PropertyPage() {
  const { propertyId } = Route.useParams();

  const property = useGetProperty(propertyId);

  if (property.isLoading || !property.data) {
    return <PropertyPageSkeleton />;
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-y-4">
          <div className="aspect-video overflow-hidden rounded-xl">
            <picture>
              <source
                media="(max-width: 799px)"
                srcSet={`${property.data.image}&w=400`}
              />
              <source
                media="(min-width: 800px)"
                srcSet={`${property.data.image}&w=1600`}
              />
              <img
                src={`${property.data.image}&w=1600`}
                className="h-full w-full object-bottom"
                alt={property.data.title}
              />
            </picture>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-medium leading-tight text-zinc-600">
                {property.data.location.city}, {property.data.location.state}
              </h2>
              <div className="flex items-center gap-x-1">
                <Star className="h-4 w-4 fill-zinc-800 text-zinc-800" />
                <span>
                  {property.data.rating} ({property.data.reviews})
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-semibold leading-tight">
              {property.data.title}
            </h1>
            <ol className="flex  gap-x-1 text-zinc-600">
              <li>{property.data.guests} guests</li>
              <li aria-hidden="true">·</li>
              <li>{property.data.bedrooms} bedrooms</li>
              <span aria-hidden="true">·</span>
              <li>{property.data.bathrooms} baths</li>
            </ol>
          </div>
          <div className="pb-4">
            <h3 className="pb-1 text-lg font-medium">About the property</h3>
            <p>{property.data.description}</p>
          </div>
          <div className="pb-4">
            <h3 className="pb-1 text-lg font-medium">Amenities</h3>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(property.data.amenities)
                .filter(([, value]) => value)
                .map(([key]) => {
                  const name = key as keyof typeof amenitiesDictionary;
                  return (
                    <li key={key} className="flex items-center gap-x-2">
                      <AmenitiesIcon name={name} />{" "}
                      <span className="text-zinc-600">
                        {amenitiesDictionary[name]}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="w-80">
          <BookingBox property={property.data} />
        </div>
      </div>
    </div>
  );
}
