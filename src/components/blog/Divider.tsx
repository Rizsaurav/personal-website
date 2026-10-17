import { useEffect, useRef, useState } from "react";

/** Hairline PCB trace between sections. It draws once when first scrolled
    into view; purely decorative (CSS holds it static for reduced motion,
    phones and html.lite). */
export default function Divider({ n }: { n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const a = 60 + ((n * 53) % 110);
  const b = a + 70 + ((n * 37) % 90);
  const c = 360 + ((n * 71) % 160);
  return (
    <div className={`bl-trace bl-deco ${on ? "is-in" : ""}`} ref={ref} aria-hidden="true">
      <svg width="800" height="28" viewBox="0 0 800 28" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="6" cy="14" r="3.5" />
        <path pathLength={1} d={`M10 14 H${a} L${a + 10} 4 H${b} L${b + 10} 14 H${c}`} />
        <path pathLength={1} d={`M${c + 44} 14 H800`} />
        <g className="bl-trace-chip">
          <rect x={c} y="7" width="44" height="14" rx="3" />
          {[8, 18, 28, 38].map((x) => (
            <path key={x} d={`M${c + x} 7 v-3 M${c + x} 21 v3`} />
          ))}
          <circle cx={c + 8} cy="14" r="1.6" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

/** Large, quiet trace lines behind the hero. Static. */
export function TraceBackdrop() {
  return (
    <svg className="bl-backdrop bl-deco" viewBox="0 0 1200 520" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
      <path d="M0 80 H260 L300 40 H640 L680 80 H1200" />
      <path d="M0 96 H250 L290 56 H650 L690 96 H1200" />
      <path d="M0 112 H240 L280 72 H660 L700 112 H1200" />
      <path d="M1200 420 H900 L860 460 H520 L480 420 H0" />
      <path d="M1200 436 H910 L870 476 H510 L470 436 H0" />
      <circle cx="680" cy="80" r="5" />
      <circle cx="480" cy="420" r="5" />
      <rect x="760" y="250" width="120" height="70" rx="8" />
      <path d="M780 250 v-14 M800 250 v-14 M820 250 v-14 M840 250 v-14 M860 250 v-14 M780 320 v14 M800 320 v14 M820 320 v14 M840 320 v14 M860 320 v14" />
    </svg>
  );
}
