import { useEffect, useRef, useState } from "react";
import { ApiError } from "../lib/apiClient";

export type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

/**
 * Runs `fetcher` on mount (and whenever `deps` changes), tracking
 * loading/success/error so every list/detail view handles the same states
 * consistently instead of re-deriving loading/error booleans per
 * component. Deliberately has no "empty" state of its own — a successful
 * response with zero items is still `status: "success"` with `data: []`;
 * each component decides what "no results" looks like for its own content.
 *
 * A request in flight is aborted if the component unmounts or `deps`
 * changes again before it resolves, so a stale response can never
 * overwrite a newer one.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setState({ status: "loading" });

    fetcher()
      .then((data) => {
        if (requestIdRef.current === requestId) {
          setState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current === requestId) {
          const apiError =
            error instanceof ApiError
              ? error
              : new ApiError("Something went wrong. Please try again.", "server");
          setState({ status: "error", error: apiError });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
