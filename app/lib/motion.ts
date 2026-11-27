import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

export { gsap, ScrollTrigger };

export const SCRAMBLE_CHARS = "ABCDEF0123456789_/<>#";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Mouse/trackpad only — skips pointer-follow effects on touch screens
export function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
