import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, BookOpen, CheckCircle, Calendar, School } from 'lucide-react';
import { academicDegrees } from '../data/portfolioData';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-800/50">
            Diplômes & Formations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            Parcours Académique
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Une formation solide et spécialisée à l'IUGET, orientée vers les technologies d'avenir et l'ingénierie logicielle.
          </p>
        </motion.div>

        {/* Timeline representation */}
        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 space-y-12">
          {academicDegrees.map((degree, index) => (
            <motion.div 
              key={degree.id}
              id={`degree-card-${degree.id}`}
              initial={{ opacity: 0, x: -20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative pl-8 md:pl-10 group"
            >
              {/* Timeline dot / icon */}
              <motion.div 
                whileHover={{ scale: 1.25, rotate: 15 }}
                className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:bg-indigo-600 transition-colors duration-200 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-indigo-300 group-hover:text-white" />
              </motion.div>

              {/* Year badge - positioned to the left on desktop */}
              <div className="md:absolute md:-left-36 md:top-2 mb-2 md:mb-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 shadow-sm">
                  <Calendar className="w-3 h-3" />
                  {degree.year}
                </span>
              </div>

              {/* Card content */}
              <motion.div 
                whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.4)" }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/80 rounded-2xl p-6 sm:p-7 border border-slate-800 transition-all shadow-lg hover:shadow-indigo-950/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {degree.degree}
                  </h3>
                  <span className="text-xs font-medium text-teal-400 bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-900">
                    {degree.field}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-4">
                  <School className="w-4 h-4 text-indigo-400" />
                  <span>{degree.institution}</span>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
                  {degree.description}
                </p>

                {/* Acquired Skills Badges */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compétences & Notions Clés Développées :</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {degree.skillsAcquired.map((skill, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-default"
                      >
                        <CheckCircle className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{skill}</span>
                      </motion.span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom banner for IUGET */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">IUGET — Institut Universitaire des Grandes Écoles des Tropiques</h4>
              <p className="text-xs text-slate-400">Pôle d'excellence en technologies numériques, gestion des SI et génie logiciel à Douala.</p>
            </div>
          </div>
          <motion.a
            href="#skills"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 text-xs font-semibold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shrink-0 shadow-sm"
          >
            Découvrir mes compétences &rarr;
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};
