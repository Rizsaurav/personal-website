import { onIdle } from "@/lib/idle";
import { lazy, Suspense, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

// The scroll experience (GSAP, Lenis, scenes) loads after the hero has painted.
const loadScenes = () => import("@/components/home/Scenes");
const Scenes = lazy(loadScenes);

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
];

const Index = () => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void loadScenes().catch(() => {
      /* React.lazy handles a retry on mount. */
    });
    return onIdle(() => setReady(true), 1200);
  }, []);
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <header className="portfolio-header header-in fixed top-0 left-0 right-0 z-50 bg-background/95 border-b hairline">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#top" className="font-display text-xl text-text-primary">
              Saurav Rijal
            </a>
            <nav className="flex items-center gap-5 md:gap-7">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:inline"
                >
                  {l.label}
                </a>
              ))}
              <DarkModeToggle />
              <button
                type="button"
                className="lite-toggle hidden sm:inline-flex"
                aria-pressed={document.documentElement.classList.contains(
                  "lite",
                )}
                title="Lighter mode: fewer effects, less memory and battery"
                onClick={() => {
                  const on =
                    document.documentElement.classList.contains("lite");
                  try {
                    localStorage.setItem("sr-lite", on ? "0" : "1");
                  } catch {
                    /* ignore */
                  }
                  location.reload();
                }}
              >
                Lite
              </button>
              <button
                type="button"
                className="sm:hidden p-2 -mr-1 text-text-primary"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
              <a
                href="#contact"
                className="text-sm font-medium bg-text-primary text-background rounded-full px-5 py-2 hover:opacity-85 transition-opacity"
              >
                <span className="hidden sm:inline">Get in touch</span>
                <span className="sm:hidden">Contact</span>
              </a>
            </nav>
          </div>
          {open && (
            <nav
              id="mobile-menu"
              className="sm:hidden border-t hairline px-6 py-3 grid bg-background"
              aria-label="Sections"
            >
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg font-display text-text-primary border-b hairline last:border-0"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <main id="top">
          <Hero />
          <div className="compute-world">
            {ready ? (
              <Suspense
                fallback={<div className="scenes-pending" aria-hidden="true" />}
              >
                <Scenes />
              </Suspense>
            ) : (
              <div className="scenes-pending" aria-hidden="true" />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
