"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../../lib/motion";

const INTERACTIVE = "a, button, [role='button'], [data-cursor='hover']";

// Dot + trailing ring that swells over clickable elements. Mouse only.
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring || prefersReducedMotion() || !hasFinePointer()) return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        // Jump straight to the pointer instead of flying in from the corner
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to(root, { opacity: 1, duration: 0.2 });
        visible = true;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      const overInteractive = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (root.dataset.state !== "down") {
        root.dataset.state = overInteractive ? "hover" : "idle";
      }
    };
    const hide = () => {
      gsap.to(root, { opacity: 0, duration: 0.2 });
      visible = false;
    };
    const down = () => {
      root.dataset.state = "down";
    };
    const up = () => {
      root.dataset.state = "idle";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    html.addEventListener("mouseleave", hide);
    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-state="idle"
      className="group pointer-events-none fixed inset-0 z-[100] opacity-0"
    >
      <div ref={ringRef} className="absolute top-0 left-0">
        <div className="-translate-x-1/2 -translate-y-1/2 w-9 h-9 border border-[#00d4ff]/60 transition-[scale,background-color,border-color] duration-300 ease-out group-data-[state=hover]:scale-[1.8] group-data-[state=hover]:bg-[#00d4ff]/10 group-data-[state=hover]:border-[#00d4ff] group-data-[state=down]:scale-75" />
      </div>
      <div ref={dotRef} className="absolute top-0 left-0">
        <div className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff] transition-[scale] duration-200 group-data-[state=hover]:scale-0" />
      </div>
    </div>
  );
}
