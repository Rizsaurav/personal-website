import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loadAllPosts, formatDate, type PostMeta } from "./posts";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import Thumb from "@/components/blog/Thumb";
import Divider from "@/components/blog/Divider";
import "@/components/blog/blog.css";

function Item({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link to={`/blogs/${post.slug}`} className="bli-item bl-lift">
        <span className="bli-item-cover">
          <Thumb post={post} size="sm" />
        </span>
        <span className="bli-item-text">
          <strong>{post.title}</strong>
          {post.summary && <span className="bli-item-sum">{post.summary}</span>}
          <span className="bli-item-meta">
            {formatDate(post.date)} · {post.readTime}
          </span>
        </span>
      </Link>
    </li>
  );
}

function Group({ title, note, posts }: { title: string; note: string; posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="bli-group" aria-labelledby={`g-${title}`}>
      <header className="bli-gh">
        <h2 id={`g-${title}`}>{title}</h2>
        <p>{note}</p>
      </header>
      <ul className="bli-items">
        {posts.map((p) => (
          <Item key={p.slug} post={p} />
        ))}
      </ul>
    </section>
  );
}

/* Projects are listed in the owner's priority order, then newest first. */
const PROJECT_PRIORITY = [
  "biotwin",
  "playscript-romeo-juliet-ios",
  "ai-interviewer-faang-prep",
  "videomaxx-agentic-video-pipeline",
];
function rank(slug: string): number {
  const i = PROJECT_PRIORITY.findIndex((k) => slug === k || slug.startsWith(k));
  return i < 0 ? PROJECT_PRIORITY.length : i;
}
const byPriority = (a: PostMeta, b: PostMeta) =>
  rank(a.slug) - rank(b.slug) || new Date(b.date).getTime() - new Date(a.date).getTime();

export default function BlogIndex() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllPosts().then(setPosts);
    const prev = document.title;
    document.title = "Stories | Saurav Rijal";
    return () => {
      document.title = prev;
    };
  }, []);

  // "/" opens the quiet search row
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || t?.closest("input, textarea")) return;
      e.preventDefault();
      setOpen(true);
      window.setTimeout(() => input.current?.focus(), 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tags = useMemo(() => {
    const count = new Map<string, number>();
    posts?.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10);
  }, [posts]);

  const filtering = query.trim() !== "" || tag !== null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)),
    );
  }, [posts, query, tag]);

  // The featured slot is for research; "Also new" is the newest project.
  const latest = (posts ?? []).find((p) => p.kind === "research");
  const alsoNew = (posts ?? []).find((p) => p.kind !== "research");
  const research = filtered.filter((p) => p.kind === "research");
  const projects = filtered.filter((p) => p.kind !== "research").sort(byPriority);

  return (
    <div className="bl bli">
      <a className="bl-skip" href="#bli-main">
        Skip to stories
      </a>
      <header className="bl-chrome">
        <div className="bl-chrome-in">
          <Link to="/" className="bl-nav">
            <span aria-hidden="true">←</span> Home
          </Link>
          <span className="bl-chrome-sec" aria-hidden="true">
            Stories
          </span>
          <DarkModeToggle className="bl-theme" />
        </div>
      </header>

      <main id="bli-main">
        <div className="bli-wrap">
          <div className="bli-top">
            <div>
              <p className="bl-kicker">Saurav Rijal</p>
              <h1>Stories</h1>
              <p className="bli-lede">
                Independent research, and how each software project got built.
                Every piece opens with a short summary.
              </p>
            </div>
            <button
              type="button"
              className="bli-find"
              aria-expanded={open}
              aria-controls="bli-filters"
              onClick={() => {
                setOpen((o) => !o);
                window.setTimeout(() => input.current?.focus(), 0);
              }}
            >
              Search and filter <kbd>/</kbd>
            </button>
          </div>

          <Divider n={4} />

          <div id="bli-filters" className="bli-filters" hidden={!open}>
            <input
              ref={input}
              type="search"
              aria-label="Search stories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles and summaries"
            />
            <div className="bli-tags" role="group" aria-label="Filter by tag">
              {tags.map(([t]) => (
                <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </button>
              ))}
              {filtering && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTag(null);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {posts && !filtering && latest && (
            <section className="bli-feature" aria-label="Latest">
              <Link to={`/blogs/${latest.slug}`} className="bli-feat bl-lift">
                <Thumb post={latest} size="lg" />
                <span className="bli-feat-text">
                  <span className="bl-small">
                    Latest research · {formatDate(latest.date)}
                  </span>
                  <strong>{latest.title}</strong>
                  <span className="bli-feat-sum">{latest.summary}</span>
                  <span className="bli-read">
                    Read the story <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
              {alsoNew && (
                <Link to={`/blogs/${alsoNew.slug}`} className="bli-also bl-lift">
                  <Thumb post={alsoNew} size="md" />
                  <span className="bli-also-text">
                    <span className="bl-small">Newest project</span>
                    <strong>{alsoNew.title}</strong>
                    <span className="bli-item-meta">
                      {formatDate(alsoNew.date)} · {alsoNew.readTime}
                    </span>
                  </span>
                </Link>
              )}
            </section>
          )}

          <Group title="Projects" note="Software projects and how each one was built." posts={projects} />
          <Group title="Research" note="Independent analyses of public data." posts={research} />
          {posts && filtered.length === 0 && <p className="bli-empty">No stories match.</p>}
        </div>
      </main>
    </div>
  );
}
