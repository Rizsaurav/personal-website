import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: "Soccer Highlights Generator",
    description: "AI-powered system that creates 10-minute soccer highlight reels",
    fullDescription: "Full-stack application combining audio-based excitement detection with computer vision scene classification (BRIEF + k-Means BoVW) to generate professional 10-minute soccer highlights. Built with FastAPI backend, Next.js frontend, and Python-based video processing using OpenCV, Librosa, and MoviePy.",
    tech: ["FastAPI", "Next.js", "OpenCV", "Librosa", "MoviePy", "scikit-learn"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    image: "/placeholder.svg",
    demoUrl: "https://example.com",
    codeUrl: "https://github.com/Rizsaurav/Soccer-Highlights-Generator"
  },
  {
    id: 2,
    title: "NLP-Based Film Recommendation Engine",
    description: "Movie discovery platform ranked by real audience sentiment",
    fullDescription: "Analyzed thousands of IMDb reviews with NLP (NLTK) to assign sentiment scores and combine them with critic ratings. Built a FastAPI backend with PostgreSQL for data storage and a React.js frontend for browsing movies, surfacing hidden gems and filtering out overhyped disappointments.",
    tech: ["FastAPI", "React.js", "PostgreSQL", "NLTK", "Python"],
    color: "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/40",
    featured: false,
    image: "/placeholder.svg",
    demoUrl: "https://example.com",
    codeUrl: "https://github.com/Rizsaurav/NLP-Based-Film-Recommendation-Engine"
  },
  {
    id: 3,
    title: "PetTalks – Pet Owners’ Forum",
    description: "Community forum for pet owners with posts, comments, and upvotes",
    fullDescription: "Developed a React.js forum backed by a cloud-hosted SQL database where users can create, edit, and interact with posts through comments, upvotes, and tags. Implemented search, sorting, filtering, pseudo-authentication, and support for image/video sharing with a smooth user experience.",
    tech: ["React.js", "SQL (Postgres)", "JavaScript", "CSS"],
    color: "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-primary/20",
    featured: true,
    image: "/placeholder.svg",
    demoUrl: "https://example.com",
    codeUrl: "https://github.com/Rizsaurav/PetTalks-Pet-Owners-Discussion-Forum"
  }
];


export const WorkSection = () => {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    document.body.style.overflow = selected || showAll ? 'hidden' : '';
  }, [selected, showAll]);

  // 🔥 Listen for event from navbar to open modal
  useEffect(() => {
    const handleTrigger = () => setShowAll(true);
    window.addEventListener('openWorkModal', handleTrigger);
    return () => window.removeEventListener('openWorkModal', handleTrigger);
  }, []);

  const ProjectCard = ({ project, hideClose = false }) => (
    <motion.div
      key={project.id}
      className="glass-card rounded-medium p-6 w-full"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-1">{project.title}</h3>
          <p className="text-text-secondary">{project.fullDescription}</p>
        </div>
        {!hideClose && (
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="h-8 w-8 p-0">
            <X className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-soft mb-4 bg-surface/20" />
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map(tech => (
          <span key={tech} className="px-3 py-1 bg-surface/50 text-text-secondary text-sm rounded-full">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-3">
        <Button asChild>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1" /> Live Demo
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-1" /> View Code
          </a>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <section id="work" className="space-y-6">
      <div className="glass-card rounded-medium p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Selected Work</h2>
            <p className="text-text-secondary">Recent projects and collaborations</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
            <ArrowRight className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              onClick={() => setSelected(project.id)}
              className={`p-6 rounded-soft ${project.color} hover-lift cursor-pointer transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-accent-custom-primary text-surface text-xs rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-text-secondary">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-surface/50 text-text-secondary text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Individual Project Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {ProjectCard({ project: projects.find(p => p.id === selected) })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAll(false)}
          >
            <motion.div
              className="w-full max-w-4xl mx-auto py-10 px-4 space-y-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end sticky top-6 z-10">
                <Button variant="ghost" size="sm" onClick={() => setShowAll(false)} className="h-8 w-8 p-0">
                  <X className="w-4 h-4 text-white" />
                </Button>
              </div>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} hideClose />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
