import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/routes";

/**
 * Application header. The brand block on the left and the action slot on the
 * right are intentionally thin in this stage — the partner switcher, theme
 * toggle and account menu are mounted into the action slot in later milestones.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to={ROUTES.home}
          className="group flex items-center gap-2.5 rounded-sm"
          aria-label="Go to home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-transform duration-150 group-hover:scale-[1.03]">
            <ShieldCheck className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-tight">
              Insurance
            </span>
            <span className="text-2xs font-medium uppercase tracking-widest text-muted-foreground">
              Onboarding
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2" data-slot="header-actions">
          {/* Partner switcher + theme toggle mount here in a later stage. */}
        </div>
      </div>
    </header>
  );
}
