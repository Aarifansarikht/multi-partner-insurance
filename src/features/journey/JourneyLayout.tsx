import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ROUTES } from "@/lib/routes";
import { useJourney } from "@/features/journey/selectors";
import { JourneyStepper } from "./components/JourneyStepper";
import { JourneySummary } from "./components/JourneySummary";

/**
 * Frame shared by every journey step: progress stepper, the routed step form,
 * and a persistent selection summary. If there is no active selection (e.g. a
 * user deep-links into a step without starting a purchase) we guide them back to
 * the catalog rather than render a broken, empty journey.
 */
export function JourneyLayout() {
  const { selection } = useJourney();

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
