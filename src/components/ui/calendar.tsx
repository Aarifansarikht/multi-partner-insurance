import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Calendar built on react-day-picker, styled with our semantic tokens (sharp
 * corners, primary selection). Used by the DatePicker; supports month/year
 * dropdowns via `captionLayout="dropdown"` for quick date-of-birth entry.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        month_caption: "relative flex h-8 items-center justify-center px-9",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-8",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-8",
        ),
        // Month + year dropdown selects. The native <select> is laid over the
        // visible label transparently so only one label shows and the whole
        // pill stays clickable.
        dropdowns: "flex items-center justify-center gap-2",
        dropdown_root:
          "relative inline-flex h-8 items-center gap-1 rounded-sm border border-input bg-surface pl-2.5 pr-1.5 text-sm font-medium",
        dropdown:
          "absolute inset-0 z-10 cursor-pointer appearance-none bg-transparent text-transparent opacity-0",
        caption_label: "flex items-center gap-1 text-sm font-medium",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-2xs font-semibold uppercase tracking-wide text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "size-9 p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 font-normal",
        ),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary-hover [&>button:hover]:text-primary-foreground",
        today: "[&>button]:border [&>button]:border-primary",
        outside: "text-muted-foreground",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          const cls = cn("size-4", chevronClass);
          if (orientation === "left") return <ChevronLeft className={cls} />;
          if (orientation === "right") return <ChevronRight className={cls} />;
          return <ChevronDown className={cls} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
