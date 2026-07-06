"use client";

import { scrollToSection, scrollToTop } from "../lib/smoothScroll";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 py-4">
      <button
        onClick={scrollToTop}
        className="flex items-center gap-3"
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined text-[#00d4ff]">terminal</span>
        <span className="font-mono font-black tracking-tighter text-[#00d4ff] text-xl">
          CMD
        </span>
      </button>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
          <button
            onClick={scrollToTop}
            className="text-[#00d4ff] border-b-2 border-[#00d4ff] pb-1 font-mono tracking-widest uppercase text-sm"
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection("work")}
            className="text-slate-500 font-mono hover:text-[#00d4ff] transition-all duration-300 tracking-widest uppercase text-sm"
          >
            WORK
          </button>
          <button
            onClick={() => scrollToSection("logs")}
            className="text-slate-500 font-mono hover:text-[#00d4ff] transition-all duration-300 tracking-widest uppercase text-sm"
          >
            LOGS
          </button>
        </nav>
        <button
          onClick={() => scrollToSection("contact")}
          className="font-mono tracking-widest uppercase text-sm text-[#00d4ff] active:opacity-70 scale-95 transition-transform"
        >
          _RESOURCES
        </button>
      </div>
    </header>
  );
}
