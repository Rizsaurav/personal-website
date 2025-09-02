import { motion } from "framer-motion";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import DarkModeToggle from "@/components/ui/DarkModeToggle"; 

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-card"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-custom-primary rounded-full"></div>
              <span className="font-medium text-text-primary">Saurav Rijal</span>
            </div>

            <nav className="flex items-center space-x-6 md:space-x-8">
              <a
                href="#profile"
                className="text-text-secondary hover:text-accent-custom-primary transition-colors"
              >
                About
              </a>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openWorkModal"));
                }}
                className="text-text-secondary hover:text-accent-custom-primary transition-colors"
              >
                Work
              </button>
              <a
                href="/blogs"
                className="text-text-secondary hover:text-accent-custom-primary transition-colors"
              >
                Blog
              </a>
              <a
                href="#contact"
                className="text-text-secondary hover:text-accent-custom-primary transition-colors"
              >
                Contact
              </a>

              {/* Dark Mode Toggle as nav item */}
              <div className="flex items-center">
                <DarkModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-12">
              <motion.div
                id="profile"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProfileSection />
              </motion.div>

              <motion.div
                id="contact"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ContactSection />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              <motion.div
                id="work"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <WorkSection />
              </motion.div>

              <motion.div
                id="blog"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <BlogSection />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
