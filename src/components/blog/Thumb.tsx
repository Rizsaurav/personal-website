import Cover from "./Cover";
import { paletteFor } from "./art";
import type { PostMeta } from "@/pages/blogs/posts";

/** The framed cover: colour panel on a cream mat, a misregistered hairline
    frame and a tilted second card behind it. Used on the index, in the article
    header and on the next/related cards. */
export default function Thumb({
  post,
  size = "md",
  plate = false,
  animate = false,
}: {
  post: PostMeta;
  size?: "sm" | "md" | "lg";
  plate?: boolean;
  animate?: boolean;
}) {
  const pal = paletteFor(post.unit);
  return (
    <span
      className={`bl-thumb bl-thumb-${size}`}
      style={{ ["--pal-bg" as string]: pal.bg, ["--pal-accent" as string]: pal.accent }}
    >
      <span className="bl-thumb-back" aria-hidden="true" />
      <span className="bl-thumb-frame" aria-hidden="true" />
      <span className="bl-thumb-card">
        <span className="bl-thumb-art">
          <Cover post={post} variant={size === "lg" ? "full" : "compact"} animate={animate} />
        </span>
        {plate && (
          <span className="bl-thumb-plate">
            <i>No. {String(post.unit).padStart(2, "0")}</i>
            <span>{post.kind === "research" ? "Research" : "Project"}</span>
          </span>
        )}
      </span>
    </span>
  );
}
