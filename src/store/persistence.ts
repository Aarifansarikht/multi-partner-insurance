import type { Middleware } from "@reduxjs/toolkit";

/**
 * Lightweight localStorage persistence.
 *
 * Chosen over redux-persist deliberately: the app only needs to persist a few
 * specific slices (partner, theme, auth, in-progress journey), and a small
 * typed middleware keeps full control over exactly what is written, avoids
 * rehydration race conditions, and has zero extra dependencies. State is read
 * back synchronously as `preloadedState` at store creation, so there is no
 * loading flash and no PersistGate wrapper.
 */
const PREFIX = "mpi:";

export function readPersisted<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function writePersisted(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function removePersisted(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export interface PersistSpec<RootState> {
  key: string;
  /** Selects the slice (or projection) to persist. */
  select: (state: RootState) => unknown;
}

/**
 * Persists each spec's selected value whenever its reference changes. Relies on
 * Redux Toolkit returning a new reference only when a slice actually updates, so
 * writes are cheap and skipped when nothing relevant changed.
 */
export function createPersistMiddleware<RootState>(
  specs: PersistSpec<RootState>[],
): Middleware {
  const last = new Map<string, unknown>();
  return (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as RootState;
    for (const spec of specs) {
      const value = spec.select(state);
      if (last.get(spec.key) !== value) {
        last.set(spec.key, value);
        writePersisted(spec.key, value);
      }
    }
    return result;
  };
}
