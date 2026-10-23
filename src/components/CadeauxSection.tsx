import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';
import { GuestGiftItem } from '../types';

interface CadeauxSectionProps {
  gifts?: GuestGiftItem[];
}

export const CadeauxSection: React.FC<CadeauxSectionProps> = ({ gifts = [] }) => {
  const displayGifts = gifts && gifts.length > 0 ? gifts : [];

  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            CADEAUX INVITÉS · CATALOGUE SOUVENIR 2026
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Un souvenir personnalisé <span className="italic font-normal text-[#e5b869]">qui se garde</span>
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed font-light">
            Tasses magiques, tasses simples, porte-clés, portraits gravés sur bois ou plexiglas, 
            pochettes, maillots, macarons et bijoux personnalisés : Pixel & Trait confectionne des souvenirs inoubliables 
            marqués à vos prénoms et à la date de votre grand jour.
          </p>
        </div>

        {/* 4 Metric Blocks */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#e5b869]">Dès 800 FCFA</div>
            <div className="text-xs text-stone-400 mt-0.5">la pièce selon modèle</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#e5b869]">Petits & Grands lots</div>
            <div className="text-xs text-stone-400 mt-0.5">dès 10 à 20 pièces</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#e5b869]">7 à 10 jours</div>
            <div className="text-xs text-stone-400 mt-0.5">confection soignée</div>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#e5b869]">Partout</div>
            <div className="text-xs text-stone-400 mt-0.5">Douala, Yaoundé & Diaspora</div>
          </div>
        </div>

        {/* Dynamic Catalog of Gifts items */}
        <div className="space-y-4 pt-2">
          <span className="text-xs uppercase tracking-wider text-[#e5b869] font-semibold block">
            NOS CRÉATIONS SOUVENIRS POUR INVITÉS
          </span>

          <div className="space-y-4">
            {displayGifts.map((gift) => (
              <div
                key={gift.id}
                className="p-5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#e5b869]/40 transition-colors space-y-3"
              >
                {/* Photo if provided */}
                {gift.imageUrl && (
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-black border border-stone-800">
                    <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-semibold text-white text-base">
                      {gift.name}
                    </h3>
                    <span className="text-[11px] text-[#e5b869] font-medium">
                      {gift.category} · {gift.minQuantity}
                    </span>
                  </div>

                  <div className="text-sm font-serif font-bold text-[#e5b869] shrink-0">
                    {gift.startingPrice}
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  {gift.description}
                </p>

                <div className="pt-1">
                  <a
                    href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander « ${gift.name} » (${gift.startingPrice}) pour mes invités avec Pixel & Trait.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#e5b869] hover:underline font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#e5b869]" />
                    <span>Commander cet article sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Large WhatsApp CTA */}
        <div className="pt-2">
          <a
            href={STUDIO_INFO.whatsappUrl("Bonjour Flore ! Je souhaite commander un lot de cadeaux personnalisés pour mes invités (tasses, porte-clés, portraits, maillots...).")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#e5b869] hover:bg-[#d4a755] text-black font-serif font-bold text-sm tracking-wide transition-all shadow-md text-center"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Commander des cadeaux invités sur WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
