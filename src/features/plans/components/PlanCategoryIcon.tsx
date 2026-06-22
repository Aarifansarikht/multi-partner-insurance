import {
  Car,
  HeartPulse,
  Home,
  Plane,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { PlanCategory } from "@/types/plan";
import { cn } from "@/lib/utils";

const ICONS: Record<PlanCategory, LucideIcon> = {
  "Term Life": ShieldCheck,
  Health: HeartPulse,
  Motor: Car,
  Travel: Plane,
  Home: Home,
};

export function PlanCategoryIcon({
  category,
  className,
}: {
  category: PlanCategory;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={cn("size-5", className)} aria-hidden />;
}
