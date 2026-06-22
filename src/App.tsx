import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { NotFound } from "@/components/NotFound";
import { RouteFallback } from "@/components/feedback/RouteFallback";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { JourneyLayout } from "@/features/journey/JourneyLayout";

// Route-level code splitting: each page is its own chunk, loaded on demand.
const PlansPage = lazy(() => import("@/features/plans/pages/PlansPage"));
const PlanDetailPage = lazy(
  () => import("@/features/plans/pages/PlanDetailPage"),
);
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const KycPage = lazy(() => import("@/features/journey/pages/KycPage"));
const PersonalDetailsPage = lazy(
  () => import("@/features/journey/pages/PersonalDetailsPage"),
);
const NomineePage = lazy(() => import("@/features/journey/pages/NomineePage"));
const ReviewPage = lazy(() => import("@/features/journey/pages/ReviewPage"));
const PaymentPage = lazy(() => import("@/features/journey/pages/PaymentPage"));
const ResultPage = lazy(() => import("@/features/journey/pages/ResultPage"));

/**
 * Route tree.
 *
 * - `/` and `/plans/:planId` are public browsing pages.
 * - `/login` is the entry to the protected flow.
 * - `/journey/*` (kyc -> payment) is gated by ProtectedRoute and shares the
 *   stepper layout + step guard.
 * - `/journey/result` is protected but sits outside the stepper layout so the
 *   success/failure screen renders full-width.
 */
function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          element={
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          }
        >
          <Route index element={<PlansPage />} />
          <Route path="plans/:planId" element={<PlanDetailPage />} />
          <Route path="login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="journey" element={<JourneyLayout />}>
              <Route index element={<Navigate to="kyc" replace />} />
              <Route path="kyc" element={<KycPage />} />
              <Route path="personal" element={<PersonalDetailsPage />} />
              <Route path="nominee" element={<NomineePage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="payment" element={<PaymentPage />} />
            </Route>
            <Route path="journey/result" element={<ResultPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
