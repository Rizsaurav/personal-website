import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
// mobile browser toolbars resize the viewport while scrolling; don't rebuild every pin for that
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

export { gsap, ScrollTrigger };

/**
 * Slower devices, slow connections and data-savers get the same story with fewer effects
 * (no smooth-scroll lerp, blurs, masks or oversized decorative layers).
 */
type Nav = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};
const nav: Nav | undefined =
  typeof navigator !== "undefined" ? (navigator as Nav) : undefined;
let stored: string | null = null;
try {
  stored = localStorage.getItem("sr-lite"); // "1" forces lite, "0" forces the full experience
} catch {
  /* storage blocked: fall back to detection */
}
export const LITE =
  stored === "1" ||
  (stored !== "0" &&
    !!nav &&
    ((nav.deviceMemory ?? 8) <= 4 ||
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      !!nav.connection?.saveData ||
      ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "") ||
      (typeof matchMedia !== "undefined" &&
        matchMedia("(prefers-reduced-data: reduce)").matches)));
if (LITE && typeof document !== "undefined")
  document.documentElement.classList.add("lite");
/** Scrub lag is a luxury: lite devices follow the scrollbar directly. */
export const SCRUB: number | true = true;

/** Pinned, scrubbed scenes only run on roomy screens that allow motion. */
export const IMMERSIVE_QUERY =
  "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";
export const COMPACT_MOTION_QUERY = "(max-width: 1023px), (max-height: 619px)";

let lenis: Lenis | null = null;
let wakeLenis: () => void = () => {};

/** If the device can't hold ~30fps while scrolling, drop to lite effects on the fly. */
function watchFrameRate() {
  if (
    typeof document === "undefined" ||
    document.documentElement.classList.contains("lite")
  )
    return;
  let sampling = false;
  const deltas: number[] = [];
  const start = () => {
    if (sampling) return;
    sampling = true;
    window.removeEventListener("scroll", start);
    let last = performance.now();
    const frame = (t: number) => {
      deltas.push(t - last);
      last = t;
      if (deltas.length < 120) return requestAnimationFrame(frame);
      const sorted = deltas.slice(10).sort((a, b) => a - b);
      if (sorted[Math.floor(sorted.length / 2)] > 30) {
        document.documentElement.classList.add("lite");
        lenis?.destroy();
        lenis = null;
      }
    };
    requestAnimationFrame(frame);
  };
  window.addEventListener("scroll", start, { passive: true });
}

/**
 * One shared playhead: Lenis smooths the wheel, GSAP's ticker drives Lenis, and every
 * ScrollTrigger reads the smoothed position. The ticker only runs while scrolling
 * so an idle tab costs nothing.
 */
export function startSmoothScroll() {
  watchFrameRate();
  if (LITE || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  // The standard integration: GSAP's ticker drives Lenis every frame. Starting and stopping the
  // ticker around scrolls caused a hitch on the first frame of each scroll, so it stays on.
  lenis = new Lenis({
    lerp: 0.12,
    wheelMultiplier: 1,
    anchors: { offset: -64 },
  });
  const tick = (t: number) => lenis?.raf(t * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  wakeLenis = () => {};
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Heavy decorative layers of a scene are hidden (and their GPU memory freed) while it is far off-screen. */
export function gate(el: Element) {
  const apply = (on: boolean) => el.classList.toggle("is-off", !on);
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top bottom+=60%",
    end: "bottom top-=60%",
    onToggle: (s) => apply(s.isActive),
    onRefresh: (s) => apply(s.isActive),
  });
  apply(st.isActive);
  return st;
}

export function scrollToY(y: number) {
  if (lenis) {
    wakeLenis();
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
  const on = () => {
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
  };
}
