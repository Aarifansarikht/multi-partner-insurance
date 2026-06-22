import * as React from "react";
import { CalendarIcon } from "lucide-react";
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
 * Single-input date picker: an input-styled trigger that opens a calendar
 * popover. Month + year dropdowns (when a year range is given) make picking a
 * date of birth quick. Stores an ISO `yyyy-mm-dd` string.
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
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-sm border border-input bg-surface px-3 text-sm shadow-xs transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
            !selected && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          <span className="truncate">
            {selected ? formatDisplay(selected) : placeholder}
          </span>
        </button>
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
