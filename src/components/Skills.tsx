import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Database, 
  Network, 
  Palette, 
  ShieldCheck, 
  Users, 
  Zap
} from 'lucide-react';
import { skillCategories } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Toutes les Compétences' },
    { id: 'frontend', label: 'Front-End' },
    { id: 'backend-db', label: 'Back-End & BDD' },
    { id: 'infrastructure-networks', label: 'Systèmes & Réseaux' },
    { id: 'tools-design', label: 'Outils & Design' },
  ];

  const filteredCategories = activeTab === 'all' 
    ? skillCategories 
    : skillCategories.filter(cat => cat.id === activeTab);

  return (
    <section id="skills" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-800/50">
            Savoir-Faire & Boîte à Outils
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            Compétences Techniques & Outils
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Une palette polyvalente acquise par la pratique académique à l'IUGET et consolidée 
            en immersion professionnelle et en freelance.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                id={`filter-skills-${cat.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                  activeTab === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -4 }}
                className="bg-slate-900/80 rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800/80">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                      {category.id === 'frontend' && <Code2 className="w-5 h-5" />}
                      {category.id === 'backend-db' && <Database className="w-5 h-5" />}
                      {category.id === 'infrastructure-networks' && <Network className="w-5 h-5" />}
                      {category.id === 'tools-design' && <Palette className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {category.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills list inside category */}
                  <div className="space-y-4">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-white text-sm">
                            {skill.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-indigo-300 border border-slate-700/60">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {skill.description}
                        </p>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: sIdx * 0.08, ease: "easeOut" }}
                            className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Soft Skills & Working Methodology Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl"
        >
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Qualités Comportementales & Pratiques
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Comment je travaille au quotidien
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Le développement logiciel ne se limite pas à la syntaxe : il repose sur la rigueur opérationnelle, 
              la collaboration saine et la capacité à s'adapter immédiatement à un écosystème existant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Users className="w-5 h-5" />,
                iconColor: "text-indigo-400 bg-indigo-950 border-indigo-800/80",
                title: "Travail en Équipe",
                desc: "Communication bienveillante, partage des connaissances, respect des revues de code et des directives communes."
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                iconColor: "text-emerald-400 bg-emerald-950 border-emerald-800/80",
                title: "Rigueur & Précision",
                desc: "Attention méticuleuse portée aux détails, tests unitaires et intégrité des données d'entreprise et sauvegardes."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                iconColor: "text-amber-400 bg-amber-950 border-amber-800/80",
                title: "Capacité d'Adaptation",
                desc: "Facilité reconnue à prendre en main rapidement de nouveaux langages, progiciels propriétaires ou outils internes."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -3, scale: 1.01 }}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 transition-colors hover:border-slate-700"
              >
                <div className={`p-2 rounded-lg ${item.iconColor} border shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
