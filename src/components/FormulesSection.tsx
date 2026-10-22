import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';

export const FormulesSection: React.FC = () => {
  const formulas = [
    {
      id: 'civil',
      category: 'Mariage Civil',
      title: 'Formule Mairie Seule',
      price: '45 000 FCFA',
      delay: '5 à 7 jours ouvrés',
      ideal: 'Cérémonie civile à l’hôtel de ville et vin d’honneur',
      features: [
        'Site web interactif privé',
        'Horaires et programme de la mairie',
        'Localisation GPS (Google Maps & Waze)',
        'Confirmation de présence (RSVP direct WhatsApp)',
        'Compte à rebours animé',
        'Album photo souvenir des mariés',
      ],
      popular: false,
    },
    {
      id: 'coutumier',
      category: 'Mariage Coutumier',
      title: 'Formule Dot Traditionnelle',
      price: '45 000 FCFA',
      delay: '5 à 7 jours ouvrés',
      ideal: 'Mariage traditionnel, remise de dot et bénédiction des familles',
      features: [
        'Mise en valeur des deux familles',
        'Dress code traditionnel (Toghu, Ndop, Pagne)',
        'Plan d’accès précis au domicile familial',
        'RSVP pour le banquet traditionnel',
        'Musique d’ambiance culturelle',
        'Livre d’or et vœux des proches',
      ],
      popular: false,
    },
    {
      id: 'religieux',
      category: 'Mariage Religieux',
      title: 'Formule Bénédiction Nuptiale',
      price: '45 000 FCFA',
      delay: '5 à 7 jours ouvrés',
      ideal: 'Messe de mariage à l’église, temple ou culte solennel',
      features: [
        'Livret et textes liturgiques en ligne',
        'Horaires précis du cortège et de l’office',
        'Localisation GPS de l’église ou de la paroisse',
        'Confirmation des invités',
        'Musique sacrée d’ambiance',
      ],
      popular: false,
    },
    {
      id: 'complet',
      category: 'Les Trois Cérémonies',
      title: 'Grand Palace 3 en 1 Complet',
      price: '95 000 FCFA',
      delay: '3 à 5 jours prioritaires',
      ideal: 'Dot Traditionnelle + Mairie + Église + Soirée dansante',
      features: [
        'Les 9 fonctionnalités officielles complètes',
        'Organisation chronologique des 3 étapes distinctes',
        'Double dress code (Traditionnel & Soirée de gala)',
        'Filtre Snapchat officiel personnalisé offert',
        'Espace cagnottes Orange Money & MTN MoMo intégrés',
        'Album photo interactif partagé pour tous les invités',
        'Assistance et modifications prioritaires VIP',
      ],
      popular: true,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0c0c0c] text-white text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5b869] font-semibold block">
            GRILLE DES FORMULES CÉRÉMONIES
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Choisissez la formule qui convient à votre grand jour
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed font-light">
            Au Cameroun, chaque mariage a son rythme : que vous fassiez uniquement la mairie, la coutume, 
            l’église ou le grand mariage complet 3 en 1, nos formules sont claires et sans surprise.
          </p>
        </div>

        {/* Formulas List */}
        <div className="space-y-6">
          {formulas.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                item.popular
                  ? 'bg-[#181512] border-[#e5b869] shadow-xl'
                  : 'bg-[#141414] border-[#242424] hover:border-stone-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#242424]">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                    item.popular ? 'text-[#e5b869]' : 'text-stone-400'
                  }`}>
                    {item.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 font-light">
                    {item.ideal}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#e5b869]">
                    {item.price}
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Livraison : {item.delay}
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="py-4 space-y-2">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Ce qui est inclus :
                </span>
                {item.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-300 font-light">
                    <Check className="w-3.5 h-3.5 text-[#e5b869] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={STUDIO_INFO.whatsappUrl(`Bonjour Flore ! Je souhaite commander la ${item.title} (${item.price}) pour mon mariage.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-full text-xs font-serif font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                    item.popular
                      ? 'bg-[#e5b869] hover:bg-[#d6a550] text-black shadow-md'
                      : 'bg-[#222222] hover:bg-[#2c2c2c] text-[#e5b869] border border-[#333333]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Commander cette formule sur WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] text-center text-xs text-stone-400">
          📍 Atelier Pixel & Trait · Douala, Bonamoussadi · Quartier Denver (Cameroun)
        </div>

      </div>
    </section>
  );
};
