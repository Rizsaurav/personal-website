import { motion, useReducedMotion } from "framer-motion";

const facts = [
  { k: "Education", v: "B.S. Computer Science, Texas State University. Applied Math minor." },
  { k: "Currently", v: "SWE intern at LaunchBox, building agentic internal tools." },
  { k: "Research", v: "Undergraduate researcher, energy systems and survey data. Two IEEE-format papers." },
  { k: "Next", v: "Applying to CS graduate programs for Fall 2027." },
];

export const About = () => {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <p className="label-caps text-text-muted mb-3">03</p>
      <h2 className="font-display text-4xl md:text-6xl text-text-primary mb-10 md:mb-14">
        About <span className="italic font-light">me</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-text-secondary leading-relaxed"
        >
          I am a computer science senior drawn to{" "}
          <span className="text-text-primary">systems that do real work</span>:
          pipelines that run themselves, models that answer to evidence, and
          infrastructure that holds up at scale. My projects tend to start from a
          concrete annoyance and end as something other people can run. When I
          am not building, I write up exactly how each one came together.
        </motion.p>

        <div>
          {facts.map((f, i) => (
            <motion.div
              key={f.k}
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[7rem_1fr] gap-4 py-4 border-t hairline last:border-b"
            >
              <span className="label-caps text-text-muted pt-1">{f.k}</span>
              <span className="text-text-primary leading-relaxed">{f.v}</span>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};
