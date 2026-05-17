import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/#about' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="surface-panel mt-24"
    >
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center font-bold">
                ◆
              </div>
              <span className="text-xl font-bold gradient-text">Crisis AI</span>
            </div>
            <p className="text-current/75 text-sm">
              Advanced global crisis intelligence powered by AI and market insights.
            </p>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="font-semibold mb-4 text-current">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-current/70 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-current/70 text-sm">
            © {currentYear} Crisis AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-current/70 hover:text-primary-400 transition-colors"
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-white/60 hover:text-primary-400 transition-colors"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-white/60 hover:text-primary-400 transition-colors"
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
