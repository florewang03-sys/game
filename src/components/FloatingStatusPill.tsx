import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';
import { NavTab } from './Navbar';

interface FloatingStatusPillProps {
  activeTab: NavTab;
  onSelectNextTab: () => void;
}

export const FloatingStatusPill: React.FC<FloatingStatusPillProps> = ({ activeTab, onSelectNextTab }) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'accueil':
        return 'Accueil & Cérémonies';
      case 'formules':
        return 'Formules Mariage';
      case 'site-mariage':
        return 'Site de mariage (Les 9 Piliers)';
      case 'save-the-date':
        return 'Save the date & Filtres';
      case 'cadeaux':
        return 'Cadeaux invités';
      case 'dev-web':
        return 'Développement Web';
      case 'infographie':
        return 'Infographie & Design';
      default:
        return 'Pixel & Trait';
    }
  };

  return (
    <aside aria-label="Navigation rapide" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[92vw]">
      <div className="bg-[#1a1714]/90 backdrop-blur-md border border-[#e5b869]/30 rounded-full pl-3 pr-2 py-1.5 flex items-center gap-3 shadow-2xl">
        {/* Ring icon inside gold circle */}
        <div 
          onClick={onSelectNextTab}
          className="flex items-center gap-2.5 cursor-pointer text-left select-none pr-1"
          title="Cliquez pour changer de section"
        >
          <div className="w-7 h-7 rounded-full border border-[#e5b869] flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e5b869]" />
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-medium">
              VOUS ÊTES ICI
            </span>
            <span className="text-xs font-serif font-bold text-white tracking-wide truncate max-w-[170px] sm:max-w-[240px]">
              {getTabTitle(activeTab)}
            </span>
          </div>
        </div>

        {/* Green WhatsApp Round Button */}
        <a
          href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! J'ai visité la section ${getTabTitle(activeTab)} sur le site Pixel & Trait et je souhaite commander.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center text-white shrink-0 shadow-lg hover:scale-105 transition-transform"
          title="Commander sur WhatsApp (6 51 88 77 22)"
        >
          <MessageCircle className="w-5 h-5 fill-white text-white" />
        </a>
      </div>
    </aside>
  );
};
