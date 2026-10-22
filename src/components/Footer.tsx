import React from 'react';
import { MessageCircle, MapPin, Lock, ArrowUp } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-stone-300 pt-12 pb-24 sm:pb-16 border-t border-[#1c1c1c] text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Brand identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#e5b869]/40 bg-black p-0.5">
              <img 
                src="/assets/aistudio/image_22153377.png" 
                alt="Pixel & Trait" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              PIXEL <span className="text-[#e5b869]">&</span> TRAIT
            </span>
          </div>

          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Studio digital & créatif : Sites web de mariage interactifs, faire-parts de cérémonies, 
            cadeaux personnalisés pour invités, développement web professionnel et infographie de prestige.
          </p>

          <div className="text-xs text-[#e5b869] font-serif italic">
            « Idées en pixels, émotions en traits. »
          </div>
        </div>

        {/* Localisation Denver Bonamoussadi */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] flex items-start gap-3 text-xs">
          <MapPin className="w-4 h-4 text-[#e5b869] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-stone-300">
            <strong className="text-white block font-medium">Localisation de l'Atelier</strong>
            <p>Situé à <strong>Douala, Bonamoussadi · Quartier Denver (Cameroun)</strong></p>
            <p className="text-stone-400 text-[11px]">Commandes livrées partout au Cameroun et dans le monde entier.</p>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href={STUDIO_INFO.whatsappUrl("Bonjour Flore ! Je souhaite commander un projet avec Pixel & Trait.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#e5b869] hover:bg-[#d4a755] text-black font-serif font-bold text-xs tracking-wide transition-all shadow-md text-center"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Commander sur WhatsApp (6 51 88 77 22)</span>
          </a>
        </div>

        {/* Bottom meta & secret admin */}
        <div className="pt-6 border-t border-[#1c1c1c] flex items-center justify-between text-[11px] text-stone-500">
          <div>
            © 2026 Pixel & Trait · Fondé par Flore
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 hover:text-stone-300 transition-colors cursor-pointer"
              title="Espace réservé à Flore"
            >
              <Lock className="w-3 h-3 text-[#e5b869]" />
              <span>Administration</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Haut</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
