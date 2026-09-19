"use client";

import * as React from "react";
import { getBrowserTimezone } from "../timezone";

/** A ticking "now", plus the detected browser timezone — the live-clock backbone for World Clock and the converter. */
export function useTimezone() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const browserTimezone = React.useMemo(() => getBrowserTimezone(), []);

  return { now, browserTimezone };
}
