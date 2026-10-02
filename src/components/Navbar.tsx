import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, FileText, Sparkles } from 'lucide-react';
import { profileData } from '../data/portfolioData';

interface NavbarProps {
  onOpenCV: () => void;
  onOpenLettre?: () => void;
  onOpenWeddingDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCV, onOpenLettre, onOpenWeddingDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'À Propos', href: '#about' },
    { label: 'Parcours', href: '#education' },
    { label: 'Expériences', href: '#experiences' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Animated Logo and Name */}
        <a
          href="#"
          id="navbar-brand-link"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <motion.div 
            whileHover={{ scale: 1.12, rotate: 10 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/25 cursor-pointer"
          >
            BF
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-teal-300 transition-all duration-300">
              {profileData.fullName}
            </span>
            <span className="text-[11px] text-indigo-400 font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profileData.title}</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors duration-150"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenWeddingDemo && (
            <motion.button
              onClick={onOpenWeddingDemo}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-200 bg-amber-950/60 border border-amber-500/60 rounded-xl hover:bg-amber-900/60 transition-all duration-200 cursor-pointer shadow-sm animate-pulse"
              title="Tester le site de mariage de démonstration avec compte à rebours et galerie"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>💍 Démo Mariage Digital</span>
            </motion.button>
          )}

          <motion.a
            href={profileData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-github-button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-sm"
            title="Consulter mon GitHub"
          >
            <Github className="w-4 h-4 text-white" />
            <span>GitHub</span>
          </motion.a>

          {onOpenLettre && (
            <motion.button
              onClick={onOpenLettre}
              id="nav-lettre-button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-700/60 hover:border-indigo-500 rounded-xl hover:bg-indigo-900/50 transition-all duration-200 cursor-pointer shadow-sm"
              title="Consulter la lettre de motivation"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Lettre</span>
            </motion.button>
          )}

          <motion.button
            onClick={onOpenCV}
            id="nav-cv-button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Voir le CV</span>
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={onOpenCV}
            id="mobile-cv-button-icon"
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-200 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
            title="Voir le CV"
          >
            <FileText className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-950/98 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 mt-2 overflow-hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              {onOpenWeddingDemo && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWeddingDemo();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-black bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#d4af37] rounded-xl shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  <span>💍 Démo Site Mariage Digital (Galerie & Compte à Rebours)</span>
                </button>
              )}
              <a
                href={profileData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-xl"
              >
                <Github className="w-4 h-4" />
                <span>GitHub (florewang03-sys)</span>
              </a>
              {onOpenLettre && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLettre();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Consulter la Lettre de Motivation</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCV();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/30"
              >
                <FileText className="w-4 h-4" />
                <span>Consulter / Imprimer le CV</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
