import { useId, useMemo } from "react";
import { paletteFor } from "./art";
import { coverSpec, type CoverSpec } from "./coverSpec";
import type { PostMeta } from "@/pages/blogs/posts";

const W = 560;
const H = 380;

/** Greedy word wrap by character count. */
function wrap(text: string, max: number, maxLines = 4): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    if ((cur + " " + w).trim().length > max && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  if (out.length > maxLines) {
    const cut = out.slice(0, maxLines);
    cut[maxLines - 1] = cut[maxLines - 1].replace(/[\s,.;:]*$/, "") + "…";
    return cut;
  }
  return out;
}

const fit = (len: number, cap: number, k = 1000) => Math.max(26, Math.min(cap, k / Math.max(len, 1)));

/** Cover: a coloured panel carrying real content from the article. */
export default function Cover({
  post,
  variant = "full",
  animate = false,
}: {
  post: PostMeta;
  variant?: "full" | "compact";
  animate?: boolean;
}) {
  const pal = paletteFor(post.unit);
  const spec: CoverSpec = useMemo(() => coverSpec(post), [post]);
  const { line, accent, bg } = pal;
  const serif = "Fraunces, Georgia, serif";
  const sans = "Inter, system-ui, sans-serif";
  const no = String(post.unit).padStart(2, "0");
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const frame = (
    <>
      <rect width={W} height={H} fill={bg} />
      <rect x="12" y="12" width={W - 24} height={H - 24} rx="14" fill="none" stroke={line} strokeOpacity=".3" />
    </>
  );

  const shots = (b: Extract<CoverSpec["body"], { type: "shots" }>, compact: boolean) => {
    const phones = b.layout === "phones";
    const bw = phones ? 276 : 300;
    const bh = phones ? 236 : 236;
    const s = compact ? (phones ? 1.38 : 1.4) : 1;
    const tx = compact ? (W - bw * s) / 2 : W - 36 - bw;
    const ty = compact ? (H - bh * s) / 2 : 100;
    const items = phones
      ? b.images.map((im, i) => {
          const w = 104;
          const h = (w * im.h) / im.w;
          return { im, x: i * 86, y: 8 + (i === 1 ? 0 : 12), w, h, rot: (i - 1) * 5 };
        })
      : b.images.map((im, i) => {
          const w = i === 0 ? 280 : 262;
          const h = (w * im.h) / im.w;
          return { im, x: i === 0 ? 0 : 38, y: i === 0 ? 0 : 118, w, h, rot: 0 };
        });
    return (
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        {items.map(({ im, x, y, w, h, rot }, i) => (
          <g key={im.src} transform={`translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})`}>
            <clipPath id={`${uid}c${i}`}>
              <rect width={w} height={h} rx={phones ? 12 : 6} />
            </clipPath>
            <rect x="3" y="6" width={w} height={h} rx={phones ? 12 : 6} fill="#000" fillOpacity=".28" />
            <image href={im.src} width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}c${i})`} />
            <rect width={w} height={h} rx={phones ? 12 : 6} fill="none" stroke={line} strokeOpacity=".9" strokeWidth="1.5" />
          </g>
        ))}
      </g>
    );
  };

  if (variant === "compact" && spec.body.type === "shots") {
    return (
      <svg className="bl-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        {frame}
        {shots(spec.body, true)}
        <text x="34" y="46" fontFamily={serif} fontStyle="italic" fontSize="26" fill={line} fillOpacity=".8">
          No. {no}
        </text>
      </svg>
    );
  }

  if (variant === "compact") {
    const big = spec.lead.big;
    const lines = wrap(big, big.length > 14 ? 14 : 16, 3);
    const longest = Math.max(...lines.map((l) => l.length));
    const size = Math.min(124 / (lines.length > 1 ? 1.15 : 1), fit(longest, 124, 880));
    return (
      <svg className="bl-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        {frame}
        {lines.map((l, i) => (
          <text key={i} x="40" y={H / 2 - ((lines.length - 1) * size * 0.5) + i * size * 1.02 + size * 0.3} fontFamily={serif} fontSize={size} letterSpacing={-size * 0.03} fill={line}>
            {l}
          </text>
        ))}
        <path d={`M40 ${H - 74} H150`} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        {spec.lead.small && (
          <text x="40" y={H - 40} fontFamily={sans} fontSize="22" fill={line} fillOpacity=".85">
            {wrap(spec.lead.small, 34, 1)[0]}
          </text>
        )}
        <text x={W - 40} y={H - 40} textAnchor="end" fontFamily={serif} fontStyle="italic" fontSize="26" fill={line} fillOpacity=".75">
          No. {no}
        </text>
      </svg>
    );
  }

  const body = spec.body;
  const lead = spec.lead;
  const research = post.kind === "research";
  const leadSize =
    body.type === "shots"
      ? Math.min(44, 190 / (lead.big.length * 0.55))
      : research
        ? Math.min(78, fit(lead.big.length, 78, 560))
        : Math.min(54, fit(lead.big.length, 54, 960));
  const smallLines = lead.small ? wrap(lead.small, 52, 2) : [];
  const footer = spec.footer.join(" · ");

  return (
    <svg className={`bl-art ${animate ? "is-anim" : ""}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {frame}
      <text x="36" y="44" fontFamily={sans} fontSize="12.5" fontWeight="500" fill={line} fillOpacity=".78">
        {spec.kicker}
      </text>
      <text x="36" y={research ? 112 : 104} fontFamily={serif} fontSize={leadSize} letterSpacing={-leadSize * 0.03} fill={line}>
        {lead.big}
      </text>
      {smallLines.map((l, i) => (
        <text key={i} x="36" y={140 + i * 17} fontFamily={sans} fontSize="13.5" fill={line} fillOpacity=".88">
          {l}
        </text>
      ))}
      {!research && (
        <path d="M36 122 H92 L100 114 H150" stroke={accent} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="bl-draw" />
      )}

      {body.type === "pipeline" && (() => {
        const n = body.stages.length;
        const cols = n > 4 ? 2 : 1;
        const rows = Math.ceil(n / cols);
        const rowH = Math.min(48, 188 / rows);
        const colW = (W - 72) / cols;
        const y0 = 146;
        return body.stages.map((name, i) => {
          const c = Math.floor(i / rows);
          const r = i % rows;
          const x = 36 + c * colW;
          const y = y0 + r * rowH + rowH / 2;
          const labels = wrap(name.replace(/\s*\/\s*/g, " / "), cols === 2 ? 24 : 40, 2);
          const last = r === rows - 1 || i === n - 1;
          return (
            <g key={name}>
              {!last && (
                <path d={`M${x + 10} ${y + 10} V${y + rowH - 10}`} stroke={line} strokeOpacity=".55" strokeWidth="1.6" pathLength={1} className="bl-draw" />
              )}
              <circle cx={x + 10} cy={y} r="10" fill={accent} />
              <text x={x + 10} y={y + 3.6} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize="11" fill={bg}>
                {i + 1}
              </text>
              {labels.map((t, li) => (
                <text key={li} x={x + 30} y={y + 4.5 + (li - (labels.length - 1) / 2) * 15} fontFamily={sans} fontSize={cols === 2 ? 13.5 : 15.5} fontWeight="600" fill={line}>
                  {t}
                </text>
              ))}
            </g>
          );
        });
      })()}

      {body.type === "line" && (() => {
        const pts = body.points;
        const x0 = 56;
        const x1 = W - 56;
        const yb = 312;
        const yt = 214;
        const max = Math.max(...pts.map((p) => p.value));
        const px = (i: number) => x0 + ((x1 - x0) * i) / Math.max(1, pts.length - 1);
        const py = (v: number) => yb - ((yb - yt) * v) / max;
        const d = pts.map((p, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(p.value).toFixed(1)}`).join(" ");
        return (
          <g>
            <line x1="36" x2={W - 36} y1={yb + 8} y2={yb + 8} stroke={line} strokeOpacity=".4" />
            <path d={d} fill="none" stroke={line} strokeWidth="2.6" strokeLinejoin="round" pathLength={1} className="bl-draw" />
            {pts.map((p, i) => (
              <g key={p.label}>
                <circle cx={px(i)} cy={py(p.value)} r="5" fill={accent} stroke={bg} strokeWidth="1.5" />
                <text x={px(i)} y={py(p.value) - 12} textAnchor={i === pts.length - 1 ? "end" : "middle"} fontFamily={sans} fontSize="12" fontWeight="600" fill={line}>
                  {p.display}
                </text>
                <text x={px(i)} y={yb + 26} textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"} fontFamily={sans} fontSize="11" fill={line} fillOpacity=".8">
                  {p.label}
                </text>
              </g>
            ))}
          </g>
        );
      })()}

      {body.type === "bars" &&
        body.rows.map((r, i) => {
          const y = 196 + i * 50;
          const tw = 330;
          return (
            <g key={r.label}>
              <text x="36" y={y} fontFamily={sans} fontSize="13.5" fill={line} fillOpacity=".92">
                {r.label}
              </text>
              <rect x="36" y={y + 10} width={tw} height="12" rx="6" fill={line} fillOpacity=".2" />
              <rect x="36" y={y + 10} width={Math.max(8, (tw * r.value) / body.max)} height="12" rx="6" fill={accent} />
              <text x={W - 36} y={y + 21} textAnchor="end" fontFamily={sans} fontSize="16" fontWeight="700" fill={line}>
                {r.display}
              </text>
            </g>
          );
        })}

      {body.type === "shots" && (
        <g>
          {shots(body, false)}
          {wrap(body.text, 21, 6).map((l, i) => (
            <text key={i} x="36" y={170 + i * 22} fontFamily={serif} fontStyle="italic" fontWeight="300" fontSize="17" fill={line} fillOpacity=".92">
              {l}
            </text>
          ))}
        </g>
      )}

      {body.type === "quote" && (
        <g>
          <text x="30" y="204" fontFamily={serif} fontSize="76" fill={accent}>
            “
          </text>
          {wrap(body.text, body.text.length > 70 ? 34 : 28, 4).map((l, i) => (
            <text key={i} x="36" y={232 + i * 38} fontFamily={serif} fontStyle="italic" fontWeight="300" fontSize={body.text.length > 70 ? 30 : 36} letterSpacing="-0.8" fill={line}>
              {l}
            </text>
          ))}
        </g>
      )}

      {footer && (
        <text x="36" y={H - 24} fontFamily={sans} fontSize="12" fill={line} fillOpacity=".78">
          {wrap(footer, 74, 1)[0]}
        </text>
      )}
    </svg>
  );
}
