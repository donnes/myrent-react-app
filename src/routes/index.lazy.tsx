import * as React from "react";
import { properties } from "@/fixtures/data";
import { Property } from "@/validators/property";
import { createLazyFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarDays, Minus, Plus, Search, Star } from "lucide-react";
import { DateRange } from "react-day-picker";

import { currency } from "@/lib/formats";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function SearchBar() {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  return (
    <div className="m-auto w-full pb-12 md:max-w-3xl">
      <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-zinc-200 p-2 shadow-lg sm:h-20 sm:flex-row">
        <label className="flex flex-1 cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-zinc-100 has-[:focus-visible]:bg-zinc-100">
          <Search className="mr-2 h-6 w-6 text-zinc-600" />
          <div className="flex-1">
            <span className="pb-1 text-sm font-medium leading-none">
              Destination
            </span>
            <input
              className="flex h-6 w-full border-0 bg-transparent p-0 text-sm font-normal text-zinc-900 ring-0 placeholder:text-zinc-400 focus-visible:outline-none"
              placeholder="New York"
            />
          </div>
        </label>

        <Popover>
          <PopoverTrigger asChild>
            <label className="flex flex-1 cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-zinc-100 data-[state=open]:bg-zinc-100">
              <CalendarDays className="mr-2 h-6 w-6 text-zinc-600" />
              <div className="flex-1">
                <span className="pb-1 text-sm font-medium leading-none">
                  Check in - Check out
                </span>

                <span
                  className={cn("flex text-sm font-normal text-zinc-900", {
                    "text-zinc-400": !date?.from && !date?.to,
                  })}
                >
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy")} -{" "}
                        {format(date.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Add dates"
                  )}
                </span>
              </div>
            </label>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <label className="flex flex-1 cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-zinc-100 has-[:focus-visible]:bg-zinc-100">
          <CalendarDays className="mr-2 h-6 w-6 text-zinc-600" />
          <div className="flex-1">
            <span className="pb-1 text-sm font-medium leading-none">
              Guests
            </span>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className={cn(
                  "flex h-6 w-full border-0 bg-transparent p-0 text-sm font-normal text-zinc-900 ring-0 placeholder:text-zinc-400 focus-visible:outline-none",
                  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                )}
                min={1}
                step={1}
                placeholder="0"
              />

              <div className="flex flex-row items-center gap-1">
                <Button className="h-6 w-6" variant="outline" size="icon">
                  <Minus className="h-3 w-3" />
                </Button>
                <Button className="h-6 w-6" variant="outline" size="icon">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

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
          <data value={property.pricePerNight} className="font-semibold">
            {currency(property.pricePerNight)}
          </data>
          <span>night</span>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="container max-w-screen-2xl py-8">
      <SearchBar />

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyListItem key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
