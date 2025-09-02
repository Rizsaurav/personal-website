import { motion } from 'framer-motion';
import { X, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

interface ProfileSlideProps {
  isActive: boolean;
  onClose: () => void;
}

export const ProfileSlide = ({ isActive, onClose }: ProfileSlideProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-medium">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        {isActive && (
          <motion.button
            className="absolute top-6 right-6 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <X className="w-5 h-5 text-text-primary" />
          </motion.button>
        )}

        <motion.div
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: isActive ? 0.2 : 0 }}
        >
          {/* Avatar */}
          <div className="w-20 h-20 bg-accent-custom-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-surface">JS</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Jordan Smith
            </h1>
            <p className="text-lg text-text-secondary">
              Creative Developer & Designer
            </p>
          </div>

          {/* Description */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-text-secondary leading-relaxed">
                Crafting beautiful digital experiences with a focus on minimalism, 
                functionality, and user-centered design. Passionate about creating 
                interfaces that feel intuitive and delightful.
              </p>
              
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className="bg-accent-custom-primary hover:bg-accent-custom-secondary text-surface"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-surface-variant hover:bg-surface-variant"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Work
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};