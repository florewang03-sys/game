import React from 'react';
import { MessageCircle, Check, ExternalLink } from 'lucide-react';
import { STUDIO_INFO, WEDDING_PILLARS } from '../data/initialData';
import { CeremonyModel } from '../types';

interface WeddingSiteSectionProps {
  models?: CeremonyModel[];
}

export const WeddingSiteSection: React.FC<WeddingSiteSectionProps> = ({ models = [] }) => {
  const displayModels = models && models.length > 0 ? models : [];

  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Header Card matching image_24a472b2.png */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            SITE WEB DE MARIAGE
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Votre histoire, un site à votre image
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            Élégant, interactif, inoubliable : un site privé que vos invités ouvrent depuis leur invitation 
            (lien ou QR code) pour tout savoir de votre grand jour.
          </p>

          {/* Pricing Callout */}
          <div className="pt-2">
            <span className="text-xs text-stone-400 block mb-0.5">À partir de</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#e5b869]">
              45 000 FCFA
            </div>
            <div className="text-xs text-stone-400 mt-2 space-y-0.5">
              <p>Livraison sous 5 à 7 jours ouvrés</p>
              <p>Partout au Cameroun et dans le monde entier</p>
              <p className="text-[#e5b869]/80 font-medium pt-1">
                Atelier Pixel & Trait · Douala, Bonamoussadi (Denver)
              </p>
            </div>
          </div>

          {/* Large CTA Button */}
          <div className="pt-4">
            <a
              href={STUDIO_INFO.whatsappUrl("Bonjour Flore ! Je souhaite commander un site web de mariage avec Pixel & Trait (à partir de 45 000 FCFA).")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#e5b869] hover:bg-[#d4a755] text-black font-serif font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Commander mon site sur WhatsApp</span>
            </a>
          </div>
        </div>

        {/* The 9 Pillars Enumerated Clearly Without Clutter */}
        <div className="space-y-6 pt-4 border-t border-[#222222]">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#e5b869] font-semibold block">
              CONTENU DU SITE DE MARIAGE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Les 9 fonctionnalités incluses
            </h2>
            <p className="text-xs text-stone-400">
              Chaque module est soigneusement intégré selon vos besoins et votre programme :
            </p>
          </div>

          <div className="space-y-3">
            {WEDDING_PILLARS.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex items-start gap-3 hover:border-[#e5b869]/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#e5b869]/15 text-[#e5b869] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DYNAMIC LIST OF PUBLISHED WEDDING SITES WITH CLICKABLE DEMO LINKS */}
        <div className="space-y-6 pt-6 border-t border-[#222222]">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#e5b869] font-semibold block">
              DÉMONSTRATIONS & RÉALISATIONS RÉCENTES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Explorez nos sites de mariage en direct
            </h2>
            <p className="text-xs text-stone-400 font-light">
              Cliquez sur un modèle pour tester le site ou la démo comme si vous étiez un invité :
            </p>
          </div>

          <div className="space-y-6">
            {displayModels.map((model) => (
              <div
                key={model.id}
                className="rounded-2xl overflow-hidden border border-[#262626] bg-[#141414] hover:border-[#e5b869]/60 transition-all flex flex-col justify-between"
              >
                {/* Photo & Clickable Demo Link */}
                <div className="relative aspect-16/9 bg-black overflow-hidden group">
                  <img
                    src={model.imageUrl}
                    alt={model.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-[#e5b869] bg-black/70 px-2.5 py-1 rounded-md border border-[#e5b869]/40">
                      {model.details.ceremonyType}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-serif text-xl font-bold text-white">
                      {model.title}
                    </h3>
                    <span className="font-serif text-lg font-bold text-[#e5b869]">
                      {model.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    {model.details.description}
                  </p>

                  {/* Highlights list */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-400">
                    {model.details.highlights.map((h, i) => (
                      <span key={i} className="bg-[#1c1c1c] px-2 py-0.5 rounded text-stone-300">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Links: Demo & WhatsApp */}
                  <div className="pt-3 border-t border-[#222222] flex flex-col sm:flex-row items-center gap-2">
                    {model.demoUrl && (
                      <a
                        href={model.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#202020] hover:bg-[#282828] text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-[#333333] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#e5b869]" />
                        <span>Tester la démo en direct</span>
                      </a>
                    )}

                    <a
                      href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander le modèle de mariage « ${model.title} » (${model.price}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#e5b869] hover:bg-[#d6a550] text-black text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-black" />
                      <span>Commander sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
