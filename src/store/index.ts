import { configureStore } from "@reduxjs/toolkit";
import partnerReducer from "@/features/partner/partnerSlice";
import themeReducer from "@/features/theme/themeSlice";
import authReducer from "@/features/auth/authSlice";
import journeyReducer from "@/features/journey/journeySlice";
import { createPersistMiddleware, type PersistSpec } from "./persistence";

const rootReducer = {
  partner: partnerReducer,
  theme: themeReducer,
  auth: authReducer,
  journey: journeyReducer,
};

// Pre-derive the type so persistence specs are fully typed against the store.
export type RootState = {
  [K in keyof typeof rootReducer]: ReturnType<(typeof rootReducer)[K]>;
};

/**
 * Slices to mirror into localStorage. Each new persisted feature adds one entry
 * here — the middleware writes a slice only when its reference changes.
 */
const persistSpecs: PersistSpec<RootState>[] = [
  { key: "partner", select: (s) => s.partner },
  { key: "theme", select: (s) => s.theme },
  { key: "auth", select: (s) => s.auth },
];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().concat(createPersistMiddleware(persistSpecs)),
});

export type AppDispatch = typeof store.dispatch;
