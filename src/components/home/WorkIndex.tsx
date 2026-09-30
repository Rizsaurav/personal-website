import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, X, BookOpen } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { loadCoverMap } from "@/data/covers";

const ProjectCard = ({
  project,
  cover,
  index,
}: {
  project: Project;
  cover?: string;
  index: number;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-surface rounded-3xl overflow-hidden hover-lift border hairline cursor-pointer"
    >
      <a
        href={project.demoUrl ?? project.codeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — open ${project.demoUrl ? "live demo" : "source code"}`}
        className="absolute inset-0 z-0"
      />
      {cover && (
        <div className="relative overflow-hidden aspect-[16/9] bg-neutral-950">
          <img
            src={cover}
            alt=""
            aria-hidden
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <p className="text-white/95 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
          <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="label-caps text-text-muted">0{index + 1}</span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border hairline text-text-secondary">
            Featured
          </span>
        </div>
        <h3 className="font-display text-2xl text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mt-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-text-primary text-background text-xs font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="relative z-10 flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-5 border-t hairline">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
            >
              Live demo <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
          >
            <Github className="w-4 h-4" /> Code
          </a>
          {project.blogSlug && (
            <a
              href={`/blogs/${project.blogSlug}`}
              className="text-sm font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
            >
              <BookOpen className="w-4 h-4" /> Build story
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const AllProjectsOverlay = ({
  onClose,
  covers,
}: {
  onClose: () => void;
  covers: Record<string, string>;
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
            All projects <span className="text-text-muted text-2xl">({projects.length})</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close project index"
            className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-text-primary hover:bg-text-primary hover:text-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-3xl bg-surface-variant p-3 md:p-4 space-y-2">
          {projects.map((p) => {
            const cover = p.blogSlug ? covers[p.blogSlug] : undefined;
            return (
              <div
                key={p.id}
                className="bg-surface rounded-2xl p-4 md:p-5 flex gap-4 md:gap-5 border hairline"
              >
                {cover && (
                  <img
                    src={cover}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg md:text-xl text-text-primary leading-snug">
                      {p.title}
                    </h3>
                    <a
                      href={p.demoUrl ?? p.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.title}`}
                      className="w-9 h-9 rounded-full bg-text-primary text-background flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1.5 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tech.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-text-primary text-background text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
                      >
                        Live demo <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={p.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
                    >
                      <Github className="w-3.5 h-3.5" /> Code
                    </a>
                    {p.blogSlug && (
                      <a
                        href={`/blogs/${p.blogSlug}`}
                        className="text-xs font-medium text-text-primary inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Build story
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export const WorkIndex = () => {
  const [showAll, setShowAll] = useState(false);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const featured = projects.filter((p) => p.featured);

  useEffect(() => {
    loadCoverMap().then(setCovers);
  }, []);

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

      <div className="rounded-[2rem] bg-surface-variant p-4 md:p-6 grid sm:grid-cols-2 gap-4 md:gap-6">
        {featured.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            cover={p.blogSlug ? covers[p.blogSlug] : undefined}
          />
        ))}
      </div>

      <AnimatePresence>
        {showAll && <AllProjectsOverlay onClose={() => setShowAll(false)} covers={covers} />}
      </AnimatePresence>
    </section>
  );
};
