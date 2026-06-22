import type { LucideIcon } from "lucide-react";

/**
 * The set of CSS custom properties a partner overrides. Keys match the variable
 * names declared in index.css (minus the `--` prefix); values are bare HSL
 * triples ("H S% L%") so they slot straight into `hsl(var(--token))`.
 *
 * Semantic status colours (success / warning / destructive) are intentionally
 * not partner-overridable — they keep a consistent meaning across every brand.
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
  secondary: string;
  "secondary-foreground": string;
  accent: string;
  "accent-foreground": string;
  "shadow-color": string;
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
