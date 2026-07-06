export default function Footer() {
  return (
    <footer className="w-full py-12 bg-[#0a0a0f] border-t border-white/5">
      <div className="flex flex-col md:flex-row items-center justify-between px-12 max-w-7xl mx-auto space-y-6 md:space-y-0">
        <span className="font-mono font-bold text-slate-200 uppercase tracking-widest text-[10px]">
          © 2024 CORE_SYS // 0.1.0-STABLE
        </span>

        <div className="flex gap-8">
          <a
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase text-slate-600 hover:text-white transition-colors"
          >
            CODE_BASE
          </a>
          <a
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase text-slate-600 hover:text-white transition-colors"
          >
            NETWORK
          </a>
          <a
            href="#"
            className="font-mono text-[10px] tracking-widest uppercase text-slate-600 hover:text-white transition-colors"
          >
            ENCRYPTED_MAIL
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-container rounded-none shadow-[0_0_8px_#00d4ff]"></div>
          <span className="font-mono text-[10px] text-primary-container tracking-widest uppercase">
            SYSTEM_ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}
