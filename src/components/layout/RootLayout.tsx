import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ScrollToTop } from "./ScrollToTop";

/** Top-level chrome: header, routed content, footer. */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScrollToTop />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
