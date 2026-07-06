type ContactLink = {
  icon: string;
  label: string;
  href: string;
};

const links: ContactLink[] = [
  { icon: "code", label: "GITHUB", href: "https://github.com/kevinkimutai" },
  {
    icon: "link",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/kevin-kimutai-95aab016b/",
  },
  { icon: "mail", label: "EMAIL", href: "mailto:kevinkimutai62@gmail.com" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-8 py-32 text-center">
      <div className="flex items-center gap-4 justify-center mb-16">
        <div className="h-[1px] w-12 bg-white/10"></div>
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          &gt; CALL:STACK
        </span>
        <div className="h-[1px] w-12 bg-white/10"></div>
      </div>

      <div className="flex justify-center gap-12">
        {links.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-none border border-white/10 flex items-center justify-center group-hover:border-[#00d4ff] transition-all duration-300">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-[#00d4ff]">
                {icon}
              </span>
            </div>
            <span className="font-label-mono text-[10px] text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
