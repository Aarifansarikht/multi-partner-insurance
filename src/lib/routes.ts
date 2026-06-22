/**
 * Central route registry. Every navigation target in the app is expressed as a
 * function/const here so paths are defined once and refactors stay type-safe.
 */
export const ROUTES = {
  home: "/",
  planDetail: (planId = ":planId") => `/plans/${planId}`,
  login: "/login",
  journey: "/journey",
  kyc: "/journey/kyc",
  personal: "/journey/personal",
  nominee: "/journey/nominee",
  review: "/journey/review",
  payment: "/journey/payment",
  result: "/journey/result",
} as const;

/**
 * The protected onboarding journey, in order. Step metadata is consumed by the
 * stepper UI, the step guard, and resume-after-refresh logic so the sequence
 * lives in exactly one place.
 */
export const JOURNEY_STEPS = [
  { id: "kyc", path: ROUTES.kyc, label: "KYC", shortLabel: "KYC" },
  {
    id: "personal",
    path: ROUTES.personal,
    label: "Personal details",
    shortLabel: "Details",
  },
  {
    id: "nominee",
    path: ROUTES.nominee,
    label: "Nominee",
    shortLabel: "Nominee",
  },
  { id: "review", path: ROUTES.review, label: "Review", shortLabel: "Review" },
  {
    id: "payment",
    path: ROUTES.payment,
    label: "Payment",
    shortLabel: "Payment",
  },
] as const;

export type JourneyStepId = (typeof JOURNEY_STEPS)[number]["id"];

export const journeyStepIndex = (id: JourneyStepId) =>
  JOURNEY_STEPS.findIndex((s) => s.id === id);
