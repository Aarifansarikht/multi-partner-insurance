/** Read a CSS custom property (a hex colour) off the document root. */
export function readTokenAsHex(token: string, fallback = "#2647c9"): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || fallback;
}
