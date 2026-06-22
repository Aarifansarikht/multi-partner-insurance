import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { useActivePartner } from "@/features/partner/selectors";
import { PartnerSwitcher } from "@/features/partner/components/PartnerSwitcher";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { useAuth } from "@/features/auth/selectors";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Button } from "@/components/ui/button";

/**
 * Application header. The brand block reflects the active partner; the action
 * slot carries the partner switcher, theme toggle and account/login control.
 */
export function SiteHeader() {
  const partner = useActivePartner();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
        <Link
          to={ROUTES.home}
          className="group flex min-w-0 items-center gap-2 rounded-sm sm:gap-2.5"
          aria-label={`${partner.name} — go to home`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-transform duration-150 group-hover:scale-[1.03] sm:size-9">
            <partner.Icon className="size-4 sm:size-5" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
              {partner.name}
            </span>
            <span className="text-2xs font-medium uppercase tracking-widest text-muted-foreground">
              Insurance
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <PartnerSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to={ROUTES.login}>Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
