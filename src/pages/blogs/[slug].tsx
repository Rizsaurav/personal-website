import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calendar,
  Clock,
  Share2,
  Tag,
  User,
} from "lucide-react";
import { loadAllPosts, loadPost, formatDate, type PostMeta } from "./posts";
import { CommentSection } from "./BlogComponents";
import "./blogs.css";

function sharedTagCount(a: PostMeta, b: PostMeta): number {
  return a.tags.filter((t) => b.tags.includes(t)).length;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostMeta | null>(null);
  const [html, setHtml] = useState("");
  const [related, setRelated] = useState<PostMeta[]>([]);
  const [missing, setMissing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setMissing(true);
        return;
      }
      const p = await loadPost(slug);
      if (!p) {
        setMissing(true);
        return;
      }
      setPost(p);
      setHtml((await marked.parse(p.body)) as string);
      const all = await loadAllPosts();
      setRelated(
        all
          .filter((x) => x.slug !== slug)
          .sort((a, b) => sharedTagCount(b, p) - sharedTagCount(a, p))
          .slice(0, 3)
      );
      window.scrollTo(0, 0);
    })();
  }, [slug]);

  const share = async () => {
    if (!post) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url: window.location.href });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const loading = useMemo(
    () => !post && !missing,
    [post, missing]
  );

  if (missing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-medium p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Story not found
          </h1>
          <p className="text-text-secondary mb-6">
            This post doesn’t exist or was moved.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-accent-custom-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all stories
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
          <div className="animate-pulse bg-surface-soft h-8 w-40 rounded-md" />
          <div className="animate-pulse bg-surface-soft h-16 w-full rounded-md" />
          <div className="animate-pulse bg-surface-soft h-6 w-2/3 rounded-md" />
          <div className="animate-pulse bg-surface-soft h-96 w-full rounded-medium" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-custom-primary transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All stories
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {post.coverImage && (
            <div className="mb-8 rounded-medium overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-72 object-cover"
              />
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-custom-soft/20 text-accent-custom-primary text-xs font-medium"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted pb-8 mb-8 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-text-primary">{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>

          <div
            className="blog-body prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-12 pt-6 border-t border-border flex items-center justify-end gap-2">
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                bookmarked
                  ? "bg-accent-custom-primary text-surface border-accent-custom-primary"
                  : "border-border text-text-secondary hover:border-accent-custom-primary/50"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
              />
              {bookmarked ? "Saved" : "Save"}
            </button>
            <button
              onClick={share}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-text-secondary hover:border-accent-custom-primary/50 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-text-primary mb-5">
                More build stories
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/blogs/${r.slug}`}
                    className="group glass-card rounded-soft p-5 hover-lift block"
                  >
                    <div className="text-xs text-text-muted mb-2 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(r.date)}
                      </span>
                      <span>•</span>
                      <span>{r.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-custom-primary transition-colors mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <span className="inline-flex items-center text-accent-custom-primary text-sm font-medium">
                      Read <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <CommentSection />
        </motion.article>
      </div>
    </div>
  );
}
