import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/** Each letter jumps on hover. Pure CSS can't do per-letter springs cleanly. */
const Letters = ({ text, custom, italic = false }: { text: string; custom: number; italic?: boolean }) => {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : { variants: line, initial: "hidden", animate: "show" };
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span className={`block ${italic ? "italic font-light" : ""}`} custom={custom} {...anim}>
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block cursor-default"
            whileHover={reduce ? {} : { y: "-0.1em", rotate: -3, transition: { type: "spring", stiffness: 500, damping: 15 } }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
};

export const Hero = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const px = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const py = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="bg-text-primary text-background"
    >
      <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-44 pb-16 md:pb-24">
        {/* Meta strip */}
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="label-caps opacity-70 flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 md:mb-14"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Open to research collaborations
          </span>
          <span>San Marcos, Texas</span>
          <span>CS Senior, Texas State</span>
        </motion.div>

        {/* Name with mouse parallax */}
        <motion.h1
          style={reduce ? {} : { x: px, y: py }}
          className="font-display font-medium leading-[0.95] tracking-tight text-[clamp(3.8rem,14vw,12rem)]"
        >
          <Letters text="Saurav" custom={0} />
          <Letters text="Rijal" custom={1} italic />
        </motion.h1>

        {/* Statement */}
        <div className="mt-10 md:mt-14 max-w-2xl overflow-hidden">
          <motion.p
            className="text-lg md:text-2xl leading-relaxed opacity-80"
            custom={2}
            {...(reduce ? {} : { variants: line, initial: "hidden", animate: "show" })}
          >
            I build <span className="font-medium opacity-100">data-intensive systems</span>:
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
          className="label-caps opacity-50 mt-16 md:mt-24 flex items-center gap-3"
        >
          <span className="inline-block w-10 h-px bg-current" />
          Selected work below
        </motion.div>
      </div>
    </section>
  );
};
