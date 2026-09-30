import fm from "front-matter";

/** Map of blog slug -> cover image path, read from post frontmatter. */
export const loadCoverMap = async (): Promise<Record<string, string>> => {
  const importAll = import.meta.glob("../../components/content/blogs/*.md", {
    query: "?raw",
    import: "default",
  });
  const map: Record<string, string> = {};
  for (const path in importAll) {
    const raw = (await importAll[path]()) as string;
    const { attributes } = fm<{ coverImage?: string; image?: string }>(raw);
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    const img = attributes.coverImage || attributes.image;
    if (slug && img) map[slug] = img;
  }
  return map;
};
