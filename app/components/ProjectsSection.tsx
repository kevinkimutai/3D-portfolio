type Project = {
  icon: string;
  tags: { label: string; highlight: boolean }[];
  title: string;
  description: string;
};

const projects: Project[] = [
  {
    icon: "hub",
    tags: [
      { label: "AI", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "AI-Scent",
    description: "Personalized Fragrance Recommendation Engine.",
  },
  {
    icon: "hub",
    tags: [
      { label: "AI", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "Kakeru Bets",
    description:
      "An AI-powered sports analytics assistant designed to take the guesswork—and the high risk—out of football betting.",
  },
  {
    icon: "hub",
    tags: [
      { label: "AI", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "High-Throughput Video Transcoding Pipeline.",
    description:
      "A concurrent, high-performance video processing service built in Go that orchestrates system-level FFmpeg instances.",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="max-w-5xl mx-auto px-8 py-24 border-t border-white/5"
    >
      <div className="flex items-center gap-4 mb-16">
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          &gt; ROOT:PROJECTS
        </span>
        <div className="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group border border-white/10 p-8 hover:border-[#00d4ff]/50 transition-all duration-500 bg-[#0a0a0f] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[#00d4ff] text-4xl">
                {project.icon}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`px-2 py-1 border font-code-sm text-[10px] uppercase ${
                      tag.highlight
                        ? "border-[#00d4ff]/30 text-[#00d4ff]"
                        : "border-white/10 text-slate-400"
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <h3 className="font-headline-lg text-white group-hover:text-[#00d4ff] transition-colors">
                {project.title}
              </h3>
              <p className="font-body-md text-slate-400">{project.description}</p>

              <div className="pt-4">
                <a
                  href="#"
                  className="font-label-mono text-xs text-[#00d4ff] uppercase tracking-widest flex items-center gap-2"
                >
                  VIEW_PROJECT{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
