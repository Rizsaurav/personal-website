import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useLocation,
  useNavigate,
  useNavigationType,
  type Location,
} from "react-router-dom";
import {
  TRANSITION_FALLBACK_MS,
  TRANSITION_MS,
  pageLabel,
  preloadBlogChunk,
  prefersReducedMotion,
  recallScroll,
  rememberScroll,
  transitionHrefFor,
} from "@/lib/transition";
import "./transition.css";

// GSAP lives in the scenes chunk; the router shell must not pull it into the first load.
const loadMotion = () => import("@/lib/motion");
const refreshTriggers = () => {
  if (document.querySelector(".pin-spacer"))
    loadMotion().then((m) => m.ScrollTrigger.refresh());
};

type Slot = { id: number; loc: Location };
type Snap = { slots: Slot[]; fromY: number };

const blockInput = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
const KEYS = new Set([
  " ",
  "PageDown",
  "PageUp",
  "End",
  "Home",
  "ArrowDown",
  "ArrowUp",
]);
const blockKeys = (e: KeyboardEvent) => KEYS.has(e.key) && e.preventDefault();

/**
 * Keeps the outgoing route mounted beside the incoming one. The outgoing page
 * is clipped into two halves that retract to the screen edges while the
 * incoming page (fixed underneath) is revealed in the widening gap.
 */
export default function PageTransitions({
  children,
}: {
  children: (loc: Location) => ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const navType = useNavigationType();
  const [snap, setSnap] = useState<Snap>({
    slots: [{ id: 0, loc: location }],
    fromY: 0,
  });
  const nextId = useRef(1);
  const scrollY = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const edgeLRef = useRef<HTMLDivElement>(null);
  const edgeRRef = useRef<HTMLDivElement>(null);
  const lastPath = useRef(location.pathname);

  const newest = snap.slots[snap.slots.length - 1];
  const out = snap.slots.length > 1 ? snap.slots[0].loc : null;
  const cur = newest.loc;

  // Derived state: swap in the new location during render so the old page is never dropped for a frame.
  // The old page keeps its slot (and React key), so it is not remounted while it animates away.
  if (cur !== location) {
    const y = scrollY.current;
    const animate =
      navType !== "POP" &&
      !prefersReducedMotion() &&
      !out &&
      location.pathname !== cur.pathname;
    rememberScroll(cur.key, y);
    setSnap(
      animate
        ? { slots: [newest, { id: nextId.current++, loc: location }], fromY: y }
        : {
            slots: [
              out
                ? { id: nextId.current++, loc: location }
                : { id: newest.id, loc: location },
            ],
            fromY: y,
          },
    );
  }

  useEffect(() => {
    const onScroll = () => {
      if (snap.slots.length === 1) scrollY.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [snap.slots.length]);

  // Router-level link interception: no edits to the components that render the links.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onClick = (e: MouseEvent) => {
      const href = transitionHrefFor(e);
      if (!href) return;
      e.preventDefault();
      scrollY.current = window.scrollY;
      preloadBlogChunk().then(() => navigate(href));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  // No overlay (first paint, reduced motion, same-path or back/forward): just fix scroll.
  useLayoutEffect(() => {
    if (out || cur.pathname === lastPath.current) return;
    const path = cur.pathname;
    const y = recallScroll(cur.key);
    window.scrollTo(0, y);
    if (!y) {
      lastPath.current = path;
      const t = window.setTimeout(refreshTriggers, 60);
      return () => window.clearTimeout(t);
    }
    // Pinned scenes build their spacers after mount: wait until the page is tall enough, then restore.
    let tries = 0;
    const iv = window.setInterval(() => {
      tries += 1;
      const tall =
        document.documentElement.scrollHeight >= y + window.innerHeight;
      if (tall || tries > 30) {
        window.clearInterval(iv);
        lastPath.current = path;
        refreshTriggers();
        window.scrollTo(0, y);
        // Late refreshes from the page itself can reset the scroll; re-assert briefly.
        [200, 600].forEach((ms) =>
          timers.push(
            window.setTimeout(() => {
              if (window.scrollY < 40) window.scrollTo(0, y);
            }, ms),
          ),
        );
      }
    }, 100);
    const timers: number[] = [];
    return () => {
      window.clearInterval(iv);
      timers.forEach(window.clearTimeout);
    };
  }, [snap]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const root = rootRef.current,
      outEl = outRef.current,
      inEl = inRef.current,
      innerEl = inEl?.firstElementChild as HTMLElement | null | undefined;
    const stripEl = stripRef.current,
      labelEl = labelRef.current,
      edgeL = edgeLRef.current,
      edgeR = edgeRRef.current;
    if (!out || !root || !outEl || !inEl || !innerEl) return;
    if (!stripEl || !labelEl || !edgeL || !edgeR) return;
    lastPath.current = cur.pathname;
    outEl.setAttribute("inert", "");
    document.documentElement.dataset.transition = "on";

    // Geometry is read once. The outgoing page is never touched again: it stays frozen in flow
    // while viewport-sized layers on top (the incoming page, the strip) open from the centre.
    const half = document.documentElement.clientWidth / 2;
    let done = false;

    window.addEventListener("wheel", blockInput, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchmove", blockInput, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", blockKeys, true);

    const anims: Animation[] = [];
    const run = (
      el: HTMLElement,
      frames: Keyframe[],
      duration: number,
      easing: string,
      delay = 0,
    ) => {
      const a = el.animate(frames, { duration, easing, delay, fill: "both" });
      anims.push(a);
      return a;
    };

    const finish = () => {
      if (done) return;
      done = true;
      delete document.documentElement.dataset.transition;
      window.removeEventListener("wheel", blockInput, true);
      window.removeEventListener("touchmove", blockInput, true);
      window.removeEventListener("keydown", blockKeys, true);
      setSnap((s) =>
        s.slots.length > 1 && s.slots[1].id === newest.id
          ? { ...s, slots: [s.slots[1]] }
          : s,
      );
    };

    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    const opened = "inset(0% 0% 0% 0%)";
    const closed = "inset(0% 50% 0% 50%)";
    const ms = TRANSITION_MS;
    const main = run(
      inEl,
      [{ clipPath: closed }, { clipPath: opened }],
      ms,
      ease,
    );
    run(stripEl, [{ clipPath: closed }, { clipPath: opened }], ms, ease);
    run(
      innerEl,
      [
        { transform: "translate3d(0, 56px, 0) scale(1.05)" },
        { transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      ms,
      "cubic-bezier(0.215, 0.61, 0.355, 1)",
    );
    run(
      edgeL,
      [
        { transform: "translate3d(0,0,0)" },
        { transform: `translate3d(${-half}px,0,0)` },
      ],
      ms,
      ease,
    );
    run(
      edgeR,
      [
        { transform: "translate3d(0,0,0)" },
        { transform: `translate3d(${half}px,0,0)` },
      ],
      ms,
      ease,
    );
    run(
      labelEl,
      [
        { opacity: 0, transform: "translate3d(0, 14px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      450,
      "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      50,
    );
    run(stripEl, [{ opacity: 1 }, { opacity: 0 }], 500, "ease-in-out", 300);
    // Unmount the heavy outgoing tree only after the last animated frame has been presented.
    main.finished
      .then(() => requestAnimationFrame(() => requestAnimationFrame(finish)))
      .catch(() => undefined);
    const fallback = window.setTimeout(finish, TRANSITION_FALLBACK_MS);

    return () => {
      window.clearTimeout(fallback);
      finish();
      // Released only once the DOM has moved on (this cleanup runs after the commit, before paint).
      anims.forEach((a) => a.cancel());
    };
  }, [snap.slots.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // After the old page unmounts: land on top, refresh triggers, move focus.
  const wasOut = useRef(false);
  useLayoutEffect(() => {
    if (out) {
      wasOut.current = true;
      return;
    }
    if (!wasOut.current) return;
    wasOut.current = false;
    window.scrollTo(0, 0);
    refreshTriggers();
    const el = inRef.current;
    if (el) {
      const target = el.querySelector<HTMLElement>("h1") ?? el;
      if (!target.hasAttribute("tabindex"))
        target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }, [out]);

  const label = pageLabel(cur.pathname);

  return (
    <div ref={rootRef} className="pt-root">
      {snap.slots.map((slot, i) => {
        const isOut = out !== null && i === 0;
        return (
          <div
            key={slot.id}
            ref={
              isOut ? outRef : i === snap.slots.length - 1 ? inRef : undefined
            }
            className={isOut ? "pt-out" : out ? "pt-in--live" : undefined}
            aria-hidden={isOut ? true : undefined}
          >
            <div className="pt-inner">{children(slot.loc)}</div>
          </div>
        );
      })}
      {out && (
        <>
          <div ref={stripRef} className="pt-strip" aria-hidden="true">
            <div ref={labelRef} className="pt-label">
              <span>{label.code} / loading</span>
              <b>{label.name}</b>
            </div>
          </div>
          <div ref={edgeLRef} className="pt-edge pt-edge--l" aria-hidden="true" />
          <div ref={edgeRRef} className="pt-edge pt-edge--r" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
