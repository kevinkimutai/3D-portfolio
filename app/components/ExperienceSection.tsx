import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import ScrambleText from "./motion/ScrambleText";
import TimelineProgress from "./motion/TimelineProgress";

type ExperienceEntry = {
  period: string;
  role: string;
  description: string;
  active: boolean;
};

const entries: ExperienceEntry[] = [
  {
    period: "SEP 2024 — PRESENT",
    role: "Backend Developer @ Savannah Health Informatics",
    description:
      "Building Go (Gin) backend services for digital health partners including Johnson & Johnson and the Bill & Melinda Gates Foundation. Supported a national health insurance system serving 18M+ beneficiaries and the BeWell consumer app for 100k+ users. Built scalable gRPC microservices, robust error handling, logging and monitoring, and deployed to AWS via Helm and Docker.",
    active: true,
  },
  {
    period: "MAR 2024 — AUG 2024",
    role: "Software Developer @ Eclectics International",
    description:
      "Developed and maintained backend systems with Java and Spring Boot in the R&D department. Ensured coverage with JUnit and Mockito, worked across relational and NoSQL databases (MySQL, PostgreSQL, Oracle), and deployed Java applications to on-premise and cloud environments while supporting production systems.",
    active: false,
  },
  {
    period: "JUL 2023 — FEB 2024",
    role: "Fullstack Software Developer @ Controlla Solutions [CTRL+A]",
    description:
      "Built Node.js backend services including an e-ticketing platform used for rugby events in Kenya, and performant frontends with Next.js and React. Managed PostgreSQL and MongoDB database design, and crafted interactive, responsive UIs with TypeScript and Framer Motion.",
    active: false,
  },
  {
    period: "AUG 2022 — JUN 2023",
    role: "Health Informatics Software Developer @ Elizabeth Glaser Pediatric AIDS Foundation",
    description:
      "Built RESTful APIs with Node.js and Express, and React Native mobile apps for iOS and Android. Worked with HL7 and FHIR healthcare standards for interoperability, optimized SQL databases (PostgreSQL, MySQL) for patient data, and trained healthcare personnel on digital health solutions.",
    active: false,
  },
];

export default function ExperienceSection() {
  return (
    <section
      id="logs"
      className="max-w-5xl mx-auto px-8 py-24 border-t border-white/5"
    >
      <Reveal className="flex items-center gap-4 mb-16">
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          <ScrambleText text="> SYS:LOGS" hover={false} revealOnScroll />
        </span>
        <div data-reveal-line className="h-[1px] flex-grow bg-white/10"></div>
        <Magnetic>
          <a
            href="/kimutai-april-cv.pdf"
            download
            className="group flex items-center gap-2 border border-[#00d4ff]/40 text-[#00d4ff] px-4 py-2 font-label-mono text-xs uppercase tracking-widest hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-[background-color,border-color,box-shadow,scale] active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-y-0.5">
              download
            </span>
            <ScrambleText text="DOWNLOAD_CV" />
          </a>
        </Magnetic>
      </Reveal>

      <Reveal
        className="relative pl-12 border-l border-[#00d4ff]/20 space-y-16"
        stagger={0.18}
        y={0}
        x={-24}
      >
        <TimelineProgress />
        {entries.map((entry) => (
          <div
            data-reveal
            key={entry.role}
            className={`group relative transition-opacity duration-500 ${
              !entry.active ? "opacity-60 hover:opacity-100" : ""
            }`}
          >
            <div
              className={`absolute -left-[54px] top-0 w-3 h-3 transition-[scale,box-shadow] duration-300 group-hover:scale-150 group-hover:shadow-[0_0_14px_#00d4ff] ${
                entry.active
                  ? "bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]"
                  : "border border-[#00d4ff] bg-[#0a0a0f]"
              }`}
            >
              {entry.active && (
                <span className="absolute inset-0 bg-[#00d4ff] motion-safe:animate-ping" />
              )}
            </div>
            <div className="space-y-2 transition-transform duration-500 group-hover:translate-x-1">
              <span className="font-label-mono text-slate-500 text-xs uppercase tracking-widest">
                {entry.period}
              </span>
              <h3 className="font-headline-md text-white text-xl">{entry.role}</h3>
              <p className="font-body-md text-slate-400 max-w-2xl">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
