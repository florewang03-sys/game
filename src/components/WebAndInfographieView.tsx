import React from 'react';
import { MessageCircle, ExternalLink, Globe, PenTool } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';
import { WebProjectItem, InfographieItem } from '../types';

interface WebAndInfographieViewProps {
  mode: 'dev-web' | 'infographie';
  webProjects: WebProjectItem[];
  infographieItems: InfographieItem[];
}

export const WebAndInfographieView: React.FC<WebAndInfographieViewProps> = ({ 
  mode, 
  webProjects, 
  infographieItems 
}) => {
  const isDev = mode === 'dev-web';

  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            {isDev ? 'PÔLE PIXEL · DÉVELOPPEMENT WEB & APPLICATIONS' : 'PÔLE TRAIT · INFOGRAPHIE, BRANDING & MULTIMÉDIA'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {isDev ? 'Applications Web & Sites Vitrines sur-mesure' : 'Identité Visuelle, Tableaux, Print & Vidéos'}
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed font-light">
            {isDev
              ? 'Conception d’outils web rapides, performants sur mobiles 3G/4G au Cameroun, avec référencement Google et boutons WhatsApp reliés directement à vos services.'
              : 'Création d’identités de marque complètes, tableaux artistiques sur bois/plexiglas, montages vidéo, roll-up, bâches, impressions sur papier et objets personnalisés (t-shirts, macarons, bijoux, tasses).'
            }
          </p>

          <div className="pt-2">
            <span className="text-xs text-stone-400 block mb-0.5">Tarif d'entrée :</span>
            <div className="text-3xl font-serif font-bold text-[#e5b869]">
              {isDev ? 'À partir de 120 000 FCFA' : 'À partir de 25 000 FCFA'}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Atelier Pixel & Trait · Douala, Bonamoussadi (Denver)
            </p>
          </div>
        </div>

        {/* Dynamic Items Showcase */}
        <div className="space-y-6 pt-2">
          <span className="text-xs uppercase tracking-wider text-[#e5b869] font-semibold block">
            {isDev ? 'NOS RÉALISATIONS & SITES EN LIGNE' : 'CATALOGUE DES PRESTATIONS INFOGRAPHIQUES'}
          </span>

          {isDev ? (
            /* WEB PROJECTS LIST */
            <div className="space-y-6">
              {webProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-[#262626] hover:border-[#e5b869]/40 transition-colors space-y-4"
                >
                  {project.imageUrl && (
                    <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-black border border-stone-800">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#e5b869] uppercase tracking-wider">
                      {project.clientType}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-400">
                    {project.tags.map((t, idx) => (
                      <span key={idx} className="bg-[#1e1e1e] px-2 py-0.5 rounded text-stone-300">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#222222] flex flex-col sm:flex-row items-center gap-2">
                    {project.siteUrl && (
                      <a
                        href={project.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#202020] hover:bg-[#282828] text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-[#333333] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#e5b869]" />
                        <span>Visiter le site en direct</span>
                      </a>
                    )}

                    <a
                      href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander un projet web similaire à « ${project.title} ».`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#e5b869] hover:bg-[#d6a550] text-black text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-black" />
                      <span>Commander sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* INFOGRAPHIE ITEMS LIST */
            <div className="space-y-6">
              {infographieItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-[#262626] hover:border-[#e5b869]/40 transition-colors space-y-4"
                >
                  {item.imageUrl && (
                    <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-black border border-stone-800">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-[11px] font-semibold text-[#e5b869] uppercase tracking-wider block">
                        {item.type}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-base font-serif font-bold text-[#e5b869] shrink-0">
                      {item.price}
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-[#222222] flex flex-col sm:flex-row items-center gap-2">
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#202020] hover:bg-[#282828] text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-[#333333] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#e5b869]" />
                        <span>Voir des exemples / Démo</span>
                      </a>
                    )}

                    <a
                      href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander la prestation « ${item.title} » (${item.price}) avec Pixel & Trait.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-[#e5b869] hover:bg-[#d6a550] text-black text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-black" />
                      <span>Commander sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Local presence */}
        <div className="p-4 rounded-xl bg-[#181818] border border-[#2a2a2a] text-xs text-stone-400 flex items-center justify-between">
          <span>Douala, Bonamoussadi · Quartier Denver</span>
          <span className="text-[#e5b869] font-medium">Validation avant livraison</span>
        </div>

      </div>
    </section>
  );
};
