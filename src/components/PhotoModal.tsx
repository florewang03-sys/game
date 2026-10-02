import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, Check, Sparkles, UserCheck } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const photoUrl = '/flore_photo_profil.jpg';

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = 'Flore_Wang_Photo_Profil.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDirect = () => {
    window.open(photoUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Votre Photo de Profil Optimisée</h3>
              <p className="text-xs text-slate-400">Recadrée au format carré 1:1 pour ComeUp, LinkedIn & CV</p>
            </div>
          </div>

          {/* Photo Display Card */}
          <div className="relative group mx-auto my-3 w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-xl shadow-indigo-950/80">
            <img
              src={photoUrl}
              alt="Beneditte Flore - Photo de Profil Professionnelle"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3 pointer-events-none">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Format studio prêt à l'emploi
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 my-4 text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-white flex items-center gap-1.5">
              💡 Comment l'utiliser sur votre téléphone :
            </p>
            <p>1. Cliquez sur le bouton vert <strong>« Télécharger la photo »</strong> ci-dessous.</p>
            <p>2. Elle s'enregistre directement dans votre galerie ou dossier Téléchargements.</p>
            <p>3. Retournez sur ComeUp et sélectionnez-la comme photo de profil !</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger la photo 📥</span>
            </button>
            <button
              onClick={handleOpenDirect}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir en grand</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
