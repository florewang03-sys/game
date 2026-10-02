import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Copy, Check, MessageSquare, Smartphone, FileText, ExternalLink, HelpCircle } from 'lucide-react';

interface MobileCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCandidateModal: React.FC<MobileCandidateModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'whatsapp' | 'help'>('download');

  const messageText = `Bonjour Madame, Monsieur,

Je me permets de vous contacter afin de vous soumettre ma candidature pour un poste de Développeuse d’Applications Web au sein de SYSCOLIA.

Titulaire d'une Licence en Génie Logiciel et d'un BTS en Gestion des Systèmes d'Information à Douala, je maîtrise la conception d'applications web avec React.js, Node.js/Express et MySQL.

Très intéressée par vos plateformes d'apprentissage numérique et vos projets technologiques, je serais ravie de mettre mes compétences au service du développement de vos solutions web.

📁 Veuillez trouver ci-joints mes documents :
1. Mon Curriculum Vitae (CV)
2. Ma Lettre de motivation personnalisée

🔗 Mon portfolio en ligne : https://ais-dev-on4tnm7gtenxqfdeska53v-164542755171.europe-west2.run.app

Restant à votre entière disposition pour tout échange ou entretien.

Bien cordialement,
Flore WANG
📞 (+237) 651 88 77 22 — Douala, Bonamoussadi`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(messageText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = messageText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/${filename}?v=${Date.now()}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 my-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Guide Spécial Téléphone</h3>
                  <p className="text-[11px] text-slate-400">Pour envoyer votre candidature facilement</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('download')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'download'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>1. Fichiers</span>
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>2. WhatsApp</span>
              </button>
              <button
                onClick={() => setActiveTab('help')}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'help'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>3. Aide</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              {activeTab === 'download' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Touchez chaque bouton pour télécharger vos documents directement dans la mémoire de votre téléphone :
                  </p>

                  {/* Bouton Lettre SYSCOLIA */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Lettre de Motivation SYSCOLIA</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">PDF</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleDownload('Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                      <a
                        href="/Lettre_de_Motivation_SYSCOLIA_Flore_Wang.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir</span>
                      </a>
                    </div>
                  </div>

                  {/* Bouton CV */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Curriculum Vitae (CV)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">PDF</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleDownload('CV_BISSIEK_WANG_Beneditte_Flore.pdf')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                      <a
                        href="/CV_BISSIEK_WANG_Beneditte_Flore.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-xl text-[11px] text-indigo-200 leading-relaxed">
                    💡 <strong>Astuce :</strong> Une fois téléchargés, passez à l'onglet <strong>« 2. WhatsApp »</strong> pour envoyer votre candidature.
                  </div>
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Message d'accompagnement :</span>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg active:scale-95 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                    {messageText}
                  </div>

                  <p className="text-xs text-slate-400">
                    Touchez un contact ci-dessous pour ouvrir directement la discussion sur WhatsApp :
                  </p>

                  <a
                    href="https://wa.me/237676726155?text=Bonjour%20Madame,%20Monsieur,%20je%20vous%20contacte%20pour%20vous%20soumettre%20ma%20candidature%20au%20poste%20de%20D%C3%A9veloppeuse%20d%E2%80%99Applications%20Web%20au%20sein%20de%20SYSCOLIA.%20Flore%20WANG%20-%20T%C3%A9l%20651887722"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ouvrir WhatsApp SYSCOLIA (676 72 61 55)</span>
                  </a>

                  <a
                    href="https://wa.me/237699552701?text=Bonjour%20Madame,%20Monsieur,%20je%20vous%20contacte%20pour%20vous%20soumettre%20ma%20candidature%20au%20poste%20de%20D%C3%A9veloppeuse%20d%E2%80%99Applications%20Web%20au%20sein%20de%20SYSCOLIA.%20Flore%20WANG%20-%20T%C3%A9l%20651887722"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ouvrir WhatsApp SYSCOLIA 2 (699 55 27 01)</span>
                  </a>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>📁</span>
                      <span>Où se trouvent mes fichiers téléchargés ?</span>
                    </h4>
                    <p className="text-[11.5px] text-slate-300 leading-relaxed">
                      • <strong>Sur Android (Samsung, Tecno, Infinix, Xiaomi...) :</strong><br />
                      Allez dans vos applications et ouvrez <strong>« Mes Fichiers »</strong> (icône jaune) ou <strong>« Files »</strong> de Google. Cliquez ensuite sur le dossier <strong>« Téléchargements »</strong> (ou <em>Downloads</em>).
                    </p>
                    <p className="text-[11.5px] text-slate-300 leading-relaxed">
                      • <strong>Sur iPhone :</strong><br />
                      Ouvrez l'application bleue <strong>« Fichiers »</strong> &gt; onglet <strong>« Téléchargements »</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>📎</span>
                      <span>Comment joindre les 2 PDF sur WhatsApp ?</span>
                    </h4>
                    <ol className="list-decimal pl-4 space-y-1.5 text-[11.5px] text-slate-300">
                      <li>Ouvrez la discussion WhatsApp.</li>
                      <li>Appuyez sur le symbole du trombone <strong>📎</strong> (ou <strong>+</strong> sur iPhone).</li>
                      <li>Sélectionnez <strong>« Document »</strong> (ne choisissez pas « Photo »).</li>
                      <li>Cliquez sur votre CV et votre Lettre de motivation pour les envoyer.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Flore WANG &bull; Douala 651 88 77 22
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
