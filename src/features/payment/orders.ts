/**
 * Client-side order creation stub.
 *
 * In a real integration the order is created by a trusted backend that holds the
 * Razorpay secret and returns an `order_id`; the client must never do this.
 * Since this assignment has no backend, we simulate it here and treat it as a
 * documented limitation (see README). The generated id is used only to label the
 * transaction in the UI.
 */
export interface MockOrder {
  orderId: string;
  amount: number; // paise
  currency: "INR";
}

export function createOrder(amountInRupees: number): Promise<MockOrder> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `order_${Math.random().toString(36).slice(2, 12)}`;
      resolve({ orderId: id, amount: Math.round(amountInRupees * 100), currency: "INR" });
    }, 500);
  });
}

/** Generate a policy/payment reference id for the result screen. */
export function generateReferenceId(prefix = "PAY"): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return `${prefix}-${stamp}-${rand}`;
}
