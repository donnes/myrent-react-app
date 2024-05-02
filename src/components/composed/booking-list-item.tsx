import * as React from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { Booking } from "@/validators/booking";
import { currency } from "@/lib/formats";
import { useCancelBooking } from "@/hooks/use-mutations";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingListItemSkeleton() {
  return (
    <div className="flex gap-x-2.5 p-2.5">
      <Skeleton className="aspect-square w-28 overflow-hidden rounded-xl" />
      <div className="flex w-full">
        <div>
          <Skeleton className="mb-3 h-5 w-52" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

export function BookingListItem({
  booking,
  isEditable,
}: {
  booking: Booking;
  isEditable?: boolean;
}) {
  const [isCancelAlertOpen, setCancelAlertOpen] = React.useState(false);

  const cancelMutation = useCancelBooking();

  function onCancel() {
    const promise = cancelMutation.mutateAsync(booking.id);

    toast.promise(promise, {
      loading: "Canceling your reservation...",
      success: () => "Your reservation has been canceled!",
      error: cancelMutation.error?.message,
    });
  }

  return (
    <div className="flex gap-x-2.5 rounded-xl p-2.5 transition-colors hover:bg-white has-[button[data-state='open']]:bg-white">
      <div className="aspect-square w-28 overflow-hidden rounded-xl">
        <picture>
          <img
            src={`${booking.property.image}&w=250`}
            className="h-full w-full object-cover"
            alt={booking.property.title}
          />
        </picture>
      </div>
      <div className="flex w-full">
        <div className="flex-1">
          <h2 className="font-semibold">{booking.property.title}</h2>

          <ol className="flex gap-x-2 py-1 text-sm">
            <li>
              {format(new Date(booking.dates.from), "dd/MM/yyyy")}
              {" ꟷ "}
              {format(new Date(booking.dates.to), "dd/MM/yyyy")}
            </li>
            <li aria-hidden="true">·</li>
            <li>{booking.property.location.city}</li>
          </ol>

          <ol className="flex gap-x-1 text-sm">
            <li>{booking.guests} guests</li>
          </ol>

          <data value={booking.totalPrice}>
            Total{" "}
            <span className="font-medium">{currency(booking.totalPrice)}</span>
          </data>
        </div>

        {isEditable && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCancelAlertOpen(true)}
                  className="text-red-400 focus:text-red-500"
                >
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
              open={isCancelAlertOpen}
              onOpenChange={setCancelAlertOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone and will permanently cancel
                    this reservation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
