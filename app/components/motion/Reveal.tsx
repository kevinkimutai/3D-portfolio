"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  x?: number;
};

// Fades/slides in `[data-reveal]` descendants (or direct children if none are
// marked) when the block scrolls into view. `[data-reveal-line]` elements draw
// in horizontally.
export default function Reveal({
  children,
  className,
  stagger = 0.1,
  y = 28,
  x = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const marked = root.querySelectorAll("[data-reveal]");
      const items = marked.length ? Array.from(marked) : Array.from(root.children);
      const lines = root.querySelectorAll("[data-reveal-line]");
      const scrollTrigger = { trigger: root, start: "top 85%", once: true };

      if (items.length) {
        gsap.from(items, {
          y,
          x,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          clearProps: "opacity",
          scrollTrigger,
        });
      }

      if (lines.length) {
        gsap.from(lines, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [stagger, y, x]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
