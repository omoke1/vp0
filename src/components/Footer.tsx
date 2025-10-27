import React from 'react';
import { Facebook, Twitter, Github, Linkedin } from 'lucide-react';
import { FooterSection } from '../types';

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#integrations', label: 'Integrations' },
        { href: '#use-cases', label: 'Use Cases' },
        { href: '#pricing', label: 'Pricing' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { href: '#docs', label: 'Documentation' },
        { href: '#api', label: 'API Reference' },
        { href: '#sdk', label: 'SDK' },
        { href: '#examples', label: 'Examples' }
      ]
    },
    {
      title: 'Ecosystem',
      links: [
        { href: '#polymarket', label: 'Polymarket' },
        { href: '#eigencloud', label: 'EigenCloud' },
        { href: '#partners', label: 'Partners' },
        { href: '#gnosis', label: 'Gnosis' },
        { href: '#uma', label: 'UMA' }
      ]
    }
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Github, label: 'GitHub' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto pr-4 pl-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* VPO Brand */}
          <div>
            <h3 className="text-xl font-semibold mb-4">VPO</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Verifiable Truth for the Prediction Economy. Built on EigenCloud.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © VPO 2025 — Built on EigenCloud
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
