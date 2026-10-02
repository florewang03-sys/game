import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Server,
  Code,
  FileSpreadsheet
} from 'lucide-react';
import { workExperiences } from '../data/portfolioData';

export const Experiences: React.FC = () => {
  return (
    <section id="experiences" className="py-20 bg-slate-900/50 border-y border-slate-800/60 relative overflow-hidden">
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
            Parcours & Réalisations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            Expériences Professionnelles
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Des missions concrètes en entreprise et en freelance, alliant développement applicatif, 
            gestion de progiciels métiers et intégration de systèmes d'information.
          </p>
        </motion.div>

        {/* Experience Cards Grid */}
        <div className="space-y-8">
          {workExperiences.map((exp, index) => {
            const isLatest = index === 0;
            return (
              <motion.div
                key={exp.id}
                id={`experience-card-${exp.id}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isLatest
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl shadow-indigo-950/30 ring-1 ring-indigo-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                {/* Header Banner */}
                <div className="p-6 sm:p-8 border-b border-slate-800/80">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md cursor-pointer"
                      >
                        {exp.type === 'freelance' ? (
                          <Code className="w-6 h-6" />
                        ) : exp.company.includes('Kaiidou') ? (
                          <Server className="w-6 h-6" />
                        ) : (
                          <FileSpreadsheet className="w-6 h-6" />
                        )}
                      </motion.div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-white">
                            {exp.role}
                          </h3>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                            exp.type === 'freelance'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}>
                            {exp.type === 'freelance' ? 'Freelance' : 'Stage Professionnel'}
                          </span>
                          {isLatest && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 animate-pulse">
                              Poste actuel
                            </span>
                          )}
                        </div>
                        <p className="text-base font-semibold text-indigo-400 flex items-center gap-2">
                          <span>{exp.company}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Missions & Responsabilités Détaillées :</span>
                  </h4>

                  <ul className="space-y-3 mb-6">
                    {exp.missions.map((mission, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                        <span className="leading-relaxed">{mission}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Highlights if any */}
                  {exp.highlights && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Bénéfices & Valeur Ajoutée Apportée
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {exp.highlights.map((item, hIdx) => (
                          <motion.span
                            key={hIdx}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-800/40 cursor-default"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech stack pills */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 mr-1">Technologies & Outils :</span>
                      {exp.technologies.map((tech, tIdx) => (
                        <motion.span
                          key={tIdx}
                          whileHover={{ scale: 1.06 }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700/80 cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
                    >
                      <span>Discuter de cette expérience</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
