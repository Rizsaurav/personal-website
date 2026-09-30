import { motion, useReducedMotion } from "framer-motion";
import { Bot, Map, Cpu, BarChart3 } from "lucide-react";

const areas = [
  {
    icon: Bot,
    title: "Agentic AI pipelines",
    desc: "Multi-agent video and document workflows that plan, call tools, and recover from failures on their own.",
  },
  {
    icon: Map,
    title: "Geospatial ML",
    desc: "Risk models on real city data, from cycling safety maps to infrastructure siting analysis.",
  },
  {
    icon: Cpu,
    title: "Edge AI",
    desc: "Small models running on-device: chess coaching and vision apps tuned for phones, not data centers.",
  },
  {
    icon: BarChart3,
    title: "Data visualization",
    desc: "Dashboards and analyses that turn messy survey, traffic, and energy data into decisions.",
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
