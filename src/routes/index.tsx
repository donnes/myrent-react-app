import { createFileRoute } from "@tanstack/react-router";

import { PropertySearchSchema } from "@/validators/property";
import { useGetProperties } from "@/hooks/use-queries";

import {
  PropertyListItem,
  PropertyListItemSkeleton,
} from "@/components/composed/property-list-item";
import { SearchBar } from "@/components/composed/search-bar";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: PropertySearchSchema,
});

function Index() {
  const search = Route.useSearch();

  const properties = useGetProperties(search);

  return (
    <div className="container max-w-screen-xl py-8">
      <SearchBar search={search} />

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <PropertyListItemSkeleton
                key={`PropertyListItemSkeleton-${index}`}
              />
            ))
          : properties.data?.map((property) => (
              <PropertyListItem key={property.id} property={property} />
            ))}
      </div>
    </div>
  );
}
