import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';
import { NavTab } from './Navbar';

interface HomeOverviewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({ onNavigateTab }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Brand Banner */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            STUDIO DIGITAL & CRÉATIF · DOUALA (DENVER)
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Idées en pixels, <br />
            <span className="italic font-normal text-[#e5b869]">émotions en traits.</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            Pixel & Trait conçoit des <strong>sites web de mariage interactifs</strong>, des <strong>faire-parts digitaux</strong>, 
            des <strong>cadeaux personnalisés pour invités</strong> ainsi que des <strong>sites vitrines d’entreprises</strong> et de l’<strong>infographie d’art</strong>.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={STUDIO_INFO.whatsappUrl("Bonjour Flore ! Je souhaite commander un projet avec Pixel & Trait.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#e5b869] hover:bg-[#d4a755] text-black font-serif font-bold text-sm tracking-wide shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Commander sur WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigateTab('site-mariage')}
              className="px-6 py-3.5 rounded-full bg-[#181818] hover:bg-[#222222] text-stone-200 border border-[#2c2c2c] text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Voir le site de mariage</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#e5b869]" />
            </button>
          </div>
        </div>

        {/* 4 Quick Access Navigation Cards */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#e5b869] font-semibold block">
            EXPLORER LE CATALOGUE PIXEL & TRAIT
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1 */}
            <div
              onClick={() => onNavigateTab('site-mariage')}
              className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#e5b869]/50 transition-all cursor-pointer space-y-2 group"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#e5b869] font-semibold block">
                Célébrations Nuptiales
              </span>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e5b869] transition-colors">
                Sites Web de Mariage
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Les 9 piliers interactifs : histoire, compte à rebours, RSVP, dress code, GPS, programme, filtre Snap, cagnotte et album partagé.
              </p>
              <span className="text-xs font-serif font-bold text-[#e5b869] block pt-1">
                Dès 45 000 FCFA →
              </span>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onNavigateTab('save-the-date')}
              className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#e5b869]/50 transition-all cursor-pointer space-y-2 group"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#e5b869] font-semibold block">
                Annonces & Réseaux
              </span>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e5b869] transition-colors">
                Save the Date & Filtres Snap
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Fichiers prêts pour WhatsApp et Instagram, livrés en 48 h chrono.
              </p>
              <span className="text-xs font-serif font-bold text-[#e5b869] block pt-1">
                Dès 5 000 FCFA →
              </span>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onNavigateTab('cadeaux')}
              className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#e5b869]/50 transition-all cursor-pointer space-y-2 group"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#e5b869] font-semibold block">
                Souvenirs Personnalisés
              </span>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e5b869] transition-colors">
                Cadeaux pour Invités
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Tasses magiques, tasses simples, porte-clés, portraits bois/plexiglas, pochettes et maillots personnalisés.
              </p>
              <span className="text-xs font-serif font-bold text-[#e5b869] block pt-1">
                Dès 1 000 FCFA la pièce →
              </span>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => onNavigateTab('dev-web')}
              className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#e5b869]/50 transition-all cursor-pointer space-y-2 group"
            >
              <span className="text-[10px] uppercase tracking-wider text-[#e5b869] font-semibold block">
                Pôle Professionnel
              </span>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e5b869] transition-colors">
                Web & Infographie d'Art
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Sites vitrines sur-mesure, chartes graphiques et logos vectoriels de haute précision.
              </p>
              <span className="text-xs font-serif font-bold text-[#e5b869] block pt-1">
                Découvrir nos offres →
              </span>
            </div>
          </div>
        </div>

        {/* Localisation Reassurance */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] text-xs text-stone-400 space-y-1">
          <strong className="text-white block font-serif text-sm">Pixel & Trait au Cameroun</strong>
          <p>
            Atelier situé à <strong>Douala, Bonamoussadi · Quartier Denver</strong>. 
            Créations livrées partout au Cameroun (Douala, Yaoundé, Bafoussam, Kribi, etc.) et dans la diaspora.
          </p>
        </div>

      </div>
    </section>
  );
};
