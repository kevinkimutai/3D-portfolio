import Reveal from "./motion/Reveal";
import ScrambleText from "./motion/ScrambleText";
import SpotlightCard from "./motion/SpotlightCard";

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
      { label: "Web", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "BeWell",
    description:
      "Be.Well by Slade360° is a digital health and insurance platform that lets users buy health insurance, link medical cards, view benefits, check claims history, and book online medical consultations.",
  },
  {
    icon: "hub",
    tags: [
      { label: "Web", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "SHA Provider Portal",
    description:
      "The SHA Provider Portal is a secure digital platform managed by Kenya's Social Health Authority that allows accredited healthcare facilities to verify patient eligibility, process medical claims, and manage pre-authorization requests for the Social Health Insurance Fund (SHIF).",
  },
  {
    icon: "hub",
    tags: [
      { label: "AI", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "Uzazi Salama",
    description:
      "Uzazi Salama is a maternal health programme set to  strengthen Reproductive, Maternal, Neonatal, Child, and Adolescent health outcomes (RMNCAH) for mothers and children",
  },
  {
    icon: "hub",
    tags: [
      { label: "Web", highlight: true },
      { label: "Mobile", highlight: true },
      { label: "Go", highlight: false },
    ],
    title: "Slade360 Advantage HMIS",
    description:
      "Slade360° Advantage HMIS powered by Safaricom is an all-in-one digital healthcare management and hospital information system (HMIS).",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="max-w-5xl mx-auto px-8 py-24 border-t border-white/5"
    >
      <Reveal className="flex items-center gap-4 mb-16">
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          <ScrambleText text="> ROOT:PROJECTS" hover={false} revealOnScroll />
        </span>
        <div data-reveal-line className="h-[1px] flex-grow bg-white/10"></div>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-8" stagger={0.15} y={48}>
        {projects.map((project) => (
          <SpotlightCard
            key={project.title}
            className="group border border-white/10 p-8 hover:border-[#00d4ff]/50 hover:shadow-[0_0_40px_-12px_rgba(0,212,255,0.4)] transition-[border-color,box-shadow] duration-500 bg-[#0a0a0f] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-[opacity,rotate] duration-500 group-hover:rotate-90">
              <span className="material-symbols-outlined text-[#00d4ff] text-4xl">
                {project.icon}
              </span>
            </div>

            <div className="relative space-y-6">
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
                  <ScrambleText text="VIEW_PROJECT" />
                  <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </Reveal>
    </section>
  );
}
