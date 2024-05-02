import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { Property } from "@/validators/property";
import { currency } from "@/lib/formats";

import { Skeleton } from "@/components/ui/skeleton";

export function PropertyListItemSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square overflow-hidden rounded-xl" />
      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="mb-2 h-6 w-52" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}

export function PropertyListItem({ property }: { property: Property }) {
  return (
    <Link
      to="/properties/$propertyId"
      params={{
        propertyId: property.id,
      }}
      className="group cursor-pointer"
    >
      <div className="aspect-square overflow-hidden rounded-xl">
        <picture>
          <source
            media="(max-width: 799px)"
            srcSet={`${property.image}&w=400`}
          />
          <source
            media="(min-width: 800px)"
            srcSet={`${property.image}&w=800`}
          />
          <img
            src={`${property.image}&w=800`}
            className="h-full w-full object-cover"
            alt={property.title}
          />
        </picture>
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {property.location.city}, {property.location.state}
          </h3>

          <div className="flex items-center gap-x-1">
            <Star className="h-4 w-4 fill-zinc-800 text-zinc-800" />
            <span>
              {property.rating} ({property.reviews})
            </span>
          </div>
        </div>
        <h2 className="line-clamp-2 truncate text-lg text-zinc-500 transition-colors group-hover:text-zinc-900">
          {property.title}
        </h2>
        <div className="flex gap-x-1">
          <data value={property.pricePerNight}>
            <span className="font-semibold">
              {currency(property.pricePerNight)}
            </span>{" "}
            night
          </data>
          {property.totalPricePerNight && (
            <>
              <span>•</span>
              <data
                value={property.totalPricePerNight}
                className="text-zinc-500"
              >
                {currency(property.totalPricePerNight)} total
              </data>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
