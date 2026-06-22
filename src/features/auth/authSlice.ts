import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@/mocks/auth";
import { readPersisted } from "@/store/persistence";

export interface AuthState {
  token: string | null;
  user: Session["user"] | null;
  expiresAt: number | null;
}

const EMPTY: AuthState = { token: null, user: null, expiresAt: null };

/**
 * Rehydrate the session from storage. A persisted-but-expired token is dropped
 * here, so a stale session never survives a refresh — the user simply starts
 * logged out.
 */
export function getInitialAuthState(): AuthState {
  const persisted = readPersisted<AuthState>("auth");
  if (!persisted?.token) return EMPTY;
  if (persisted.expiresAt && persisted.expiresAt <= Date.now()) return EMPTY;
  return persisted;
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.expiresAt = action.payload.expiresAt;
    },
    clearSession() {
      return EMPTY;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

/** True when a non-expired token is present. */
export const selectIsAuthenticated = (auth: AuthState): boolean =>
  !!auth.token && (!auth.expiresAt || auth.expiresAt > Date.now());
