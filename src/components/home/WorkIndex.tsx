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
      className="group bg-surface rounded-3xl overflow-hidden hover-lift border hairline"
    >
      {cover && (
        <div className="overflow-hidden aspect-[16/9]">
          <img
            src={cover}
            alt=""
            aria-hidden
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display text-2xl text-text-primary">{project.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mt-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-surface-variant text-xs text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-5 border-t hairline">
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

const AllProjectsOverlay = ({ onClose }: { onClose: () => void }) => {
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

        <div className="rounded-3xl bg-surface-variant p-3 md:p-4">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.demoUrl ?? p.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="index-row flex items-center justify-between gap-4 px-4 py-4 rounded-2xl"
            >
              <span>
                <span className="font-medium text-text-primary block">{p.title}</span>
                <span className="text-xs text-text-muted mt-0.5 block">
                  {p.tech.slice(0, 4).join(" · ")}
                </span>
              </span>
              <ArrowUpRight className="row-arrow w-5 h-5 text-text-primary shrink-0" />
            </a>
          ))}
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
        {showAll && <AllProjectsOverlay onClose={() => setShowAll(false)} />}
      </AnimatePresence>
    </section>
  );
};
