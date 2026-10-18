import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
// mobile browser toolbars resize the viewport while scrolling; don't rebuild every pin for that
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

export { gsap, ScrollTrigger };

/** Lite is an explicit visitor preference; full motion remains the default. */
let stored: string | null = null;
try {
  stored = localStorage.getItem("sr-lite"); // "1" forces lite, "0" forces the full experience
} catch {
  /* storage blocked: fall back to detection */
}
// Full motion for everyone by default. Lite is only what the visitor picks with the header switch.
export const LITE = stored === "1";
if (LITE && typeof document !== "undefined")
  document.documentElement.classList.add("lite");
/** Scrub lag is a luxury: lite devices follow the scrollbar directly. */
export const SCRUB: number | true = true;

/** Pinned, scrubbed scenes only run on roomy screens that allow motion. */
export const IMMERSIVE_QUERY =
  "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";
export const COMPACT_MOTION_QUERY =
  "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 619px) and (prefers-reduced-motion: no-preference)";

let lenis: Lenis | null = null;
/** Keep one shared Lenis/GSAP clock; release it on route changes or reduced motion. */
export function startSmoothScroll() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let instance: Lenis | null = null;
  const tick = (t: number) => instance?.raf(t * 1000);
  const stop = () => {
    gsap.ticker.remove(tick);
    if (lenis === instance) lenis = null;
    instance?.destroy();
    instance = null;
  };
  const configure = () => {
    stop();
    if (reduced.matches || document.documentElement.classList.contains("lite"))
      return;
    instance = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      anchors: { offset: -64 },
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  };
  configure();
  reduced.addEventListener("change", configure);
  return () => {
    reduced.removeEventListener("change", configure);
    stop();
  };
}

/** Hide distant decorations and release their explicit promotion hints; reclamation is browser-managed. */
export function gate(el: Element) {
  const apply = (on: boolean) => {
    el.classList.toggle("is-off", !on);
    el.classList.toggle("is-near", on);
  };
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top bottom+=60%",
    end: "bottom top-=60%",
    onToggle: (s) => apply(s.isActive),
    onRefresh: (s) => apply(s.isActive),
    onKill: () => el.classList.remove("is-off", "is-near"),
  });
  apply(st.isActive);
  return st;
}

export function scrollToY(y: number) {
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1 });
  } else window.scrollTo({ top: y });
}

const darkStages = new Set<string>();
/** Several scenes can ask for the dark header; it stays dark while any do. */
export function setDarkStage(key: string, on: boolean) {
  if (on) darkStages.add(key);
  else darkStages.delete(key);
  const root = document.documentElement;
  if (darkStages.size) root.dataset.stage = "dark";
  else delete root.dataset.stage;
}

/** Writes `data-dir="up" | "down"` on <html> so CSS can react to the direction of travel. */
export function trackDirection() {
  let last = window.scrollY;
  let raf = 0;
  let rest = 0;
  const on = () => {
    window.clearTimeout(rest);
    rest = window.setTimeout(() => {
      delete document.documentElement.dataset.dir;
    }, 220);
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const d = window.scrollY - last;
      if (Math.abs(d) > 6) {
        document.documentElement.dataset.dir = d < 0 ? "up" : "down";
        last = window.scrollY;
      }
    });
  };
  window.addEventListener("scroll", on, { passive: true });
  return () => {
    window.removeEventListener("scroll", on);
    cancelAnimationFrame(raf);
    window.clearTimeout(rest);
    delete document.documentElement.dataset.dir;
  };
}
