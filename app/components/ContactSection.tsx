"use client";

import { useEffect, useRef, useState } from "react";
import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import ScrambleText from "./motion/ScrambleText";

type ContactLink = {
  icon: string;
  label: string;
  href: string;
};

const EMAIL = "kevinkimutai62@gmail.com";

const links: ContactLink[] = [
  { icon: "code", label: "GITHUB", href: "https://github.com/kevinkimutai" },
  {
    icon: "link",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/kevin-kimutai-95aab016b/",
  },
  { icon: "mail", label: "EMAIL", href: `mailto:${EMAIL}` },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetRef.current), []);

  // Email copies to the clipboard; falls back to the mail client if that fails
  const copyEmail = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="max-w-5xl mx-auto px-8 py-32 text-center">
      <Reveal className="flex items-center gap-4 justify-center mb-16">
        <div data-reveal-line className="h-[1px] w-12 bg-white/10"></div>
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          <ScrambleText text="> CALL:STACK" hover={false} revealOnScroll />
        </span>
        <div data-reveal-line className="h-[1px] w-12 bg-white/10"></div>
      </Reveal>

      <Reveal className="flex justify-center gap-12" stagger={0.12}>
        {links.map(({ icon, label, href }) => {
          const isEmail = label === "EMAIL";
          const showCopied = isEmail && copied;
          return (
            <Magnetic key={label} strength={0.4}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={isEmail ? copyEmail : undefined}
                title={isEmail ? `Copy ${EMAIL}` : undefined}
                className="group flex flex-col items-center gap-4 active:scale-95 transition-[scale]"
              >
                <div
                  className={`w-16 h-16 rounded-none border flex items-center justify-center transition-all duration-300 group-hover:border-[#00d4ff] group-hover:shadow-[0_0_24px_rgba(0,212,255,0.35)] group-hover:-translate-y-1 ${
                    showCopied ? "border-[#00d4ff] bg-[#00d4ff]/10" : "border-white/10"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-[color,rotate] duration-300 group-hover:text-[#00d4ff] group-hover:-rotate-12 ${
                      showCopied ? "text-[#00d4ff]" : "text-slate-400"
                    }`}
                  >
                    {showCopied ? "check" : icon}
                  </span>
                </div>
                <span
                  className={`font-label-mono text-[10px] uppercase tracking-widest group-hover:text-white transition-colors ${
                    showCopied ? "text-[#00d4ff]" : "text-slate-600"
                  }`}
                >
                  <ScrambleText
                    key={showCopied ? "copied" : "label"}
                    text={showCopied ? "COPIED" : label}
                    revealOnScroll={showCopied}
                  />
                </span>
              </a>
            </Magnetic>
          );
        })}
      </Reveal>

      <p aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </p>
    </section>
  );
}
