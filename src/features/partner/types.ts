import type { LucideIcon } from "lucide-react";


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
