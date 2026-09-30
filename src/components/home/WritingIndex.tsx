import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import fm from "front-matter";

interface ArticleMeta {
  title: string;
  date: string;
  summary: string;
  slug: string;
  body: string;
}

const estimateReadTime = (text: string) =>
  Math.ceil(text.trim().split(/\s+/).length / 200) + " min read";

const pad = (n: number) => String(n).padStart(2, "0");

export const WritingIndex = () => {
  const [articles, setArticles] = useState<ArticleMeta[] | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const importAll = import.meta.glob("../../components/content/blogs/*.md", {
      query: "?raw",
      import: "default",
    });
    const load = async () => {
      const entries: ArticleMeta[] = [];
      for (const path in importAll) {
        const raw = (await importAll[path]()) as string;
        const { attributes, body } = fm<Partial<ArticleMeta>>(raw);
        entries.push({
          slug: path.split("/").pop()?.replace(".md", "") || "",
          title: attributes.title ?? "Untitled",
          date: attributes.date ?? new Date().toISOString(),
          summary: attributes.summary ?? "",
          body,
        });
      }
      entries.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      setArticles(entries.slice(0, 4));
    };
    load();
  }, []);

  return (
    <section id="writing" className="bg-surface-variant">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <p className="label-caps text-text-muted mb-3">02</p>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary">
            Build <span className="italic font-light">stories</span>
          </h2>
        </div>
        <Link
          to="/blogs"
          className="label-caps text-text-primary border-b hairline pb-1 hover:opacity-60 transition-opacity inline-flex items-center gap-1 shrink-0"
        >
          All articles <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <p className="text-text-secondary max-w-2xl mb-8 leading-relaxed">
        Why I built it, what it solves, and how I thought of it. One story per
        project.
      </p>

      <div>
        {articles ? (
          articles.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/blogs/${a.slug}`}
                className="index-row grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-baseline gap-4 py-6 px-2 border-t hairline last:border-b"
              >
                <span className="label-caps text-text-muted">{pad(i + 1)}</span>
                <span>
                  <span className="text-xl md:text-2xl font-medium text-text-primary block leading-snug">
                    {a.title}
                  </span>
                  <span className="label-caps text-text-muted mt-2 block">
                    {new Date(a.date).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {estimateReadTime(a.body)}
                  </span>
                </span>
                <ArrowUpRight className="row-arrow w-5 h-5 text-text-primary" />
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-soft h-20 rounded" />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
};
