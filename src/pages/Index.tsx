import { motion, MotionConfig } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { FocusAreas } from "@/components/home/FocusAreas";
import { WorkIndex } from "@/components/home/WorkIndex";
import { WritingIndex } from "@/components/home/WritingIndex";
import { About } from "@/components/home/About";
import { Footer } from "@/components/home/Footer";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

const links = [
  { label: "Work", href: "#work" },
  { label: "Writing", href: "#writing" },
  { label: "About", href: "#about" },
];

const Index = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-md border-b hairline"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
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
              <a
                href="#contact"
                className="text-sm font-medium bg-text-primary text-background rounded-full px-5 py-2 hover:opacity-85 transition-opacity"
              >
                Get in touch
              </a>
            </nav>
          </div>
        </motion.header>

        <main id="top">
          <Hero />
          <Marquee />
          <FocusAreas />
          <WorkIndex />
          <WritingIndex />
          <About />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
};

export default Index;
