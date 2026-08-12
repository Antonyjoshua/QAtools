"use client";

import * as React from "react";
import { animate } from "framer-motion";

export function AnimatedNumber({
  value,
  duration = 0.8,
  formatter,
}: {
  value: number;
  duration?: number;
  formatter?: (v: number) => string;
}) {
  const [display, setDisplay] = React.useState(0);
  const ref = React.useRef(0);

  React.useEffect(() => {
    const controls = animate(ref.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        ref.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return <>{formatter ? formatter(display) : Math.round(display)}</>;
}
