import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const HEADER_OFFSET = 72;

export function scrollToSection(id: string) {
  gsap.to(window, {
    duration: 1.2,
    ease: "power2.inOut",
    scrollTo: { y: `#${id}`, offsetY: HEADER_OFFSET },
  });
}

export function scrollToTop() {
  gsap.to(window, {
    duration: 1.2,
    ease: "power2.inOut",
    scrollTo: { y: 0 },
  });
}
