import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store";
import { PartnerThemeProvider } from "@/features/partner/PartnerThemeProvider";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PartnerThemeProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </PartnerThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
