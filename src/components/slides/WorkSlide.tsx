import { motion } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkSlideProps {
  isActive: boolean;
  onClose: () => void;
}

const projects = [
  {
    title: "Minimal E-commerce",
    description: "Clean, conversion-focused online store",
    tech: ["React", "Stripe", "Tailwind"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30"
  },
  {
    title: "SaaS Dashboard",
    description: "Analytics platform for creators",
    tech: ["Next.js", "PostgreSQL", "D3.js"],
    color: "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/40"
  },
  {
    title: "Brand Identity",
    description: "Complete visual system redesign",
    tech: ["Figma", "Adobe Suite", "Webflow"],
    color: "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-primary/20"
  }
];

export const WorkSlide = ({ isActive, onClose }: WorkSlideProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-medium bg-surface">
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
          <h2 className="text-2xl font-bold text-text-primary mb-2">Selected Work</h2>
          <p className="text-text-secondary">
            Recent projects and collaborations
          </p>
        </motion.div>
      </div>

      {/* Projects */}
      <div className="p-8 space-y-6 overflow-y-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            className={`p-6 rounded-soft ${project.color} hover-lift transition duration-300`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {project.title}
                </h3>
                <p className="text-text-secondary">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-surface/50 text-text-secondary text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex space-x-3"
                >
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
