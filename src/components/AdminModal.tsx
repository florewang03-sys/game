import React, { useState } from 'react';
import { X, Lock, Plus, Trash2, Check, RefreshCw, KeyRound, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { 
  StudioCatalogState, 
  CeremonyModel, 
  SaveTheDateItem, 
  GuestGiftItem, 
  WebProjectItem, 
  InfographieItem,
  CeremonyCategory
} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: StudioCatalogState;
  onSaveCatalog: (newCatalog: StudioCatalogState) => void;
  onResetCatalog: () => void;
}

type AdminSection = 'mariage' | 'save_the_date' | 'cadeaux' | 'web' | 'infographie';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onSaveCatalog,
  onResetCatalog,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Active admin section
  const [activeAdminSection, setActiveAdminSection] = useState<AdminSection>('mariage');

  // Generic form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [delay, setDelay] = useState('');
  const [description, setDescription] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/fairepart_wedding_preview_1792669131612.jpg');
  
  // Specific to wedding category
  const [weddingCat, setWeddingCat] = useState<CeremonyCategory>('civil');
  // Specific to infographie type
  const [infographieType, setInfographieType] = useState('Tableau & Gravure Bois/Plexiglas');
  // Specific to guest gifts
  const [giftMinQty, setGiftMinQty] = useState('Minimum 15 pièces');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (['flore', 'pixel', '237', 'admin'].includes(passcode.toLowerCase().trim())) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Mot de passe incorrect.');
    }
  };

  // Helper to handle direct file photo upload from phone/computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeAdminSection === 'mariage') {
      let typeLabel = 'Mariage Civil';
      if (weddingCat === 'coutumier') typeLabel = 'Mariage Coutumier / Dot';
      else if (weddingCat === 'religieux') typeLabel = 'Mariage Religieux / Église';
      else if (weddingCat === 'complet_3en1') typeLabel = 'Mariage Complet (Les Trois 3 en 1)';
      else if (weddingCat === 'anniversaire') typeLabel = 'Anniversaire VIP';
      else if (weddingCat === 'bapteme') typeLabel = 'Baptême & Enfance';

      const newModel: CeremonyModel = {
        id: `wm-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Modèle officiel Pixel & Trait',
        category: weddingCat,
        price: price.trim() || 'À partir de 45 000 FCFA',
        deliveryTime: delay.trim() || '5 à 7 jours ouvrés',
        imageUrl: imageUrl || '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
        demoUrl: demoUrl.trim() || undefined,
        details: {
          ceremonyType: typeLabel,
          highlights: ['RSVP WhatsApp', 'Compte à rebours', 'Album photo partagé', 'GPS Waze & Maps'],
          description: description.trim() || 'Modèle prestigieux conçu par Pixel & Trait.',
        },
      };

      onSaveCatalog({
        ...catalog,
        weddingModels: [newModel, ...catalog.weddingModels],
      });
      alert(`Le modèle de mariage « ${newModel.title} » est maintenant en ligne avec son lien de démonstration !`);
    } else if (activeAdminSection === 'save_the_date') {
      const newItem: SaveTheDateItem = {
        id: `std-${Date.now()}`,
        title: title.trim(),
        price: price.trim() || '5 000 FCFA',
        delay: delay.trim() || 'Livré en 48 h',
        desc: description.trim() || 'Visuel exclusif pour réseaux sociaux et WhatsApp.',
        imageUrl: imageUrl,
        demoUrl: demoUrl.trim() || undefined,
      };

      onSaveCatalog({
        ...catalog,
        saveTheDateItems: [newItem, ...catalog.saveTheDateItems],
      });
      alert(`Le visuel « ${newItem.title} » a été ajouté à la rubrique Save the date & Filtres !`);
    } else if (activeAdminSection === 'cadeaux') {
      const newGift: GuestGiftItem = {
        id: `gift-${Date.now()}`,
        name: title.trim(),
        category: subtitle.trim() || 'Souvenir d’exception',
        startingPrice: price.trim() || 'Dès 2 000 FCFA / pièce',
        minQuantity: giftMinQty.trim() || 'Minimum 15 pièces',
        description: description.trim() || 'Personnalisé aux prénoms des mariés.',
        imageUrl: imageUrl,
      };

      onSaveCatalog({
        ...catalog,
        guestGifts: [newGift, ...catalog.guestGifts],
      });
      alert(`L'article souvenir « ${newGift.name} » a été ajouté au catalogue de cadeaux invités !`);
    } else if (activeAdminSection === 'web') {
      const newWeb: WebProjectItem = {
        id: `web-${Date.now()}`,
        title: title.trim(),
        clientType: subtitle.trim() || 'Application Web & Entreprise',
        description: description.trim() || 'Développé sur-mesure par Flore (Pixel & Trait).',
        siteUrl: demoUrl.trim() || undefined,
        imageUrl: imageUrl,
        tags: ['React & TypeScript', 'SEO Google', 'WhatsApp Direct'],
      };

      onSaveCatalog({
        ...catalog,
        webProjects: [newWeb, ...catalog.webProjects],
      });
      alert(`Le projet web « ${newWeb.title} » a été ajouté avec son lien cliquable !`);
    } else if (activeAdminSection === 'infographie') {
      const newInfo: InfographieItem = {
        id: `info-${Date.now()}`,
        title: title.trim(),
        type: infographieType,
        price: price.trim() || 'À partir de 25 000 FCFA',
        description: description.trim() || 'Création graphique haute précision pour imprimerie et digital.',
        imageUrl: imageUrl,
        demoUrl: demoUrl.trim() || undefined,
      };

      onSaveCatalog({
        ...catalog,
        infographieItems: [newInfo, ...catalog.infographieItems],
      });
      alert(`La création « ${newInfo.title} » a été ajoutée à la section Infographie !`);
    }

    // Reset fields
    setTitle('');
    setSubtitle('');
    setDescription('');
    setDemoUrl('');
    setPrice('');
  };

  const handleDeleteWedding = (id: string) => {
    if (confirm('Supprimer ce modèle de mariage ?')) {
      onSaveCatalog({
        ...catalog,
        weddingModels: catalog.weddingModels.filter((m) => m.id !== id),
      });
    }
  };

  const handleDeleteStd = (id: string) => {
    if (confirm('Supprimer cet élément ?')) {
      onSaveCatalog({
        ...catalog,
        saveTheDateItems: catalog.saveTheDateItems.filter((i) => i.id !== id),
      });
    }
  };

  const handleDeleteGift = (id: string) => {
    if (confirm('Supprimer cet article cadeau ?')) {
      onSaveCatalog({
        ...catalog,
        guestGifts: catalog.guestGifts.filter((g) => g.id !== id),
      });
    }
  };

  const handleDeleteWeb = (id: string) => {
    if (confirm('Supprimer ce projet web ?')) {
      onSaveCatalog({
        ...catalog,
        webProjects: catalog.webProjects.filter((w) => w.id !== id),
      });
    }
  };

  const handleDeleteInfo = (id: string) => {
    if (confirm('Supprimer cette réalisation infographie ?')) {
      onSaveCatalog({
        ...catalog,
        infographieItems: catalog.infographieItems.filter((i) => i.id !== id),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs text-left">
      <div className="bg-[#141414] text-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#2a2a2a] relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* AUTHENTICATION SCREEN */
          <div className="max-w-sm mx-auto text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-black text-[#e5b869] flex items-center justify-center mx-auto border border-[#e5b869]/40 shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-white">
                Espace Fondatrice
              </h3>
              <p className="text-xs text-stone-400">
                Accès réservé à Flore pour alimenter les rubriques, photos, vidéos et liens de sites.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  placeholder="Mot de passe"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-stone-700 text-sm text-center text-white focus:outline-none focus:border-[#e5b869]"
                />
                {errorMsg && <p className="text-[11px] text-rose-500 mt-1.5">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#e5b869] hover:bg-[#d6a550] text-black font-serif font-bold text-xs tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ouvrir le panneau d'administration</span>
              </button>
            </form>
          </div>
        ) : (
          /* FULL MULTI-SECTION ADMIN DASHBOARD */
          <div className="space-y-6">
            <div className="border-b border-stone-800 pb-3 pr-8">
              <span className="text-[10px] uppercase tracking-widest text-[#e5b869] font-bold block">
                ADMINISTRATION GÉNÉRALE · PIXEL & TRAIT
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                Gérer les photos, vidéos et liens des 5 rubriques
              </h3>
            </div>

            {/* SECTION SELECTOR TABS */}
            <div className="flex flex-wrap gap-1 p-1 bg-black rounded-xl border border-stone-800">
              <button
                onClick={() => setActiveAdminSection('mariage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeAdminSection === 'mariage' ? 'bg-[#e5b869] text-black font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Sites de mariage
              </button>
              <button
                onClick={() => setActiveAdminSection('save_the_date')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeAdminSection === 'save_the_date' ? 'bg-[#e5b869] text-black font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Save the date & Filtres
              </button>
              <button
                onClick={() => setActiveAdminSection('cadeaux')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeAdminSection === 'cadeaux' ? 'bg-[#e5b869] text-black font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Cadeaux invités
              </button>
              <button
                onClick={() => setActiveAdminSection('web')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeAdminSection === 'web' ? 'bg-[#e5b869] text-black font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Développement Web
              </button>
              <button
                onClick={() => setActiveAdminSection('infographie')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeAdminSection === 'infographie' ? 'bg-[#e5b869] text-black font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Infographie & Design
              </button>
            </div>

            {/* ADD ITEM FORM */}
            <form onSubmit={handleAddItem} className="p-5 rounded-2xl bg-[#1a1a1a] border border-[#2c2c2c] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#e5b869]" />
                  <span>
                    Ajouter dans :{' '}
                    <strong className="text-[#e5b869]">
                      {activeAdminSection === 'mariage' && 'Sites de mariage'}
                      {activeAdminSection === 'save_the_date' && 'Save the date & Filtres'}
                      {activeAdminSection === 'cadeaux' && 'Cadeaux invités personnalisés'}
                      {activeAdminSection === 'web' && 'Projets Développement Web'}
                      {activeAdminSection === 'infographie' && 'Infographie, Tableaux, Print & Vidéos'}
                    </strong>
                  </span>
                </span>
              </div>

              {/* Conditional Category selection for Marriage */}
              {activeAdminSection === 'mariage' && (
                <div>
                  <label className="font-semibold block mb-1 text-white">Catégorie de Cérémonie *</label>
                  <select
                    value={weddingCat}
                    onChange={(e) => setWeddingCat(e.target.value as CeremonyCategory)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white font-medium"
                  >
                    <option value="civil">1. Mariage Civil (Mairie uniquement)</option>
                    <option value="coutumier">2. Mariage Coutumier (Dot / Traditionnel uniquement)</option>
                    <option value="religieux">3. Mariage Religieux (Église / Bénédiction uniquement)</option>
                    <option value="complet_3en1">4. Mariage Complet (Les Trois Cérémonies 3 en 1)</option>
                    <option value="anniversaire">5. Anniversaire & Gala VIP</option>
                    <option value="bapteme">6. Baptême & Enfance</option>
                  </select>
                </div>
              )}

              {/* Conditional Type selection for Infographie */}
              {activeAdminSection === 'infographie' && (
                <div>
                  <label className="font-semibold block mb-1 text-white">Type de réalisation graphique *</label>
                  <select
                    value={infographieType}
                    onChange={(e) => setInfographieType(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white font-medium"
                  >
                    <option value="Identité Visuelle Complète">Identité Visuelle Complète & Logo</option>
                    <option value="Tableau & Gravure Bois/Plexiglas">Tableaux sur Bois Noble ou Plexiglas</option>
                    <option value="Montage Vidéo & Animations">Montage Vidéo & Réels Événementiels</option>
                    <option value="Roll-up & Impression Papier">Roll-up, Bâches & Impressions Papier HD</option>
                    <option value="T-shirts, Macarons & Bijoux">T-shirts, Macarons, Bijoux & Objets Personnalisés</option>
                  </select>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-white">Titre de la création *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariage Samuel & Audrey / Tasses Magiques"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white focus:border-[#e5b869]"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-white">Sous-titre / Détail</label>
                  <input
                    type="text"
                    placeholder="Ex: Douala Palace / Souvenir révélateur à chaud"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white focus:border-[#e5b869]"
                  />
                </div>
              </div>

              {/* Price & Delay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-white">Prix affiché</label>
                  <input
                    type="text"
                    placeholder="Ex: À partir de 45 000 FCFA / Dès 3 500 FCFA"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-white">
                    {activeAdminSection === 'cadeaux' ? 'Quantité minimale' : 'Délai de réalisation'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5 à 7 jours ouvrés / Dès 10 pièces"
                    value={activeAdminSection === 'cadeaux' ? giftMinQty : delay}
                    onChange={(e) => activeAdminSection === 'cadeaux' ? setGiftMinQty(e.target.value) : setDelay(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white"
                  />
                </div>
              </div>

              {/* THE CRITICAL LINK FOR SITES / DEMOS / VIDEOS */}
              {(activeAdminSection === 'mariage' || activeAdminSection === 'web' || activeAdminSection === 'save_the_date' || activeAdminSection === 'infographie') && (
                <div>
                  <label className="font-semibold block mb-1 text-[#e5b869] flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lien direct du site, de la démo ou de la vidéo (URL cliquable par le client) :</span>
                  </label>
                  <input
                    type="url"
                    placeholder="Ex: https://votre-site-de-mariage.com ou https://wa.me/237651887722..."
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white focus:border-[#e5b869]"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Lorsque le visiteur cliquera sur ce modèle, il sera automatiquement redirigé vers ce lien pour tester !
                  </p>
                </div>
              )}

              {/* Photo Upload or Selection */}
              <div className="space-y-2">
                <label className="font-semibold block text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#e5b869]" />
                  <span>Photo / Image de la création :</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* File upload from phone or computer */}
                  <label className="w-full sm:w-auto px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg cursor-pointer text-center font-medium border border-stone-600 transition-colors">
                    <span>Choisir une photo depuis mon appareil</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Or select curated studio photos */}
                  <select
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white"
                  >
                    <option value="/src/assets/images/fairepart_wedding_preview_1792669131612.jpg">
                      Photo Mariage Blanc & Or Brossé
                    </option>
                    <option value="/src/assets/images/fairepart_birthday_party_1792670579697.jpg">
                      Photo Anniversaire VIP Black & Gold
                    </option>
                    <option value="/src/assets/images/fairepart_baptism_ceremony_1792670579660.jpg">
                      Photo Baptême Douceur Végétale
                    </option>
                    <option value="/src/assets/images/branding_infographie_showcase_1792669132520.jpg">
                      Photo Infographie, Papeterie & Objets
                    </option>
                    <option value="/src/assets/images/hero_studio_creative_1792669131015.jpg">
                      Photo Développement Web & Applications
                    </option>
                  </select>
                </div>

                {imageUrl && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
                    <img src={imageUrl} alt="Aperçu" className="w-8 h-8 rounded object-cover border border-stone-700" />
                    <span>Photo sélectionnée prête pour publication</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-1 text-white">Description de quoi fait la création</label>
                <textarea
                  rows={2}
                  placeholder="Décrivez ce que fait la plateforme ou ce que contient le cadeau..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-black rounded-lg border border-stone-700 text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#e5b869] hover:bg-[#d6a550] text-black font-serif font-bold text-xs tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Publier immédiatement sur le site vitrine</span>
              </button>
            </form>

            {/* LIST OF CURRENTLY PUBLISHED ITEMS IN THIS SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Éléments actuellement en ligne dans cette rubrique :
                </span>
                <button
                  onClick={onResetCatalog}
                  className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Restaurer le catalogue d'origine"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {activeAdminSection === 'mariage' &&
                  catalog.weddingModels.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-black border border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <strong className="block text-white">{item.title}</strong>
                          <span className="text-[10px] text-[#e5b869]">{item.details.ceremonyType} · {item.price}</span>
                          {item.demoUrl && (
                            <a href={item.demoUrl} target="_blank" rel="noreferrer" className="block text-[10px] text-sky-400 underline truncate max-w-[200px]">
                              Lien : {item.demoUrl}
                            </a>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteWedding(item.id)} className="p-1.5 text-stone-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {activeAdminSection === 'save_the_date' &&
                  catalog.saveTheDateItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-black border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-white">{item.title}</strong>
                        <span className="text-[10px] text-[#e5b869]">{item.price} · {item.delay}</span>
                      </div>
                      <button onClick={() => handleDeleteStd(item.id)} className="p-1.5 text-stone-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {activeAdminSection === 'cadeaux' &&
                  catalog.guestGifts.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-black border border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <strong className="block text-white">{item.name}</strong>
                          <span className="text-[10px] text-[#e5b869]">{item.startingPrice} · {item.minQuantity}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteGift(item.id)} className="p-1.5 text-stone-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {activeAdminSection === 'web' &&
                  catalog.webProjects.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-black border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-white">{item.title}</strong>
                        <span className="text-[10px] text-[#e5b869]">{item.clientType}</span>
                        {item.siteUrl && (
                          <a href={item.siteUrl} target="_blank" rel="noreferrer" className="block text-[10px] text-sky-400 underline truncate max-w-[200px]">
                            Lien site : {item.siteUrl}
                          </a>
                        )}
                      </div>
                      <button onClick={() => handleDeleteWeb(item.id)} className="p-1.5 text-stone-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {activeAdminSection === 'infographie' &&
                  catalog.infographieItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-black border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-white">{item.title}</strong>
                        <span className="text-[10px] text-[#e5b869]">{item.type} · {item.price}</span>
                        {item.demoUrl && (
                          <a href={item.demoUrl} target="_blank" rel="noreferrer" className="block text-[10px] text-sky-400 underline truncate max-w-[200px]">
                            Lien : {item.demoUrl}
                          </a>
                        )}
                      </div>
                      <button onClick={() => handleDeleteInfo(item.id)} className="p-1.5 text-stone-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
