import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** ISO (yyyy-mm-dd) <-> local Date helpers, TZ-safe (no UTC shifting). */
function toISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function fromISO(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
function formatDisplay(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export interface DatePickerProps {
  id?: string;
  /** ISO date string (yyyy-mm-dd). */
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Earliest selectable year (enables month/year dropdowns). */
  fromYear?: number;
  /** Latest selectable year (enables month/year dropdowns). */
  toYear?: number;
  /** Disable dates after today (default true — birth dates can't be future). */
  disableFuture?: boolean;
}

/**
 * shadcn-style date picker: a Popover-triggered calendar. When `fromYear`/
 * `toYear` are provided it shows month + year dropdowns, making date-of-birth
 * entry quick instead of stepping month by month.
 */
export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Select a date",
  invalid,
  disabled,
  fromYear,
  toYear,
  disableFuture = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = fromISO(value);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasRange = fromYear !== undefined || toYear !== undefined;
  const defaultMonth =
    selected ?? (toYear ? new Date(toYear - 25, 0) : undefined);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "w-full justify-start gap-2 font-normal",
            !selected && "text-muted-foreground",
            invalid &&
              "border-destructive focus-visible:ring-destructive",
          )}
        >
          <CalendarIcon className="size-4 opacity-70" />
          {selected ? formatDisplay(selected) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={defaultMonth}
          captionLayout={hasRange ? "dropdown" : "label"}
          startMonth={fromYear ? new Date(fromYear, 0) : undefined}
          endMonth={toYear ? new Date(toYear, 11) : undefined}
          disabled={disableFuture ? { after: today } : undefined}
          onSelect={(date) => {
            if (date) {
              onChange(toISO(date));
              setOpen(false);
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
