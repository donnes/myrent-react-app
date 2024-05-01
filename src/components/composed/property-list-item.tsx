import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { Property } from "@/validators/property";
import { currency } from "@/lib/formats";

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
        <div className="flex flex-row items-center justify-between">
          <h3 className="font-semibold">
            {property.location.city}, {property.location.state}
          </h3>

          <div className="flex flex-row items-center gap-x-1">
            <Star className="h-4 w-4 fill-zinc-800 text-zinc-800" />
            <span>
              {property.rating} ({property.reviews})
            </span>
          </div>
        </div>
        <h2 className="line-clamp-2 truncate text-lg text-zinc-500 transition-colors group-hover:text-zinc-900">
          {property.title}
        </h2>
        <div className="flex flex-row gap-x-1">
          <div className="flex flex-row gap-x-1">
            <data value={property.pricePerNight} className="font-semibold">
              {currency(property.pricePerNight)}
            </data>
            <span>night</span>
          </div>
          {property.totalPricePerNight && (
            <>
              <span>•</span>
              <div className="flex flex-row gap-x-1 text-zinc-500">
                <data value={property.totalPricePerNight}>
                  {currency(property.totalPricePerNight)}
                </data>
                <span>total</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}