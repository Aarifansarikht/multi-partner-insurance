
export type PlanCategory =
  | "Term Life"
  | "Health"
  | "Motor"
  | "Travel"
  | "Home";

export interface CoverageItem {

  label: string;

  detail: string;
  included: boolean;
}

export interface PlanHighlight {
  title: string;
  description: string;
}

export interface Plan {
  id: string;
  
  slug: string;
  name: string;
  category: PlanCategory;
  tagline: string;
  description: string;
  featured: boolean;
  popular?: boolean;

 
  coverMin: number;
  coverMax: number;
  coverStep: number;
  coverDefault: number;

  ratePerLakh: number;
 
  terms: number[];

  highlights: PlanHighlight[];
  coverage: CoverageItem[];
  benefits: string[];
  exclusions: string[];

  
  claimSettlementRatio: number; 
  rating: number; 
  reviewCount: number;
}


export interface PremiumQuote {
  coverAmount: number;
  term: number;

  basePremium: number;

  tax: number;
  taxRate: number;
 
  totalPremium: number;
}
