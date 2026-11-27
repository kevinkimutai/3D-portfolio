"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection, scrollToTop } from "../lib/smoothScroll";
import ScrambleText from "./motion/ScrambleText";

type SectionId = "home" | "work" | "logs" | "contact";

const NAV: { id: SectionId; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "work", label: "WORK" },
  { id: "logs", label: "LOGS" },
];

const TRACKED: SectionId[] = ["work", "logs", "contact"];

function goTo(id: SectionId) {
  if (id === "home") scrollToTop();
  else scrollToSection(id);
}

export default function Header() {
  const [active, setActive] = useState<SectionId>("home");
  const [hidden, setHidden] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRefs = useRef<Partial<Record<SectionId, HTMLButtonElement | null>>>({});

  // Scroll progress, hide-on-scroll-down, and active-section tracking
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }

      if (Math.abs(y - lastY) > 4) {
        setHidden(y > 160 && y > lastY);
        lastY = y;
      }

      const probe = window.innerHeight * 0.4;
      let current: SectionId = "home";
      for (const id of TRACKED) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      if (max - y < 4) current = "contact";
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Slide the underline to the active nav item
  useEffect(() => {
    const place = () => {
      const indicator = indicatorRef.current;
      if (!indicator) return;
      const target = navRefs.current[active];
      if (!target) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${target.offsetWidth}px`;
      indicator.style.transform = `translateX(${target.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 py-4 transition-transform duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group flex items-center gap-3"
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined text-[#00d4ff] transition-transform duration-500 group-hover:rotate-[360deg]">
          terminal
        </span>
        <span className="font-mono font-black tracking-tighter text-[#00d4ff] text-xl">
          K<span className="motion-safe:animate-pulse">_</span>
        </span>
      </button>
      <div className="flex items-center gap-6">
        <nav className="relative hidden md:flex gap-8">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              ref={(el) => {
                navRefs.current[id] = el;
              }}
              onClick={() => goTo(id)}
              aria-current={active === id ? "true" : undefined}
              className={`pb-1 font-mono tracking-widest uppercase text-sm transition-colors duration-300 active:scale-95 ${
                active === id ? "text-[#00d4ff]" : "text-slate-500 hover:text-[#00d4ff]"
              }`}
            >
              <ScrambleText text={label} />
            </button>
          ))}
          <span
            ref={indicatorRef}
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff] transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
        </nav>
        <button
          onClick={() => goTo("contact")}
          className={`font-mono tracking-widest uppercase text-sm transition-[color,scale] active:scale-95 ${
            active === "contact" ? "text-white" : "text-[#00d4ff] hover:text-white"
          }`}
        >
          <ScrambleText text="_RESOURCES" />
        </button>
      </div>

      <div
        ref={progressRef}
        aria-hidden
        className="absolute left-0 -bottom-px h-px w-full origin-left bg-[#00d4ff]"
        style={{ transform: "scaleX(0)" }}
      />
    </header>
  );
}
