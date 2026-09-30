import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Github, X, BookOpen } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { loadCoverMap } from "@/data/covers";

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
  onHoverCover,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
  onHoverCover: (slug: string | null) => void;
}) => (
  <div
    className="border-t hairline last:border-b"
    onMouseEnter={() => onHoverCover(project.blogSlug ?? null)}
    onMouseLeave={() => onHoverCover(null)}
  >
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
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [activeCover, setActiveCover] = useState<string | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const reduce = useReducedMotion();
  const featured = projects.filter((p) => p.featured);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });

  useEffect(() => {
    loadCoverMap().then(setCovers);
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const showPreview = finePointer && !reduce && activeCover && covers[activeCover];

  return (
    <section id="work" className="bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
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

        <div
          onMouseMove={(e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
          }}
        >
          {featured.map((p, i) => (
            <FeaturedRow
              key={p.id}
              project={p}
              index={i}
              open={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
              onHoverCover={setActiveCover}
            />
          ))}
        </div>

        <p className="label-caps text-text-muted mt-6 hidden md:block">
          Hover a project to preview it
        </p>
      </div>

      {/* Floating cover preview that follows the cursor */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed top-0 left-0 z-40 pointer-events-none hidden md:block"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          >
            <img
              src={covers[activeCover!]}
              alt=""
              aria-hidden
              className="w-[22rem] h-[14rem] object-cover rounded-lg shadow-2xl -translate-x-1/2 -translate-y-[110%] border hairline"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAll && <AllProjectsOverlay onClose={() => setShowAll(false)} />}
      </AnimatePresence>
    </section>
  );
};
