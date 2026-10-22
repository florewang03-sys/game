import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';

export type NavTab = 
  | 'accueil' 
  | 'formules' 
  | 'site-mariage' 
  | 'save-the-date' 
  | 'cadeaux' 
  | 'dev-web' 
  | 'infographie';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenAdmin }) => {
  const [clickCount, setClickCount] = React.useState(0);

  // Secret admin trigger on brand logo double click
  const handleLogoClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        onOpenAdmin();
        return 0;
      }
      setTimeout(() => setClickCount(0), 800);
      return next;
    });
  };

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'formules', label: 'Formules' },
    { id: 'site-mariage', label: 'Site de mariage' },
    { id: 'save-the-date', label: 'Save the date & Filtres' },
    { id: 'cadeaux', label: 'Cadeaux invités' },
    { id: 'dev-web', label: 'Développement Web' },
    { id: 'infographie', label: 'Infographie' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#222222]">
      {/* Top Header Row with Logo and WhatsApp Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between">
        {/* Brand Logo (with secret admin double click) */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title="Pixel & Trait (Double-cliquez pour l'espace administrateur)"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e5b869]/40 bg-black p-0.5 group-hover:scale-105 transition-transform">
            <img 
              src="/assets/aistudio/image_22153377.png" 
              alt="Pixel & Trait" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-[#e5b869] transition-colors leading-none">
              PIXEL <span className="text-[#e5b869] font-normal">&</span> TRAIT
            </span>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 mt-1">
              Douala · Bonamoussadi, Denver
            </span>
          </div>
        </div>

        {/* Round WhatsApp icon button */}
        <a
          href={STUDIO_INFO.whatsappUrl("Bonjour Flore ! Je souhaite commander un projet avec Pixel & Trait.")}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#e5b869] hover:bg-[#d6a550] flex items-center justify-center text-black shadow-md hover:scale-105 transition-all"
          title="Commander directement sur WhatsApp (6 51 88 77 22)"
        >
          <MessageCircle className="w-5 h-5 fill-black text-black" />
        </a>
      </div>

      {/* Horizontal Nav Bar with active gold underline (matches uploaded screenshot) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-6 sm:gap-8 min-w-max text-xs sm:text-sm font-medium py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`pb-2.5 transition-colors whitespace-nowrap cursor-pointer relative ${
                  isActive 
                    ? 'text-[#e5b869] font-semibold' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e5b869] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
