import { Link } from "react-router-dom";
import { formatDate, type PostMeta } from "@/pages/blogs/posts";
import type { Project } from "@/data/projects";
import Thumb from "./Thumb";

function Card({ p, dir }: { p: PostMeta; dir: "older" | "newer" }) {
  return (
    <Link to={`/blogs/${p.slug}`} className={`bl-pn bl-lift bl-pn-${dir}`}>
      <Thumb post={p} size="sm" />
      <span className="bl-pn-text">
        <span className="bl-small">{dir === "older" ? "← Older story" : "Newer story →"}</span>
        <strong>{p.title}</strong>
        <span className="bl-pn-meta">
          {formatDate(p.date)} · {p.readTime}
        </span>
      </span>
    </Link>
  );
}

export default function ArticleFooter({
  post,
  project,
  older,
  newer,
  related,
}: {
  post: PostMeta;
  project?: Project;
  older?: PostMeta;
  newer?: PostMeta;
  related: PostMeta[];
}) {
  return (
    <footer className="bl-foot">
      <section className="bl-colophon" aria-labelledby="bl-colo-h">
        <h2 id="bl-colo-h">Colophon</h2>
        <p>
          Written by {post.author}, {formatDate(post.date)}. {post.readTime}.
          {post.tags.length > 0 && <> Filed under {post.tags.join(", ")}.</>}
        </p>
        <p>
          Set in Fraunces and Inter. The cover is drawn in SVG from this
          article's own stages, figures and words.
        </p>
        <p className="bl-colo-links">
          {project?.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
              Source code ↗
            </a>
          )}
          {project?.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              Live demo ↗
            </a>
          )}
          <button type="button" onClick={() => window.scrollTo({ top: 0 })}>
            Back to top ↑
          </button>
        </p>
      </section>

      {(older || newer) && (
        <nav className="bl-pn-wrap" aria-label="More stories">
          {older ? <Card p={older} dir="older" /> : <span />}
          {newer ? <Card p={newer} dir="newer" /> : <span />}
        </nav>
      )}
      {related.length > 0 && (
        <section aria-labelledby="bl-related-h">
          <h2 id="bl-related-h" className="bl-related-h">
            More like this
          </h2>
          <ul className="bl-related">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/blogs/${r.slug}`} className="bl-lift">
                  <Thumb post={r} size="sm" />
                  <strong>{r.title}</strong>
                  <span>{r.tags.slice(0, 3).join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </footer>
  );
}
