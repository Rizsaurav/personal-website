import { useEffect, useRef } from "react";
import { scrollToY, trackDirection } from "@/lib/motion";
import "./rail.css";

const chapters = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "archive", label: "More" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];
const KEY = "sr-rail-max";

/**
 * A memory trail down the right edge: the line fills to the furthest point you have reached and
 * never drains, chapters you have visited stay lit, and the marker shows where you are now.
 * Scrolling back up lights a rewind cue. Every chapter is a jump link.
 */
export function ChapterRail() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nodes = Array.from(
      el.querySelectorAll<HTMLButtonElement>(".cr-node"),
    );
    let max = 0;
    try {
      max = Number(sessionStorage.getItem(KEY)) || 0;
    } catch {
      /* private mode: the trail just starts fresh */
    }
    let pos: number[] = [];
    let raf = 0;
    const measure = () => {
      const range = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      pos = chapters.map((c) => {
        const t = document.getElementById(c.id);
        return t
          ? Math.min(
              1,
              Math.max(
                0,
                (t.getBoundingClientRect().top + window.scrollY) / range,
              ),
            )
          : 0;
      });
      nodes.forEach((n, i) => (n.style.top = `${pos[i] * 100}%`));
      update();
    };
    function update() {
      raf = 0;
      const range = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const p = Math.min(1, window.scrollY / range);
      if (p > max) {
        max = p;
        try {
          sessionStorage.setItem(KEY, String(max));
        } catch {
          /* ignore */
        }
      }
      el!.style.setProperty("--p", String(p));
      el!.style.setProperty("--m", String(max));
      el!.classList.toggle(
        "is-shown",
        window.scrollY > window.innerHeight * 0.5,
      );
      let active = 0;
      pos.forEach((x, i) => {
        if (p >= x - 0.004) active = i;
        nodes[i].classList.toggle("is-seen", max >= x - 0.004);
      });
      nodes.forEach((n, i) => n.classList.toggle("is-on", i === active));
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const stopDir = trackDirection();
    const settle = window.setTimeout(measure, 800);
    const late = window.setTimeout(measure, 2500);
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    measure();
    return () => {
      stopDir();
      window.clearTimeout(settle);
      window.clearTimeout(late);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (id: string) => {
    const t = document.getElementById(id);
    if (t) scrollToY(t.getBoundingClientRect().top + window.scrollY);
  };

  return (
    <nav ref={root} className="cr" aria-label="Chapters">
      <i className="cr-line" aria-hidden="true">
        <b className="cr-fill" />
        <u className="cr-now" />
      </i>
      {chapters.map((c) => (
        <button
          key={c.id}
          type="button"
          className="cr-node"
          onClick={() => jump(c.id)}
        >
          <span className="cr-dot" />
          <span className="cr-label">{c.label}</span>
        </button>
      ))}
      <span className="cr-rewind" aria-hidden="true">
        ◀◀ rewind
      </span>
    </nav>
  );
}
