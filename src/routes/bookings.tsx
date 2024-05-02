import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings")({
  component: () => <div>Hello /bookings!</div>,
});
