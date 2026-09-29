import { motion } from 'framer-motion';
import { Mail, ExternalLink, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

export const ProfileSection = () => {
  return (
    <section id="profile" className="glass-card rounded-medium p-8 hover-lift">
      <div className="space-y-6">
        {/* Hero Image */}
        <div className="aspect-video rounded-soft overflow-hidden">
          <img 
            src={heroImage}
            alt="Portfolio hero"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent-custom-primary rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-surface">SR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Saurav Rijal</h1>
              <p className="text-text-secondary">CS Senior @ Texas State University</p>
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed">
            I build data-intensive systems: agentic pipelines, geospatial ML, and
            real-time AI apps. Senior in Computer Science (Applied Math minor) at
            Texas State, SWE intern at LaunchBox, and an undergraduate researcher
            working with energy and survey data. Applying to CS graduate programs
            for Fall 2027.
          </p>

          {/* Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-accent-custom-primary rounded-full"></div>
            <span className="text-text-primary font-medium">Open to research collaborations</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button className="bg-accent-custom-primary hover:bg-accent-custom-secondary text-surface" asChild>
              <a href="mailto:rizsaurav@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.linkedin.com/in/saurav-rijal-08082a261/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Resume
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 pt-4">
            {[
              { icon: Github, href: "https://github.com/Rizsaurav" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/saurav-rijal-08082a261/" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center hover:bg-accent-custom-soft transition-colors"
              >
                <social.icon className="w-5 h-5 text-text-muted" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
