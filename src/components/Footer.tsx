import React from 'react';
import { motion } from 'motion/react';
import { Github, ArrowUp, GraduationCap } from 'lucide-react';
import { profileData } from '../data/portfolioData';

interface FooterProps {
  onOpenCV: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCV }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Identity with animated Logo and Name */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center text-white font-bold text-base shadow-md cursor-pointer"
            >
              BF
            </motion.div>
            <div>
              <motion.p 
                whileHover={{ color: "#38bdf8" }}
                className="text-sm font-bold text-white transition-colors cursor-default"
              >
                {profileData.fullName}
              </motion.p>
              <p className="text-xs text-indigo-400">
                {profileData.title} &bull; Génie Logiciel & GSI (IUGET)
              </p>
            </div>
          </motion.div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
            {['#about', '#education', '#experiences', '#skills', '#projects', '#contact'].map((href, idx) => {
              const labels = ['À Propos', 'Parcours', 'Expériences', 'Compétences', 'Projets', 'Contact'];
              return (
                <motion.a 
                  key={href}
                  href={href}
                  whileHover={{ scale: 1.08, color: '#ffffff' }}
                  className="hover:text-white transition-colors"
                >
                  {labels[idx]}
                </motion.a>
              );
            })}
            <motion.button
              onClick={onOpenCV}
              whileHover={{ scale: 1.08 }}
              className="hover:text-indigo-400 transition-colors font-medium cursor-pointer"
            >
              Curriculum Vitae
            </motion.button>
          </div>

          {/* GitHub button & Back to top */}
          <div className="flex items-center gap-3">
            <motion.a
              href={profileData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition-colors"
              title="GitHub florewang03-sys"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-slate-300 font-semibold">{profileData.fullName}</strong>. Tous droits réservés.
          </p>
          <p className="flex items-center gap-1.5 justify-center">
            <span>Conçu avec passion & rigueur logicielle</span>
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Diplômée IUGET Douala</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
