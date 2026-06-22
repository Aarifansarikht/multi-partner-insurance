/** Insurance product categories supported by the catalog. */
export type PlanCategory =
  | "Term Life"
  | "Health"
  | "Motor"
  | "Travel"
  | "Home";

export interface CoverageItem {
  /** Short label, e.g. "In-patient hospitalisation". */
  label: string;
  /** Human-readable cover detail, e.g. "Up to sum insured". */
  detail: string;
  included: boolean;
}

export interface PlanHighlight {
  title: string;
  description: string;
}

export interface Plan {
  id: string;
  /** URL-friendly identifier used in the detail route. */
  slug: string;
  name: string;
  category: PlanCategory;
  tagline: string;
  description: string;
  featured: boolean;
  popular?: boolean;

  /** Cover range, in rupees. Drives the configurator slider. */
  coverMin: number;
  coverMax: number;
  coverStep: number;
  coverDefault: number;

  /** Annual premium per ₹1,00,000 of cover at the shortest available term. */
  ratePerLakh: number;
  /** Selectable policy terms, in years (ascending). */
  terms: number[];

  highlights: PlanHighlight[];
  coverage: CoverageItem[];
  benefits: string[];
  exclusions: string[];

  /** Marketing/quality signals shown on the detail page. */
  claimSettlementRatio: number; // percentage, e.g. 98.6
  rating: number; // 0-5
  reviewCount: number;
}

/** A fully-resolved quote for a chosen cover + term. */
export interface PremiumQuote {
  coverAmount: number;
  term: number;
  /** Annual premium before tax, in rupees. */
  basePremium: number;
  /** GST applied on the base premium. */
  tax: number;
  taxRate: number;
  /** basePremium + tax. */
  totalPremium: number;
}
