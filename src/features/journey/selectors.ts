import { useAppSelector } from "@/store/hooks";
import { stepCompletion } from "./progress";

/** Convenience accessor for journey state plus derived step completion. */
export function useJourney() {
  const journey = useAppSelector((s) => s.journey);
  return { ...journey, completion: stepCompletion(journey) };
}
