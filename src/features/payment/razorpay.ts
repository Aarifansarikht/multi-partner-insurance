/**
 * Razorpay Checkout integration (test/sandbox mode).
 *
 * The checkout script is loaded on demand the first time payment is attempted.
 * The publishable key is read from VITE_RAZORPAY_KEY_ID; no secret key is used
 * or committed. Because there is no backend, the order is created client-side
 * (see orders.ts) — in production the order_id MUST come from a server, which is
 * called out as a known limitation in the README.
 */

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description?: string;
  order_id?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (response: unknown) => void) => void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
export const isRazorpayConfigured = Boolean(razorpayKey);

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  if (!window.Razorpay) throw new Error("Razorpay SDK not loaded");
  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", () => {
    /* surfaced via the page-level failure handling */
  });
  rzp.open();
}
