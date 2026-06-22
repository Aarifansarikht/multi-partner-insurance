# Multi-Partner Insurance Onboarding

A single-page insurance onboarding journey. The same app serves multiple
partners — each with its own brand (colours, logo, name) — and guides a user all
the way from browsing plans to paying and seeing a confirmation.

The browsing pages (home, plan detail) are public; the purchase journey (login →
KYC → personal → nominee → review → payment → result) is protected, resumable
after a refresh, and rebrands instantly when the partner is switched.

---

## Tech stack

| Concern        | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Framework      | React + TypeScript (Vite)                                 |
| Styling        | Tailwind CSS (v3) + shadcn/ui primitives, token-driven    |
| State          | Redux Toolkit                                             |
| Routing        | React Router v7                                           |
| Forms          | react-hook-form + zod                                     |
| Payments       | Razorpay Checkout (test mode), with a simulated fallback  |
| Notifications  | sonner (toasts)                                           |
| Testing        | Vitest + React Testing Library                            |

---

## Getting started

Requirements: Node 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run test     # run the unit/integration tests
```

### Environment / Razorpay test key

The app runs **without any configuration** — if no Razorpay key is present the
payment step uses a built-in **simulated checkout** with explicit
"Simulate success / Simulate failure" buttons, so the full flow (including both
result screens) is walkable out of the box.

To exercise the real Razorpay **test** widget instead:

```bash
cp .env.example .env
# then edit .env:
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

`.env` is git-ignored; only `.env.example` is committed. No secret key is used
anywhere (Checkout only needs the publishable key id).

In Razorpay test mode use card `4111 1111 1111 1111` with any future expiry and
any CVV, or UPI id `success@razorpay`.

---

## Test credentials & how to walk the flow

There is no real backend — login is a mocked mobile + OTP handshake.

1. Open the app, browse plans, open a plan, choose a **cover amount + term** and
   watch the premium update live.
2. Click **Buy now**.
3. **Login** — enter any valid 10-digit Indian mobile (e.g. `9876543210`) → the
   OTP is **`123456`**.
4. After login you land **back in the purchase** (not the home page).
5. Fill **KYC** (try PAN `ABCDE1234F`), **personal details**, **nominee**.
6. **Review** the summary, tick the confirmation, continue to **payment**.
7. Pay (real test widget if a key is set, otherwise simulate success/failure).
8. See the **success** screen (with a reference id) or the **failure** screen
   (with retry).

---

## Architecture & key decisions

### Folder structure (feature-first)

```
src/
  components/        # shared UI: shadcn primitives (ui/), layout, feedback, form
  features/
    plans/           # catalog: data hooks, cards, carousel, detail + configurator
    auth/            # auth slice, login page, ProtectedRoute, user menu
    journey/         # journey slice, step pages, stepper, guard, schemas
    partner/         # partner registry, theme provider, switcher
    theme/           # light/dark slice + toggle
    payment/         # Razorpay integration + (mock) order creation
  store/             # store config, typed hooks, persistence middleware
  mocks/             # mock API layer (plans, auth) shaped like a real backend
  hooks/  lib/  types/
```

Each feature owns its slice, components, hooks and types. Cross-feature sharing
goes through `components/`, `lib/` and `store/`. This keeps related code together
and makes a feature easy to reason about (or delete) in isolation.

### Multi-partner theming (the core architectural piece)

The whole brand is driven by **semantic design tokens**, the same indirection
shadcn/ui uses:

- `tailwind.config.ts` maps semantic colours (`primary`, `surface`, `border`,
  `success`, …) to CSS custom properties via `hsl(var(--token))`.
- Each partner is **one config object** in
  [`features/partner/partners.config.ts`](src/features/partner/partners.config.ts)
  carrying a **light** and **dark** token set.
- A single [`PartnerThemeProvider`](src/features/partner/PartnerThemeProvider.tsx),
  driven by Redux, writes the active partner's tokens onto `document.documentElement`
  and toggles the `dark` class. **Nothing else in the UI knows about partners** —
  every component just uses `bg-primary`, `text-foreground`, etc.
- Light/dark mode is an **independent** toggle (`html.dark`); because each
  partner ships both token sets, the two systems compose without conflict.

**Adding a 4th partner is one object** in that config file — no other change is
needed. Partner selection and theme are persisted, so both survive a reload.

There are **no inline hex/rgb values** in the JSX layer; all colour flows through
tokens so theming propagates app-wide.

### State management & persistence

Separate Redux Toolkit slices: `auth`, `partner`, `theme`, `journey`.

Persistence is a small **custom localStorage middleware**
([`store/persistence.ts`](src/store/persistence.ts)) rather than redux-persist.
It writes a slice only when its reference changes, and slices are rehydrated
synchronously as initial state — so there is no rehydration flash and no
`PersistGate`. Persisted: auth session, partner, theme, and in-progress journey.

### Auth & access control

- Mobile + OTP is mocked ([`mocks/auth.ts`](src/mocks/auth.ts)); the session
  carries an explicit `expiresAt`.
- `ProtectedRoute` redirects logged-out users to `/login?redirect=<intended>`
  and returns them to the exact page after login.
- A persisted-but-expired token is dropped on load and on guard, with a toast,
  routing the user cleanly back to login.
- Logout clears the session **and** any in-progress journey data.

### Mid-journey refresh handling

This was the most interesting requirement to get right:

- The URL always reflects the current step (`/journey/kyc`, `/journey/personal`,
  …), and the plan configurator keeps cover/term in the query string.
- Journey state (selection + entered form data) is persisted, so a refresh
  **restores the exact step with the data already filled in** (forms hydrate
  their defaults from the slice).
- A **step guard** in the journey layout blocks jumping ahead to a step whose
  prerequisites aren't met and redirects to the first incomplete step — so a deep
  link or refresh can never land the user in a broken/half-filled state.
- Starting a **new** purchase (`startJourney`) always resets to a clean slate, and
  finishing one resets it too, so no data leaks between purchases.

### Data layer

All data is mocked in [`src/mocks`](src/mocks) but shaped like a real REST API:
each call returns a Promise, adds randomised latency, supports `AbortSignal`
cancellation, and throws typed errors. The plans search is debounced and uses
that cancellation so a slow earlier response can't overwrite a newer one.
Swapping in a real backend is isolated to the `mocks/` layer.

### Payment (known limitation)

There is no backend, so the Razorpay **order is created client-side**
([`features/payment/orders.ts`](src/features/payment/orders.ts)). In production
the `order_id` and signature verification **must** come from a trusted server
holding the secret key — this is intentionally stubbed and called out here.

---

## Stretch goals included

- ✅ Step guard (no jumping to unfinished steps)
- ✅ Resume journey after refresh (exact step + entered data restored)
- ✅ View state in the URL (current step, plan cover/term, search & filters)
- ✅ Debounced search + filtering with in-flight request cancellation
- ✅ Toasts for key events (login, payment, session expiry)
- ✅ Global error boundary
- ✅ Route-level code splitting (lazy routes + Suspense skeleton)
- ✅ Accessibility — labels/ARIA, keyboard nav, focus moved between steps,
  skip-to-content link, respects OS light/dark preference on first visit
- ✅ Schema-based validation with inline, accessible errors and
  disabled-while-submitting
- ✅ Polished loading — skeletons matching real content, not bare spinners
- ✅ Automated tests for the auth guard, journey step logic and validation

---

## What I'd improve with more time

- **Token refresh / silent re-auth** — the mock session has an `expiresAt` and
  graceful expiry handling, but I didn't wire a real refresh-token round-trip
  (would slot into the `mocks/auth` layer + an Axios interceptor).
- **Server-side order creation** for Razorpay and real signature verification.
- **More tests** — component/interaction tests for the configurator and the full
  happy-path journey, plus partner-theme snapshot coverage.
- **Multiple nominees** with a live total-share validator.
- **i18n** and number/locale abstraction (currently India-localised).

## Knowingly left out

- A real backend / persistence beyond localStorage.
- Real KYC/PAN verification (format-validated only) and an external-redirect KYC.
- Optimistic UI (not meaningful without a write backend here).
