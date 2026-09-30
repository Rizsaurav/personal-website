import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, X, BookOpen } from "lucide-react";
import { projects, type Project } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
    {project.demoUrl && (
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="label-caps text-text-primary underline underline-offset-4 decoration-text-primary/30 hover:decoration-text-primary inline-flex items-center gap-1"
      >
        Live demo <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    )}
    <a
      href={project.codeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="label-caps text-text-primary underline underline-offset-4 decoration-text-primary/30 hover:decoration-text-primary inline-flex items-center gap-1"
    >
      <Github className="w-3.5 h-3.5" /> Code
    </a>
    {project.blogSlug && (
      <a
        href={`/blogs/${project.blogSlug}`}
        className="label-caps text-text-primary underline underline-offset-4 decoration-text-primary/30 hover:decoration-text-primary inline-flex items-center gap-1"
      >
        <BookOpen className="w-3.5 h-3.5" /> Build story
      </a>
    )}
  </div>
);

const FeaturedRow = ({
  project,
  index,
  open,
  onToggle,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
}) => (
  <div className="border-t hairline last:border-b">
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="index-row w-full text-left grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-baseline gap-4 py-7 md:py-9 px-2 md:px-4 cursor-pointer"
    >
      <span className="label-caps text-text-muted">{pad(index + 1)}</span>
      <span>
        <span className="font-display text-2xl md:text-4xl text-text-primary leading-tight block">
          {project.title}
        </span>
        <span className="text-text-secondary mt-2 block max-w-2xl leading-relaxed">
          {project.description}
        </span>
        <span className="label-caps text-text-muted mt-3 block">
          {project.tech.slice(0, 4).join(" · ")}
        </span>
      </span>
      <ArrowUpRight className="row-arrow w-6 h-6 text-text-primary self-start mt-1" />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="px-2 md:px-4 pb-8 md:pl-[5rem] max-w-3xl">
            <p className="text-text-secondary leading-relaxed">{project.fullDescription}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border hairline text-sm text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
            <ProjectLinks project={project} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

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
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="label-caps text-text-muted mb-2">Index</p>
            <h2 className="font-display text-4xl md:text-6xl text-text-primary">
              All projects <span className="italic font-light">({projects.length})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project index"
            className="w-12 h-12 rounded-full border hairline flex items-center justify-center hover:bg-text-primary hover:text-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={p.demoUrl ?? p.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="index-row grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 px-2 border-t hairline last:border-b"
            >
              <span className="label-caps text-text-muted">{pad(i + 1)}</span>
              <span>
                <span className="text-lg md:text-xl font-medium text-text-primary block">
                  {p.title}
                </span>
                <span className="label-caps text-text-muted mt-1 block">
                  {p.tech.slice(0, 5).join(" · ")}
                </span>
              </span>
              <ArrowUpRight className="row-arrow w-5 h-5 text-text-primary" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const WorkIndex = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" className="py-16 md:py-24">
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <p className="label-caps text-text-muted mb-3">01</p>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary">
            Selected <span className="italic font-light">work</span>
          </h2>
        </div>
        <button
          onClick={() => setShowAll(true)}
          className="label-caps text-text-primary border-b hairline pb-1 hover:opacity-60 transition-opacity inline-flex items-center gap-1 shrink-0"
        >
          View all ({projects.length}) <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div>
        {featured.map((p, i) => (
          <FeaturedRow
            key={p.id}
            project={p}
            index={i}
            open={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {showAll && <AllProjectsOverlay onClose={() => setShowAll(false)} />}
      </AnimatePresence>
    </section>
  );
};
