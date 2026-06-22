import { useLayoutEffect, type ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { getPartner } from "./partners.config";

/**
 * The ONLY place branding is applied.
 *
 * It reads the active partner + theme mode from Redux and writes the partner's
 * token set onto the document root as CSS custom properties, toggling the `dark`
 * class for the light/dark variant. Because every component styles itself with
 * semantic tokens (bg-primary, text-foreground, …), this one effect rebrands the
 * entire app — there is no partner-conditional logic anywhere in the UI layer.
 */
export function PartnerThemeProvider({ children }: { children: ReactNode }) {
  const partnerId = useAppSelector((s) => s.partner.activePartnerId);
  const mode = useAppSelector((s) => s.theme.mode);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const tokens = getPartner(partnerId).tokens[mode];

    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
    for (const [token, value] of Object.entries(tokens)) {
      root.style.setProperty(`--${token}`, value);
    }
  }, [partnerId, mode]);

  return <>{children}</>;
}
