/** Schedule optional work without leaving callbacks alive after a route unmounts. */
export function onIdle(work: () => void, timeout: number, fallback = 200) {
  let cancelled = false;
  const run = () => {
    if (!cancelled) work();
  };
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(run, { timeout });
    return () => {
      cancelled = true;
      window.cancelIdleCallback(id);
    };
  }
  const id = globalThis.setTimeout(run, fallback);
  return () => {
    cancelled = true;
    globalThis.clearTimeout(id);
  };
}
