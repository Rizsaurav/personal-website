import { Link } from "react-router-dom";
import type { PostMeta } from "@/pages/blogs/posts";
import { formatDate } from "@/pages/blogs/posts";
import type { Project } from "@/data/projects";
import Thumb from "./Thumb";
import { TraceBackdrop } from "./Divider";

const titleSize = (t: string) =>
  t.length > 62
    ? "clamp(30px, 4.1vw, 58px)"
    : t.length > 40
      ? "clamp(34px, 5vw, 72px)"
      : "clamp(38px, 6.2vw, 92px)";

/** Editorial header: big Fraunces title beside the framed cover, then a
    plain-language summary. Everything is read from the article's front-matter,
    its body and src/data/projects.ts. */
export default function ArticleHeader({
  post,
  project,
  stats,
  next,
}: {
  post: PostMeta;
  project?: Project;
  stats: { value: string; label: string }[];
  next?: PostMeta;
}) {
  const stack = project?.tech ?? [];
  return (
    <header className="bl-head">
      <TraceBackdrop />
      <span className="bl-ghost" aria-hidden="true">
        {String(post.unit).padStart(2, "0")}
      </span>
      <div className="bl-hero">
        <div className="bl-hero-text">
          <p className="bl-kicker">{post.kind === "research" ? "Research" : "Project"} · No. {String(post.unit).padStart(2, "0")}</p>
          <h1 style={{ ["--t" as string]: titleSize(post.title) }}>{post.title}</h1>
          <p className="bl-byline">
            By {post.author} · {formatDate(post.date)} · {post.readTime}
          </p>
        </div>
        <div className="bl-hero-art">
          <Thumb post={post} size="lg" animate />
        </div>
      </div>

      <section className="bl-tldr" aria-labelledby="bl-tldr-h">
        <h2 id="bl-tldr-h" className="bl-tldr-h">
          The short version
        </h2>
        <p className="bl-tldr-text">{post.summary}</p>

        {stats.length > 0 && (
          <ul className="bl-keyfig" aria-label="Key figures">
            {stats.map((s) => (
              <li key={s.value + s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        )}

        {(stack.length > 0 || project?.codeUrl || project?.demoUrl) && (
          <div className="bl-tldr-grid">
            {stack.length > 0 && (
              <div>
                <h3 className="bl-small">Built with</h3>
                <ul className="bl-chips">
                  {stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {(project?.codeUrl || project?.demoUrl) && (
              <div>
                <h3 className="bl-small">See it</h3>
                <ul className="bl-links">
                  {project.demoUrl && (
                    <li>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        Live demo <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  )}
                  {project.codeUrl && (
                    <li>
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                        Source code <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {next && (
          <Link to={`/blogs/${next.slug}`} className="bl-readnext bl-lift">
            <Thumb post={next} size="sm" />
            <span>
              <span className="bl-small">Read next</span>
              <strong>{next.title}</strong>
            </span>
          </Link>
        )}
      </section>
    </header>
  );
}
