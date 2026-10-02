import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Code2, 
  Database, 
  Download,
  FileText,
  Server,
  Sparkles,
  Terminal
} from 'lucide-react';
import { profileData } from '../data/portfolioData';

interface HeroProps {
  onOpenCV: () => void;
  onOpenLettre?: () => void;
  onOpenPhoto?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCV, onOpenLettre, onOpenPhoto }) => {
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    "Développeuse Full-Stack (React.js & Node.js)",
    "Diplômée Génie Logiciel & BTS GSI (IUGET Douala)",
    "Spécialiste Bases de Données (MySQL) & Progiciels",
    "Conceptrice d'Applications Web & ERP d'Entreprise"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Split name for letter-by-letter animation and hover physics
  const firstNameLetters = "Beneditte Flore".split('');
  const lastNameLetters = "BISSIEK WANG".split('');

  const letterVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 0.15 + i * 0.035,
        type: "spring" as const,
        stiffness: 400,
        damping: 18,
      }
    })
  };

  return (
    <section 
      id="hero" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Dynamic Animated Ambient Background Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.18, 0.32, 0.18],
          x: [-20, 20, -20],
          y: [-10, 15, -10],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/25 blur-[140px] rounded-full pointer-events-none -z-10" 
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.12, 0.28, 0.12],
          x: [15, -25, 15],
          y: [10, -15, 10],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-teal-500/20 blur-[130px] rounded-full pointer-events-none -z-10" 
      />

      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.22, 0.1],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-10 left-10 w-[320px] h-[320px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Headline & Intro */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            
            {/* Status Pill with interactive micro-glow */}
            <motion.div 
              id="hero-status-pill"
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.04, borderColor: "rgba(99, 102, 241, 0.6)" }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 text-xs font-medium text-slate-300 mb-6 shadow-lg shadow-black/40 cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>{profileData.availability}</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-indigo-400 font-semibold">Douala & Remote</span>
              </span>
            </motion.div>

            {/* Greeting with waving hand */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 text-base sm:text-lg text-indigo-300 font-medium mb-2"
            >
              <span>Bonjour, bienvenue sur mon portfolio</span>
              <span className="text-xl animate-wave-hand">👋</span>
            </motion.div>

            {/* HIGH-END ANIMATED NAME SECTION */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
              <span className="block text-slate-400 text-xl sm:text-2xl font-semibold mb-1">
                Je suis
              </span>

              {/* First Name with individual reactive animated letters */}
              <span className="inline-flex flex-wrap mr-3 font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-teal-200 to-indigo-300 animate-gradient-flow select-none">
                {firstNameLetters.map((char, index) => (
                  <motion.span
                    key={`first-${index}`}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.25, 
                      rotate: index % 2 === 0 ? 8 : -8,
                      color: "#38bdf8",
                      transition: { type: "spring", stiffness: 600, damping: 12 }
                    }}
                    className="inline-block transition-colors cursor-pointer"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>

              {/* Last Name with individual reactive animated letters */}
              <span className="inline-flex flex-wrap font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-300 to-purple-300 animate-gradient-flow select-none">
                {lastNameLetters.map((char, index) => (
                  <motion.span
                    key={`last-${index}`}
                    custom={index + firstNameLetters.length}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.25, 
                      rotate: index % 2 === 0 ? -8 : 8,
                      color: "#a78bfa",
                      transition: { type: "spring", stiffness: 600, damping: 12 }
                    }}
                    className="inline-block transition-colors cursor-pointer"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Dynamic Rotating Role Badge with AnimatePresence */}
            <div className="h-9 mb-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-teal-300 bg-slate-900/90 px-3.5 py-1 rounded-lg border border-teal-800/50 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{roles[roleIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pitch Text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl"
            >
              Spécialisée dans la conception d'applications web interactives et modernes (<span className="text-white font-medium">React.js, Node.js</span>), 
              la gestion experte de bases de données relationnelles (<span className="text-white font-medium">MySQL</span>) et l'intégration de progiciels d'entreprise (<span className="text-indigo-300 font-medium">EasyProcess, EasyGC, EasyCompta</span>). 
              Diplômée de l'<span className="text-teal-300 font-medium">IUGET</span>, prête pour vos missions et recrutements.
            </motion.p>

            {/* Action Buttons with Interactive Pulsing Glow */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto"
            >
              <motion.a
                href="#contact"
                id="hero-contact-cta"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/40 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">Me Contacter</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                onClick={onOpenCV}
                id="hero-cv-cta"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 rounded-xl hover:border-indigo-500/60 transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Consulter CV</span>
              </motion.button>

              {onOpenLettre && (
                <motion.button
                  onClick={onOpenLettre}
                  id="hero-lettre-cta"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/60 border border-indigo-700/70 rounded-xl hover:border-indigo-400 transition-all shadow-md"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Lettre de Motivation</span>
                </motion.button>
              )}

              <motion.a
                href={profileData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-github-cta"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-800 rounded-xl hover:text-white hover:border-slate-700 transition-all"
                title="GitHub florewang03-sys"
              >
                <Github className="w-4 h-4" />
                <span>florewang03-sys</span>
              </motion.a>
            </motion.div>

            {/* Quick Contact Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="pt-6 border-t border-slate-800/80 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`mailto:${profileData.email}`} className="hover:text-white transition-colors underline-offset-2 hover:underline">
                  {profileData.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileData.phones[0]} / {profileData.phones[1]}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Douala, Cameroun &bull; Diplômée IUGET</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Full-Stack &bull; Réseaux &bull; Progiciels</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Visual Interactive Profile Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center"
          >
            <motion.div 
              id="hero-profile-card"
              whileHover={{ 
                y: -8, 
                rotateZ: -0.5,
                boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" 
              }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-2xl p-6 relative overflow-hidden group"
            >
              {/* Subtle shining light corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />

              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80 relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    onClick={onOpenPhoto}
                    title="Cliquer pour voir et télécharger la photo de profil"
                    className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/70 shadow-lg shadow-indigo-500/30 cursor-pointer group/avatar"
                  >
                    <img 
                      src="/flore_photo_profil.jpg" 
                      alt="Beneditte Flore" 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-indigo-600/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      📸
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                      {profileData.fullName}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium">
                      Développeuse Full-Stack
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenPhoto}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 rounded-full shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>📸 Télécharger</span>
                </button>
              </div>

              {/* Code Snippet terminal look */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/90 font-mono text-xs text-slate-300 mb-5 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 text-slate-500 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                    <span className="text-[10px] ml-2 text-slate-400">flore-profile.ts</span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-indigo-400">const <span className="text-teal-300">developer</span> = &#123;</p>
                <p className="pl-4 text-slate-300">name: <span className="text-emerald-400">"{profileData.firstName}"</span>,</p>
                <p className="pl-4 text-slate-300">surname: <span className="text-emerald-400">"{profileData.lastName}"</span>,</p>
                <p className="pl-4 text-slate-300">degrees: [<span className="text-amber-300">"Licence GL"</span>, <span className="text-amber-300">"BTS GSI"</span>],</p>
                <p className="pl-4 text-slate-300">school: <span className="text-emerald-400">"IUGET"</span>,</p>
                <p className="pl-4 text-slate-300">stack: [<span className="text-indigo-300">"React"</span>, <span className="text-indigo-300">"Node"</span>, <span className="text-indigo-300">"MySQL"</span>],</p>
                <p className="pl-4 text-slate-300">mindset: <span className="text-amber-300">"Rigueur & Excellence"</span></p>
                <p className="text-indigo-400">&#125;;</p>
              </div>

              {/* Diplomas & Credentials mini bento */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 transition-colors hover:border-indigo-500/40"
                >
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="text-indigo-300">Licence GL</span>
                    <span className="text-xs font-normal text-slate-400">2026</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Génie Logiciel (IUGET)</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 transition-colors hover:border-teal-500/40"
                >
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="text-teal-300">BTS GSI</span>
                    <span className="text-xs font-normal text-slate-400">2025</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Systèmes d'Info (IUGET)</p>
                </motion.div>
              </div>

              {/* Verified Key competencies list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    React.js, JavaScript, HTML5/CSS3
                  </span>
                  <span className="text-emerald-400 text-[11px] font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Validé</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-teal-400" />
                    MySQL & Sauvegardes de BD
                  </span>
                  <span className="text-emerald-400 text-[11px] font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Validé</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                  <span className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-purple-400" />
                    Progiciels d'Entreprise (EasySuite)
                  </span>
                  <span className="text-emerald-400 text-[11px] font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Opérationnel</span>
                </div>
              </div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
