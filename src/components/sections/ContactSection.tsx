import { motion } from 'framer-motion';
import { Mail, Linkedin, MapPin } from 'lucide-react';

export const ContactSection = () => {
  const linkedInUrl = "https://www.linkedin.com/in/saurav-rijal-08082a261/"; // <-- update this link

  return (
    <section id="contact" className="space-y-6">
      <div className="glass-card rounded-medium p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Let's Connect</h2>
            <p className="text-text-secondary">Available for freelance projects and collaborations</p>
          </div>

          {/* Availability Status */}
          <div className="flex items-center justify-between p-4 bg-accent-custom-soft/20 rounded-soft">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent-custom-primary rounded-full animate-pulse"></div>
              <span className="text-text-primary font-medium">Available for new projects</span>
            </div>
            <div className="flex items-center space-x-2 text-text-muted text-sm">
              <MapPin className="w-4 h-4" />
              <span>San Marcos, Texas</span>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { 
                icon: Mail, 
                label: "Email", 
                value: "rizsaurav@gmail.com",
                href: "mailto:rizsaurav@gmail.com",
                primary: true
              },
              { 
                icon: Linkedin, 
                label: "LinkedIn", 
                value: "Saurav Rijal", // Display Name
                href: linkedInUrl
              }
            ].map((contact) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-4 rounded-soft transition-colors group ${
                  contact.primary 
                    ? 'bg-accent-custom-primary/10 hover:bg-accent-custom-primary/20' 
                    : 'bg-surface-variant/30 hover:bg-surface-variant/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <contact.icon className={`w-5 h-5 transition-colors ${
                  contact.primary 
                    ? 'text-accent-custom-primary' 
                    : 'text-text-muted group-hover:text-accent-custom-primary'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-text-secondary text-sm">{contact.label}</div>
                  <div className="text-text-primary text-sm font-medium truncate">{contact.value}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
