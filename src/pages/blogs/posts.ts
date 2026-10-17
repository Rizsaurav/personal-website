import fm from "front-matter";
import type { Visual } from "@/components/blog/types";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  featured: boolean;
  coverImage: string;
  body: string;
  readTime: string;
  /** Optional figures declared in front-matter; every value comes from the article text. */
  visuals: Visual[];
  /** "research" for independent analyses; anything else is a software project. */
  kind: "research" | "project";
  /** Optional verbatim sentence from the body, shown as a pull-quote. */
  pull?: { after: string; text: string };
  /** 1-based position in publication order, used for the SR-0N unit label. */
  unit: number;
}

interface RawAttrs {
  title?: string;
  date?: string;
  author?: string;
  summary?: string;
  tags?: string[] | string;
  featured?: boolean | string;
  coverImage?: string;
  image?: string;
  kind?: string;
  visuals?: Visual[];
  pull?: { after: string; text: string };
}

const modules = import.meta.glob("../../components/content/blogs/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function normalizeTags(tags: RawAttrs["tags"]): string[] {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

function readTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? date
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
}

let cache: Promise<PostMeta[]> | null = null;

export function loadAllPosts(): Promise<PostMeta[]> {
  cache ??= readAllPosts();
  return cache;
}

async function readAllPosts(): Promise<PostMeta[]> {
  const posts: PostMeta[] = [];

  for (const path of Object.keys(modules)) {
    const raw = await modules[path]();
    const { attributes, body } = fm<RawAttrs>(raw);
    const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";

    posts.push({
      slug,
      title: attributes.title?.trim() || "Untitled",
      date:
        (attributes.date as unknown) instanceof Date
          ? (attributes.date as unknown as Date).toISOString().slice(0, 10)
          : attributes.date || "",
      author: attributes.author?.trim() || "Saurav Rijal",
      summary: attributes.summary?.trim() || "",
      tags: normalizeTags(attributes.tags),
      featured: attributes.featured === true || attributes.featured === "true",
      coverImage: attributes.coverImage || attributes.image || "",
      body,
      readTime: readTime(body),
      visuals: Array.isArray(attributes.visuals) ? attributes.visuals : [],
      kind: attributes.kind === "research" ? "research" : "project",
      pull: attributes.pull,
      unit: 0,
    });
  }

  const byDate = (a: PostMeta, b: PostMeta) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();
  [...posts].sort((a, b) => byDate(b, a)).forEach((p, i) => (p.unit = i + 1));
  return posts.sort(byDate);
}

export async function loadPost(slug: string): Promise<PostMeta | null> {
  const posts = await loadAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export { formatDate };
