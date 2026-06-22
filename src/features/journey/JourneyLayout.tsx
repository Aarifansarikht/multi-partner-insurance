import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { JOURNEY_STEPS, ROUTES } from "@/lib/routes";
import { useJourney } from "@/features/journey/selectors";
import { firstIncompleteStep, isStepUnlocked } from "@/features/journey/progress";
import { JourneyStepper } from "./components/JourneyStepper";
import { JourneySummary } from "./components/JourneySummary";

/**
 * Frame + guard for the journey.
 *
 * Guards, in order:
 * 1. No selection -> guide back to the catalog (nothing to apply for).
 * 2. Purchase already completed -> jump to the result screen.
 * 3. Jumping ahead to a locked step -> redirect to the first incomplete step.
 *
 * Combined with persisted journey state, this makes a mid-flow refresh or a deep
 * link land the user on a valid step with their entered data restored.
 */
export function JourneyLayout() {
  const { pathname } = useLocation();
  const journey = useJourney();
  const { selection, payment } = journey;

  if (!selection) {
    return (
      <div className="container max-w-2xl py-16">
        <EmptyState
          title="No plan selected yet"
          description="Pick a plan and choose your cover to begin the application."
          action={
            <Button asChild>
              <Link to={ROUTES.home}>Browse plans</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (payment?.status === "success") {
    return <Navigate to={ROUTES.result} replace />;
  }

  const currentStep = JOURNEY_STEPS.find((s) => pathname.startsWith(s.path));
  if (currentStep && !isStepUnlocked(journey, currentStep.id)) {
    const target = JOURNEY_STEPS.find(
      (s) => s.id === firstIncompleteStep(journey),
    );
    if (target && target.path !== currentStep.path) {
      return <Navigate to={target.path} replace />;
    }
  }

  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <JourneyStepper />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-sm border border-border bg-surface p-6 shadow-sm md:p-8">
          <Outlet />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <JourneySummary />
        </div>
      </div>
    </div>
  );
}
