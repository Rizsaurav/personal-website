import { motion, MotionConfig } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { WorkIndex } from "@/components/home/WorkIndex";
import { WritingIndex } from "@/components/home/WritingIndex";
import { About } from "@/components/home/About";
import { Footer } from "@/components/home/Footer";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

const links = [
  { label: "Work", href: "#work" },
  { label: "Writing", href: "#writing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Index = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        {/* Slim nav */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b hairline"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#top" className="font-display text-xl text-text-primary">
              Saurav <span className="italic font-light">Rijal</span>
            </a>
            <nav className="flex items-center gap-5 md:gap-8">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="label-caps text-text-secondary hover:text-text-primary transition-colors hidden sm:inline"
                >
                  {l.label}
                </a>
              ))}
              <DarkModeToggle />
            </nav>
          </div>
        </motion.header>

        <main id="top" className="max-w-6xl mx-auto px-6">
          <Hero />
          <div className="border-t hairline" />
          <WorkIndex />
          <div className="border-t hairline" />
          <WritingIndex />
          <div className="border-t hairline" />
          <About />
          <div className="border-t hairline" />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
};

export default Index;
