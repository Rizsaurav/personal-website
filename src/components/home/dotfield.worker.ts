/// <reference lib="webworker" />
/** Draws the signal field off the main thread. The page only sends tiny state messages. */
type Msg =
  | { type: "init"; canvas: OffscreenCanvas }
  | { type: "size"; w: number; h: number; dpr: number }
  | {
      type: "state";
      visible?: boolean;
      px?: number;
      py?: number;
      scroll?: number;
      ink?: string;
      still?: boolean;
    };

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let w = 1,
  h = 1,
  dpr = 1,
  cols = 0,
  rows = 0;
const step = 42;
let visible = false,
  still = false,
  ink = "#ececec",
  scroll = 0;
const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
let timer = 0,
  last = 0;

function draw(t: number) {
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ink;
  pointer.x += (pointer.tx - pointer.x) * 0.12;
  pointer.y += (pointer.ty - pointer.y) * 0.12;
  const flow = t * 0.0011 + scroll * 0.004;
  const buckets: number[][] = [[], [], []];
  for (let j = 0; j < rows; j++) {
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
}

function loop(t: number) {
  timer = 0;
  if (!visible || still) return;
  if (t - last >= 41) {
    last = t;
    draw(t);
  }
  schedule();
}
function schedule() {
  if (timer || !visible || still) return;
  timer =
    typeof requestAnimationFrame === "function"
      ? requestAnimationFrame(loop)
      : (setTimeout(() => loop(performance.now()), 41) as unknown as number);
}

self.onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.type === "init") {
    canvas = m.canvas;
    ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
  } else if (m.type === "size" && canvas) {
    w = m.w;
    h = m.h;
    dpr = m.dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / step) + 1;
    rows = Math.ceil(h / step) + 1;
    draw(performance.now());
  } else if (m.type === "state") {
    if (m.px !== undefined) {
      pointer.tx = m.px;
      pointer.ty = m.py ?? -9999;
    }
    if (m.scroll !== undefined) scroll = m.scroll;
    if (m.ink) ink = m.ink;
    if (m.still !== undefined) still = m.still;
    if (m.visible !== undefined) visible = m.visible;
    if (visible && still) draw(performance.now());
    else schedule();
  }
};
