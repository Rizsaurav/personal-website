import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileSlide } from './slides/ProfileSlide';
import { WorkSlide } from './slides/WorkSlide';
import { BlogSlide } from './slides/BlogSlide';
import { ContactSlide } from './slides/ContactSlide';

export type SlideType = 'profile' | 'work' | 'blog' | 'contact';

interface SlideStackProps {
  activeSlide: SlideType | null;
  onSlideChange: (slide: SlideType | null) => void;
}

const slides = [
  { id: 'profile' as SlideType, component: ProfileSlide, title: 'Profile' },
  { id: 'work' as SlideType, component: WorkSlide, title: 'Work' },
  { id: 'blog' as SlideType, component: BlogSlide, title: 'Blog' },
  { id: 'contact' as SlideType, component: ContactSlide, title: 'Contact' },
];

export const SlideStack = ({ activeSlide, onSlideChange }: SlideStackProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null; // Desktop uses open canvas layout
  }

  return (
    <div className="relative h-screen w-full overflow-hidden slide-stack">
      <AnimatePresence>
        {slides.map((slide, index) => {
          const isActive = activeSlide === slide.id;
          const isBackground = activeSlide && activeSlide !== slide.id;
          
          return (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 slide-card glass-card ${
                isActive ? 'active z-20' : isBackground ? 'background z-10' : 'z-10'
              }`}
              style={{
                top: isActive ? 0 : `${index * 20 + 100}px`,
                left: isActive ? 0 : `${index * 10}px`,
                right: isActive ? 0 : `${index * 10}px`,
              }}
              initial={{ 
                y: 100 + index * 20,
                scale: 0.95,
                opacity: 0.8
              }}
              animate={{
                y: isActive ? 0 : index * 20 + 100,
                scale: isActive ? 1 : isBackground ? 0.85 : 0.95,
                opacity: isActive ? 1 : isBackground ? 0.3 : 0.8,
                filter: isBackground ? 'blur(4px)' : 'blur(0px)',
              }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => {
                if (!isActive) {
                  onSlideChange(slide.id);
                }
              }}
              onTap={() => {
                if (isActive) {
                  onSlideChange(null);
                }
              }}
            >
              <slide.component 
                isActive={isActive}
                onClose={() => onSlideChange(null)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};