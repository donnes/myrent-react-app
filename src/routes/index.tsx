import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { Property, PropertySearchSchema } from "@/validators/property";
import { currency } from "@/lib/formats";
import { useGetProperties } from "@/hooks/use-queries";

import { SearchBar } from "@/components/composed/search-bar";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: PropertySearchSchema.partial(),
});

function PropertyListItem({ property }: { property: Property }) {
  return (
    <div className="group cursor-pointer">
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
    </div>
  );
}

function Index() {
  const search = Route.useSearch();

  const properties = useGetProperties(search);

  return (
    <div className="container max-w-screen-2xl py-8">
      <SearchBar search={search} />

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.data?.map((property) => (
          <PropertyListItem key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
