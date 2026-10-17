/** Helpers for the parallel (split-screen) route transition. */

export const TRANSITION_MS = 1150;
export const TRANSITION_FALLBACK_MS = TRANSITION_MS + 700;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll offsets remembered per history entry, for back/forward. */
const scrollMemory = new Map<string, number>();
export const rememberScroll = (key: string, y: number) =>
  scrollMemory.set(key, y);
export const recallScroll = (key: string) => scrollMemory.get(key) ?? 0;

/** Same-origin, plain left-clicks on links into the blog routes. */
export function transitionHrefFor(event: MouseEvent): string | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return null;
  const target = event.target;
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a");
  if (!anchor) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (!/^\/blogs(\/|$)/.test(url.pathname)) return null;
  if (url.pathname === window.location.pathname && !url.search) return null;
  return url.pathname + url.search + url.hash;
}

export function pageLabel(pathname: string): { code: string; name: string } {
  const slug = pathname.replace(/^\/blogs\/?/, "").split("/")[0];
  if (pathname.startsWith("/blogs") && slug)
    return { code: "SR—01", name: slug.replace(/-/g, " ") };
  if (pathname.startsWith("/blogs")) return { code: "SR—00", name: "archive" };
  return { code: "SR—00", name: "index" };
}

let preloaded = false;
/** Warm the lazy article chunk so the incoming page is ready to be revealed. */
export function preloadBlogChunk(): Promise<unknown> {
  if (preloaded) return Promise.resolve();
  preloaded = true;
  return Promise.race([
    import("@/pages/blogs/[slug]").catch(() => undefined),
    new Promise((r) => setTimeout(r, 900)),
  ]);
}
