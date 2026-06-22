import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { useActivePartner } from "@/features/partner/selectors";
import { PartnerSwitcher } from "@/features/partner/components/PartnerSwitcher";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

/**
 * Application header. The brand block reflects the active partner; the action
 * slot carries the partner switcher and theme toggle (account menu is added
 * with auth).
 */
export function SiteHeader() {
  const partner = useActivePartner();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to={ROUTES.home}
          className="group flex items-center gap-2.5 rounded-sm"
          aria-label={`${partner.name} — go to home`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-transform duration-150 group-hover:scale-[1.03]">
            <partner.Icon className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-tight">
              {partner.name}
            </span>
            <span className="text-2xs font-medium uppercase tracking-widest text-muted-foreground">
              Insurance
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <PartnerSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
