import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import "./archive.css";

const FEATURED = new Set([14, 11, 12, 13, 1]);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "More projects": rows that unfold into a short brief with links. Opens on hover (pointer)
 * or tap, and stays open until another row is hovered or tapped, the empty space around is
 * tapped, or Escape is pressed.
 */
export function Archive() {
  const rest = projects.filter(
    (p) => !FEATURED.has(p.id) && p.kind !== "research",
  );
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const timer = useRef(0);

  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".arc-row")) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const hover = (i: number) => {
    window.clearTimeout(timer.current);
    // a short intent delay keeps a passing cursor from flickering rows open
    timer.current = window.setTimeout(() => setOpen(i), 90);
  };

  return (
    <section ref={root} className="arc" id="archive" aria-labelledby="arc-h">
      <div className="arc-wrap">
        <header className="arc-head-wrap">
          <p className="arc-kick">02b / Also built</p>
          <h2 id="arc-h">
            More <em>projects</em>
          </h2>
          <p className="arc-sub">
            {rest.length} smaller builds. Hover or tap one for the short
            version.
          </p>
        </header>
        <ul
          className="arc-list"
          onPointerLeave={() => window.clearTimeout(timer.current)}
        >
          {rest.map((p, i) => {
            const isOpen = open === i;
            return (
              <li
                key={p.id}
                className={`arc-row${isOpen ? " is-open" : ""}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && hover(i)}
              >
                <button
                  type="button"
                  className="arc-head"
                  aria-expanded={isOpen}
                  aria-controls={`arc-p-${p.id}`}
                  onClick={() => {
                    window.clearTimeout(timer.current);
                    setOpen(isOpen ? null : i);
                  }}
                >
                  <span className="arc-n">{pad(i + 1)}</span>
                  <span className="arc-t">{p.title}</span>
                  <span className="arc-tags">
                    {p.tech.slice(0, 3).join(" · ")}
                  </span>
                  <Plus className="arc-plus" size={16} aria-hidden="true" />
                </button>
                <div
                  className="arc-panel"
                  id={`arc-p-${p.id}`}
                  role="region"
                  aria-label={p.title}
                >
                  <div className="arc-inner">
                    <p className="arc-desc">{p.description}</p>
                    <p className="arc-tech">{p.tech.join(" / ")}</p>
                    <div className="arc-links">
                      <Link
                        to={`/blogs/${p.blogSlug}`}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        Read the project <ArrowUpRight size={14} />
                      </Link>
                      <a
                        href={p.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <Github size={14} /> Code
                      </a>
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={isOpen ? 0 : -1}
                        >
                          Live demo <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
