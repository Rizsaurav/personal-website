import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type {
  BarsVisual,
  LineVisual,
  PipelineVisual,
  TabsVisual,
  Visual,
} from "./types";

/* Figures only. Every label and number is passed in from the article's
   front-matter, which in turn copies it from the article text. All motion is
   transform/opacity and starts from a click, never from scrolling. */

function Frame({
  kind,
  title,
  caption,
  children,
  actions,
}: {
  kind: string;
  title: string;
  caption?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <figure className="bl-viz">
      <div className="bl-viz-bar">
        <span className="bl-viz-kind">
          {kind}
        </span>
        {actions && <span className="bl-viz-actions">{actions}</span>}
      </div>
      <p className="bl-viz-title">{title}</p>
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/* --------------------------- pipeline / rack ------------------------- */

function Pipeline({ v }: { v: PipelineVisual }) {
  const uid = useId();
  const [open, setOpen] = useState(0);
  const [running, setRunning] = useState(false);
  const n = v.stages.length;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      if (open >= n - 1) setRunning(false);
      else setOpen(open + 1);
    }, 1100);
    return () => window.clearTimeout(t);
  }, [running, open, n]);

  const go = (i: number, focus = false) => {
    const next = Math.max(0, Math.min(n - 1, i));
    setOpen(next);
    if (focus) refs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      setRunning(false);
      go(map[e.key], true);
    }
  };

  return (
    <Frame
      kind={v.kind ?? "Pipeline"}
      title={v.title}
      caption={v.caption}
      actions={
        <>
          <button
            type="button"
            className="bl-btn"
            onClick={() => {
              if (running) return setRunning(false);
              if (open >= n - 1) setOpen(0);
              setRunning(true);
            }}
          >
            {running ? "Stop" : "Run sequence"}
          </button>
          <span className="bl-count" aria-hidden="true">
            {pad(open + 1)}/{pad(n)}
          </span>
        </>
      }
    >
      <div
        className="bl-rack"
        role="tablist"
        aria-orientation="vertical"
        aria-label={v.title}
      >
        {v.stages.map((s, i) => {
          const sel = i === open;
          return (
            <div
              key={s.name}
              className={`bl-bay ${sel ? "is-open" : ""} ${i < open ? "is-done" : ""}`}
            >
              <button
                ref={(el) => (refs.current[i] = el)}
                type="button"
                role="tab"
                id={`${uid}-t${i}`}
                aria-selected={sel}
                aria-controls={`${uid}-p${i}`}
                tabIndex={sel ? 0 : -1}
                className="bl-bay-head"
                onClick={() => {
                  setRunning(false);
                  go(i);
                }}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="bl-bay-no">{pad(i + 1)}</span>
                <span className="bl-bay-name">{s.name}</span>
                {s.tag && <span className="bl-bay-tag">{s.tag}</span>}
              </button>
              <div
                role="tabpanel"
                id={`${uid}-p${i}`}
                aria-labelledby={`${uid}-t${i}`}
                hidden={!sel}
                className="bl-bay-body"
              >
                <p>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* ------------------------------- tabs -------------------------------- */

function Tabs({ v }: { v: TabsVisual }) {
  const uid = useId();
  const [sel, setSel] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = v.tabs.length;
  const onKey = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % n,
      ArrowLeft: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      setSel(map[e.key]);
      refs.current[map[e.key]]?.focus();
    }
  };
  return (
    <Frame kind="Method" title={v.title} caption={v.caption}>
      <div className="bl-tabs" role="tablist" aria-label={v.title}>
        {v.tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={i === sel}
            aria-controls={`${uid}-p${i}`}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {v.tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${uid}-p${i}`}
          aria-labelledby={`${uid}-t${i}`}
          hidden={i !== sel}
          className="bl-tabpanel"
        >
          <ul>
            {t.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </Frame>
  );
}

/* ------------------------------- bars -------------------------------- */

function Bars({ v }: { v: BarsVisual }) {
  const [active, setActive] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const top = v.max ?? Math.max(...v.data.map((d) => d.value), v.reference?.value ?? 0);
  const pct = (x: number) => `${(x / top) * 100}%`;
  const fmt = (x: number, d?: string) => d ?? `${x}${v.unit ?? ""}`;
  return (
    <Frame
      kind="Chart"
      title={v.title}
      caption={v.caption}
      actions={
        <button type="button" className="bl-btn" onClick={() => setRun((r) => r + 1)}>
          Replay
        </button>
      }
    >
      <div className="bl-bars" key={run}>
        {v.data.map((d, i) => (
          <button
            key={d.label}
            type="button"
            className={`bl-bar ${active === i ? "is-active" : ""}`}
            aria-pressed={active === i}
            onClick={() => setActive(active === i ? null : i)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="bl-bar-label">{d.label}</span>
            <span className="bl-bar-track">
              <span
                className="bl-bar-fill"
                style={{ width: pct(d.value), animationDelay: `${i * 70}ms` }}
              />
              {v.reference && (
                <span
                  className="bl-bar-ref"
                  style={{ left: pct(v.reference.value) }}
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="bl-bar-val">{fmt(d.value, d.display)}</span>
          </button>
        ))}
      </div>
      {v.reference && (
        <p className="bl-viz-note">
          <i className="bl-ref-key" aria-hidden="true" />
          {v.reference.label}: {fmt(v.reference.value, v.reference.display)}
        </p>
      )}
      <p className="bl-viz-note" aria-live="polite">
        {active !== null && v.data[active].note
          ? v.data[active].note
          : "Hover, focus or tap a bar for detail."}
      </p>
    </Frame>
  );
}

/* ------------------------------- line -------------------------------- */

function Line({ v }: { v: LineVisual }) {
  const [active, setActive] = useState(v.data.length - 1);
  const [run, setRun] = useState(0);
  const xs = v.data.map((d) => new Date(d.date).getTime());
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const ymax = Math.max(...v.data.map((d) => d.value)) * 1.12;
  const px = (t: number) => 4 + ((t - x0) / (x1 - x0 || 1)) * 92;
  const py = (y: number) => 100 - (y / ymax) * 100;
  const path = v.data
    .map((d, i) => `${i ? "L" : "M"}${px(xs[i]).toFixed(2)} ${py(d.value).toFixed(2)}`)
    .join(" ");
  const area = `${path} L${px(x1)} 100 L${px(x0)} 100 Z`;
  const fmt = (x: number, d?: string) => d ?? `${x}${v.unit ?? ""}`;
  const cur = v.data[active];
  return (
    <Frame
      kind="Chart"
      title={v.title}
      caption={v.caption}
      actions={
        <button type="button" className="bl-btn" onClick={() => setRun((r) => r + 1)}>
          Replay
        </button>
      }
    >
      <div className="bl-line">
        <div className="bl-line-plot" key={run}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[25, 50, 75].map((g) => (
              <line key={g} x1="0" x2="100" y1={g} y2={g} className="bl-grid" />
            ))}
            <path d={area} className="bl-area" />
            <path d={path} className="bl-path" vectorEffect="non-scaling-stroke" />
          </svg>
          {v.data.map((d, i) => (
            <button
              key={d.date}
              type="button"
              className={`bl-pt ${i === active ? "is-active" : ""}`}
              style={{ left: `${px(xs[i])}%`, top: `${py(d.value)}%` }}
              aria-label={`${d.label}: ${fmt(d.value, d.display)}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="bl-line-x" aria-hidden="true">
          {v.data.map((d, i) => (
            <span key={d.date} style={{ left: `${px(xs[i])}%` }}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
      <p className="bl-readout" aria-live="polite">
        <b>{cur.label}</b> <span>{fmt(cur.value, cur.display)}</span>
      </p>
    </Frame>
  );
}

export default function VisualBlock({ v }: { v: Visual }) {
  switch (v.type) {
    case "pipeline":
      return <Pipeline v={v} />;
    case "tabs":
      return <Tabs v={v} />;
    case "bars":
      return <Bars v={v} />;
    case "line":
      return <Line v={v} />;
    default:
      return null;
  }
}
