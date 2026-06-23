import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { readPersisted } from "@/store/persistence";

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
}


export function getInitialThemeState(): ThemeState {
  const persisted = readPersisted<ThemeState>("theme");
  if (persisted?.mode === "light" || persisted?.mode === "dark") {
    return { mode: persisted.mode };
  }
  // Default to light when nothing is persisted.
  return { mode: "light" };
}

const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialThemeState(),
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
