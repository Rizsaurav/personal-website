import { onIdle } from "@/lib/idle";
import { ScrollTrigger } from "@/lib/motion";
import { useEffect, useState } from "react";
import { ComputeJourney } from "./ComputeJourney";
import { Archive } from "./Archive";
import { ResearchScene } from "./ResearchScene";
import { Footer } from "./Footer";
import { ChapterRail } from "./ChapterRail";
import { preloadBlogChunk } from "@/lib/transition";

/**
 * Everything below the hero, in one lazily loaded chunk. The heavy first scenes build first; the rest
 * mounts on the next idle slot so scene setup is spread over two tasks instead of one long one.
 */
export default function Scenes() {
  const [late, setLate] = useState(false);
  useEffect(() => {
    let cancelWarm = () => {};
    const cancelMount = onIdle(
      () => {
        setLate(true);
        cancelWarm = onIdle(
          () => {
            void preloadBlogChunk();
          },
          4000,
          2000,
        );
      },
      600,
      120,
    );

    return () => {
      cancelMount();
      cancelWarm();
    };
  }, []);
  useEffect(() => {
    if (!late) return;
    let disposed = false;
    let frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    // Font metrics affect every downstream pin and chapter marker.
    void document.fonts.ready.then(() => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
    };
  }, [late]);
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
