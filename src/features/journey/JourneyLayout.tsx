import { Outlet } from "react-router-dom";

/**
 * Layout shared by every step of the onboarding journey. The progress stepper
 * and step-guard logic are introduced once the journey state slice exists; for
 * now it simply frames the routed step.
 */
export function JourneyLayout() {
  return (
    <div className="container max-w-3xl py-8 md:py-12">
      <Outlet />
    </div>
  );
}
