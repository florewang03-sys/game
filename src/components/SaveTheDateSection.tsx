import React from 'react';
import { MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';
import { SaveTheDateItem } from '../types';

interface SaveTheDateSectionProps {
  items: SaveTheDateItem[];
}

export const SaveTheDateSection: React.FC<SaveTheDateSectionProps> = ({ items }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            SAVE THE DATE & FILTRES
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Annoncez votre événement avec style
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed font-light">
            Design unique adapté à votre thème, fichier prêt à partager sur WhatsApp et les réseaux sociaux, 
            livré en 48 h chrono par l'atelier <strong>Pixel & Trait</strong> à Douala.
          </p>
        </div>

        {/* Dynamic Cards */}
        <div className="space-y-4">
          {items.map((prod) => (
            <div
              key={prod.id}
              className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-3 hover:border-[#e5b869]/40 transition-colors"
            >
              {prod.imageUrl && (
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-black mb-3">
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{prod.title}</h3>
                  <div className="text-2xl font-serif font-bold text-[#e5b869] mt-0.5">
                    {prod.price}
                  </div>
                </div>

                <span className="text-[11px] font-medium text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3 h-3 text-[#e5b869]" />
                  <span>{prod.delay}</span>
                </span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {prod.desc}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {prod.demoUrl && (
                  <a
                    href={prod.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#e5b869]" />
                    <span>Tester la démo / Voir un exemple</span>
                  </a>
                )}

                <a
                  href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander la création « ${prod.title} » (${prod.price}) avec Pixel & Trait.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#e5b869] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#e5b869]" />
                  <span>Commander sur WhatsApp (6 51 88 77 22)</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance banner */}
        <div className="p-4 rounded-xl bg-[#181818] border border-[#2a2a2a] text-xs text-stone-400 flex items-center justify-between">
          <span>Créé à Douala, Bonamoussadi · Quartier Denver</span>
          <span className="text-[#e5b869] font-medium">Validation avant livraison</span>
        </div>

      </div>
    </section>
  );
};
