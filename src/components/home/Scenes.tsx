import { useEffect, useState } from "react";
import { ComputeJourney } from "./ComputeJourney";
import { Archive } from "./Archive";
import { ResearchScene } from "./ResearchScene";
import { Footer } from "./Footer";
import { ChapterRail } from "./ChapterRail";
import { preloadBlogChunk } from "@/lib/transition";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
};

/**
 * Everything below the hero, in one lazily loaded chunk. The heavy first scenes build first; the rest
 * mounts on the next idle slot so scene setup is spread over two tasks instead of one long one.
 */
export default function Scenes() {
  const [late, setLate] = useState(false);
  useEffect(() => {
    const idle = (window as IdleWindow).requestIdleCallback;
    const go = () => {
      setLate(true);
      // warm the article page so a click on any project or study opens instantly
      const warm = () => preloadBlogChunk();
      if (idle) idle(warm, { timeout: 4000 });
      else setTimeout(warm, 2000);
    };
    if (idle) idle(go, { timeout: 600 });
    else setTimeout(go, 120);
  }, []);
  return (
    <>
      <ComputeJourney />
      {late && (
        <>
          <Archive />
          <ResearchScene />
          <Footer />
          <ChapterRail />
        </>
      )}
    </>
  );
}
