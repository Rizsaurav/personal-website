import { motion, useReducedMotion } from "framer-motion";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const Hero = () => {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : { variants: line, initial: "hidden", animate: "show" };

  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24">
      {/* Meta strip */}
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="label-caps text-text-secondary flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 md:mb-14"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-custom-primary animate-pulse" />
          Open to research collaborations
        </span>
        <span>San Marcos, Texas</span>
        <span>CS Senior, Texas State</span>
      </motion.div>

      {/* Name */}
      <h1 className="font-display font-medium text-text-primary leading-[0.95] tracking-tight text-[clamp(3.8rem,13vw,11.5rem)]">
        <span className="block overflow-hidden">
          <motion.span className="block" custom={0} {...anim}>
            Saurav
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span className="block italic font-light" custom={1} {...anim}>
            Rijal
          </motion.span>
        </span>
      </h1>

      {/* Statement */}
      <div className="mt-10 md:mt-14 max-w-2xl overflow-hidden">
        <motion.p
          className="text-lg md:text-2xl text-text-secondary leading-relaxed"
          custom={2}
          {...anim}
        >
          I build{" "}
          <span className="text-text-primary font-medium">data-intensive systems</span>:
          agentic pipelines, geospatial ML, and real-time AI apps. Senior in
          Computer Science at Texas State, SWE intern at LaunchBox, and an
          undergraduate researcher working with energy and survey data.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="label-caps text-text-muted mt-16 md:mt-24 flex items-center gap-3"
      >
        <span className="inline-block w-10 h-px bg-current" />
        Selected work below
      </motion.div>
    </section>
  );
};
