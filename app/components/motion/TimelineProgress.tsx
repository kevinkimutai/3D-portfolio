"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/motion";

// Bright line that fills its positioned parent's left border as you scroll.
export default function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.parentElement) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { scaleY: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute -left-px top-0 h-full w-px origin-top scale-y-0 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"
    />
  );
}
