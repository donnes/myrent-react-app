import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";

import { properties } from "@/fixtures/data";
import { Property, PropertySearch } from "@/validators/property";

export const queryKeys = {
  getProperties: "get-properties",
  getProperty: "get-property",
};

// Simulate API round trip latency
const delay = async () =>
  new Promise((r) => setTimeout(r, Math.round(Math.random() * 500)));

export function useGetProperties(
  params?: Partial<PropertySearch>,
  options?: UseQueryOptions<Array<Property>>,
) {
  async function queryFn() {
    await delay();

    if (params && params.startDate && params.endDate) {
      const nights = differenceInDays(params.endDate, params.startDate);

      return properties
        .filter((p) => {
          const { city, state, country } = p.location;
          const fullLocation = `${city}, ${state}, ${country}`;
          let filter = true;

          if (params.guests && params.guests > p.guests) {
            filter = false;
          }

          if (params.destination && fullLocation !== params.destination) {
            filter = false;
          }

          return filter;
        })
        .map((p) => ({
          ...p,
          totalPricePerNight: p.pricePerNight * nights,
        }));
    }

    return properties;
  }

  return useQuery({
    queryKey: [queryKeys.getProperties, params],
    queryFn,
    ...options,
  });
}

export function useGetProperty(id: string) {
  async function queryFn() {
    await delay();
    return properties.find((p) => p.id === id);
  }

  return useQuery({
    queryKey: [queryKeys.getProperty, id],
    queryFn,
  });
}
