"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import * as THREE from "three";
import HeroScene from "./HeroScene";
import { scrollToSection } from "../lib/smoothScroll";

const NAME = "KEVIN KIMUTAI";
const TITLE = "SYSTEM'S ENGINEER";

export default function HeroSection() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

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

    // Act 5 — bottom-left decoration
    tl.fromTo(
      decorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1.6
    );

    return () => { tl.kill(); };
  }, [sceneReady]);

  return (
    <section className="relative min-h-[707px] flex flex-col items-center justify-center px-6 overflow-hidden">
      <HeroScene meshRef={meshRef} onReady={handleSceneReady} />

      <div className="absolute inset-0 bg-mesh opacity-40 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f] z-[1] pointer-events-none" />

      <div className="relative z-10 text-center space-y-6">
        <h1 className="font-headline-lg text-6xl md:text-8xl tracking-tighter text-white font-extrabold uppercase overflow-hidden">
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
          <button
            onClick={() => scrollToSection("work")}
            className="border border-[#00d4ff] text-[#00d4ff] px-8 py-3 font-label-mono tracking-widest hover:bg-[#00d4ff]/10 transition-colors uppercase"
          >
            [VIEW_WORK]
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="border border-white/10 text-white px-8 py-3 font-label-mono tracking-widest hover:bg-white/5 transition-colors uppercase"
          >
            [GET_IN_TOUCH]
          </button>
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
    </section>
  );
}
