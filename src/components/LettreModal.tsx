import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Mail, Phone, MapPin, CheckCircle2, Building2, FileText } from 'lucide-react';

interface LettreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LettreModal: React.FC<LettreModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'syscolia' | 'general'>('syscolia');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    const fileName = activeTab === 'syscolia' 
      ? 'Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf'
      : 'Lettre_de_Motivation_Flore_Wang.pdf';
    
    try {
      const response = await fetch(`/${fileName}?v=${Date.now()}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch {
      window.location.href = `/${fileName}?v=${Date.now()}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 print:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 my-6 print:my-0 print:shadow-none print:max-w-none print:rounded-none"
          >
            {/* Header Bar with Action Buttons */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold tracking-wide hidden sm:inline">
                  Lettre de Motivation — Flore WANG
                </span>
                <span className="text-sm font-semibold tracking-wide sm:hidden">
                  Lettre de Motivation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleDownloadPdf}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Télécharger le PDF sélectionné"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF</span>
                </motion.button>
                <motion.button
                  onClick={handlePrint}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Imprimer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimer</span>
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

            {/* Version Switcher (SYSCOLIA vs General) */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 print:hidden">
              <button
                onClick={() => setActiveTab('syscolia')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                  activeTab === 'syscolia'
                    ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Version SYSCOLIA (Recommandée)</span>
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                  activeTab === 'general'
                    ? 'bg-white text-slate-900 border-slate-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Version Générale (Stage Web)</span>
              </button>
            </div>

            {/* Letter Body - Visual Sheet */}
            <div className="p-6 sm:p-12 space-y-5 max-h-[80vh] overflow-y-auto text-slate-800 text-sm leading-relaxed">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                    Flore WANG
                  </h1>
                  <p className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    Douala, Bonamoussadi
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Tél : (+237) 651 88 77 22
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    E-mail : florewang03@gmail.com
                  </p>
                </div>
                
                {/* Destination Block */}
                {activeTab === 'syscolia' ? (
                  <div className="sm:text-right space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Douala, Cameroun</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      À l'attention de la Direction
                    </p>
                    <p className="text-sm font-extrabold text-indigo-700">
                      SYSCOLIA
                    </p>
                    <p className="text-xs text-slate-500">Douala, Cameroun</p>
                  </div>
                ) : (
                  <div className="sm:text-right space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Douala, Cameroun</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 max-w-xs sm:ml-auto leading-snug">
                      À l'attention du Responsable des Ressources Humaines
                    </p>
                  </div>
                )}
              </div>

              {/* Objet */}
              <div className="py-1">
                <p className="text-sm sm:text-base font-extrabold text-slate-950">
                  {activeTab === 'syscolia'
                    ? 'Objet : Candidature au poste de Développeuse d’Applications Web'
                    : 'Objet : Candidature au stage de Développeur d’Applications Web'}
                </p>
              </div>

              {/* Formule d'appel */}
              <div className="pt-1">
                <p className="font-semibold text-slate-900">Madame, Monsieur,</p>
              </div>

              {/* Contenu spécifique */}
              {activeTab === 'syscolia' ? (
                <>
                  <p className="text-justify leading-relaxed">
                    Acteur de référence dans la formation professionnelle en ligne et la digitalisation des compétences, <strong>SYSCOLIA</strong> se distingue par la qualité et l’accessibilité de ses plateformes éducatives. Particulièrement sensible à vos initiatives d’apprentissage numérique et au développement de vos outils web interactifs, je vous propose ma candidature pour participer activement au développement et à l’évolution de vos applications.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Titulaire d’un BTS en Gestion des Systèmes d’Information et d’une Licence en Génie Logiciel, j’ai développé une solide maîtrise technique dans la conception et l’implémentation de solutions logicielles. Je maîtrise l’écosystème JavaScript moderne, avec des compétences concrètes sur <strong className="text-slate-950 font-semibold">React.js</strong> pour la conception d’interfaces réactives et fluides, ainsi que <strong className="text-slate-950 font-semibold">Node.js</strong> et <strong className="text-slate-950 font-semibold">Express</strong> pour la création d’API REST fiables et sécurisées.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Sur le plan des données, mon expérience me permet de modéliser et structurer efficacement des bases relationnelles <strong className="text-slate-950 font-semibold">MySQL</strong>, tout en assurant une intégration fluide entre le front-end et le back-end. J’ai notamment participé à la conception de tableaux de bord, de formulaires dynamiques et d’outils de suivi d’utilisateurs, des fonctionnalités essentielles pour une plateforme de gestion et d’apprentissage en ligne comme la vôtre.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Rigoureuse, force de proposition et habituée à travailler avec méthode et respect des délais, je souhaite mettre mon énergie au service des projets de SYSCOLIA. Qu’il s’agisse de développer de nouveaux modules, d’améliorer l’expérience utilisateur de vos apprenants ou d’assurer la robustesse technique de vos services numériques, je saurai m’adapter rapidement à vos exigences.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Je me tiens à votre entière disposition pour convenir d’un entretien au cours duquel je pourrai vous détailler mon profil et vous exposer comment mes compétences s’alignent avec les objectifs de SYSCOLIA.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations les plus distinguées.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-justify leading-relaxed">
                    Titulaire d’une Licence en Génie Logiciel, je souhaite vous soumettre ma candidature pour le stage de Développeur d’Applications Web publié sur Expert du CV. Je souhaite aujourd’hui mettre en pratique mes connaissances techniques au sein d’un environnement professionnel et continuer à développer mes compétences dans le domaine du développement web.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Au cours de ma formation et de mes projets, j’ai acquis des connaissances en <strong className="text-slate-950 font-semibold">JavaScript, React.js, Node.js/Express, API REST, MySQL ainsi qu’en Git/GitHub</strong>. J’ai notamment participé à la conception et au développement d’applications web, ce qui m’a permis de travailler sur la partie frontend et backend, la gestion des données et la mise en place d’API.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Sérieuse, motivée et désireuse d’apprendre, je souhaite intégrer une équipe qui me permettra de consolider mes acquis, de découvrir davantage les pratiques professionnelles du développement d’applications web et de contribuer concrètement aux projets qui me seront confiés.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Je serais heureuse de pouvoir échanger avec vous lors d’un entretien afin de vous présenter plus en détail mon parcours, mes compétences et ma motivation.
                  </p>

                  <p className="text-justify leading-relaxed">
                    Dans l’attente de votre retour, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.
                  </p>
                </>
              )}

              {/* Signature */}
              <div className="pt-5 flex justify-end">
                <div className="text-right">
                  <p className="text-base font-black text-slate-950 tracking-tight">Flore WANG</p>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-indigo-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {activeTab === 'syscolia' 
                    ? 'Lettre ciblée SYSCOLIA (EdTech & Formation en ligne - Douala)' 
                    : 'Lettre de stage générale (Développement Web - Douala)'}
                </span>
                <span className="hidden sm:inline text-slate-400">Flore WANG &bull; 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
