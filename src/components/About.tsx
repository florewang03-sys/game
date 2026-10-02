import React from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Target, 
  Users, 
  Zap, 
  ShieldCheck, 
  FileCheck, 
  Briefcase,
  Sparkles
} from 'lucide-react';
import { profileData } from '../data/portfolioData';

interface AboutProps {
  onOpenCV: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenCV }) => {
  return (
    <section id="about" className="py-20 bg-slate-900/40 border-y border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title with Animated Name Highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-800/50">
            Profil & Philosophie
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            À Propos de{' '}
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-teal-200 to-indigo-300 animate-gradient-flow cursor-default"
            >
              {profileData.fullName}
            </motion.span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Une approche combinant solidité conceptuelle en systèmes d'information et 
            pratique concrète du développement logiciel full-stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Biography Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span>Mon Parcours & Ma Vision</span>
              </h3>
              
              <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>
                  Diplômée d’un <strong className="text-white">Baccalauréat A4 All (2023)</strong>, j’ai développé une rigueur d'esprit, une aisance d'expression et une méthode analytique qui constituent aujourd'hui les fondations de mon approche en ingénierie logicielle.
                </p>
                <p>
                  J'ai ensuite concrétisé ma passion pour la technologie à l'<strong className="text-white">IUGET</strong> (Institut Universitaire des Grandes Écoles des Tropiques) en obtenant mon <strong className="text-white">BTS en Gestion des Systèmes d'Information (2025)</strong>, suivi de ma <strong className="text-white">Licence en Génie Logiciel (2026)</strong>.
                </p>
                <p>
                  Ce double ancrage m'octroie une vision globale : non seulement je conçois et développe des applications web interactives et modernes (<span className="text-indigo-300 font-medium">React.js, Node.js, MySQL</span>), mais je comprends également l'infrastructure sous-jacente, les flux d'information de l'entreprise, le paramétrage client-serveur et les enjeux cruciaux de la sauvegarde de données.
                </p>
                <p>
                  Qu'il s'agisse de déployer des progiciels de gestion d'envergure (<span className="text-slate-200">EasyProcess, EasyGC, EasyCompta</span>), de modéliser un système de facturation pour un ERP, ou de concevoir de bout en bout une application web front-end pour une communauté, j'accorde une importance primordiale à l'ergonomie, à la propreté du code et à la satisfaction des utilisateurs finaux.
                </p>
              </div>

              {/* Core Values / Soft Skills */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Valeurs professionnelles & Qualités clés
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
                      title: "Rigueur & Méthodologie",
                      desc: "Respect des spécifications, code soigné et tests rigoureux."
                    },
                    {
                      icon: <Users className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />,
                      title: "Travail en Équipe",
                      desc: "Communication fluide, écoute active et esprit collaboratif."
                    },
                    {
                      icon: <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
                      title: "Forte Adaptabilité",
                      desc: "Montée en compétence rapide sur tout nouvel environnement technique."
                    },
                    {
                      icon: <Target className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />,
                      title: "Sens du Service & Résultats",
                      desc: "Centrée sur la résolution efficace des besoins métiers."
                    }
                  ].map((val, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -3, backgroundColor: "rgba(15, 23, 42, 0.9)" }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-colors cursor-default"
                    >
                      {val.icon}
                      <div>
                        <h5 className="text-sm font-semibold text-white">{val.title}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">{val.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Identity Card & Key Pillars */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Identity Summary Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-lg"
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Informations Clés
              </h4>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Nom complet</span>
                  <motion.span 
                    whileHover={{ color: "#38bdf8" }}
                    className="font-semibold text-white transition-colors cursor-default"
                  >
                    {profileData.fullName}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Date de naissance</span>
                  <span className="font-semibold text-white">{profileData.birthDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Spécialisation</span>
                  <span className="font-semibold text-indigo-300">Génie Logiciel & Full-Stack</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Établissement</span>
                  <span className="font-semibold text-white">IUGET Douala</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Localisation</span>
                  <span className="font-semibold text-white">{profileData.location}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Email pro</span>
                  <a href={`mailto:${profileData.email}`} className="font-medium text-indigo-400 hover:underline">
                    {profileData.email}
                  </a>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Téléphones</span>
                  <span className="font-medium text-slate-200 text-right">
                    651 88 77 22 <br /> 697 20 44 31
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Profil GitHub</span>
                  <a 
                    href={profileData.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-teal-400 hover:underline"
                  >
                    florewang03-sys
                  </a>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Portfolio</span>
                  <a 
                    href={profileData.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-400 hover:underline"
                  >
                    folio-alpha-gilt.vercel.app
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <motion.button
                  onClick={onOpenCV}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-md cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>Consulter le Dossier / CV Complet</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Experience & Academic Highlights */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 rounded-2xl p-6 border border-indigo-900/40 shadow-lg"
            >
              <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Expérience Terrain Éprouvée</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Expériences concrètes en entreprise chez <strong className="text-white">Kaiidou Lab SARL</strong> et <strong className="text-white">BNR Company</strong>, ainsi qu'en développement web indépendant. Capable d'intervenir sur tout le cycle du projet applicatif.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['#GestionCommerciale', '#CRMProspects', '#EasySuite', '#ReactJS'].map((tag, i) => (
                  <motion.span 
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    className="px-2.5 py-1 rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
