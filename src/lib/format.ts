

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});


export function formatCurrency(amount: number): string {
  return inr.format(Math.round(amount));
}


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
