import { Check, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useActivePartner } from "@/features/partner/selectors";
import { setPartner } from "@/features/partner/partnerSlice";
import { PARTNERS } from "@/features/partner/partners.config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** Runtime partner switcher. Selection is persisted via the partner slice. */
export function PartnerSwitcher() {
  const dispatch = useAppDispatch();
  const active = useActivePartner();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 items-center gap-2 rounded-sm border border-border bg-surface px-2.5 text-sm font-medium shadow-xs transition-colors hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        aria-label={`Active partner: ${active.name}. Change partner`}
      >
        <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <active.Icon className="size-3.5" />
        </span>
        <span className="hidden sm:inline">{active.shortName}</span>
        <ChevronDown className="size-4 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[15rem]">
        <DropdownMenuLabel>Switch partner</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PARTNERS.map((partner) => {
          const isActive = partner.id === active.id;
          return (
            <DropdownMenuItem
              key={partner.id}
              onSelect={() => dispatch(setPartner(partner.id))}
              className="gap-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-soft text-primary">
                <partner.Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {partner.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {partner.tagline}
                </span>
              </span>
              {isActive && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
