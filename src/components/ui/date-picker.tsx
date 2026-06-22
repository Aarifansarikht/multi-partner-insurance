import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Simple, dependency-free date picker: three Day / Month / Year dropdowns.
 *
 * Chosen over a calendar grid because it's the fastest, most reliable way to
 * enter a date of birth (jump straight to a year instead of paging months) and
 * has no rendering edge cases. Emits an ISO `yyyy-mm-dd` string once all three
 * parts are chosen (and `""` while incomplete, so validation still fires).
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface DatePickerProps {
  id?: string;
  /** ISO date string (yyyy-mm-dd). */
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  /** Earliest selectable year. */
  fromYear?: number;
  /** Latest selectable year. */
  toYear?: number;
}

interface Parts {
  d: string;
  m: string;
  y: string;
}

function parse(value?: string): Parts {
  if (!value) return { d: "", m: "", y: "" };
  const [y, m, d] = value.split("-");
  return {
    y: y ?? "",
    m: m ? String(Number(m)) : "",
    d: d ? String(Number(d)) : "",
  };
}

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  disabled,
  fromYear,
  toYear,
}: DatePickerProps) {
  const current = parse(value);
  const maxYear = toYear ?? new Date().getFullYear();
  const minYear = fromYear ?? maxYear - 100;

  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  const dayCount =
    current.y && current.m
      ? daysInMonth(Number(current.y), Number(current.m))
      : 31;
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  const emit = (next: Partial<Parts>) => {
    const d = next.d ?? current.d;
    const m = next.m ?? current.m;
    const y = next.y ?? current.y;
    if (d && m && y) {
      // Clamp the day to the chosen month/year (e.g. 31 -> 28 for February).
      const dd = Math.min(Number(d), daysInMonth(Number(y), Number(m)));
      onChange(
        `${y}-${String(Number(m)).padStart(2, "0")}-${String(dd).padStart(2, "0")}`,
      );
    } else {
      onChange("");
    }
    onBlur?.();
  };

  return (
    <div
      id={id}
      className="grid grid-cols-[1fr_1.3fr_1fr] gap-2"
      role="group"
      aria-label="Date of birth"
    >
      <Select
        value={current.d}
        onValueChange={(v) => emit({ d: v })}
        disabled={disabled}
      >
        <SelectTrigger aria-label="Day" aria-invalid={invalid || undefined}>
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {days.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.m}
        onValueChange={(v) => emit({ m: v })}
        disabled={disabled}
      >
        <SelectTrigger aria-label="Month" aria-invalid={invalid || undefined}>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {MONTHS.map((name, i) => (
            <SelectItem key={name} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.y}
        onValueChange={(v) => emit({ y: v })}
        disabled={disabled}
      >
        <SelectTrigger aria-label="Year" aria-invalid={invalid || undefined}>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
