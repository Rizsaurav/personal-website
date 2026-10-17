import { useEffect, useState, type RefObject } from "react";

/** Writes scroll progress (0..1) straight to a transform, no React re-render. */
export function useReadingProgress(
  barRef: RefObject<HTMLElement>,
  labelRef: RefObject<HTMLElement>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (labelRef.current)
        labelRef.current.textContent = `${Math.round(p * 100)}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Active heading id: the last heading whose top has passed the reading line. */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState("");
  const key = ids.join("|");
  useEffect(() => {
    if (!key) return;
    const list = key.split("|");
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = 120;
      let cur = "";
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);
  return active;
}
