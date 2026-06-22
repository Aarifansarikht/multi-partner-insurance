import { Compass, Leaf, ShieldCheck } from "lucide-react";
import type { Partner } from "./types";

/**
 * Partner registry — the single source of truth for branding.
 *
 * To onboard a new partner, add ONE object to this array: an id, name, icon and
 * a light + dark token set. Everything else (theme switching, persistence, the
 * switcher UI) picks it up automatically because the rest of the app only ever
 * reads semantic tokens, never a partner-specific value.
 */
export const PARTNERS: Partner[] = [
  {
    id: "aegis",
    name: "Aegis Assure",
    shortName: "Aegis",
    tagline: "Protection, simplified.",
    Icon: ShieldCheck,
    tokens: {
      light: {
        background: "210 20% 98%",
        foreground: "222 32% 12%",
        surface: "0 0% 100%",
        "surface-foreground": "222 32% 12%",
        muted: "214 20% 94%",
        "muted-foreground": "218 14% 42%",
        border: "214 20% 88%",
        input: "214 20% 86%",
        ring: "224 64% 47%",
        primary: "224 64% 47%",
        "primary-foreground": "0 0% 100%",
        secondary: "222 32% 20%",
        "secondary-foreground": "0 0% 100%",
        accent: "199 89% 46%",
        "accent-foreground": "0 0% 100%",
        "shadow-color": "222 47% 30%",
      },
      dark: {
        background: "222 30% 9%",
        foreground: "210 20% 96%",
        surface: "222 26% 12%",
        "surface-foreground": "210 20% 96%",
        muted: "217 22% 18%",
        "muted-foreground": "215 16% 64%",
        border: "217 20% 22%",
        input: "217 20% 24%",
        ring: "222 70% 64%",
        primary: "222 70% 62%",
        "primary-foreground": "222 47% 11%",
        secondary: "210 20% 90%",
        "secondary-foreground": "222 47% 11%",
        accent: "199 89% 58%",
        "accent-foreground": "222 47% 11%",
        "shadow-color": "0 0% 0%",
      },
    },
  },
  {
    id: "vitalcare",
    name: "VitalCare Health",
    shortName: "VitalCare",
    tagline: "Care that keeps up with you.",
    Icon: Leaf,
    tokens: {
      light: {
        background: "150 30% 98%",
        foreground: "170 30% 10%",
        surface: "0 0% 100%",
        "surface-foreground": "170 30% 10%",
        muted: "152 24% 93%",
        "muted-foreground": "168 12% 40%",
        border: "152 22% 86%",
        input: "152 22% 84%",
        ring: "160 76% 34%",
        primary: "160 76% 32%",
        "primary-foreground": "0 0% 100%",
        secondary: "174 60% 18%",
        "secondary-foreground": "0 0% 100%",
        accent: "142 70% 42%",
        "accent-foreground": "0 0% 100%",
        "shadow-color": "168 60% 20%",
      },
      dark: {
        background: "170 28% 8%",
        foreground: "150 20% 95%",
        surface: "172 24% 11%",
        "surface-foreground": "150 20% 95%",
        muted: "172 18% 17%",
        "muted-foreground": "155 14% 62%",
        border: "172 16% 21%",
        input: "172 16% 23%",
        ring: "158 70% 50%",
        primary: "158 68% 44%",
        "primary-foreground": "170 40% 8%",
        secondary: "150 20% 90%",
        "secondary-foreground": "170 40% 8%",
        accent: "142 62% 52%",
        "accent-foreground": "170 40% 8%",
        "shadow-color": "0 0% 0%",
      },
    },
  },
  {
    id: "orbit",
    name: "Orbit Cover",
    shortName: "Orbit",
    tagline: "Insurance for the journey ahead.",
    Icon: Compass,
    tokens: {
      light: {
        background: "270 30% 98%",
        foreground: "265 30% 12%",
        surface: "0 0% 100%",
        "surface-foreground": "265 30% 12%",
        muted: "268 24% 94%",
        "muted-foreground": "263 12% 44%",
        border: "268 22% 88%",
        input: "268 22% 86%",
        ring: "262 70% 54%",
        primary: "262 70% 54%",
        "primary-foreground": "0 0% 100%",
        secondary: "258 40% 22%",
        "secondary-foreground": "0 0% 100%",
        accent: "318 75% 50%",
        "accent-foreground": "0 0% 100%",
        "shadow-color": "263 47% 30%",
      },
      dark: {
        background: "264 30% 9%",
        foreground: "270 20% 96%",
        surface: "264 26% 12%",
        "surface-foreground": "270 20% 96%",
        muted: "264 20% 18%",
        "muted-foreground": "265 14% 64%",
        border: "264 18% 23%",
        input: "264 18% 25%",
        ring: "262 78% 70%",
        primary: "262 78% 68%",
        "primary-foreground": "265 47% 11%",
        secondary: "270 20% 90%",
        "secondary-foreground": "265 47% 11%",
        accent: "318 80% 64%",
        "accent-foreground": "265 47% 11%",
        "shadow-color": "0 0% 0%",
      },
    },
  },
];

export const DEFAULT_PARTNER_ID = PARTNERS[0].id;

export const getPartner = (id: string): Partner =>
  PARTNERS.find((p) => p.id === id) ?? PARTNERS[0];
