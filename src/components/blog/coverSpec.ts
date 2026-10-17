import { projects } from "@/data/projects";
import type { PostMeta } from "@/pages/blogs/posts";

/* What a cover says. Everything here is read from the article itself
   (front-matter visuals, its stat block, its pull-quote, projects.ts). */

export interface Row {
  label: string;
  display: string;
  value: number;
}
export interface CoverSpec {
  kicker: string;
  lead: { big: string; small?: string };
  body:
    | { type: "pipeline"; stages: string[] }
    | { type: "line"; points: Row[] }
    | { type: "bars"; rows: Row[]; max: number }
    | { type: "quote"; text: string }
    | { type: "shots"; layout: "phones" | "windows"; images: { src: string; w: number; h: number }[]; text: string };
  footer: string[];
}

export function shortName(post: PostMeta): string {
  const proj = projects.find((p) => p.blogSlug === post.slug);
  const t = (proj?.title ?? post.title).trim();
  return t.split(/[:.?]/)[0].trim();
}

function statsOf(body: string) {
  const m = body.match(/```stat\n([\s\S]*?)```/);
  if (!m) return [];
  return m[1]
    .split("\n")
    .map((l) => {
      const i = l.indexOf("|");
      return i > 0 ? { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() } : null;
    })
    .filter((x): x is { value: string; label: string } => !!x);
}

/* Real app screenshots for covers, keyed by slug prefix. */
const SHOT_COVERS: Record<
  string,
  { layout: "phones" | "windows"; images: { src: string; w: number; h: number }[] }
> = {
  playscript: {
    layout: "phones",
    images: [
      { src: "/projects/playscript/library.jpg", w: 696, h: 1500 },
      { src: "/projects/playscript/story.jpg", w: 738, h: 1500 },
      { src: "/projects/playscript/choices.jpg", w: 733, h: 1500 },
    ],
  },
  biotwin: {
    layout: "windows",
    images: [
      { src: "/projects/biotwin/overview.jpg", w: 1500, h: 829 },
      { src: "/projects/biotwin/day-ahead.jpg", w: 1500, h: 652 },
    ],
  },
};

const cache = new Map<string, CoverSpec>();

export function coverSpec(post: PostMeta): CoverSpec {
  const hit = cache.get(post.slug);
  if (hit) return hit;
  const research = post.kind === "research";
  const proj = projects.find((p) => p.blogSlug === post.slug);
  const no = String(post.unit).padStart(2, "0");
  const kicker = `${research ? "Research" : "Project"} · No. ${no}`;
  const pipe = post.visuals.find((v) => v.type === "pipeline");
  const line = post.visuals.find((v) => v.type === "line");
  const bars = post.visuals.find((v) => v.type === "bars");
  const stats = statsOf(post.body);
  const footer = (proj?.tech ?? (research ? [] : post.tags)).slice(0, 6);

  let lead: CoverSpec["lead"] = { big: shortName(post) };
  let body: CoverSpec["body"] | null = null;

  if (research) {
    const stat = stats.find((s) => /[$]/.test(s.value)) ?? stats.find((s) => /GW/.test(s.value)) ?? stats[0];
    if (stat) lead = { big: stat.value, small: stat.label };
    else if (bars && bars.type === "bars") {
      const d = bars.data[0];
      lead = { big: d.display ?? `${d.value}${bars.unit ?? ""}`, small: `${d.label}: ${bars.title.toLowerCase()}` };
    }
    if (line && line.type === "line")
      body = {
        type: "line",
        points: line.data.map((d) => ({ label: d.label, value: d.value, display: d.display ?? `${d.value}${line.unit ?? ""}` })),
      };
    else if (bars && bars.type === "bars")
      body = {
        type: "bars",
        max: bars.max ?? Math.max(...bars.data.map((d) => d.value)),
        rows: bars.data.slice(0, 3).map((d) => ({ label: d.label, value: d.value, display: d.display ?? `${d.value}${bars.unit ?? ""}` })),
      };
  }
  const shotKey = Object.keys(SHOT_COVERS).find((k) => post.slug.startsWith(k));
  if (shotKey)
    body = {
      type: "shots",
      layout: SHOT_COVERS[shotKey].layout,
      images: SHOT_COVERS[shotKey].images,
      text: post.pull?.text ?? post.summary,
    };
  if (!body && pipe && pipe.type === "pipeline")
    body = { type: "pipeline", stages: pipe.stages.map((s) => s.name) };
  if (!body) body = { type: "quote", text: post.pull?.text ?? post.summary };

  const spec = { kicker, lead, body, footer };
  cache.set(post.slug, spec);
  return spec;
}
