import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import "./blogs.css";

function parseFrontMatter(content) {
  const match = /^---\n([\s\S]+?)\n---/.exec(content);
  if (!match) return { attributes: {}, body: content };

  const attributes = {};
  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    attributes[key.trim()] = rest.join(":").trim();
  });

  const body = content.slice(match[0].length);
  return { attributes, body };
}

function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // average reading speed
  return `${minutes} min read`;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [postHtml, setPostHtml] = useState("");
  const [meta, setMeta] = useState({
    title: "",
    date: "",
    author: "",
    authorImage: "",
    coverImage: "",
    tags: [],
    readTime: "",
  });

  useEffect(() => {
    const importAll = import.meta.glob(
      "../../components/content/blogs/*.md",
      { query: "?raw", import: "default" }
    );

    const loadPost = async () => {
      const path = Object.keys(importAll).find(p =>
        p.includes(`${slug}.md`)
      );

      if (!path) {
        setPostHtml("<h2>Post not found</h2>");
        return;
      }

      const raw = await importAll[path]();
      const { attributes, body } = parseFrontMatter(raw);
      if (attributes.tags) {
        attributes.tags = attributes.tags.split(",").map(tag => tag.trim());
      }
      attributes.readTime = estimateReadTime(body);
      setMeta(attributes);
      setPostHtml(marked.parse(body));
    };

    loadPost();
  }, [slug]);

  return (
    <article className="prose-blog relative max-w-4xl mx-auto px-4 py-16 bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-500">
      
      {/* Hero Image */}
      {meta.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md relative">
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-serif font-semibold leading-tight mb-1 tracking-tight text-[hsl(var(--text-primary))]">
        {meta.title}
      </h1>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        {meta.authorImage && (
          <img
            src={meta.authorImage}
            alt={meta.author}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
          />
        )}
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">{meta.author}</p>
          <p className="text-xs italic text-gray-400">
            {new Date(meta.date).toLocaleDateString()} • {meta.readTime}
          </p>
        </div>
      </div>

      {/* Tags */}
      {meta.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {meta.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full bg-[hsl(140,40%,90%)] text-[hsl(140,20%,30%)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Blog Content */}
      <div
        className="blog-body text-[hsl(var(--text-primary))] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: postHtml }}
      />

      {/* Reactions */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
        <button className="hover:text-pink-500 transition">❤️ Love</button>
        <button className="hover:text-yellow-500 transition">👍 Like</button>
        <button className="hover:text-indigo-500 transition">💡 Insightful</button>
        <button className="hover:text-green-500 transition">🌟 Amazing</button>
        <button className="ml-auto text-blue-600 hover:underline">🔖 Bookmark</button>
        <button className="text-blue-600 hover:underline">↗️ Share</button>
      </div>

      {/* CTA */}
      <div className="mt-16 pt-10 border-t border-dashed text-center text-sm text-muted-foreground dark:text-gray-500">
        <p>Enjoyed this post?</p>
        <p className="mt-1">
          Explore more on the <a href="/blogs" className="text-blue-600 hover:underline">Blog Page</a> or share your thoughts in the comments.
        </p>
      </div>
    </article>
  );
}
