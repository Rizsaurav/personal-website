import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marked, type Tokens } from "marked";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import {
  Bookmark,
  Calendar,
  Check,
  Clock,
  Share2,
  User,
} from "lucide-react";
import { loadAllPosts, loadPost, formatDate, type PostMeta } from "./posts";
import { CommentSection } from "./BlogComponents";
import {
  CursorDot,
  Reveal,
  slugify,
  useReadingProgress,
  useScrollSpy,
  type TocEntry,
} from "./interactions";
import "./blogs.css";

const HEADING_FONT = "font-display";
const BODY_FONT = "font-['Inter',system-ui,sans-serif]";

/* Escape everything interpolated into the renderer output so markdown
   content can never break out of the attribute/text context. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* marked v16+: renderer methods receive a single token object.
   - Every markdown image becomes a large centered figure with its alt
     text as the caption (auto-numbered "Fig. N" via CSS counters).
   - h2/h3 headings get stable ids so the TOC rail can scroll-spy them.
   - ```stat fenced blocks become full-bleed navy stat bands:
         ```stat
         474 | station records audited
         ```
*/
marked.use({
  renderer: {
    image(token: Tokens.Image) {
      const src = escapeAttr(token.href ?? "");
      const alt = escapeAttr(token.text ?? "");
      const caption = token.text
        ? `<figcaption>${escapeAttr(token.text)}</figcaption>`
        : "";
      return `<figure class="blog-figure"><img src="${src}" alt="${alt}" loading="lazy" />${caption}</figure>`;
    },
    heading(token: Tokens.Heading) {
      if (token.depth === 2 || token.depth === 3) {
        const inner = marked.parseInline(token.text) as string;
        return `<h${token.depth} id="${slugify(token.text)}">${inner}</h${
          token.depth
        }>`;
      }
      return false;
    },
    code(token: Tokens.Code) {
      if (token.lang === "stat") {
        const items = token.text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => {
            const i = line.indexOf("|");
            const value = (i >= 0 ? line.slice(0, i) : line).trim();
            const label = (i >= 0 ? line.slice(i + 1) : "").trim();
            return `<div class="stat"><span class="stat-value">${escapeAttr(
              value
            )}</span><span class="stat-label">${escapeAttr(label)}</span></div>`;
          })
          .join("");
        return `<div class="stat-band">${items}</div>`;
      }
      return `<pre><code>${escapeAttr(token.text)}</code></pre>`;
    },
  },
});

function extractToc(body: string): TocEntry[] {
  const out: TocEntry[] = [];
  for (const t of marked.lexer(body)) {
    if (t.type === "heading" && (t.depth === 2 || t.depth === 3)) {
      out.push({ id: slugify(t.text), text: t.text, depth: t.depth });
    }
  }
  return out;
}

function sharedTagCount(a: PostMeta, b: PostMeta): number {
  return a.tags.filter((t) => b.tags.includes(t)).length;
}

function ArticleChrome({
  section,
  progress,
}: {
  section: string;
  progress: ReturnType<typeof useReadingProgress>["progress"];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`article-chrome ${scrolled ? "is-scrolled" : ""}`}>
      <div className="article-chrome-inner">
        <Link
          to="/blogs"
          className={`${BODY_FONT} inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e7377] hover:text-[#e54d66] transition-colors`}
        >
          ← <span className="hidden sm:inline">All stories</span>
          <span className="sm:hidden">Stories</span>
        </Link>
        <span className="article-chrome-section" aria-live="polite">
          {section}
        </span>
        <span
          className={`${BODY_FONT} hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e54d66] sm:inline`}
        >
          Saurav Rijal
        </span>
      </div>
      <motion.div className="reading-progress-bar" style={{ scaleX: progress }} />
    </header>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostMeta | null>(null);
  const [html, setHtml] = useState("");
  const [related, setRelated] = useState<PostMeta[]>([]);
  const [missing, setMissing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

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
      const raw = (await marked.parse(p.body)) as string;
      setHtml(
        DOMPurify.sanitize(raw, {
          ADD_TAGS: ["figure", "figcaption"],
          ADD_ATTR: ["loading"],
        })
      );
      const all = await loadAllPosts();
      setRelated(
        all
          .filter((x) => x.slug !== slug && sharedTagCount(x, p) > 0)
          .sort((a, b) => sharedTagCount(b, p) - sharedTagCount(a, p))
          .slice(0, 3)
      );
      window.scrollTo(0, 0);
    })();
  }, [slug]);

  const toc = useMemo(() => (post ? extractToc(post.body) : []), [post]);
  const activeId = useScrollSpy(toc.map((t) => t.id));
  const { progress } = useReadingProgress();
  const activeSection = toc.find((t) => t.id === activeId)?.text ?? post?.title ?? "Introduction";

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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const loading = useMemo(() => !post && !missing, [post, missing]);

  if (missing) {
    return (
      <div
        className={`blog-paper min-h-screen flex items-center justify-center px-6 ${BODY_FONT}`}
      >
        <div className="blog-grain" aria-hidden="true" />
        <div className="text-center max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377] mb-4">
            404
          </p>
          <h1
            className={`${HEADING_FONT} text-[30px] font-semibold tracking-tight text-[#14161a] mb-3`}
          >
            Story not found.
          </h1>
          <p className="text-[#8a8f93] mb-8">
            This post doesn’t exist or was moved.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e54d66] hover:text-[#d13a52] transition-colors"
          >
            ← All stories
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div
        className={`blog-paper min-h-screen flex items-center justify-center ${BODY_FONT}`}
      >
        <div className="blog-grain" aria-hidden="true" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377]">
          Loading story…
        </p>
      </div>
    );
  }

  const kicker = [post.date ? formatDate(post.date) : null, post.readTime]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className={`blog-paper min-h-screen ${BODY_FONT}`}>
      <div className="blog-grain" aria-hidden="true" />
      <CursorDot />
      <ArticleChrome section={activeSection} progress={progress} />

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-16"
      >
        {/* Cover */}
        {post.coverImage && (
          <div className="max-w-[1280px] mx-auto px-6 mt-8">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        )}

        {/* Header block — overlaps the cover on desktop, sits flat on mobile */}
        <div
          className={`relative max-w-[720px] bg-white p-8 md:p-10 shadow-[0_20px_50px_rgba(20,22,26,0.08)] ${
            post.coverImage ? "ml-0 mt-0 lg:ml-[8%] lg:-mt-24" : "mx-auto mt-10"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377]">
            {kicker}
          </p>
          <div className="mt-3 h-[3px] w-[45px] bg-[#e54d66]" />
          <h1
            className={`${HEADING_FONT} mt-5 text-[clamp(2.1rem,5vw,3.4rem)] font-semibold tracking-tight leading-[1.08] text-[#14161a] max-w-[22ch]`}
          >
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] border-b border-[#eef0f2] pb-8">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#232639]">
              <User className="w-4 h-4 text-[#6e7377]" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#8a8f93]">
              <Calendar className="w-4 h-4" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#8a8f93]">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>
        </div>

        {/* Article body + TOC rail */}
        <div className="article-layout px-6 mt-14">
          {toc.length > 0 && (
            <aside className="article-toc" aria-label="Table of contents">
              <p className="toc-kicker">On this page</p>
              <nav>
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    data-depth={t.depth}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(t.id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`toc-link ${t.id === activeId ? "is-active" : ""}`}
                  >
                    {t.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
          <div
            className="magazine-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Tags + share footer */}
        <div className="px-6">
          <Reveal className="mx-auto max-w-[65ch] border-t border-[#e7e2d8] mt-16 pt-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to="/blogs"
                    className="tag-pill text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e7377] hover:text-[#e54d66] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => setBookmarked((b) => !b)}
                aria-pressed={bookmarked}
                className="inline-flex items-center gap-2 text-[13px] text-[#6e7377] hover:text-[#e54d66] transition-colors"
              >
                <motion.span
                  key={String(bookmarked)}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="inline-flex"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarked ? "fill-current text-[#e54d66]" : ""
                    }`}
                  />
                </motion.span>
                {bookmarked ? "Saved" : "Save"}
              </motion.button>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 text-[13px] text-[#6e7377] hover:text-[#e54d66] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#e54d66]" /> Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Share
                  </>
                )}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-[1140px] mx-auto px-6 py-16">
            <Reveal>
              <p className="blog-kicker mb-2.5">Related stories</p>
              <h2
                className={`${HEADING_FONT} font-semibold tracking-tight leading-none text-[#1c2333] mb-10 text-[clamp(1.8rem,3.5vw,2.4rem)]`}
              >
                More build stories
              </h2>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.08}>
                  <Link
                    to={`/blogs/${r.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    {r.coverImage && (
                      <span className="blog-card-img block w-28 h-24 shrink-0">
                        <img
                          src={r.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </span>
                    )}
                    <div>
                      <h3
                        className={`${HEADING_FONT} text-[17px] font-semibold leading-[1.35] tracking-tight text-[#232639] group-hover:text-[#e54d66] transition-colors line-clamp-2`}
                      >
                        {r.title}
                      </h3>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6e7377]">
                        {formatDate(r.date)} • {r.readTime}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="px-6 pb-20">
          <div className="mx-auto max-w-[65ch]">
            <CommentSection />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
