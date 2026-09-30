import { motion, useReducedMotion } from "framer-motion";
import heroPhoto from "@/assets/h.jpg";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-4">
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] bg-surface-variant px-6 py-10 md:p-14"
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          <motion.img
            src={heroPhoto}
            alt="Saurav Rijal"
            initial={reduce ? {} : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-36 h-36 md:w-52 md:h-52 rounded-full object-cover grayscale ring-4 ring-surface mx-auto md:mx-0"
          />

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Open to forward-deployed AI roles
            </span>

            <h1 className="font-display text-4xl md:text-6xl text-text-primary mt-5 leading-[1.05]">
              Saurav Rijal
            </h1>
            <p className="label-caps text-text-muted mt-3">
              AI systems · ML infrastructure
            </p>

            <p className="text-text-secondary leading-relaxed mt-5 max-w-xl">
              Computer science senior at Texas State and SWE intern at LaunchBox,
              where I build agentic internal tools with client engineering teams.
              I work on AI systems end to end: pipelines that run themselves,
              models measured against evidence, and infrastructure that holds up
              at scale. Each project below ships with a build story explaining
              exactly how it came together.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#work"
                className="inline-flex items-center gap-2 text-sm font-medium bg-text-primary text-background rounded-full px-6 py-2.5 hover:opacity-85 transition-opacity"
              >
                View projects <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-2.5 border hairline text-text-primary hover:bg-text-primary hover:text-background transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
