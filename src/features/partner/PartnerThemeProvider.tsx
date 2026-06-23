import { useLayoutEffect, type ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { getPartner } from "./partners.config";


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
