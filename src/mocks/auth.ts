/**
 * Mocked mobile + OTP authentication.
 *
 * No backend is wired in, so this simulates the two-call OTP handshake a real
 * provider would expose. The session carries an explicit `expiresAt` so the app
 * can demonstrate genuine expired-session handling. Swapping in a real auth API
 * (e.g. DummyJSON) means replacing only this file.
 *
 * Demo OTP: any mobile, code 123456.
 */

export interface AuthUser {
  id: string;
  mobile: string;
}

export interface Session {
  token: string;
  user: AuthUser;
  /** Epoch millis after which the token is no longer valid. */
  expiresAt: number;
}

/** Session lifetime — 1 hour. Tune lower to exercise expiry handling. */
export const SESSION_TTL_MS = 60 * 60 * 1000;

export const DEMO_OTP = "123456";

class AuthError extends Error {}

function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestOtp(mobile: string): Promise<{ sent: true }> {
  await delay();
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new AuthError("Enter a valid 10-digit mobile number.");
  }
  return { sent: true };
}

export async function verifyOtp(
  mobile: string,
  otp: string,
): Promise<Session> {
  await delay();
  if (otp !== DEMO_OTP) {
    throw new AuthError("Incorrect OTP. Please try again.");
  }
  return {
    token: `mock.${btoa(mobile)}.${Math.random().toString(36).slice(2)}`,
    user: { id: `usr_${mobile}`, mobile },
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}
