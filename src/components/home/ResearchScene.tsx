import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import articlesData, { type ArticleChart } from "virtual:articles";
import { gsap, ScrollTrigger, scrollToY, SCRUB, gate } from "@/lib/motion";
import { Chars, Reveal, readThrough, useScene } from "./reveal";
import "./research.css";

const pad = (n: number) => String(n).padStart(2, "0");
const studies = articlesData.filter((a) => a.kind === "research");

/** The study's own chart, drawn from the numbers in its article. Hover a row or point for the article's note. */
function Chart({ chart }: { chart: ArticleChart }) {
  const max = chart.max ?? Math.max(...chart.data.map((d) => d.value));
  const note = (e: React.SyntheticEvent<Element>, text?: string) => {
    const el = e.currentTarget.closest(".rs-chart")?.querySelector(".rs-note");
    if (el) el.textContent = text ?? chart.caption ?? "";
  };
  if (chart.type === "line") {
    const xs = chart.data.map((d) => (d.date ? +new Date(d.date) : 0));
    const hasDates = xs.every(Boolean);
    const x0 = Math.min(...xs),
      x1 = Math.max(...xs);
    const W = 420,
      H = 190,
      padL = 14,
      padR = 14,
      padT = 28,
      padB = 30;
    const px = (i: number) =>
      hasDates
        ? padL + ((xs[i] - x0) / (x1 - x0 || 1)) * (W - padL - padR)
        : padL + (i / Math.max(1, chart.data.length - 1)) * (W - padL - padR);
    const py = (v: number) => padT + (1 - v / (max * 1.05)) * (H - padT - padB);
    const d = chart.data
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(p.value).toFixed(1)}`,
      )
      .join(" ");
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="rs-svg"
        role="img"
        aria-label={chart.title}
      >
        <line
          x1={padL}
          x2={W - padR}
          y1={H - padB}
          y2={H - padB}
          className="rs-axis"
        />
        <path
          d={`${d} L${px(chart.data.length - 1)} ${H - padB} L${px(0)} ${H - padB} Z`}
          className="rs-area"
        />
        <path d={d} pathLength={1} className="rs-line" />
        {chart.data.map((p, i) => (
          <g
            key={p.label}
            className="rs-pt"
            tabIndex={0}
            onPointerEnter={(e) =>
              note(e, p.note ?? `${p.label}: ${p.display ?? p.value}`)
            }
            onFocus={(e) =>
              note(e, p.note ?? `${p.label}: ${p.display ?? p.value}`)
            }
          >
            <circle cx={px(i)} cy={py(p.value)} r="4.5" />
            <text
              x={px(i)}
              y={py(p.value) - 11}
              textAnchor={
                i === 0
                  ? "start"
                  : i === chart.data.length - 1
                    ? "end"
                    : "middle"
              }
              className="rs-val"
            >
              {p.display ?? p.value}
            </text>
            <text
              x={px(i)}
              y={H - 10}
              textAnchor={
                i === 0
                  ? "start"
                  : i === chart.data.length - 1
                    ? "end"
                    : "middle"
              }
              className="rs-lab"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  return (
    <ol className="rs-bars">
      {chart.data.map((p) => (
        <li
          key={p.label}
          tabIndex={0}
          onPointerEnter={(e) => note(e, p.note)}
          onFocus={(e) => note(e, p.note)}
        >
          <span className="rs-bl">{p.label}</span>
          <i className="rs-track">
            <b
              className="rs-bar"
              style={{ width: `${Math.min(100, (p.value / max) * 100)}%` }}
            />
          </i>
          <span className="rs-bv">{p.display ?? p.value}</span>
        </li>
      ))}
    </ol>
  );
}

export const ResearchScene = () => {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const slot = 3.8;
  const n = studies.length;

  useScene(
    root,
    ({ el, q, one }) => {
      gate(el);
      const items = q(".rs-item");
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: one(".rs-stage"),
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.25 * n)}`,
          pin: true,
          scrub: SCRUB,
          refreshPriority: 7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(n - 1, Math.floor(self.progress * n));
            q(".rs-tick").forEach((b, j) =>
              b.classList.toggle("is-on", j === i),
            );
          },
        },
      });
      st.current = tl.scrollTrigger!;
      // layers drift at their own speeds
      tl.fromTo(
        one(".rs-grid"),
        { y: 0 },
        { y: () => -window.innerHeight * 0.5, duration: n * slot },
        0,
      )
        .fromTo(
          one(".rs-ghost"),
          { x: 0 },
          { x: () => -window.innerWidth * 0.5, duration: n * slot },
          0,
        )
        .from(one(".rs-head"), { opacity: 0, y: -12, duration: 0.6 }, 0)
        .fromTo(
          one(".rs-rail b"),
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: "50% 0", duration: n * slot },
          0,
        );

      items.forEach((it, i) => {
        const t = i * slot;
        tl.set(it, { autoAlpha: 1 }, t)
          .from(
            it.querySelectorAll(".rs-title .jx-char"),
            {
              yPercent: 115,
              rotate: 4,
              stagger: 0.08,
              duration: 0.7,
              ease: "power3.out",
            },
            t + 0.1,
          )
          .from(
            it.querySelector(".rs-meta"),
            { opacity: 0, x: -16, duration: 0.5 },
            t + 0.5,
          )
          .from(
            it.querySelector(".rs-chart"),
            {
              opacity: 0,
              y: 40,
              scale: 0.97,
              duration: 0.8,
              ease: "power3.out",
            },
            t + 0.3,
          )
          .from(
            it.querySelectorAll(".rs-bar"),
            {
              scaleX: 0,
              transformOrigin: "0 50%",
              stagger: 0.25,
              duration: 0.9,
              ease: "power3.out",
            },
            t + 0.9,
          )
          .from(
            it.querySelectorAll(".rs-bv, .rs-bl"),
            { opacity: 0, stagger: 0.15, duration: 0.4 },
            t + 1.1,
          )
          .fromTo(
            it.querySelectorAll(".rs-line"),
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDasharray: 1,
              strokeDashoffset: 0,
              duration: 1.4,
              ease: "power2.inOut",
            },
            t + 0.9,
          )
          .from(
            it.querySelectorAll(".rs-area"),
            { opacity: 0, duration: 0.8 },
            t + 1.6,
          )
          .from(
            it.querySelectorAll(".rs-pt"),
            {
              opacity: 0,
              scale: 0.4,
              transformOrigin: "50% 50%",
              stagger: 0.22,
              duration: 0.45,
              ease: "back.out(2)",
            },
            t + 1.2,
          )
          .from(
            it.querySelector(".rs-note"),
            { opacity: 0, duration: 0.5 },
            t + 2,
          );
        const end = readThrough(tl, it.querySelector(".rs-sum")!, t + 0.8, 1.5);
        tl.from(
          it.querySelector(".rs-go"),
          { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" },
          end - 0.3,
        );
        if (i < n - 1) {
          tl.to(
            it.querySelector(".rs-copy"),
            { opacity: 0, y: -28, duration: 0.55, ease: "power2.in" },
            t + slot - 0.7,
          )
            .to(
              it.querySelector(".rs-chart"),
              {
                opacity: 0,
                y: -20,
                scale: 0.98,
                duration: 0.55,
                ease: "power2.in",
              },
              t + slot - 0.7,
            )
            .set(it, { autoAlpha: 0 }, t + slot - 0.1)
            .to(
              one(".rs-num > div"),
              {
                yPercent: -((i + 1) * 100) / n,
                duration: 0.7,
                ease: "power3.inOut",
              },
              t + slot - 0.7,
            );
        }
      });
    },
    [],
  );

  return (
    <section id="research" ref={root} className="rs" aria-labelledby="rs-h">
      <div className="rs-stage">
        <div className="rs-grid" aria-hidden="true" />
        <div className="rs-ghost" aria-hidden="true">
          RESEARCH · RESEARCH
        </div>
        <div className="rs-head">
          <div>
            <p className="rs-kick">03 / Research</p>
            <h2 id="rs-h">
              Research, <em>in the open</em>
            </h2>
            <p className="rs-intro">
              Measured, reproducible studies. Each one ships with the data and
              the method behind it.
            </p>
          </div>
          <Link to="/blogs" className="rs-all">
            All writing <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rs-num" aria-hidden="true">
          <div>
            {studies.map((_, i) => (
              <span key={i}>{pad(i + 1)}</span>
            ))}
          </div>
        </div>
        <i className="rs-rail" aria-hidden="true">
          <b />
        </i>
        <nav className="rs-ticks" aria-label="Jump to study">
          {studies.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              className={`rs-tick${i === 0 ? " is-on" : ""}`}
              onClick={() => {
                const t = st.current;
                if (!t) return;
                scrollToY(
                  t.start + ((i * slot + 1.6) / (n * slot)) * (t.end - t.start),
                );
              }}
            >
              <span className="rs-tick-n">{pad(i + 1)}</span>
              <span className="rs-tick-t">{a.title}</span>
            </button>
          ))}
        </nav>
        <ol className="rs-list">
          {studies.map((a, i) => (
            <li className="rs-item" key={a.slug}>
              <div className="rs-copy">
                <span className="rs-idx">
                  {pad(i + 1)} / {pad(n)}
                </span>
                <h3 className="rs-title">
                  <span className="sr-only">{a.title}</span>
                  <span aria-hidden="true" className="rs-title-vis">
                    <Chars text={a.title} by="word" />
                  </span>
                </h3>
                <p className="rs-meta">
                  {new Date(a.date).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {a.minutes} min read
                </p>
                <p className="rs-sum">
                  <Reveal text={a.summary} />
                </p>
                <Link to={`/blogs/${a.slug}`} className="rs-go">
                  Read the study <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              {a.chart && (
                <figure className="rs-chart">
                  <figcaption className="rs-ct">{a.chart.title}</figcaption>
                  <Chart chart={a.chart} />
                  <p className="rs-note">{a.chart.caption}</p>
                </figure>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
