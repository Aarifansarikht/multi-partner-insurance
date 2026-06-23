import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/selectors";
import { clearSession } from "@/features/auth/authSlice";
import { ROUTES } from "@/lib/routes";


export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const hasToken = useAppSelector((s) => !!s.auth.token);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (hasToken && !isAuthenticated) {
      dispatch(clearSession());
      toast.error("Your session expired. Please log in again.");
    }
  }, [hasToken, isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
