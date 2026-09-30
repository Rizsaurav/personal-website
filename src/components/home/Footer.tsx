import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  const reduce = useReducedMotion();
  return (
    <footer id="contact" className="bg-text-primary text-background">
      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-10">
        <p className="label-caps opacity-50 mb-3">04</p>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-6xl mb-10"
        >
          Say <span className="italic font-light">hello</span>
        </motion.h2>

        <motion.a
          href="mailto:rizsaurav@gmail.com"
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.8rem,6vw,4.5rem)] leading-none"
        >
          <span className="underline underline-offset-8 decoration-background/25 group-hover:decoration-background transition-all">
            rizsaurav@gmail.com
          </span>
          <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.a>

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
              className="label-caps opacity-60 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
            >
              <s.icon className="w-4 h-4" /> {s.label}
            </a>
          ))}
        </div>

        <div className="border-t border-background/20 mt-12 pt-6 flex flex-wrap justify-between gap-2">
          <span className="label-caps opacity-50">Saurav Rijal</span>
          <span className="label-caps opacity-50">San Marcos, Texas · 2026</span>
        </div>
      </div>
    </footer>
  );
};
