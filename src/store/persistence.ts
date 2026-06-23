import type { Middleware } from "@reduxjs/toolkit";


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

export interface PersistSpec<RootState> {
  key: string;

  select: (state: RootState) => unknown;
}


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
