import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { loadAllPosts, type PostMeta } from "./posts";
import { projects } from "@/data/projects";
import { parseArticle, slugify } from "@/components/blog/markdown";
import { useScrollSpy } from "@/components/blog/hooks";
import { Chrome, Toc } from "@/components/blog/Chrome";
import { scrollToId } from "@/components/blog/utils";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleFooter from "@/components/blog/ArticleFooter";
import Divider from "@/components/blog/Divider";
import { paletteFor } from "@/components/blog/art";
import "@/components/blog/blog.css";

const CommentSection = lazy(() =>
  import("./BlogComponents").then((m) => ({ default: m.CommentSection })),
);
const VisualBlock = lazy(() => import("@/components/blog/Visuals"));
const Lightbox = lazy(() => import("@/components/blog/Lightbox"));

function sharedTagCount(a: PostMeta, b: PostMeta): number {
  return a.tags.filter((t) => b.tags.includes(t)).length;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bl bl-center">
      <p className="bl-label">{children}</p>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [all, setAll] = useState<PostMeta[] | null>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    loadAllPosts().then(setAll);
  }, [slug]);

  const idx = all ? all.findIndex((p) => p.slug === slug) : -1;
  const post = idx >= 0 && all ? all[idx] : null;

  const article = useMemo(() => (post ? parseArticle(post.body) : null), [post]);
  const project = useMemo(
    () => projects.find((p) => p.blogSlug === slug),
    [slug],
  );
  const related = useMemo(() => {
    if (!all || !post) return [];
    return all
      .filter((x) => x.slug !== post.slug && sharedTagCount(x, post) > 0)
      .sort((a, b) => sharedTagCount(b, post) - sharedTagCount(a, post))
      .slice(0, 3);
  }, [all, post]);

  const newer = all && idx > 0 ? all[idx - 1] : undefined;
  const older = all && idx >= 0 ? all[idx + 1] : undefined;
  const readNext = related[0] ?? newer ?? older;

  useEffect(() => {
    if (!post) return;
    // The route transition resets scroll itself once the old page is gone.
    if (!document.documentElement.dataset.transition) window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${post.title} | Saurav Rijal`;
    return () => {
      document.title = prev;
    };
  }, [post]);

  const toc = useMemo(() => article?.toc ?? [], [article]);
  const h2 = useMemo(() => toc.filter((t) => t.depth === 2), [toc]);
  const activeId = useScrollSpy(toc.map((t) => t.id));
  const activeSection =
    toc.find((t) => t.id === activeId)?.text ?? post?.title ?? "";

  // J / K jump between sections.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "j" && e.key !== "k") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], dialog")) return;
      const ids = h2.map((x) => x.id);
      const cur = ids.indexOf(
        toc.find((x) => x.id === activeId && x.depth === 2)?.id ?? "",
      );
      const next = e.key === "j" ? cur + 1 : cur - 1;
      if (next >= 0 && next < ids.length) scrollToId(ids[next]);
      else if (next < 0) window.scrollTo({ top: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [h2, toc, activeId]);

  const onBodyClick = useCallback((e: MouseEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    const copy = t.closest<HTMLButtonElement>("[data-copy]");
    if (copy) {
      const code = copy.closest(".bl-code")?.querySelector("code")?.textContent;
      if (code) {
        navigator.clipboard
          ?.writeText(code)
          .then(() => {
            copy.textContent = "Copied";
            window.setTimeout(() => (copy.textContent = "Copy"), 1600);
          })
          .catch(() => undefined);
      }
      return;
    }
    const z = t.closest<HTMLElement>("[data-zoom]");
    const img = z?.querySelector("img");
    if (img) setZoom({ src: img.currentSrc || img.src, alt: img.alt });
  }, []);

  if (all && !post) {
    return (
      <div className="bl bl-center">
        <div>
          <p className="bl-small">404</p>
          <h1 className="bl-404">Story not found.</h1>
          <Link to="/blogs" className="bl-btn">
            ← All stories
          </Link>
        </div>
      </div>
    );
  }
  if (!post || !article) return <Shell>Loading story…</Shell>;

  const visualsAfter = (id: string) =>
    post.visuals.filter((v) => (v.after ? slugify(v.after) : "") === id);

  const renderVisuals = (id: string) =>
    visualsAfter(id).map((v) => (
      <Suspense key={v.title} fallback={<div className="bl-viz bl-viz-wait" />}>
        <VisualBlock v={v} />
      </Suspense>
    ));

  const pal = paletteFor(post.unit);
  const pull = (id: string) =>
    post.pull && slugify(post.pull.after) === id ? (
      <aside className="bl-pull" aria-hidden="true">
        <span className="bl-pull-mark">“</span>
        <p>{post.pull.text}</p>
      </aside>
    ) : null;

  return (
    <div className="bl" style={{ ["--bl-accent" as string]: pal.accent }}>
      <a className="bl-skip" href="#bl-main" onClick={(e) => {
        e.preventDefault();
        document.getElementById("bl-main")?.focus();
        scrollToId("bl-main");
      }}>
        Skip to article
      </a>
      <Chrome section={activeSection} ready />

      <main id="bl-main" tabIndex={-1}>
        <article>
          <ArticleHeader
            post={post}
            project={project}
            stats={article.stats}
            next={readNext}
          />

          <div className="bl-layout">
            <Toc toc={toc} activeId={activeId} />
            <div className="bl-col" onClick={onBodyClick}>
              {article.intro && (
                <div
                  className="bl-prose bl-lead"
                  dangerouslySetInnerHTML={{ __html: article.intro }}
                />
              )}
              {renderVisuals("")}
              {article.sections.map((s, i) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <Divider n={i + 1} />
                  <div
                    className="bl-prose"
                    dangerouslySetInnerHTML={{ __html: s.html }}
                  />
                  {renderVisuals(s.id)}
                  {pull(s.id)}
                </section>
              ))}
            </div>
          </div>
        </article>

        <ArticleFooter
          post={post}
          project={project}
          older={older}
          newer={newer}
          related={related}
        />

        {import.meta.env.VITE_FIREBASE_API_KEY && (
          <div className="bl-comments">
            <Suspense fallback={<p>Loading comments…</p>}>
              <CommentSection />
            </Suspense>
          </div>
        )}
      </main>

      {zoom && (
        <Suspense fallback={null}>
          <Lightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />
        </Suspense>
      )}
    </div>
  );
}
