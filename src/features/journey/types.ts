import type { PlanCategory, PremiumQuote } from "@/types/plan";

/** Snapshot of the chosen plan + configuration taken when the journey starts. */
export interface JourneySelection {
  planId: string;
  planSlug: string;
  planName: string;
  category: PlanCategory;
  quote: PremiumQuote;
}

export interface KycData {
  panNumber: string;
  fullName: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
}

export type Gender = "male" | "female" | "other";

export interface PersonalData {
  fullName: string;
  email: string;
  gender: Gender;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export type NomineeRelation =
  | "spouse"
  | "child"
  | "parent"
  | "sibling"
  | "other";

export interface NomineeData {
  fullName: string;
  relation: NomineeRelation;
  dateOfBirth: string;
  sharePercentage: number;
}

export type PaymentStatus = "success" | "failed";

export interface PaymentResult {
  status: PaymentStatus;
  referenceId: string;
  amount: number;
  /** Epoch millis. */
  at: number;
  method?: string;
}
