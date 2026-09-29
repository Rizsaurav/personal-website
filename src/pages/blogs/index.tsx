import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { loadAllPosts, formatDate, type PostMeta } from "./posts";

const HEADING_FONT = "font-['Poppins','Montserrat',system-ui,sans-serif]";
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
      className={`${BODY_FONT} inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#e54d66] hover:text-[#d13a52] transition-colors`}
    >
      Read more →
    </Link>
  );
}

function HeroCard({ post }: { post: PostMeta }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8">
      <Link to={`/blogs/${post.slug}`} className="group block">
        <div className="relative flex flex-col md:block md:h-[440px]">
          {/* Dark panel + cover photo band */}
          <div className="md:absolute md:inset-0 flex flex-col md:flex-row">
            <div className="hidden md:block md:w-[42%] bg-[#2c2d31]" />
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-64 w-full object-cover md:h-full md:w-[58%]"
              />
            ) : (
              <div className="h-64 w-full bg-[#2c2d31] md:h-full md:w-[58%]" />
            )}
          </div>
          {/* Overlapping card */}
          <div className="relative bg-[#f3f7fa] p-8 md:absolute md:left-[8%] md:top-1/2 md:w-[40%] md:-translate-y-1/2 md:p-10 lg:p-12">
            <p
              className={`${BODY_FONT} text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e7377]`}
            >
              {formatDate(post.date)} • Featured • {post.readTime}
            </p>
            <div className="mt-3 h-[3px] w-[45px] bg-[#e54d66]" />
            <h2
              className={`${HEADING_FONT} mt-5 text-[30px] font-extrabold leading-[1.25] tracking-tight text-[#14161a]`}
            >
              {post.title}
            </h2>
            <p
              className={`${BODY_FONT} mt-4 text-[15px] leading-[1.7] text-[#6e7377] line-clamp-3`}
            >
              {post.summary}
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}

function StoryCard({ post }: { post: PostMeta }) {
  return (
    <article>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square w-full bg-[#2c2d31]" aria-hidden="true" />
      )}
      <div className="relative -mt-[28px] mr-[25px] bg-white p-6 pt-7">
        <Link to={`/blogs/${post.slug}`}>
          <h3
            className={`${HEADING_FONT} text-[20px] font-bold leading-[1.3] tracking-tight text-[#232639]`}
          >
            {post.title}
          </h3>
        </Link>
        <div className="mt-3">
          <MetaLine post={post} />
        </div>
        <div className="my-4 h-[3px] w-10 bg-[#e54d66]" />
        <p
          className={`${BODY_FONT} text-[14px] leading-[1.65] text-[#8a8f93] line-clamp-3`}
        >
          {post.summary}
        </p>
        <div className="mt-4">
          <ReadMoreLink slug={post.slug} />
        </div>
      </div>
    </article>
  );
}

function PickCard({ post }: { post: PostMeta }) {
  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:gap-8">
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-48 w-full object-cover sm:h-32 sm:w-40 sm:shrink-0"
        />
      ) : (
        <div
          className="h-48 w-full bg-[#2c2d31] sm:h-32 sm:w-40 sm:shrink-0"
          aria-hidden="true"
        />
      )}
      <div>
        <Link to={`/blogs/${post.slug}`}>
          <h3
            className={`${HEADING_FONT} text-[20px] font-bold leading-[1.3] tracking-tight text-[#232639]`}
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

  // Staff's Picks: prefer featured posts (excluding the hero), then newest.
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
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-10">
        <BackToHome />
      </div>

      {hero && <HeroCard post={hero} />}

      {/* Latest Stories */}
      <section className="mx-auto max-w-[1140px] px-6 py-16">
        <p
          className={`${BODY_FONT} text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377]`}
        >
          Browse and read the latest stuff
        </p>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            className={`${HEADING_FONT} mt-2.5 text-[30px] font-extrabold leading-none tracking-tight text-[#1c2333]`}
          >
            Latest Stories
          </h2>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex items-center gap-2 border-b border-[#e2e5e8] focus-within:border-[#e54d66]">
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
                      className={`${BODY_FONT} pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
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
              {visible.map((post) => (
                <StoryCard key={post.slug} post={post} />
              ))}
            </div>
            {rest.length > visibleCount && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setVisibleCount(rest.length)}
                  className={`${BODY_FONT} rounded-full bg-[#e54d66] px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#d13a52] transition-colors`}
                >
                  More posts
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Staff's Picks */}
      {picks.length > 0 && (
        <section className="border-t border-[#eef0f2]">
          <div className="mx-auto max-w-[1140px] px-6 py-16">
            <p
              className={`${BODY_FONT} text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e7377]`}
            >
              You have to read this!
            </p>
            <h2
              className={`${HEADING_FONT} mt-2.5 text-[30px] font-extrabold leading-none tracking-tight text-[#1c2333]`}
            >
              Staff's Picks
            </h2>
            <div className="mt-10 space-y-10">
              {picks.map((post) => (
                <PickCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
