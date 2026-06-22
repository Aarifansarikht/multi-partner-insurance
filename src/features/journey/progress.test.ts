import { describe, expect, it } from "vitest";
import { emptyJourney, type JourneyState } from "./journeySlice";
import { firstIncompleteStep, isStepUnlocked, stepCompletion } from "./progress";
import type {
  JourneySelection,
  KycData,
  NomineeData,
  PersonalData,
} from "./types";

const selection: JourneySelection = {
  planId: "p1",
  planSlug: "p1",
  planName: "Test Plan",
  category: "Term Life",
  quote: {
    coverAmount: 1000000,
    term: 10,
    basePremium: 1000,
    tax: 180,
    taxRate: 0.18,
    totalPremium: 1180,
  },
};
const kyc: KycData = {
  panNumber: "ABCDE1234F",
  fullName: "Test User",
  dateOfBirth: "1990-01-01",
};
const personal: PersonalData = {
  fullName: "Test User",
  email: "t@example.com",
  gender: "male",
  addressLine1: "1 St",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411001",
};
const nominee: NomineeData = {
  fullName: "Nom",
  relation: "spouse",
  dateOfBirth: "1992-01-01",
  sharePercentage: 100,
};

const state = (over: Partial<JourneyState> = {}): JourneyState => ({
  ...emptyJourney,
  selection,
  ...over,
});

describe("journey step logic", () => {
  it("locks every step until a plan is selected", () => {
    const noSelection = { ...emptyJourney };
    expect(isStepUnlocked(noSelection, "kyc")).toBe(false);
  });

  it("unlocks only the first step at the start", () => {
    const s = state();
    expect(isStepUnlocked(s, "kyc")).toBe(true);
    expect(isStepUnlocked(s, "personal")).toBe(false);
    expect(isStepUnlocked(s, "payment")).toBe(false);
    expect(firstIncompleteStep(s)).toBe("kyc");
  });

  it("unlocks the next step once the previous is complete", () => {
    const s = state({ kyc });
    expect(stepCompletion(s).kyc).toBe(true);
    expect(isStepUnlocked(s, "personal")).toBe(true);
    expect(isStepUnlocked(s, "nominee")).toBe(false);
    expect(firstIncompleteStep(s)).toBe("personal");
  });

  it("requires review confirmation before payment unlocks", () => {
    const beforeReview = state({ kyc, personal, nominee });
    expect(isStepUnlocked(beforeReview, "review")).toBe(true);
    expect(isStepUnlocked(beforeReview, "payment")).toBe(false);

    const afterReview = state({ kyc, personal, nominee, reviewed: true });
    expect(isStepUnlocked(afterReview, "payment")).toBe(true);
    expect(firstIncompleteStep(afterReview)).toBe("payment");
  });

  it("marks payment complete only on a successful payment", () => {
    const failed = state({
      kyc,
      personal,
      nominee,
      reviewed: true,
      payment: { status: "failed", referenceId: "x", amount: 1, at: 0 },
    });
    expect(stepCompletion(failed).payment).toBe(false);

    const ok = state({
      kyc,
      personal,
      nominee,
      reviewed: true,
      payment: { status: "success", referenceId: "x", amount: 1, at: 0 },
    });
    expect(stepCompletion(ok).payment).toBe(true);
  });
});
