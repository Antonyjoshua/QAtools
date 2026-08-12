"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after the component has mounted on the client — avoids SSR/CSR mismatch without setState-in-effect. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
