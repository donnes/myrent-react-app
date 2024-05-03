import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { amenitiesDictionary } from "@/fixtures/dictionaries";
import { currency } from "@/lib/formats";
import { useGetProperty } from "@/hooks/use-queries";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingForm } from "@/components/composed/booking-from";
import { AmenitiesIcon } from "@/components/composed/property-icons";

export const Route = createFileRoute("/properties/$propertyId")({
  component: PropertyPage,
});

function PropertyPageSkeleton() {
  return (
    <div className="container max-w-screen-xl py-8 pb-28 md:pb-8">
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

        <Skeleton className="hidden h-96 w-80 md:flex" />
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
    <>
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
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <div>
            <div className="sticky top-20 hidden w-80 md:flex">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-lg">
                <BookingForm property={property.data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="flex h-20 items-center justify-between rounded-t-xl border-t border-zinc-200 bg-zinc-50 px-4 shadow-lg">
          <data value={property.data.pricePerNight}>
            <span className="font-medium">
              {currency(property.data.pricePerNight)}
            </span>{" "}
            night
          </data>
          <Drawer>
            <DrawerTrigger asChild>
              <Button type="button" size="lg">
                Reserve
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <BookingForm property={property.data} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
