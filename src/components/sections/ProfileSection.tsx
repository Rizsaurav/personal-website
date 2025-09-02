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
              <p className="text-text-secondary">Software Developer</p>
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed">
            Crafting beautiful digital experiences with a focus on 
            functionality, and user-centered design. Currently, a Junior in Texas State University studying Computer Science with a minor in Applied Mathematics.
          </p>

          {/* Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-accent-custom-primary rounded-full"></div>
            <span className="text-text-primary font-medium">Available for projects</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button className="bg-accent-custom-primary hover:bg-accent-custom-secondary text-surface">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 pt-4">
            {[
              { icon: Github, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
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