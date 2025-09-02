import { motion } from 'framer-motion';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogSlideProps {
  isActive: boolean;
  onClose: () => void;
}

const articles = [
  {
    title: "The Art of Minimalism in Web Design",
    excerpt: "Exploring how less can truly be more in digital interfaces",
    date: "Dec 2024",
    readTime: "5 min read"
  },
  {
    title: "Building Touch-First Experiences",
    excerpt: "Designing for mobile in a gesture-driven world",
    date: "Nov 2024", 
    readTime: "8 min read"
  },
  {
    title: "Design Systems That Scale",
    excerpt: "Creating consistent experiences across platforms",
    date: "Oct 2024",
    readTime: "12 min read"
  }
];

export const BlogSlide = ({ isActive, onClose }: BlogSlideProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-medium bg-surface">
      {/* Header */}
      <div className="p-8 border-b border-surface-variant/50">
        {isActive && (
          <motion.button
            className="absolute top-6 right-6 w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <X className="w-5 h-5 text-text-primary" />
          </motion.button>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Thoughts & Ideas
          </h2>
          <p className="text-text-secondary">
            Writing about design, development, and creativity
          </p>
        </motion.div>
      </div>

      {/* Articles */}
      <div className="p-8 space-y-6 overflow-y-auto">
        {articles.map((article, index) => (
          <motion.article
            key={article.title}
            className="group cursor-pointer"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 + (isActive ? 0.2 : 0) }}
          >
            <div className="p-6 rounded-soft bg-surface-variant/30 hover:bg-surface-variant/50 transition-colors duration-300">
              <div className="space-y-3">
                <div className="flex items-center text-text-muted text-sm space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-custom-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-text-secondary leading-relaxed">
                  {article.excerpt}
                </p>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center text-accent-custom-primary text-sm font-medium group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.article>
        ))}

        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <Button variant="outline" className="w-full">
              View All Articles
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};