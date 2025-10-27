import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavigationItem, MobileMenuProps } from '../types';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { href: '#how-it-works', label: 'How It Works', delay: 100 },
    { href: '#integrations', label: 'Integrations', delay: 200 },
    { href: '#use-cases', label: 'Use Cases', delay: 300 },
    { href: '#ecosystem', label: 'Ecosystem', delay: 400 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    handleMobileMenuClose();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/60 transition-all duration-300 ${
      isScrolled ? 'bg-white/95' : 'bg-white/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="animate-slide-in-down flex space-x-3 items-center">
            <span className="text-lg sm:text-xl font-semibold tracking-tight">VPO</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`animate-slide-in-down text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hover-lift`}
                style={{ animationDelay: `${item.delay}ms` }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Desktop CTA */}
          <div className="animate-slide-in-down delay-500 hidden sm:flex items-center space-x-3">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Docs
            </button>
            <button className="cursor-pointer inline-flex flex-col leading-none outline-none overflow-hidden no-underline align-baseline whitespace-nowrap select-none transition-all duration-150 hover:opacity-85 focus:outline-none focus:ring-4 focus:ring-black/50 h-10 sm:h-12 text-sm sm:text-lg text-white text-center bg-gradient-to-b from-neutral-700 to-neutral-900 border-0 rounded-xl pt-2 sm:pt-3 pr-6 sm:pr-8 pb-2 sm:pb-3 pl-6 sm:pl-8 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] items-center justify-center hover-lift">
              Launch App
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              type="button"
              className="mobile-menu-button bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              onClick={handleMobileMenuToggle}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
    </nav>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigationItems: NavigationItem[] = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#integrations', label: 'Integrations' },
    { href: '#use-cases', label: 'Use Cases' },
    { href: '#ecosystem', label: 'Ecosystem' },
  ];

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
        {navigationItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-sm font-medium"
            onClick={(e) => {
              e.preventDefault();
              handleSmoothScroll(item.href);
            }}
          >
            {item.label}
          </a>
        ))}
        <div className="border-t border-gray-200 pt-4 pb-3">
          <a href="#" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-sm font-medium">
            Docs
          </a>
          <a href="#" className="bg-gradient-to-b from-neutral-700 to-neutral-900 text-white block px-3 py-2 rounded-lg text-sm font-medium hover:opacity-85 mt-2">
            Launch App
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
