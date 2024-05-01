import { createFileRoute } from "@tanstack/react-router";

import { useGetProperty } from "@/hooks/use-queries";

export const Route = createFileRoute("/properties/$propertyId")({
  component: PropertyPage,
});

function PropertyPage() {
  const { propertyId } = Route.useParams();

  const property = useGetProperty(propertyId);

  if (property.isLoading) return null;

  return (
    <div className="container max-w-screen-2xl py-8">
      <h1 className="text-2xl font-medium">{property.data?.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2"></div>
    </div>
  );
}
