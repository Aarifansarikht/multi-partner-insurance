import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "./authSlice";

export function useAuth() {
  const auth = useAppSelector((s) => s.auth);
  return {
    user: auth.user,
    expiresAt: auth.expiresAt,
    isAuthenticated: selectIsAuthenticated(auth),
  };
}
