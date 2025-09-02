import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import fm from "front-matter";
import { Link } from "react-router-dom";

interface ArticleMeta {
  title: string;
  date: string;
  summary: string;
  slug: string;
  body: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
}

const estimateReadTime = (text: string) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute) + " min read";
};

export const BlogSection = () => {
  const [articles, setArticles] = useState<ArticleMeta[] | null>(null);

  useEffect(() => {
    const importAll = import.meta.glob(
      "../../components/content/blogs/*.md",
      { query: "?raw", import: "default" }
    );

    const loadPosts = async () => {
      const entries: ArticleMeta[] = [];

      for (const path in importAll) {
        const resolver = importAll[path];
        const raw = (await resolver()) as string;
        const { attributes, body } = fm<Partial<ArticleMeta>>(raw);
        const slug = path.split("/").pop()?.replace(".md", "") || "";

        entries.push({
          slug,
          title: attributes.title ?? "Untitled",
          date: attributes.date ?? new Date().toISOString(),
          summary: attributes.summary ?? "No summary available.",
          tags: attributes.tags ?? [],
          image: attributes.image ?? "",
          featured: attributes.featured ?? false,
          body,
        });
      }

      const sorted = entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setArticles(sorted.slice(0, 3));
    };

    loadPosts();
  }, []);

  return (
    <section id="blog" className="space-y-6">
      <div className="glass-card rounded-medium p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Thoughts & Ideas</h2>
            <p className="text-text-secondary">Writing about design, development, and creativity</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/blogs">
              <ArrowRight className="w-4 h-4 mr-2" />
              All Articles
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {articles ? (
            articles.map((article, index) => (
              <motion.article
                key={article.slug}
                className="group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/blogs/${article.slug}`}>
                  <div className={`p-6 rounded-soft transition-colors duration-300 ${
                    article.featured
                      ? "bg-accent-custom-soft/20 hover:bg-accent-custom-soft/30"
                      : "bg-surface-variant/30 hover:bg-surface-variant/50"
                  }`}>
                    <div className="space-y-4">
                      {/* Hero Image */}
                      {article.image && (
                        <div className="overflow-hidden rounded-md aspect-video">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-text-muted text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{estimateReadTime(article.body)}</span>
                          </div>
                        </div>
                        {article.featured && (
                          <span className="px-2 py-1 bg-accent-custom-primary text-surface text-xs rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-custom-primary transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-text-secondary leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-soft text-xs text-text-muted border border-border"
                            >
                              <Tag className="w-3 h-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-accent-custom-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          ) : (
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-surface-soft h-36 w-full rounded-md" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
3