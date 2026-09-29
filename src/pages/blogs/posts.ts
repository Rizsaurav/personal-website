import fm from "front-matter";

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
  return isNaN(d.getTime()) ? date : d.toLocaleDateString();
}

export async function loadAllPosts(): Promise<PostMeta[]> {
  const posts: PostMeta[] = [];

  for (const path of Object.keys(modules)) {
    const raw = await modules[path]();
    const { attributes, body } = fm<RawAttrs>(raw);
    const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";

    posts.push({
      slug,
      title: attributes.title?.trim() || "Untitled",
      date: attributes.date || "",
      author: attributes.author?.trim() || "Saurav Rijal",
      summary: attributes.summary?.trim() || "",
      tags: normalizeTags(attributes.tags),
      featured: attributes.featured === true || attributes.featured === "true",
      coverImage: attributes.coverImage || attributes.image || "",
      body,
      readTime: readTime(body),
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function loadPost(slug: string): Promise<PostMeta | null> {
  const posts = await loadAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export { formatDate };
