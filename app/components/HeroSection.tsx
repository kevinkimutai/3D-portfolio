"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import * as THREE from "three";
import HeroScene from "./HeroScene";
import { scrollToSection } from "../lib/smoothScroll";
import { hasFinePointer, prefersReducedMotion } from "../lib/motion";
import Magnetic from "./motion/Magnetic";
import ScrambleText from "./motion/ScrambleText";

const NAME = "KEVIN KIMUTAI";
const TITLE = "SYSTEM'S ENGINEER";

export default function HeroSection() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const meshBgRef = useRef<HTMLDivElement>(null);
  // Letter hover only kicks in once the intro stagger has finished
  const introDoneRef = useRef(false);

  // Flipped to true by TorusKnotMesh's useEffect — guarantees meshRef.current is set
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    if (!sceneReady) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Act 1 — TorusKnot scales in from 0
    tl.to(
      meshRef.current!.scale,
      { x: 1, y: 1, z: 1, duration: 1.4, ease: "elastic.out(1, 0.6)" },
      0
    );

    // Act 2 — name letters stagger up
    tl.fromTo(
      lettersRef.current.filter(Boolean),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.04 },
      0.5
    );

    // Act 3 — subtitle fades in
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      1.1
    );

    // Act 4 — buttons slide up
    tl.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.4
    );

    // Act 5 — bottom-left decoration + scroll cue
    tl.fromTo(
      [decorRef.current, cueRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1.6
    );

    tl.eventCallback("onComplete", () => {
      introDoneRef.current = true;
    });

    return () => { tl.kill(); };
  }, [sceneReady]);

  // Hero content drifts up and fades as you scroll past it
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.to(contentRef.current, {
      y: -120,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // Heading and background glow shift with the pointer for a sense of depth
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || !hasFinePointer()) return;

    const headX = gsap.quickTo(headingRef.current, "x", { duration: 1, ease: "power3.out" });
    const headY = gsap.quickTo(headingRef.current, "y", { duration: 1, ease: "power3.out" });
    const bgX = gsap.quickTo(meshBgRef.current, "x", { duration: 1.4, ease: "power3.out" });
    const bgY = gsap.quickTo(meshBgRef.current, "y", { duration: 1.4, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      headX(nx * 24);
      headY(ny * 14);
      bgX(nx * -60);
      bgY(ny * -40);
    };
    const leave = () => {
      headX(0);
      headY(0);
      bgX(0);
      bgY(0);
    };

    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
    };
  }, []);

  const bounceLetter = (el: HTMLSpanElement | null) => {
    if (!el || !introDoneRef.current || prefersReducedMotion()) return;
    gsap
      .timeline()
      .to(el, { y: -8, color: "#00d4ff", duration: 0.15, ease: "power2.out", overwrite: "auto" })
      .to(el, { y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" })
      .to(el, { color: "#ffffff", duration: 0.8, clearProps: "color" }, "<");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[707px] flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <HeroScene meshRef={meshRef} onReady={handleSceneReady} />

      <div
        ref={meshBgRef}
        className="absolute -inset-16 bg-mesh opacity-40 z-0 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f] z-[1] pointer-events-none" />

      <div ref={contentRef} className="relative z-10 text-center space-y-6">
        <h1
          ref={headingRef}
          className="font-headline-lg text-6xl md:text-8xl tracking-tighter text-white font-extrabold uppercase overflow-hidden">
          {NAME.split(" ").map((word, wordIndex, words) => {
            const offset = words
              .slice(0, wordIndex)
              .reduce((sum, w) => sum + w.length + 1, 0);
            return (
              <span
                key={wordIndex}
                className={`inline-block whitespace-nowrap ${
                  wordIndex < words.length - 1 ? "mr-[0.25em]" : ""
                }`}
              >
                {word.split("").map((char, j) => {
                  const i = offset + j;
                  return (
                    <span
                      key={i}
                      ref={(el) => { lettersRef.current[i] = el; }}
                      onMouseEnter={(e) => bounceLetter(e.currentTarget)}
                      className="inline-block"
                      style={{ opacity: 0 }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h1>

        <p
          ref={subtitleRef}
          className="font-body-lg text-slate-400 tracking-[0.2em] text-sm md:text-lg"
          style={{ opacity: 0 }}
        >
          {TITLE}
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col md:flex-row gap-4 pt-8 justify-center"
          style={{ opacity: 0 }}
        >
          <Magnetic className="block">
            <button
              onClick={() => scrollToSection("work")}
              className="w-full md:w-auto border border-[#00d4ff] text-[#00d4ff] px-8 py-3 font-label-mono tracking-widest hover:bg-[#00d4ff]/10 hover:shadow-[0_0_24px_rgba(0,212,255,0.35)] transition-[background-color,box-shadow,scale] duration-300 active:scale-95 uppercase"
            >
              <ScrambleText text="[VIEW_WORK]" />
            </button>
          </Magnetic>
          <Magnetic className="block">
            <button
              onClick={() => scrollToSection("contact")}
              className="w-full md:w-auto border border-white/10 text-white px-8 py-3 font-label-mono tracking-widest hover:bg-white/5 hover:border-white/40 transition-[background-color,border-color,scale] duration-300 active:scale-95 uppercase"
            >
              <ScrambleText text="[GET_IN_TOUCH]" />
            </button>
          </Magnetic>
        </div>
      </div>

      <div
        ref={decorRef}
        className="absolute bottom-10 left-10 hidden md:block"
        style={{ opacity: 0 }}
      >
        <div className="font-code-sm text-slate-600 space-y-1">
          <p>LATENCY_TARGET: &lt; 20MS</p>
          <p>UPTIME_SLA: 99.99%</p>
          <p>REGION: US-EAST-1</p>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="font-code-sm text-[10px] text-slate-500 tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10">
          <div className="absolute inset-0 bg-[#00d4ff] motion-safe:animate-scroll-cue" />
        </div>
      </div>
    </section>
  );
}
