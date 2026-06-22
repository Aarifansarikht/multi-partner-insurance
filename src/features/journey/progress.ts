import {
  JOURNEY_STEPS,
  journeyStepIndex,
  type JourneyStepId,
} from "@/lib/routes";
import type { JourneyState } from "./journeySlice";

export type StepCompletion = Record<JourneyStepId, boolean>;

/** Which journey steps are considered finished given the current data. */
export function stepCompletion(j: JourneyState): StepCompletion {
  return {
    kyc: !!j.kyc,
    personal: !!j.personal,
    nominee: !!j.nominee,
    review: j.reviewed,
    payment: j.payment?.status === "success",
  };
}

/** A step is reachable only once every step before it is complete. */
export function isStepUnlocked(j: JourneyState, step: JourneyStepId): boolean {
  if (!j.selection) return false;
  const idx = journeyStepIndex(step);
  const completion = stepCompletion(j);
  return JOURNEY_STEPS.slice(0, idx).every((s) => completion[s.id]);
}

/** The earliest step the user still needs to complete. */
export function firstIncompleteStep(j: JourneyState): JourneyStepId {
  const completion = stepCompletion(j);
  return JOURNEY_STEPS.find((s) => !completion[s.id])?.id ?? "payment";
}
