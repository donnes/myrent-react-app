import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulate API round trip latency
export const delay = async () =>
  new Promise((r) => setTimeout(r, Math.round(Math.random() * 500)));
