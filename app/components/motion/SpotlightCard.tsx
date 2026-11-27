"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/motion";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

const MAX_TILT = 6;

// Card that tilts toward the cursor with a glow tracking the pointer.
// Expects `group` and `relative` in className; content should be `relative`
// so it sits above the glow.
export default function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;

    gsap.set(el, { transformPerspective: 900 });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      rotY((px - 0.5) * MAX_TILT * 2);
      rotX((0.5 - py) * MAX_TILT * 2);
    };
    const leave = () => {
      rotX(0);
      rotY(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(0, 212, 255, 0.12), transparent 45%)",
        }}
      />
      {children}
    </div>
  );
}
