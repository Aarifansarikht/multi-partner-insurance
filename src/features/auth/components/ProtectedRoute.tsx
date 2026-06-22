import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/selectors";
import { clearSession } from "@/features/auth/authSlice";
import { ROUTES } from "@/lib/routes";

/**
 * Gate for the purchase journey.
 *
 * - Logged-out users are redirected to /login with a `redirect` param so they
 *   return to the exact page they were trying to reach after authenticating.
 * - A token that exists but has expired is cleaned up here (state + storage)
 *   before redirecting, so an invalid session never lingers.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const hasToken = useAppSelector((s) => !!s.auth.token);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (hasToken && !isAuthenticated) dispatch(clearSession());
  }, [hasToken, isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
