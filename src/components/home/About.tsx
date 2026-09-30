import { motion, useReducedMotion } from "framer-motion";

const facts = [
  { k: "Education", v: "B.S. Computer Science, Texas State University. Applied Math minor." },
  { k: "Currently", v: "SWE intern at LaunchBox, building agentic internal tools." },
  { k: "Research", v: "Undergraduate researcher, energy systems and survey data. Two research papers." },
  { k: "Next", v: "Applying to CS graduate programs for Fall 2027." },
];

export const About = () => {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 md:px-6 py-6 scroll-mt-20">
      <div className="px-2 mb-6">
        <p className="label-caps text-text-muted mb-3">03 · About</p>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary">
          A little more
        </h2>
      </div>

      <div className="rounded-[2rem] bg-surface-variant p-4 md:p-8">
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-text-secondary leading-relaxed max-w-2xl px-2 md:px-4 pt-2 md:pt-4"
        >
          I am a computer science senior drawn to{" "}
          <span className="text-text-primary font-medium">systems that do real work</span>:
          pipelines that run themselves, models that answer to evidence, and
          infrastructure that holds up at scale. My projects tend to start from a
          concrete annoyance and end as something other people can run.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {facts.map((f, i) => (
            <motion.div
              key={f.k}
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface rounded-2xl p-5 border hairline"
            >
              <p className="label-caps text-text-muted mb-2">{f.k}</p>
              <p className="text-text-primary leading-relaxed text-[0.95rem]">{f.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
