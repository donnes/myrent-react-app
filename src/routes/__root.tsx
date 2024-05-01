import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/80">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <div className="mr-6 flex items-center space-x-2">
              <Link to="/">
                <span className="font-mono text-2xl font-bold">MyRent</span>
              </Link>
            </div>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
              <Link
                to="/"
                className="text-zinc-900/60 transition-colors hover:text-zinc-900/80 [&.active]:text-zinc-900"
              >
                Home
              </Link>
              <Link
                to="/bookings"
                className="text-zinc-900/60 transition-colors hover:text-zinc-900/80 [&.active]:text-zinc-900"
              >
                My Bookings
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
