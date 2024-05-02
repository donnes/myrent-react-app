import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/80">
        <div className="container flex h-14 max-w-screen-xl items-center">
          <div className="flex flex-1">
            <Link to="/" className="mr-6">
              <span className="font-mono text-2xl font-bold">MyRent</span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
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
          <nav className="md:hidden">
            <Link
              to="/bookings"
              className="text-zinc-900/60 transition-colors hover:text-zinc-900/80 [&.active]:text-zinc-900"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
