import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download,
  Mail, 
  Phone, 
  Calendar,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText
} from 'lucide-react';
import { profileData } from '../data/portfolioData';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/CV_BISSIEK_WANG_Beneditte_Flore.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CV_BISSIEK_WANG_Beneditte_Flore.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch {
      window.location.href = '/telecharger.html';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Control Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Curriculum Vitae Officiel — BISSIEK WANG Beneditte Flore
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <motion.a
                  href="/Lettre_de_Motivation_Flore_Wang.pdf"
                  download="Lettre_de_Motivation_Flore_Wang.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Télécharger la Lettre de motivation"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lettre de motivation</span>
                  <span className="sm:hidden">Lettre</span>
                </motion.a>
                <motion.a
                  href="/CV_BISSIEK_WANG_Beneditte_Flore.pdf"
                  download="CV_BISSIEK_WANG_Beneditte_Flore.pdf"
                  onClick={handleDownloadPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Télécharger le fichier PDF officiel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CV PDF</span>
                </motion.a>
                <motion.button
                  onClick={handlePrint}
                  id="cv-print-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Imprimer ou enregistrer en PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / PDF</span>
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Authentic CV Document Layout (matches the user's PDF exact structure) */}
            <div 
              id="printable-cv-content"
              className="overflow-y-auto bg-white text-slate-900 p-6 sm:p-10 font-sans print:p-6 print:m-0 print:shadow-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 print:grid-cols-12">
                
                {/* LEFT COLUMN: Identity, Contact, Compétences & Formation (Dark Blue / Slate Styled) */}
                <div className="md:col-span-4 bg-slate-900 text-white rounded-xl p-6 sm:p-7 space-y-7 print:col-span-4 print:bg-slate-900 print:text-white">
                  
                  {/* Header Identity */}
                  <div className="border-b border-slate-700/80 pb-5">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase">
                      BISSIEK WANG
                    </h1>
                    <h2 className="text-lg font-semibold text-indigo-300 mt-0.5">
                      Beneditte Flore
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mt-2">
                      DÉVELOPPEUSE FULL-STACK
                    </p>
                  </div>

                  {/* CONTACT */}
                  <div className="space-y-2.5 text-xs">
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px] border-b border-slate-700/60 pb-1">
                      CONTACT
                    </h3>
                    <div className="space-y-1.5 text-slate-200">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>651 88 77 22</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>697 20 44 31</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="break-all">florewang03@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Née le 14/04/2006</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1.5 border-t border-slate-700/60">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="font-semibold text-slate-100">Douala, Bonamoussadi</span>
                      </div>
                    </div>
                  </div>

                  {/* COMPÉTENCES TECHNIQUES */}
                  <div className="space-y-2 text-xs">
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px] border-b border-slate-700/60 pb-1">
                      COMPÉTENCES TECHNIQUES
                    </h3>
                    <ul className="space-y-1 text-slate-200">
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>React.js, JavaScript, CSS</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>Node.js / Express</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>API REST</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>JWT (authentification)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>Bases en Java</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>MySQL</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>Git / GitHub</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>VS Code, NetBeans</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>Réseaux LAN, MAN, WAN (bases)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">&bull;</span>
                        <span>Canva (maîtrise)</span>
                      </li>
                    </ul>
                  </div>

                  {/* COMPÉTENCES TRANSVERSALES */}
                  <div className="space-y-2 text-xs">
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px] border-b border-slate-700/60 pb-1">
                      COMPÉTENCES TRANSVERSALES
                    </h3>
                    <ul className="space-y-1 text-slate-200">
                      <li className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">&bull;</span>
                        <span>Travail en équipe</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">&bull;</span>
                        <span>Rigueur</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">&bull;</span>
                        <span>Capacité d'adaptation</span>
                      </li>
                    </ul>
                  </div>

                  {/* FORMATION */}
                  <div className="space-y-3 text-xs pt-1">
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px] border-b border-slate-700/60 pb-1">
                      FORMATION
                    </h3>
                    
                    <div>
                      <h4 className="font-bold text-white leading-snug">Licence Génie Logiciel</h4>
                      <p className="text-indigo-300 text-[11px]">IUGET — 2026</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white leading-snug">BTS Gestion des Systèmes d'Information</h4>
                      <p className="text-indigo-300 text-[11px]">IUGET — 2025</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white leading-snug">Baccalauréat A4</h4>
                      <p className="text-indigo-300 text-[11px]">2023</p>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Profil & Expérience Professionnelle */}
                <div className="md:col-span-8 space-y-7 print:col-span-8 py-2">
                  
                  {/* PROFIL */}
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3">
                      PROFIL
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                      Jeune développeuse full-stack, titulaire d’une Licence en Génie Logiciel, avec une expérience en développement web et en systèmes d’information. Autonome sur React.js, Node.js et MySQL, j’ai également participé à la conception et au développement d’applications web de gestion de prospects et d’interactions commerciales. Rigoureuse et orientée résultats, je souhaite mettre mes compétences en pratique et contribuer à des projets concrets au sein d’une équipe professionnelle.
                    </p>
                  </div>

                  {/* EXPÉRIENCE PROFESSIONNELLE */}
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-5">
                      EXPÉRIENCE PROFESSIONNELLE
                    </h3>

                    <div className="space-y-6">
                      
                      {/* Expérience 1 : Freelance */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-950">
                            Développeuse Freelance — Application front-end pour une église
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          Freelance <span className="text-slate-400">|</span> Avril 2026 — Aujourd'hui
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Développement de l'interface front-end d'une plateforme web pour une église, de la conception à l'intégration.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Utilisation de React.js, CSS et JavaScript pour construire des composants réutilisables et une expérience utilisateur soignée.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Expérience 2 : Kaiidou Lab */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-950">
                            Stagiaire en Génie Logiciel
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          Kaiidou Lab SARL <span className="text-slate-400">|</span> 27 janvier — 7 avril 2026
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Mise à jour de logiciels de gestion comptable et commerciale pour les clients de l'entreprise.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Installation et configuration des logiciels EasyProcess, EasyGC et EasyCompta sur les machines clientes et serveurs.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Réalisation des sauvegardes régulières des données de l'entreprise.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Conception et développement d'une application web de gestion des prospects et des interactions commerciales.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Expérience 3 : BNR Company */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-950">
                            Stagiaire en Gestion des Systèmes d'Information
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          BNR Company <span className="text-slate-400">|</span> Juillet 2025
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Apprentissage approfondi du HTML et du CSS à travers des cas pratiques.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                            <span>Reproduction de modèles de factures destinés à être intégrés dans le système de gestion de l'entreprise.</span>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              {/* Document footer notice */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 print:text-slate-400">
                Curriculum Vitae officiel certifié &bull; BISSIEK WANG Beneditte Flore &bull; florewang03@gmail.com
              </div>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
