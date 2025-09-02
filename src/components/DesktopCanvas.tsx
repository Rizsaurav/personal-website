import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileSection } from './sections/ProfileSection';
import { WorkSection } from './sections/WorkSection';
import { BlogSection } from './sections/BlogSection';
import { ContactSection } from './sections/ContactSection';

export const DesktopCanvas = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Mobile uses slide stack
  }

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
              <span className="font-medium text-text-primary">Portfolio – Available</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#profile" className="text-text-secondary hover:text-accent-custom-primary transition-colors">About</a>
              <a href="#work" className="text-text-secondary hover:text-accent-custom-primary transition-colors">Work</a>
              <a href="#blog" className="text-text-secondary hover:text-accent-custom-primary transition-colors">Blog</a>
              <a href="#contact" className="text-text-secondary hover:text-accent-custom-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ProfileSection />
              </motion.div>
              
              <motion.div
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
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <WorkSection />
              </motion.div>
              
              <motion.div
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