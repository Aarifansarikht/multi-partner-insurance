import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { NotFound } from "@/components/NotFound";
import { JourneyLayout } from "@/features/journey/JourneyLayout";
import PlansPage from "@/features/plans/pages/PlansPage";
import PlanDetailPage from "@/features/plans/pages/PlanDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import KycPage from "@/features/journey/pages/KycPage";
import PersonalDetailsPage from "@/features/journey/pages/PersonalDetailsPage";
import NomineePage from "@/features/journey/pages/NomineePage";
import ReviewPage from "@/features/journey/pages/ReviewPage";
import PaymentPage from "@/features/journey/pages/PaymentPage";
import ResultPage from "@/features/journey/pages/ResultPage";

/**
 * Route tree.
 *
 * - `/` and `/plans/:planId` are public browsing pages.
 * - `/login` is the entry to the protected flow.
 * - `/journey/*` (kyc -> payment) shares the stepper layout; access control and
 *   the step guard are layered onto these routes in later milestones.
 * - `/journey/result` deliberately sits outside the stepper layout so the
 *   success/failure screen renders full-width without a progress bar.
 */
function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<PlansPage />} />
        <Route path="plans/:planId" element={<PlanDetailPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route path="journey" element={<JourneyLayout />}>
          <Route index element={<Navigate to="kyc" replace />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="personal" element={<PersonalDetailsPage />} />
          <Route path="nominee" element={<NomineePage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
        <Route path="journey/result" element={<ResultPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
