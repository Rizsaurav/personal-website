import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export const Footer = () => {
  const reduce = useReducedMotion();
  return (
    <footer id="contact" className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-8 scroll-mt-20">
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] bg-[#101013] text-white px-6 py-14 md:p-20 text-center ring-1 ring-white/10"
      >
        <p className="label-caps text-white/50 mb-4">04 · Contact</p>
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          Tell me about your<br className="hidden md:block" /> next project
        </h2>
        <p className="text-white/60 mt-5 max-w-md mx-auto leading-relaxed">
          Research collaborations, internships, or just a good systems
          conversation. My inbox is open.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-9">
          <a
            href="mailto:rizsaurav@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium bg-white text-black rounded-full px-7 py-3 hover:opacity-85 transition-opacity"
          >
            rizsaurav@gmail.com <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/Rizsaurav"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-3 border border-white/25 text-white hover:bg-white hover:text-black transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/saurav-rijal-08082a261/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-3 border border-white/25 text-white hover:bg-white hover:text-black transition-colors"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-between gap-2 px-2 pt-6">
        <span className="text-xs text-text-muted">© 2026 Saurav Rijal</span>
        <span className="text-xs text-text-muted">San Marcos, Texas</span>
      </div>
    </footer>
  );
};
