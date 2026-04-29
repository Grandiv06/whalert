"use client";

import { useEffect, useState } from "react";

export default function useDevice(): "mobile" | "desktop" {
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const check = () =>
      setDevice(window.innerWidth < 768 ? "mobile" : "desktop");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return device;
}
