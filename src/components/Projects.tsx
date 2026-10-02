import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Calendar, 
  Building2, 
  CheckCircle, 
  X,
  Globe
} from 'lucide-react';
import { projectItems } from '../data/portfolioData';
import { ProjectItem } from '../types';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-800/50">
            Réalisations & Déploiements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            Projets & Réalisations Clés
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Un aperçu concret des solutions web développées, avec accès direct aux démonstrations en ligne.
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectItems.map((project, index) => (
            <motion.div
              key={project.id}
              id={`project-card-${project.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 shadow-lg hover:shadow-indigo-950/20 group relative overflow-hidden"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    {project.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        En ligne
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      project.status === 'En cours'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {project.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    {project.clientOrContext}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {project.period}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Features preview */}
                <div className="space-y-1.5 mb-6">
                  {project.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom footer with tech tags and action buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[11px] text-slate-500 px-1 py-0.5">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                      title="Ouvrir la démo en direct"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Démo Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  )}

                  <motion.button
                    onClick={() => setSelectedProject(project)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-semibold text-indigo-400 hover:text-white px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    Détails
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 inline-block mb-3">
                {selectedProject.category}
              </span>

              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedProject.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6 pb-4 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <strong>Contexte :</strong> {selectedProject.clientOrContext}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <strong>Période :</strong> {selectedProject.period}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <strong>Statut :</strong> {selectedProject.status}
                </span>
              </div>

              {/* LIVE DEMO CALLOUT BANNER IF PROJECT HAS LIVE URL */}
              {selectedProject.liveUrl && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/40 border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Application Accessible en Ligne
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Déployée sur infrastructure cloud. Testez l'interface et les fonctionnalités en temps réel.
                    </p>
                  </div>
                  <motion.a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all shrink-0"
                  >
                    <span>Ouvrir l'application</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              )}

              <div className="space-y-5 text-sm text-slate-300">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description Complète
                  </h4>
                  <p className="leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Fonctionnalités & Réalisations Clés
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/30 border border-slate-800/60">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Stack Technique Déployée
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-950 text-indigo-300 border border-indigo-900/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                {selectedProject.liveUrl ? (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[240px] sm:max-w-none">{selectedProject.liveUrl}</span>
                  </a>
                ) : <span />}

                <motion.button
                  onClick={() => setSelectedProject(null)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
