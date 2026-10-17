import { useEffect, useRef } from "react";

/**
 * Ambient "signal field": a grid of dots carrying interfering waves that lean toward the pointer and
 * flow with scroll. Drawn in a Web Worker on an OffscreenCanvas so it costs the main thread (and the
 * scroll scrubbing) nothing; browsers without OffscreenCanvas get the same drawing on the main thread.
 * One canvas, three batched fills per frame, 24 fps cap, rendered at 1x (the dots are tiny squares), paused while off-screen or
 * hidden, drawn once (no loop) for touch, reduced motion and lite devices.
 */
export function DotField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    // A fresh canvas per mount: a canvas can only be handed to a worker once (React may remount in dev).
    const canvas = document.createElement("canvas");
    canvas.className = "boot-field";
    canvas.setAttribute("aria-hidden", "true");
    wrap.appendChild(canvas);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const still = () =>
      reduced || coarse || document.documentElement.classList.contains("lite");

    const useWorker =
      "transferControlToOffscreen" in canvas && typeof Worker !== "undefined";
    let worker: Worker | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let w = 1,
      h = 1,
      dpr = 1;

    // ---- main-thread fallback state ----
    const step = 42;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let cols = 0,
      rows = 0,
      raf = 0,
      last = 0,
      visible = false,
      ink = "",
      frame = 0;

    const readInk = () => getComputedStyle(canvas).color;
    const dprNow = () => 1;

    if (useWorker) {
      try {
        worker = new Worker(new URL("./dotfield.worker.ts", import.meta.url), {
          type: "module",
        });
        const off = canvas.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: off }, [off]);
      } catch {
        worker = null;
      }
    }
    if (!worker) ctx = canvas.getContext("2d");

    const draw = (t: number) => {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ink = frame++ % 8 === 0 || !ink ? readInk() : ink;
      ctx.fillStyle = ink;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const flow = t * 0.0011 + window.scrollY * 0.004;
      const buckets: number[][] = [[], [], []];
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const x = i * step,
            y = j * step;
          const a =
            Math.sin(i * 0.33 + flow) +
            Math.sin(j * 0.41 - flow * 0.8) +
            Math.sin((i + j) * 0.18 + flow * 1.3);
          let v = (a + 3) / 6;
          const dx = x - pointer.x,
            dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 36000) v = Math.min(1, v + (1 - d2 / 36000) * 0.9);
          buckets[v > 0.72 ? 2 : v > 0.5 ? 1 : 0].push(x, y, v);
        }
      const alpha = [0.1, 0.22, 0.55];
      for (let b = 0; b < 3; b++) {
        ctx.globalAlpha = alpha[b];
        ctx.beginPath();
        const list = buckets[b];
        for (let k = 0; k < list.length; k += 3) {
          const r = 0.8 + list[k + 2] * (b === 2 ? 2.4 : 1.4);
          ctx.rect(list[k] - r, list[k + 1] - r, r * 2, r * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden || still()) return;
      if (t - last >= 41) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    const size = () => {
      const r = canvas.getBoundingClientRect();
      dpr = dprNow();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      if (worker) worker.postMessage({ type: "size", w, h, dpr });
      else {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        cols = Math.ceil(w / step) + 1;
        rows = Math.ceil(h / step) + 1;
        draw(performance.now());
      }
    };

    // pointer and scroll are forwarded at most once per frame, and only while the field is on screen
    let pending: { px?: number; py?: number; scroll?: number } | null = null;
    let sendRaf = 0;
    const flush = () => {
      sendRaf = 0;
      if (!pending) return;
      const r = canvas.getBoundingClientRect();
      const msg = {
        type: "state" as const,
        ...pending,
        scroll: window.scrollY,
        ink: readInk(),
      };
      if (pending.px !== undefined) {
        msg.px = pending.px - r.left;
        msg.py = (pending.py ?? 0) - r.top;
      }
      worker?.postMessage(msg);
      pending = null;
    };
    const queue = (p: { px?: number; py?: number; scroll?: number }) => {
      if (!visible) return;
      pending = { ...pending, ...p };
      if (!sendRaf) sendRaf = requestAnimationFrame(flush);
    };
    const move = (e: PointerEvent) => {
      if (worker) queue({ px: e.clientX, py: e.clientY });
      else {
        const r = canvas.getBoundingClientRect();
        pointer.tx = e.clientX - r.left;
        pointer.ty = e.clientY - r.top;
      }
    };
    const onScroll = () => worker && queue({ scroll: window.scrollY });

    size();
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (worker) {
          worker.postMessage({
            type: "state",
            visible,
            still: still(),
            ink: readInk(),
            scroll: window.scrollY,
          });
        } else if (visible) {
          if (still()) draw(performance.now());
          else if (!raf) raf = requestAnimationFrame(loop);
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const vis = () => {
      if (worker)
        worker.postMessage({
          type: "state",
          visible: visible && !document.hidden,
        });
      else if (!document.hidden && visible && !raf)
        raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", vis);
    // lite can switch on at runtime (slow-frame detector): stop animating
    const mo = new MutationObserver(() =>
      worker?.postMessage({ type: "state", still: still() }),
    );
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sendRaf);
      worker?.terminate();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", vis);
      canvas.remove();
    };
  }, []);

  return <div ref={ref} className="boot-field-wrap" aria-hidden="true" />;
}
