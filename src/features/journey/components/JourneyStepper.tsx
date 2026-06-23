import { Link, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { JOURNEY_STEPS } from "@/lib/routes";
import { useJourney } from "@/features/journey/selectors";
import { isStepUnlocked } from "@/features/journey/progress";
import { cn } from "@/lib/utils";


export function JourneyStepper() {
  const { pathname } = useLocation();
  const journey = useJourney();

  const currentIndex = Math.max(
    0,
    JOURNEY_STEPS.findIndex((s) => pathname.startsWith(s.path)),
  );
  const current = JOURNEY_STEPS[currentIndex];

  return (
    <nav aria-label="Onboarding progress" className="mb-8">
      {/* Mobile: compact label + progress bar */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium">{current.label}</p>
          <p className="text-xs text-muted-foreground">
            Step {currentIndex + 1} of {JOURNEY_STEPS.length}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / JOURNEY_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden items-center md:flex">
        {JOURNEY_STEPS.map((step, i) => {
          const isDone = journey.completion[step.id];
          const isCurrent = i === currentIndex;
          const unlocked = isStepUnlocked(journey, step.id);
          const clickable = (isDone || unlocked) && !isCurrent;

          const circle = (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                isCurrent && "border-primary bg-primary text-primary-foreground",
                !isCurrent &&
                  isDone &&
                  "border-success bg-success-soft text-success",
                !isCurrent &&
                  !isDone &&
                  "border-border bg-surface text-muted-foreground",
              )}
            >
              {isDone && !isCurrent ? <Check className="size-4" /> : i + 1}
            </span>
          );

          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2.5">
                {clickable ? (
                  <Link
                    to={step.path}
                    className="flex items-center gap-2.5 rounded-sm"
                  >
                    {circle}
                    <span className="text-sm font-medium">{step.label}</span>
                  </Link>
                ) : (
                  <>
                    {circle}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </>
                )}
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    isDone ? "bg-success" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
