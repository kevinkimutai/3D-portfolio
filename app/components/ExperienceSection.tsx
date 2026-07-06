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
      <div className="flex items-center gap-4 mb-16">
        <span className="font-label-mono text-[#00d4ff] text-lg uppercase">
          &gt; SYS:LOGS
        </span>
        <div className="h-[1px] flex-grow bg-white/10"></div>
        <a
          href="/kimutai-april-cv.pdf"
          download
          className="group flex items-center gap-2 border border-[#00d4ff]/40 text-[#00d4ff] px-4 py-2 font-label-mono text-xs uppercase tracking-widest hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] transition-colors whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          DOWNLOAD_CV
        </a>
      </div>

      <div className="relative pl-12 border-l border-[#00d4ff]/20 space-y-16">
        {entries.map((entry) => (
          <div
            key={entry.role}
            className={`relative ${!entry.active ? "opacity-60" : ""}`}
          >
            <div
              className={`absolute -left-[54px] top-0 w-3 h-3 ${
                entry.active
                  ? "bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]"
                  : "border border-[#00d4ff] bg-[#0a0a0f]"
              }`}
            ></div>
            <div className="space-y-2">
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
      </div>
    </section>
  );
}
