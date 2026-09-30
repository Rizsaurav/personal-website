import { motion, useReducedMotion } from "framer-motion";
import { Bot, Gauge, Cpu, Layers } from "lucide-react";

const areas = [
  {
    icon: Bot,
    title: "Agentic AI pipelines",
    desc: "Multi-agent video and document workflows that plan, call tools, and recover from failures on their own.",
  },
  {
    icon: Gauge,
    title: "LLM measurement",
    desc: "Large-scale audits of the open-weight ecosystem: concentration, licensing, and what actually predicts downloads.",
  },
  {
    icon: Cpu,
    title: "Edge AI",
    desc: "Models running where the user is: chess coaching and vision apps tuned for phones, not data centers.",
  },
  {
    icon: Layers,
    title: "Full-stack engineering",
    desc: "Shipped web apps and internal tools: React frontends, Postgres backends, agentic workflows in production.",
  },
];

export const FocusAreas = () => {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      <p className="label-caps text-text-muted mb-3">Focus</p>
      <h2 className="font-display text-3xl md:text-4xl text-text-primary">
        What I do
      </h2>

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 mt-10">
        {areas.map((a, i) => (
          <motion.div
            key={a.title}
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-4"
          >
            <span className="shrink-0 w-11 h-11 rounded-2xl bg-surface-variant flex items-center justify-center">
              <a.icon className="w-5 h-5 text-text-primary" />
            </span>
            <span>
              <h3 className="font-semibold text-text-primary">{a.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5">
                {a.desc}
              </p>
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
