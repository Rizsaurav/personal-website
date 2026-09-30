import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, X, BookOpen, Plus } from "lucide-react";
import { Marked } from "marked";
import DOMPurify from "dompurify";
import { projects, type Project } from "@/data/projects";
import { loadCoverMap } from "@/data/covers";
import { loadPost, type PostMeta } from "@/pages/blogs/posts";

/* ------------------------------------------------------------------ */
/* Accordion row: expands a quiet preview on hover (fine pointers),    */
/* tap / click anywhere opens the full dossier modal.                 */
/* ------------------------------------------------------------------ */
const ProjectRow = ({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) => {
  return (
    <button
      onClick={() => onOpen(project)}
      className="project-row group w-full text-left border-t hairline last:border-b px-2 md:px-4 cursor-pointer"
    >
      <div className="flex items-center gap-4 py-5">
        <span className="label-caps text-text-muted w-8 shrink-0">
          0{index + 1}
        </span>
        <span className="font-display text-xl md:text-2xl text-text-primary flex-1 leading-snug">
          {project.title}
        </span>
        <Plus className="row-plus w-5 h-5 text-text-muted shrink-0" />
      </div>
      <div className="acc-preview">
        <div className="acc-preview-inner">
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            {project.description}
          </p>
          <p className="text-xs text-text-muted mt-3 tracking-wide">
            {project.tech.slice(0, 6).join("  ·  ")}
          </p>
          <p className="text-xs font-medium text-text-primary mt-3 pb-6">
            Open dossier <ArrowUpRight className="w-3.5 h-3.5 inline -mt-0.5" />
          </p>
        </div>
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Dossier modal: cover, tabs (Overview / Build story), GitHub pinned  */
/* at the top of the story. Escape / backdrop click closes.            */
/* ------------------------------------------------------------------ */
const ProjectModal = ({
  project,
  cover,
  onClose,
}: {
  project: Project;
  cover?: string;
  onClose: () => void;
}) => {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"overview" | "story">("overview");
  const [post, setPost] = useState<PostMeta | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const modalMarked = useMemo(() => new Marked(), []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (tab === "story" && project.blogSlug && !post && !loadingStory) {
      setLoadingStory(true);
      loadPost(project.blogSlug).then((p) => {
        setPost(p);
        setLoadingStory(false);
      });
    }
  }, [tab, project.blogSlug, post, loadingStory]);

  const storyHtml = useMemo(
    () =>
      post?.body
        ? DOMPurify.sanitize(modalMarked.parse(post.body) as string)
        : "",
    [post, modalMarked]
  );

  const tabs = (
    [
      { id: "overview", label: "Overview" },
      ...(project.blogSlug ? [{ id: "story", label: "Build story" }] : []),
    ] as const
  );

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-end md:items-center justify-center md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} dossier`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 48, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-background w-full max-w-3xl max-h-[92vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Close dossier"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto">
          {cover && (
            <div className="h-48 md:h-64 overflow-hidden shrink-0">
              <img src={cover} alt="" aria-hidden className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-10">
            <p className="label-caps text-text-muted mb-3">Project dossier</p>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
              {project.title}
            </h2>

            <div className="flex gap-7 mt-6 border-b hairline">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    tab === t.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="dossier-tab"
                      className="absolute left-0 right-0 -bottom-px h-0.5 bg-text-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {tab === "overview" ? (
              <div className="pt-6">
                <p className="text-text-secondary leading-relaxed">
                  {project.fullDescription || project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-text-primary text-background text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium bg-text-primary text-background rounded-full px-6 py-2.5 hover:opacity-85 transition-opacity"
                    >
                      Live demo <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-2.5 border hairline text-text-primary hover:bg-text-primary hover:text-background transition-colors"
                  >
                    <Github className="w-4 h-4" /> Code
                  </a>
                  {project.blogSlug && (
                    <button
                      onClick={() => setTab("story")}
                      className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-6 py-2.5 border hairline text-text-primary hover:bg-text-primary hover:text-background transition-colors"
                    >
                      <BookOpen className="w-4 h-4" /> Build story
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium bg-text-primary text-background rounded-full px-5 py-2 hover:opacity-85 transition-opacity"
                  >
                    <Github className="w-4 h-4" /> View code on GitHub
                  </a>
                  {post && (
                    <span className="text-xs text-text-muted">{post.readTime}</span>
                  )}
                </div>
                {loadingStory && (
                  <p className="text-sm text-text-muted">Loading build story…</p>
                )}
                {post && (
                  <div
                    className="modal-prose"
                    dangerouslySetInnerHTML={{ __html: storyHtml }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* View-all overlay: compact rows, each opens the dossier modal.       */
/* ------------------------------------------------------------------ */
const AllProjectsOverlay = ({
  onClose,
  covers,
  onOpen,
}: {
  onClose: () => void;
  covers: Record<string, string>;
  onOpen: (p: Project) => void;
}) => {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background overflow-y-auto"
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="All projects"
    >
      <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-text-primary">
            All projects{" "}
            <span className="text-text-muted text-2xl">({projects.length})</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close project index"
            className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-text-primary hover:bg-text-primary hover:text-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-3xl bg-surface-variant p-3 md:p-4">
          {projects.map((p) => {
            const thumb = p.blogSlug ? covers[p.blogSlug] : undefined;
            return (
              <button
                key={p.id}
                onClick={() => onOpen(p)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-surface transition-colors text-left cursor-pointer"
              >
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                )}
                <span className="flex-1 min-w-0">
                  <span className="font-medium text-text-primary block truncate">
                    {p.title}
                  </span>
                  <span className="text-xs text-text-muted mt-0.5 block truncate">
                    {p.tech.slice(0, 4).join("  ·  ")}
                  </span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-text-muted shrink-0" />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-text-muted text-center mt-6">
          Select any project for the full dossier.
        </p>
      </div>
    </motion.div>
  );
};

export const WorkIndex = () => {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const featured = projects.filter((p) => p.featured);

  useEffect(() => {
    loadCoverMap().then(setCovers);
  }, []);

  const activeCover = active?.blogSlug ? covers[active.blogSlug] : undefined;

  return (
    <section id="work" className="max-w-6xl mx-auto px-4 md:px-6 py-6 scroll-mt-20">
      <div className="flex items-end justify-between px-2 mb-6">
        <div>
          <p className="label-caps text-text-muted mb-3">01 · Work</p>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary">
            Selected projects
          </h2>
        </div>
        <button
          onClick={() => setShowAll(true)}
          className="text-sm font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
        >
          View all ({projects.length}) <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-[2rem] bg-surface-variant px-4 md:px-8 py-2">
        {featured.map((p, i) => (
          <ProjectRow key={p.id} project={p} index={i} onOpen={setActive} />
        ))}
      </div>

      <AnimatePresence>
        {showAll && (
          <AllProjectsOverlay
            onClose={() => setShowAll(false)}
            covers={covers}
            onOpen={setActive}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <ProjectModal
            project={active}
            cover={activeCover}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
