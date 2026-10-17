import { useLayoutEffect, type RefObject } from "react";
import { gsap, IMMERSIVE_QUERY, COMPACT_MOTION_QUERY } from "@/lib/motion";

export function Chars({
  text,
  by = "char",
}: {
  text: string;
  by?: "char" | "word";
}) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span className="jx-word" key={w} aria-hidden="true">
          {by === "word" ? (
            <span className="jx-char">{word}</span>
          ) : (
            Array.from(word).map((c, i) => (
              <span className="jx-char" key={i}>
                {c}
              </span>
            ))
          )}
          {"\u00a0"}
        </span>
      ))}
    </>
  );
}

/** Reading text: every word is its own playhead stop. *Starred* runs are emphasised. */
export function Reveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`rd ${className}`}>
      {text.split("*").map((run, r) =>
        (run.match(/\s*\S+\s*/g) ?? []).map((w, i) => (
          <span key={`${r}-${i}`} className={`rd-w${r % 2 ? " rd-s" : ""}`}>
            {w}
          </span>
        )),
      )}
    </span>
  );
}

/** Adds a scrubbed read-through of `container` to `tl`; returns its end time. */
export function readThrough(
  tl: gsap.core.Timeline,
  container: Element,
  at: number,
  dur: number,
) {
  const words = Array.from(container.querySelectorAll(".rd-w"));
  const each = dur / Math.max(1, words.length);
  tl.fromTo(
    words,
    { opacity: 0.14 },
    {
      opacity: 1,
      ease: "none",
      stagger: each,
      duration: each * 3,
    },
    at,
  );
  const strong = Array.from(container.querySelectorAll(".rd-s"));
  if (strong.length) {
    tl.fromTo(
      strong,
      { "--u": 0 },
      {
        "--u": 100,
        ease: "power2.out",
        stagger: 0.12,
        duration: 0.5,
      },
      at + dur,
    );
  }
  return at + dur + 0.5;
}

interface SceneApi {
  el: HTMLElement;
  q: <T extends Element = HTMLElement>(s: string) => T[];
  one: <T extends Element = HTMLElement>(s: string) => T;
}

/**
 * Pinned timeline on roomy screens, scrubbed read-through on phones,
 * plain static markup for reduced motion.
 */
export function useScene(
  root: RefObject<HTMLElement>,
  build: (api: SceneApi) => void | (() => void),
  deps: unknown[],
) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const api: SceneApi = {
      el,
      q: (s) => Array.from(el.querySelectorAll(s)) as never,
      one: (s) => el.querySelector(s) as never,
    };
    const mm = gsap.matchMedia();
    mm.add(IMMERSIVE_QUERY, () => {
      el.classList.add("is-immersive");
      const undo = build(api);
      return () => {
        el.classList.remove("is-immersive");
        if (typeof undo === "function") undo();
      };
    });
    mm.add(COMPACT_MOTION_QUERY, () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      api.q(".rd").forEach((r) =>
        gsap.fromTo(
          r.querySelectorAll(".rd-w"),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: r,
              start: "top 88%",
              end: "bottom 50%",
              scrub: 0.5,
            },
          },
        ),
      );
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
