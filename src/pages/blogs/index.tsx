import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  Tag,
} from "lucide-react";
import { loadAllPosts, formatDate, type PostMeta } from "./posts";

function PostCard({ post, index }: { post: PostMeta; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link to={`/blogs/${post.slug}`} className="group block h-full">
        <div className="glass-card rounded-medium p-6 h-full hover-lift flex flex-col">
          <div className="flex items-center justify-between text-sm text-text-muted mb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
            {post.featured && (
              <span className="px-2 py-0.5 bg-accent-custom-primary text-surface text-xs rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-custom-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-text-secondary leading-relaxed mb-4 flex-1">
            {post.summary}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-soft text-xs text-text-muted border border-border"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          <span className="flex items-center text-accent-custom-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
            Read the story <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    loadAllPosts().then(setPosts);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q);
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  const showHero = !query.trim() && !activeTag;
  const hero = showHero ? filtered.find((p) => p.featured) : undefined;
  const rest = hero ? filtered.filter((p) => p.slug !== hero.slug) : filtered;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-custom-primary transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
            Build Stories
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Every project documented: why it needed to exist, what it solves,
            and how I thought of it.
          </p>
        </motion.div>

        {/* Search + tag filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories…"
              className="w-full pl-10 pr-4 py-2.5 rounded-soft bg-surface-variant/30 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-custom-primary/40"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    activeTag === tag
                      ? "bg-accent-custom-primary text-surface border-accent-custom-primary"
                      : "bg-surface-variant/30 text-text-secondary border-border hover:border-accent-custom-primary/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeTag && (
                <button
                  onClick={() => setActiveTag(null)}
                  className="px-3 py-1.5 rounded-full text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {!posts ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-surface-soft h-56 w-full rounded-medium"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-medium p-12 text-center">
            <p className="text-text-secondary text-lg">
              No stories match{query.trim() && <> “{query.trim()}”</>}
              {activeTag && <> with tag “{activeTag}”</>}.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
              className="mt-4 text-accent-custom-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {hero && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link to={`/blogs/${hero.slug}`} className="group block">
                  <div className="glass-card rounded-medium p-8 md:p-10 hover-lift bg-accent-custom-soft/10">
                    <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
                      <span className="px-2.5 py-1 bg-accent-custom-primary text-surface text-xs rounded-full font-medium">
                        Featured
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {formatDate(hero.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {hero.readTime}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 group-hover:text-accent-custom-primary transition-colors">
                      {hero.title}
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-3xl">
                      {hero.summary}
                    </p>
                    {hero.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {hero.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-soft text-xs text-text-muted border border-border"
                          >
                            <Tag className="w-3 h-3" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center text-accent-custom-primary font-medium group-hover:translate-x-1 transition-transform">
                      Read the story <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
