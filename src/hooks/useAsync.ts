import { useCallback, useEffect, useRef, useState } from "react";
import { AbortError } from "@/mocks/api";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  /** Re-run the async function (e.g. from a "Try again" button). */
  refetch: () => void;
}


export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList,
): AsyncState<T> {
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  // Keep the latest fn without forcing it into the dependency array.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fnRef
      .current(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || err instanceof AbortError) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("error");
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { status, data, error, refetch };
}
