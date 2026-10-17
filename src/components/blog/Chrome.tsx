import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import { useReadingProgress } from "./hooks";
import type { TocEntry } from "./markdown";
import { scrollToId } from "./utils";


/** Fixed top bar: back, theme toggle, section name, reading progress. */
export function Chrome({ section, ready }: { section: string; ready: boolean }) {
  const navigate = useNavigate();
  const bar = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  useReadingProgress(bar, pct, [ready]);
  // Back returns to wherever the reader came from; direct visits go home.
  const goBack = () =>
    window.history.state?.idx > 0 ? navigate(-1) : navigate("/");

  return (
    <header className="bl-chrome">
      <div className="bl-chrome-in">
        <button type="button" className="bl-nav" onClick={goBack}>
          <span aria-hidden="true">←</span> Back
        </button>
        <Link to="/blogs" className="bl-nav bl-hide-sm">
          All stories
        </Link>
        <span className="bl-chrome-sec" aria-hidden="true">
          {section}
        </span>
        <span className="bl-pct bl-hide-sm" ref={pct} aria-hidden="true">
          0%
        </span>
        <DarkModeToggle className="bl-theme" />
      </div>
      <div className="bl-progress" aria-hidden="true">
        <span ref={bar} />
      </div>
    </header>
  );
}

/** Sticky scroll-spy rail on desktop; collapsible bar on phones and tablets. */
export function Toc({ toc, activeId }: { toc: TocEntry[]; activeId: string }) {
  const [open, setOpen] = useState(false);
  const current = toc.find((t) => t.id === activeId);
  if (toc.length === 0) return null;
  return (
    <aside className="bl-toc" aria-label="Table of contents">
      <button
        type="button"
        className="bl-toc-toggle"
        aria-expanded={open}
        aria-controls="bl-toc-list"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="bl-small">Contents</span>
        <span className="bl-toc-cur">{current?.text ?? "Introduction"}</span>
        <span className="bl-toc-caret" aria-hidden="true" data-open={open} />
      </button>
      <nav id="bl-toc-list" className={open ? "is-open" : ""}>
        <p className="bl-small bl-toc-head">On this page</p>
        <ol>
          {toc.map((t, i) => (
            <li key={t.id} data-depth={t.depth}>
              <a
                href={`#${t.id}`}
                aria-current={t.id === activeId ? "location" : undefined}
                className={t.id === activeId ? "is-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollToId(t.id);
                }}
              >
                <span className="bl-toc-no">{String(i + 1).padStart(2, "0")}</span>
                {t.text}
              </a>
            </li>
          ))}
        </ol>
        <p className="bl-keys">
          Tip: press <kbd>J</kbd> or <kbd>K</kbd> to move between sections
        </p>
      </nav>
    </aside>
  );
}
