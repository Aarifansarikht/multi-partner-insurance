import "react-day-picker/style.css";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Calendar built on react-day-picker.
 *
 * We deliberately use the library's own stylesheet for layout (grid, nav,
 * dropdowns) — that's what guarantees a correct render — and only override the
 * colours via our semantic tokens (see the `.rdp-root` rules in index.css), so
 * the calendar matches the active partner + light/dark theme.
 */
export function Calendar({ className, ...props }: CalendarProps) {
  return <DayPicker className={cn("p-3", className)} {...props} />;
}
