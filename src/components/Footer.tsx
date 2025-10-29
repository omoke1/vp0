import React, { useState } from 'react';
import { Facebook, Twitter, Github, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import { FooterSection } from '../types';

const Footer: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

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
    <footer className="bg-gray-900 text-white pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* VPO Brand - Full width on mobile, first column on larger screens */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/assets/vpo-logo-simple.svg" 
                alt="VPO Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">VPO</h3>
            </div>
            <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed max-w-sm">
              Verifiable Truth for the Prediction Economy. Built on EigenCloud.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections - Responsive grid with mobile collapsible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 sm:col-span-2 lg:col-span-3">
            {footerSections.map((section) => {
              const isExpanded = expandedSections.has(section.title);
              return (
                <div key={section.title} className="min-w-0">
                  {/* Mobile collapsible header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="sm:hidden w-full flex items-center justify-between text-base font-semibold mb-4 text-gray-100 hover:text-white transition-colors"
                  >
                    <span>{section.title}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Desktop header */}
                  <h4 className="hidden sm:block text-base sm:text-lg font-semibold mb-4 text-gray-100">{section.title}</h4>
                  
                  {/* Links - hidden on mobile when collapsed */}
                  <ul className={`space-y-3 transition-all duration-300 ${
                    isExpanded ? 'block' : 'hidden sm:block'
                  }`}>
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base block py-1 hover:translate-x-1 transform transition-transform duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-gray-400 text-sm text-center sm:text-left order-2 sm:order-1">
              © VPO 2025 — Built on EigenCloud
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 order-1 sm:order-2">
              <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
