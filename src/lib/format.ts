/** Formatting helpers, India-localised (₹, lakh/crore grouping). */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Full rupee amount, e.g. ₹12,500. */
export function formatCurrency(amount: number): string {
  return inr.format(Math.round(amount));
}

/** Compact cover amount, e.g. ₹50 L, ₹1.5 Cr. */
export function formatCompactCover(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${trim(cr)} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${trim(l)} L`;
  }
  return formatCurrency(amount);
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}
