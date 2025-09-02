import { motion } from 'framer-motion';
import { X, Mail, Linkedin, Twitter, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactSlideProps {
  isActive: boolean;
  onClose: () => void;
}

export const ContactSlide = ({ isActive, onClose }: ContactSlideProps) => {
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
            Let's Connect
          </h2>
          <p className="text-text-secondary">
            Available for freelance projects and collaborations
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8 overflow-y-auto">
        
        {/* Availability Status */}
        <motion.div
          className="flex items-center space-x-3 p-4 bg-accent-custom-soft/20 rounded-soft"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isActive ? 0.2 : 0 }}
        >
          <div className="w-3 h-3 bg-accent-custom-primary rounded-full animate-pulse"></div>
          <span className="text-text-primary font-medium">Available for new projects</span>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isActive ? 0.3 : 0 }}
        >
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Connect
          </h3>
          <div className="space-y-2">
            {[
              { icon: Mail, label: "hello@jordansmith.design", href: "mailto:hello@jordansmith.design" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
              { icon: Twitter, label: "Twitter", href: "#" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="flex items-center space-x-3 p-3 rounded-soft hover:bg-surface-variant/30 transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <social.icon className="w-5 h-5 text-text-muted group-hover:text-accent-custom-primary transition-colors" />
                <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        {isActive && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              Send a Message
            </h3>
            <div className="space-y-4">
              <Input 
                placeholder="Your name" 
                className="bg-surface-variant/30 border-surface-variant"
              />
              <Input 
                type="email"
                placeholder="Your email" 
                className="bg-surface-variant/30 border-surface-variant"
              />
              <Textarea 
                placeholder="Tell me about your project..."
                rows={4}
                className="bg-surface-variant/30 border-surface-variant resize-none"
              />
              <Button className="w-full bg-accent-custom-primary hover:bg-accent-custom-secondary text-surface">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};