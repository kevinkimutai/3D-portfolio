"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SCRAMBLE_CHARS,
  prefersReducedMotion,
} from "../../lib/motion";

type ScrambleTextProps = {
  text: string;
  className?: string;
  // Scramble when the nearest link/button (or the text itself) is hovered
  hover?: boolean;
  // Scramble once when the text scrolls into view
  revealOnScroll?: boolean;
};

// Text must stay constant for a given instance — remount with a new `key`
// to change it, since GSAP owns the text node once it has scrambled.
export default function ScrambleText({
  text,
  className,
  hover = true,
  revealOnScroll = false,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const scramble = () =>
      gsap.to(el, {
        duration: 0.7,
        overwrite: true,
        scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.5 },
      });

    const cleanups: (() => void)[] = [];

    if (hover) {
      const target = el.closest("a, button") ?? el;
      target.addEventListener("mouseenter", scramble);
      cleanups.push(() => target.removeEventListener("mouseenter", scramble));
    }

    if (revealOnScroll) {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: scramble,
      });
      cleanups.push(() => trigger.kill());
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(el);
      el.textContent = text;
    };
  }, [text, hover, revealOnScroll]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
