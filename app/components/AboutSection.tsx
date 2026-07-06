"use client";

import StackScene from "./StackScene";

export default function AboutSection() {
  return (
    <section className="max-w-5xl mx-auto px-8 py-24 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
              &gt; DESC:BIO
            </span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>
          <p className="font-body-lg text-slate-300 leading-relaxed text-lg">
            Engineering high-availability distributed systems with a focus on
            low-latency data processing and microservice orchestration.
            Specializing in building resilient infrastructure that scales
            horizontally without compromising on performance.
          </p>
        </div>

        <div className="relative flex flex-col gap-3">
          <span className="font-label-mono text-slate-400 uppercase text-xs tracking-widest">
            CURRENT_STACK
          </span>
          <div className="h-72 w-full">
            <StackScene />
          </div>
        </div>
      </div>
    </section>
  );
}
