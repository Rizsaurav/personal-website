// src/pages/blogs/[slug].tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { Bookmark, Share2, Calendar, Clock, User } from "lucide-react";
import { parseFrontMatter, estimateReadTime, CommentSection } from "./BlogComponents";
import "./blogs.css";

type Meta = {
  title: string;
  date: string;
  author: string;
  authorImage?: string;
  coverImage?: string;
  tags: string[];
  readTime: string;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [postHtml, setPostHtml] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [meta, setMeta] = useState<Meta>({
    title: "",
    date: "",
    author: "",
    authorImage: "",
    coverImage: "",
    tags: [],
    readTime: "",
  });

  useEffect(() => {
    const importAll = import.meta.glob("../../components/content/blogs/*.md", {
      query: "?raw",
      import: "default",
    });

    const loadPost = async () => {
      const path = Object.keys(importAll).find((p) => p.includes(`${slug}.md`));

      if (!path) {
        setPostHtml("<h2>Post not found</h2>");
        return;
      }

      const raw = await importAll[path]();
      const { attributes, body } = parseFrontMatter(raw as string);

      const normalized: Meta = {
        title: attributes.title || "",
        date: attributes.date || "",
        author: attributes.author || "",
        authorImage: attributes.authorImage || "",
        coverImage: attributes.coverImage || "",
        tags: Array.isArray(attributes.tags)
          ? attributes.tags
          : (attributes.tags || "")
              .toString()
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
        readTime: estimateReadTime(body),
      };
      setMeta(normalized);

      // parse can be async → await to satisfy TS ('string | Promise<string>')
      const html = (await marked.parse(body)) as string;
      setPostHtml(html);
    };

    loadPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: meta.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <article className="prose-blog relative max-w-4xl mx-auto px-6 py-12 bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30">
        {/* Hero Image */}
        {meta.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl relative group">
            <img
              src={meta.coverImage}
              alt={meta.title}
              className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 tracking-tight text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            {meta.title}
          </h1>
          <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            {meta.authorImage && (
              <img
                src={meta.authorImage}
                alt={meta.author}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <p className="font-semibold text-gray-800 dark:text-gray-200">{meta.author}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {meta.date ? new Date(meta.date).toLocaleDateString() : ""}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {meta.readTime}
                </div>
              </div>
            </div>
          </div>

          {meta.tags?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Blog Body */}
        <div
          className="blog-body prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: postHtml }}
        />

        {/* Actions (bookmark + share only) */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsBookmarked((b) => !b)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isBookmarked
                  ? "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">Bookmark</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <CommentSection />
      </article>
    </div>
  );
}
