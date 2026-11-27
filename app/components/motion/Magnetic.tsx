"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/motion";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

// Pulls its child toward the cursor while hovered, springs back on leave.
export default function Magnetic({
  children,
  className = "inline-block",
  strength = 0.3,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    // Measured on enter so the element's own movement doesn't skew the maths
    let rect = el.getBoundingClientRect();

    const enter = () => {
      rect = el.getBoundingClientRect();
    };
    const move = (e: PointerEvent) => {
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
