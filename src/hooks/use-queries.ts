import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { properties } from "@/fixtures/data";
import { Property } from "@/validators/property";

export const queryKeys = {
  getProperties: "get-properties",
};

// Simulate API round trip latency
const delay = async () =>
  new Promise((r) => setTimeout(r, Math.round(Math.random() * 500)));

export function useGetProperties(options?: UseQueryOptions<Array<Property>>) {
  async function queryFn() {
    await delay();
    return properties;
  }

  return useQuery({
    queryKey: [queryKeys.getProperties],
    queryFn,
    ...options,
  });
}
