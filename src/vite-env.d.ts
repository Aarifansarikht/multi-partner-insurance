/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Razorpay publishable test key (rzp_test_...). Optional — falls back to a
   *  simulated checkout when absent. */
  readonly VITE_RAZORPAY_KEY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
