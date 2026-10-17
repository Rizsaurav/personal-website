import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import fm from "front-matter";

/** Article metadata at build time, so the homepage never downloads full article bodies. */
function articleIndex() {
  const id = "virtual:articles";
  const resolved = "\0" + id;
  const dir = path.resolve(__dirname, "src/components/content/blogs");
  return {
    name: "article-index",
    resolveId: (i: string) => (i === id ? resolved : undefined),
    load(i: string) {
      if (i !== resolved) return;
      const items = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
          const { attributes, body } = fm<Record<string, unknown>>(
            fs.readFileSync(path.join(dir, f), "utf8"),
          );
          const visuals = (attributes.visuals as Record<string, unknown>[] | undefined) ?? [];
          const chart = visuals.find(
            (v) => (v.type === "line" || v.type === "bars") && Array.isArray(v.data),
          );
          return {
            slug: f.replace(/\.md$/, ""),
            title: String(attributes.title ?? "Untitled"),
            date: String(attributes.date ?? ""),
            summary: String(attributes.summary ?? ""),
            kind: attributes.kind === "research" ? "research" : "project",
            minutes: Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200)),
            chart: chart ?? null,
          };
        })
        .sort((a, b) => +new Date(b.date) - +new Date(a.date));
      return `export default ${JSON.stringify(items)};`;
    },
    handleHotUpdate({ file, server }: { file: string; server: { moduleGraph: { getModuleById(i: string): unknown; invalidateModule(m: unknown): void } } }) {
      if (file.startsWith(dir)) {
        const m = server.moduleGraph.getModuleById(resolved);
        if (m) server.moduleGraph.invalidateModule(m);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), articleIndex()],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
