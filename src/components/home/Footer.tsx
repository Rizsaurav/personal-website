import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => (
  <footer id="contact" className="pt-16 md:pt-24 pb-10">
    <p className="label-caps text-text-muted mb-3">04</p>
    <h2 className="font-display text-4xl md:text-6xl text-text-primary mb-10">
      Say <span className="italic font-light">hello</span>
    </h2>

    <a
      href="mailto:rizsaurav@gmail.com"
      className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.8rem,6vw,4.5rem)] text-text-primary leading-none"
    >
      <span className="underline underline-offset-8 decoration-text-primary/25 group-hover:decoration-text-primary transition-all">
        rizsaurav@gmail.com
      </span>
      <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </a>

    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12">
      {[
        { icon: Github, label: "GitHub", href: "https://github.com/Rizsaurav" },
        { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/saurav-rijal-08082a261/" },
        { icon: Mail, label: "Email", href: "mailto:rizsaurav@gmail.com" },
      ].map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="label-caps text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
        >
          <s.icon className="w-4 h-4" /> {s.label}
        </a>
      ))}
    </div>

    <div className="border-t hairline mt-12 pt-6 flex flex-wrap justify-between gap-2">
      <span className="label-caps text-text-muted">Saurav Rijal</span>
      <span className="label-caps text-text-muted">San Marcos, Texas · 2026</span>
    </div>
  </footer>
);
