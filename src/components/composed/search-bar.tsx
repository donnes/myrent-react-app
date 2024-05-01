import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Command as CommandPrimitive } from "cmdk";
import { format } from "date-fns";
import { CalendarDays, Minus, Plus, Search, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { destinations } from "@/fixtures/data";
import { PropertySearch, PropertySearchSchema } from "@/validators/property";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Location({
  value,
  onChange,
}: {
  value: PropertySearch["destination"];
  onChange: (value: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = React.useState(false);
  const [isSearching, setSearching] = React.useState(false);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the listing displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      if (input.value !== "" && input.value !== value) {
        setSearching(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = destinations.find(
          (option) => option.label === input.value,
        )?.label;
        if (optionToSelect) {
          onChange?.(optionToSelect);
        }
        setSearching(false);
      }

      if (event.key === "Escape") {
        input.blur();
        setSearching(false);
      }
    },
    [inputRef, value, isOpen, onChange],
  );

  const handleSelectOption = React.useCallback(
    (value: string) => {
      onChange?.(value);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [inputRef, onChange],
  );

  return (
    <label className="relative flex flex-1 cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-zinc-100 has-[:focus-visible]:bg-zinc-100">
      <Search className="mr-2 h-6 w-6 text-zinc-600" />
      <div className="flex-1">
        <span className="pb-1 text-sm font-medium leading-none">
          Destination
        </span>
        <div>
          <CommandPrimitive onKeyDown={handleKeyDown}>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              className="flex h-6 w-full border-0 bg-transparent p-0 text-sm font-normal text-zinc-900 ring-0 placeholder:text-zinc-400 focus-visible:outline-none"
              placeholder="New York"
            />
            {isOpen ? (
              <div className="animate-in fade-in-0 zoom-in-95 absolute top-[66px] z-10 w-full rounded-md border border-zinc-200 bg-white shadow-md outline-none">
                <CommandList className="max-h-[305px] p-1.5">
                  {destinations
                    .filter(({ label }) =>
                      isSearching ? label.includes(value ?? "") : true,
                    )
                    .map((destination) => {
                      return (
                        <CommandItem
                          key={destination.key}
                          value={destination.label}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onSelect={() => handleSelectOption(destination.label)}
                          className="flex w-full items-center gap-2 rounded-md"
                        >
                          {destination.label}
                        </CommandItem>
                      );
                    })}
                </CommandList>
              </div>
            ) : null}
          </CommandPrimitive>
        </div>
      </div>
    </label>
  );
}

function RangeDates({
  value,
  onChange,
}: {
  value: PropertySearch["dates"];
  onChange: (value: PropertySearch["dates"]) => void;
}) {
  return (
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
                "text-zinc-400": !value?.from && !value?.to,
              })}
            >
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "dd/MM/yyyy")} -{" "}
                    {format(value.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(value.from, "dd/MM/yyyy")
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
          defaultMonth={new Date(value.from)}
          selected={{
            from: new Date(value.from),
            to: new Date(value.to),
          }}
          onSelect={(dates) => {
            if (dates?.from && !dates.to) {
              onChange({
                from: dates.from.toISOString(),
                to: dates.from.toISOString(),
              });
            } else if (dates?.from && dates?.to) {
              onChange({
                from: dates.from.toISOString(),
                to: dates.to.toISOString(),
              });
            }
          }}
          numberOfMonths={2}
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}

function Guests({
  value,
  onChange,
}: {
  value: PropertySearch["guests"] | undefined;
  onChange: (value: PropertySearch["guests"] | undefined) => void;
}) {
  const onIncrement = React.useCallback(() => {
    if (!value) {
      onChange(1);
    } else if (value < 10) {
      onChange(value + 1);
    }
  }, [value, onChange]);

  const onDecrement = React.useCallback(() => {
    if (value && value > 1) {
      onChange(value - 1);
    }
  }, [value, onChange]);

  return (
    <label className="flex flex-1 cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-zinc-100 has-[:focus-visible]:bg-zinc-100">
      <Users className="mr-2 h-6 w-6 text-zinc-600" />
      <div className="flex-1">
        <span className="pb-1 text-sm font-medium leading-none">Guests</span>
        <div className="flex flex-row items-center">
          <input
            type="number"
            className={cn(
              "flex h-6 w-full border-0 bg-transparent p-0 text-sm font-normal text-zinc-900 ring-0 placeholder:text-zinc-400 focus-visible:outline-none",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
            value={value}
            min={1}
            step={1}
            onChange={(e) => {
              if (e.target.value === "") {
                onChange(undefined);
              } else {
                onChange(Math.min(Math.max(Number(e.target.value), 1), 10));
              }
            }}
            placeholder="0"
          />

          <div className="flex flex-row items-center gap-1">
            <Button
              type="button"
              className="h-6 w-6"
              onClick={onDecrement}
              variant="outline"
              size="icon"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              className="h-6 w-6"
              onClick={onIncrement}
              variant="outline"
              size="icon"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </label>
  );
}

export function SearchBar({
  search,
}: {
  search: Partial<PropertySearch> | undefined;
}) {
  const navigate = useNavigate();

  const form = useForm<PropertySearch>({
    resolver: zodResolver(PropertySearchSchema),
    defaultValues: search ? search : {},
  });

  function onSubmit(data: PropertySearch) {
    navigate({
      search: data,
      to: "/",
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="m-auto w-full pb-12 md:max-w-3xl"
    >
      <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-zinc-200 p-2 shadow-lg sm:h-20 sm:flex-row">
        <Controller
          name="destination"
          control={form.control}
          render={({ field }) => <Location {...field} />}
        />
        <div className="hidden h-full w-px items-center md:flex">
          <div className="h-10 w-px bg-zinc-200">&nbsp;</div>
        </div>
        <Controller
          name="dates"
          control={form.control}
          render={({ field }) => <RangeDates {...field} />}
        />
        <div className="hidden h-full w-px items-center md:flex">
          <div className="h-10 w-px bg-zinc-200">&nbsp;</div>
        </div>
        <Controller
          name="guests"
          control={form.control}
          render={({ field }) => <Guests {...field} />}
        />
        <div className="flex h-full items-center justify-center">
          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid}
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
