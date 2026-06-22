import type { LucideIcon } from "lucide-react";

/**
 * The set of CSS custom properties a partner overrides. Keys match the variable
 * names declared in index.css (minus the `--` prefix); values are flat hex
 * strings that slot straight into `var(--token)`.
 *
 * Status colours (success / warning / destructive) are intentionally not
 * partner-overridable — they keep a consistent meaning across every brand.
 * Tints (`*-soft`) and hover shades (`*-hover`) are explicit solid colours
 * rather than opacity, so theming stays simple and predictable.
 */
export interface PartnerTokens {
  background: string;
  foreground: string;
  surface: string;
  "surface-foreground": string;
  muted: string;
  "muted-foreground": string;
  border: string;
  input: string;
  ring: string;
  primary: string;
  "primary-foreground": string;
  "primary-hover": string;
  "primary-soft": string;
  secondary: string;
  "secondary-foreground": string;
  "secondary-hover": string;
  accent: string;
  "accent-foreground": string;
  "accent-soft": string;
}

export interface Partner {
  id: string;
  name: string;
  /** Short label for compact UI (e.g. the header pill). */
  shortName: string;
  tagline: string;
  Icon: LucideIcon;
  tokens: {
    light: PartnerTokens;
    dark: PartnerTokens;
  };
}
