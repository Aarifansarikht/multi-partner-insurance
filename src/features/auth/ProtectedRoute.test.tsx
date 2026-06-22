import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import partnerReducer from "@/features/partner/partnerSlice";
import themeReducer from "@/features/theme/themeSlice";
import authReducer, { setSession } from "@/features/auth/authSlice";
import journeyReducer from "@/features/journey/journeySlice";
import { ProtectedRoute } from "./components/ProtectedRoute";

function makeStore() {
  return configureStore({
    reducer: {
      partner: partnerReducer,
      theme: themeReducer,
      auth: authReducer,
      journey: journeyReducer,
    },
  });
}

function renderAt(store: ReturnType<typeof makeStore>) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/journey/kyc"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/journey/kyc" element={<div>KYC step</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => localStorage.clear());

  it("redirects a logged-out user to login", () => {
    renderAt(makeStore());
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("KYC step")).not.toBeInTheDocument();
  });

  it("renders the protected page for an authenticated user", () => {
    const store = makeStore();
    store.dispatch(
      setSession({
        token: "tok",
        user: { id: "u1", mobile: "9876543210" },
        expiresAt: Date.now() + 60_000,
      }),
    );
    renderAt(store);
    expect(screen.getByText("KYC step")).toBeInTheDocument();
  });

  it("treats an expired session as logged out", () => {
    const store = makeStore();
    store.dispatch(
      setSession({
        token: "tok",
        user: { id: "u1", mobile: "9876543210" },
        expiresAt: Date.now() - 1_000,
      }),
    );
    renderAt(store);
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
});
