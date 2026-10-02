import React, { useState } from 'react';
import { 
  MapPin, Clock, Calendar, Gift, Camera, Check, Copy, ExternalLink, Heart
} from 'lucide-react';

interface WeddingDemoProps {
  onBackToPortfolio?: () => void;
}

export const WeddingDemo: React.FC<WeddingDemoProps> = ({ onBackToPortfolio }) => {
  const [copiedOM, setCopiedOM] = useState(false);
  const [copiedMOMO, setCopiedMOMO] = useState(false);

  const handleCopy = (text: string, type: 'om' | 'momo') => {
    navigator.clipboard.writeText(text);
    if (type === 'om') {
      setCopiedOM(true);
      setTimeout(() => setCopiedOM(false), 2500);
    } else {
      setCopiedMOMO(true);
      setTimeout(() => setCopiedMOMO(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans antialiased selection:bg-[#330a0a] selection:text-white pb-20">
      
      {/* Barre de retour vers le portfolio (discrète en haut) */}
      {onBackToPortfolio && (
        <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 flex items-center justify-between">
          <span className="font-medium">Invitation Mariage Flore & Blaise</span>
          <button
            onClick={onBackToPortfolio}
            className="text-white hover:underline text-xs flex items-center gap-1 font-semibold"
          >
            ← Retour au Portfolio
          </button>
        </div>
      )}

      {/* CONTENEUR PRINCIPAL DU SITE FORMAT MOBILE / CANVA CENTRÉ */}
      <main className="max-w-md mx-auto bg-white shadow-2xl border-x border-stone-200 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* CARTE 1 : EN-TÊTE / ANNONCE DU MARIAGE */}
        {/* ========================================================================= */}
        <section className="p-8 text-center bg-gradient-to-b from-[#fffbf2] to-white border-b border-stone-100">
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#fcedd2] text-[#784408] text-xs font-bold uppercase tracking-wider mb-6">
            Invitation au Mariage
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#330a0a] mb-2 tracking-tight">
            Flore <span className="font-light italic text-[#9e7025]">&</span> Blaise
          </h1>

          <div className="w-16 h-0.5 bg-[#9e7025] mx-auto my-4" />

          <p className="text-stone-700 text-sm leading-relaxed font-serif italic px-2">
            « Le destin les a réunis, au premier regard ils se sont aimés, pour que leur âme ne fasse plus qu’une, Flore et Blaise se diront <span className="font-bold text-[#330a0a] not-italic">« OUI »</span> pour la vie le <span className="font-bold text-[#330a0a] not-italic">samedi 31 Janvier 2026</span> à la salle COZY’O de Bonamoussadi. »
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800">
            <Calendar className="w-4 h-4 text-[#9e7025]" />
            <span>Samedi 31 Janvier 2026</span>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 2 : LIEU & GOOGLE MAPS (SALLE COZY'O) */}
        {/* ========================================================================= */}
        <section className="p-6 bg-stone-50 border-b border-stone-100 text-center">
          
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-5 h-5" />
          </div>

          <h2 className="font-bold text-stone-900 text-lg mb-1">
            La Salle COZY’O de Bonamoussadi
          </h2>

          <p className="text-stone-700 text-xs leading-relaxed mb-4 px-3">
            Rond point Maetur Bonamoussadi Denver à 100m du domicile d’Eto’o fils.
          </p>

          <a
            href="https://maps.app.goo.gl/x6PRaXKuQtDqTBQWA"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#330a0a] hover:bg-stone-900 text-white font-bold text-xs shadow transition-all"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Ouvrir l'itinéraire Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 3 : PROGRAMME DE LA JOURNÉE (TOUT LES DETAILS) */}
        {/* ========================================================================= */}
        <section className="p-6 border-b border-stone-100 text-center">
          
          <span className="text-[11px] font-bold text-[#9e7025] uppercase tracking-widest block mb-1">
            Tous les Détails
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#330a0a] mb-6">
            Programme du Mariage
          </h2>

          <div className="space-y-3">
            
            {/* 13H00 : Mariage civil */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#330a0a] text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Mariage Civil</h3>
                  <p className="text-[11px] text-stone-500">Célébration officielle</p>
                </div>
              </div>
              <span className="font-black text-sm text-[#9e7025] bg-white px-3 py-1 rounded-lg border border-stone-200">
                13H00
              </span>
            </div>

            {/* 15H30 : Cocktail dînatoire */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#9e7025] text-white flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Cocktail Dînatoire</h3>
                  <p className="text-[11px] text-stone-500">Réception & Soirée dansante</p>
                </div>
              </div>
              <span className="font-black text-sm text-[#9e7025] bg-white px-3 py-1 rounded-lg border border-stone-200">
                15H30
              </span>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 4 : DRESS CODE (TENUES AUX COULEURS VIVES) */}
        {/* ========================================================================= */}
        <section className="p-6 bg-[#fffdfa] border-b border-stone-100 text-center">
          
          <span className="text-[11px] font-bold text-[#9e7025] uppercase tracking-widest block mb-1">
            Harmonie de la Fête
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#330a0a] mb-2">
            DRESS CODE
          </h2>

          <div className="inline-block px-4 py-1.5 rounded-full bg-[#330a0a] text-white text-xs font-bold mb-4">
            Tenues aux couleurs vives
          </div>

          <p className="text-stone-600 text-xs italic mb-5 px-4">
            Voici quelques idées de tenues aux couleurs vives pour illuminer la cérémonie.
          </p>

          {/* Grille simple de 3 modèles de tenues réelles africaines couleurs vives (visages coupés) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Modèle Dames Couleurs Vives"
                className="w-full h-full object-cover object-[center_90%]"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt="Modèle Messieurs Couleurs Vives"
                className="w-full h-full object-cover object-[center_85%]"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"
                alt="Détails Étoffe"
                className="w-full h-full object-cover object-[center_80%]"
              />
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 5 : CADEAUX (KIAM WANG LERICE & BAMOU MICHEL) */}
        {/* ========================================================================= */}
        <section className="p-6 border-b border-stone-100 text-center">
          
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Gift className="w-5 h-5" />
          </div>

          <span className="text-[11px] font-bold text-[#9e7025] uppercase tracking-widest block mb-1">
            À propos des
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#330a0a] mb-2">
            CADEAUX
          </h2>

          <p className="text-stone-700 text-xs italic mb-4 leading-relaxed px-2">
            « Si vous souhaitez nous témoigner encore plus votre affection et votre soutien à cette étape de notre vie, nous recevons les présents numéraires. »
          </p>
          <p className="text-stone-800 text-xs font-semibold mb-4">
            À cet effet, vos apports seront collectionnés via les numéros suivants :
          </p>

          <div className="space-y-3">
            
            {/* Numéro 1 : Kiam Wang Lerice */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-left">
              <div>
                <p className="font-bold text-stone-900 text-sm">Kiam Wang Lerice</p>
                <p className="font-mono text-base font-extrabold text-[#330a0a]">683087767</p>
              </div>
              <button
                onClick={() => handleCopy('683087767', 'om')}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedOM ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOM ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

            {/* Numéro 2 : Bamou Michel */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-left">
              <div>
                <p className="font-bold text-stone-900 text-sm">Bamou Michel</p>
                <p className="font-mono text-base font-extrabold text-[#330a0a]">694849623</p>
              </div>
              <button
                onClick={() => handleCopy('694849623', 'momo')}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedMOMO ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMOMO ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 6 : RSVP (CONFIRMATION DE PRÉSENCE) */}
        {/* ========================================================================= */}
        <section className="p-6 bg-stone-50 border-b border-stone-100 text-center">
          
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1">
            Veuillez
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#330a0a] mb-2">
            RSVP
          </h2>

          <p className="text-stone-700 text-xs mb-5 leading-relaxed px-2">
            Merci de bien vouloir confirmer votre présence en cliquant sur le bouton ci-dessous.
          </p>

          <a
            href="https://app.youform.com/forms/nf5nwhjh"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition-all"
          >
            <span>Cliquez ici pour confirmer votre présence</span>
            <ExternalLink className="w-4 h-4" />
          </a>

        </section>

        {/* ========================================================================= */}
        {/* CARTE 7 : ALBUM SOUVENIR (EN TOUTE DERNIÈRE POSITION) */}
        {/* ========================================================================= */}
        <section className="p-6 text-center">
          
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center mx-auto mb-3">
            <Camera className="w-5 h-5" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#330a0a] mb-2">
            Album Photos & Vidéos
          </h2>

          <p className="text-stone-700 text-xs mb-5 leading-relaxed px-2">
            Veuillez cliquer sur l’album ci-dessous pour y insérer les photos et les vidéos concernant le mariage.
          </p>

          <a
            href="https://app.kululu.com/q4r84m"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#330a0a] hover:bg-stone-900 text-white font-bold text-sm shadow transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Ouvrir l’Album Collaboratif Kululu</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>

        </section>

        {/* Pied de page sobre */}
        <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-400 bg-stone-50 font-sans">
          <p className="font-semibold text-stone-600">Flore & Blaise — 31 Janvier 2026</p>
          <p className="text-[11px] mt-1">Salle COZY’O de Bonamoussadi Denver</p>
        </footer>

      </main>

    </div>
  );
};
