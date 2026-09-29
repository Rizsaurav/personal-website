import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { loadAllPosts, formatDate, type PostMeta } from "./posts";
import { CursorDot, Magnetic, Reveal } from "./interactions";
import "./blogs.css";

const HEADING_FONT = "font-display";
const BODY_FONT = "font-['Inter',system-ui,sans-serif]";
const INITIAL_VISIBLE = 6;

function BackToHome() {
  return (
    <Link
      to="/"
      className={`${BODY_FONT} inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6e7377] hover:text-[#e54d66] transition-colors`}
    >
      <ArrowLeft className="h-4 w-4" /> Back to home
    </Link>
  );
}

function MetaLine({ post }: { post: PostMeta }) {
  return (
    <p
      className={`${BODY_FONT} text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6e7377]`}
    >
      {formatDate(post.date)}
      {post.tags.length > 0 && <> • {post.tags.join(", ").toUpperCase()}</>}
    </p>
  );
}

function ReadMoreLink({ slug }: { slug: string }) {
  return (
    <Link
      to={`/blogs/${slug}`}
      className={`${BODY_FONT} group/lm inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e54d66] hover:text-[#d13a52] transition-colors`}
    >
      Read more
      <span className="inline-block transition-transform duration-300 group-hover/lm:translate-x-1">
        →
      </span>
    </Link>
  );
}

function SectionHeader({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: string;
}) {
  return (
    <Reveal>
      <p className="blog-kicker">
        <span className="text-[#e54d66]">{index}</span>
        <span className="mx-3 text-[#d8d2c4]">/</span>
        {kicker}
      </p>
      <h2 className={`${HEADING_FONT} blog-section-title mt-3`}>{title}</h2>
    </Reveal>
  );
}

function HeroCard({ post }: { post: PostMeta }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8">
      <Reveal>
        <Link to={`/blogs/${post.slug}`} className="group block">
          <div className="blog-card-lift relative flex flex-col md:block md:h-[460px]">
            {/* Dark panel + cover photo band */}
            <div className="md:absolute md:inset-0 flex flex-col md:flex-row">
              <div className="hidden md:block md:w-[42%] bg-[#1c2333]" />
              <div className="blog-card-img h-64 w-full md:h-full md:w-[58%]">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#1c2333]" />
                )}
              </div>
            </div>
            {/* Overlapping card */}
            <div className="relative bg-white p-8 md:absolute md:left-[8%] md:top-1/2 md:w-[40%] md:-translate-y-1/2 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(20,22,26,0.10)]">
              <p
                className={`${BODY_FONT} text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e7377]`}
              >
                {formatDate(post.date)} • Featured • {post.readTime}
              </p>
              <div className="mt-3 h-[3px] w-[45px] bg-[#e54d66]" />
              <h2
                className={`${HEADING_FONT} mt-5 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.12] tracking-tight text-[#14161a]`}
              >
                {post.title}
              </h2>
              <p
                className={`${BODY_FONT} mt-4 text-[15px] leading-[1.7] text-[#6e7377] line-clamp-3`}
              >
                {post.summary}
              </p>
              <span
                className={`${BODY_FONT} mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e54d66]`}
              >
                Read the story
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}

function StoryCard({ post, index }: { post: PostMeta; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Magnetic max={4} className="h-full">
        <article className="blog-card-lift h-full bg-white">
          <Link to={`/blogs/${post.slug}`} className="block" aria-label={post.title}>
            <div className="blog-card-img aspect-[4/3] w-full">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full bg-[#1c2333]"
                  aria-hidden="true"
                />
              )}
            </div>
          </Link>
          <div className="relative -mt-[28px] mr-[25px] bg-white p-6 pt-7 border-t-2 border-[#e54d66]">
            <Link to={`/blogs/${post.slug}`}>
              <h3
                className={`${HEADING_FONT} text-[21px] font-semibold leading-[1.25] tracking-tight text-[#232639] hover:text-[#e54d66] transition-colors`}
              >
                {post.title}
              </h3>
            </Link>
            <div className="mt-3">
              <MetaLine post={post} />
            </div>
            <p
              className={`${BODY_FONT} mt-3 text-[14px] leading-[1.65] text-[#8a8f93] line-clamp-3`}
            >
              {post.summary}
            </p>
            <div className="mt-4">
              <ReadMoreLink slug={post.slug} />
            </div>
          </div>
        </article>
      </Magnetic>
    </Reveal>
  );
}

function PickCard({ post, index }: { post: PostMeta; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <article className="group flex flex-col gap-5 sm:flex-row sm:gap-8">
        <Link
          to={`/blogs/${post.slug}`}
          className="blog-card-img block h-48 w-full shrink-0 sm:h-36 sm:w-48"
          aria-label={post.title}
        >
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#1c2333]" aria-hidden="true" />
          )}
        </Link>
        <div className="flex flex-col justify-center">
          <p
            className={`${BODY_FONT} text-[10px] font-bold uppercase tracking-[0.2em] text-[#e54d66]`}
          >
            N°{String(index + 1).padStart(2, "0")}
          </p>
          <Link to={`/blogs/${post.slug}`}>
            <h3
              className={`${HEADING_FONT} mt-2 text-[22px] font-semibold leading-[1.25] tracking-tight text-[#232639] group-hover:text-[#e54d66] transition-colors`}
            >
              {post.title}
            </h3>
          </Link>
          <div className="mt-2">
            <MetaLine post={post} />
          </div>
          <div className="mt-3">
            <ReadMoreLink slug={post.slug} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    loadAllPosts().then(setPosts);
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [query, activeTag, posts]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q);
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  const isFiltering = query.trim() !== "" || activeTag !== null;

  // Hero only shows when no filters are active: first featured post,
  // otherwise the newest post (posts are date-desc from the loader).
  const hero: PostMeta | undefined =
    !isFiltering && filtered.length > 0
      ? filtered.find((p) => p.featured) ?? filtered[0]
      : undefined;

  const rest = hero ? filtered.filter((p) => p.slug !== hero.slug) : filtered;
  const visible = rest.slice(0, visibleCount);

  // Read These: prefer featured posts (excluding the hero), then newest.
  const picks = useMemo(() => {
    if (!posts) return [];
    const pool = hero ? posts.filter((p) => p.slug !== hero.slug) : posts;
    const out: PostMeta[] = [...pool.filter((p) => p.featured)];
    for (const p of pool) {
      if (out.length >= 3) break;
      if (!out.includes(p)) out.push(p);
    }
    return out.slice(0, 3);
  }, [posts, hero]);

  if (!posts) {
    return (
      <div className="blog-paper min-h-screen">
        <div className="blog-grain" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-6 pt-10">
          <BackToHome />
        </div>
        <p
          className={`${BODY_FONT} py-32 text-center text-[14px] text-[#6e7377]`}
        >
          Loading stories…
        </p>
      </div>
    );
  }

  return (
    <div className="blog-paper min-h-screen">
      <div className="blog-grain" aria-hidden="true" />
      <CursorDot />
      <div className="mx-auto max-w-[1280px] px-6 pt-10">
        <BackToHome />
      </div>

      {hero && <HeroCard post={hero} />}

      {/* Latest Stories */}
      <section className="mx-auto max-w-[1140px] px-6 py-16">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="01"
            kicker="Browse and read the latest stuff"
            title="Latest Stories"
          />
          <Reveal delay={0.1} className="md:pb-2">
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex items-center gap-2 border-b border-[#d8d2c4] focus-within:border-[#e54d66] transition-colors">
                <Search className="h-4 w-4 shrink-0 text-[#6e7377]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH POSTS"
                  aria-label="Search posts"
                  className={`${BODY_FONT} w-full bg-transparent pb-2 text-[13px] tracking-wide placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.18em] placeholder:text-[#a7adb2] focus:outline-none`}
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-5">
                  {["ALL", ...tags].map((t) => {
                    const isActive =
                      t === "ALL" ? activeTag === null : activeTag === t;
                    return (
                      <button
                        key={t}
                        onClick={() =>
                          setActiveTag(
                            t === "ALL" ? null : isActive ? null : t
                          )
                        }
                        className={`${BODY_FONT} tag-pill pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          isActive
                            ? "border-b-2 border-[#e54d66] text-[#e54d66]"
                            : "text-[#8a8f93] hover:text-[#14161a]"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className={`${BODY_FONT} text-[15px] text-[#8a8f93]`}>
              No stories match your search.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
              className={`${BODY_FONT} mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#e54d66] hover:text-[#d13a52]`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, i) => (
                <StoryCard key={post.slug} post={post} index={i} />
              ))}
            </div>
            {rest.length > visibleCount && (
              <div className="mt-14 flex justify-center">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount(rest.length)}
                  className={`${BODY_FONT} rounded-full bg-[#e54d66] px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_25px_rgba(229,77,102,0.35)] hover:bg-[#d13a52] transition-colors`}
                >
                  More posts
                </motion.button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Read These */}
      {picks.length > 0 && (
        <section className="border-t border-[#e7e2d8]">
          <div className="mx-auto max-w-[1140px] px-6 py-16">
            <SectionHeader
              index="02"
              kicker="You have to read this!"
              title="Read These"
            />
            <div className="mt-10 space-y-10">
              {picks.map((post, i) => (
                <PickCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
