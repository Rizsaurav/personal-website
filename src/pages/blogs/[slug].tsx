import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marked, type Tokens } from "marked";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import {
  Bookmark,
  Calendar,
  Clock,
  Share2,
  User,
} from "lucide-react";
import { loadAllPosts, loadPost, formatDate, type PostMeta } from "./posts";
import { CommentSection } from "./BlogComponents";
import "./blogs.css";

const HEADING_FONT = "font-['Poppins','Montserrat',system-ui,sans-serif]";
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

/* marked v16+: renderer methods receive a single token object
   ({ href, title, text } for images). Every markdown image becomes a
   large centered figure with its alt text as the caption. */
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
  },
});

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

  const loading = useMemo(() => !post && !missing, [post, missing]);

  if (missing) {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center px-6 ${BODY_FONT}`}>
        <div className="text-center max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377] mb-4">
            404
          </p>
          <h1 className={`${HEADING_FONT} text-[30px] font-extrabold tracking-tight text-[#14161a] mb-3`}>
            Story not found.
          </h1>
          <p className="text-[#8a8f93] mb-8">This post doesn’t exist or was moved.</p>
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
      <div className={`min-h-screen bg-white flex items-center justify-center ${BODY_FONT}`}>
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
    <div className={`min-h-screen bg-white ${BODY_FONT}`}>
      {/* Back link */}
      <div className="max-w-[1280px] mx-auto px-6 pt-10">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e7377] hover:text-[#e54d66] transition-colors"
        >
          ← All stories
        </Link>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Cover */}
        {post.coverImage && (
          <div className="max-w-[1280px] mx-auto px-6 mt-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
            />
          </div>
        )}

        {/* Header block — overlaps the cover on desktop, sits flat on mobile */}
        <div
          className={`relative max-w-[720px] bg-[#f3f7fa] p-8 md:p-10 ${
            post.coverImage ? "ml-0 mt-0 lg:ml-[8%] lg:-mt-24" : "mx-auto mt-10"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377]">
            {kicker}
          </p>
          <div className="mt-3 h-[3px] w-[45px] bg-[#e54d66]" />
          <h1
            className={`${HEADING_FONT} mt-5 text-[42px] lg:text-[48px] font-extrabold tracking-tight leading-[1.15] text-[#14161a] max-w-[20ch]`}
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

        {/* Article body */}
        <div className="px-6 mt-14">
          <div
            className="magazine-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Tags + share footer */}
        <div className="px-6">
          <div className="mx-auto max-w-[65ch] border-t border-[#eef0f2] mt-16 pt-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to="/blogs"
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e7377] hover:text-[#e54d66] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setBookmarked((b) => !b)}
                aria-pressed={bookmarked}
                className="inline-flex items-center gap-2 text-[13px] text-[#6e7377] hover:text-[#e54d66] transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${bookmarked ? "fill-current text-[#e54d66]" : ""}`}
                />
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 text-[13px] text-[#6e7377] hover:text-[#e54d66] transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-[1140px] mx-auto px-6 py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377] mb-2.5">
              Related stories
            </p>
            <h2
              className={`${HEADING_FONT} text-[30px] font-extrabold tracking-tight leading-none text-[#1c2333] mb-10`}
            >
              More build stories
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blogs/${r.slug}`}
                  className="group flex gap-4 items-start"
                >
                  {r.coverImage && (
                    <img
                      src={r.coverImage}
                      alt=""
                      className="w-28 h-24 object-cover shrink-0"
                    />
                  )}
                  <div>
                    <h3
                      className={`${HEADING_FONT} text-[17px] font-bold leading-[1.35] tracking-tight text-[#232639] group-hover:text-[#e54d66] transition-colors line-clamp-2`}
                    >
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6e7377]">
                      {formatDate(r.date)} • {r.readTime}
                    </p>
                  </div>
                </Link>
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
