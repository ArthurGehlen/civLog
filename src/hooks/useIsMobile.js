import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 709) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const window_width = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(window_width.matches);

    const handler = (e) => setIsMobile(e.matches);
    window_width.addEventListener("change", handler);
    return () => window_width.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
