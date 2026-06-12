import { useState, useEffect } from "react";

export interface WindowSize {
  width: number;
  height: number;
  /** < 640px */
  isXSmall: boolean;
  /** 640–767px */
  isSmall: boolean;
  /** 768–1023px */
  isMedium: boolean;
  /** ≥ 1024px */
  isLarge: boolean;
  /** < 768px — phone/tablet portrait */
  isMobile: boolean;
  /** ≥ 1024px — desktop/laptop */
  isDesktop: boolean;
  /** Pixel density */
  devicePixelRatio: number;
}

function compute(): WindowSize {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    width: w,
    height: h,
    isXSmall: w < 640,
    isSmall: w >= 640 && w < 768,
    isMedium: w >= 768 && w < 1024,
    isLarge: w >= 1024,
    isMobile: w < 768,
    isDesktop: w >= 1024,
    devicePixelRatio: window.devicePixelRatio ?? 1,
  };
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(compute);

  useEffect(() => {
    const handler = () => setSize(compute());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}
