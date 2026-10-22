import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { WeddingSiteSection } from './components/WeddingSiteSection';
import { SaveTheDateSection } from './components/SaveTheDateSection';
import { CadeauxSection } from './components/CadeauxSection';
import { FormulesSection } from './components/FormulesSection';
import { WebAndInfographieView } from './components/WebAndInfographieView';
import { FloatingStatusPill } from './components/FloatingStatusPill';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { StudioCatalogState } from './types';
import { 
  getStudioCatalog, 
  saveStudioCatalog, 
  INITIAL_WEDDING_MODELS, 
  INITIAL_SAVE_THE_DATE, 
  INITIAL_GUEST_GIFTS, 
  INITIAL_WEB_PROJECTS, 
  INITIAL_INFOGRAPHIE_ITEMS 
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('site-mariage');
  const [catalog, setCatalog] = useState<StudioCatalogState>({
    weddingModels: INITIAL_WEDDING_MODELS,
    saveTheDateItems: INITIAL_SAVE_THE_DATE,
    guestGifts: INITIAL_GUEST_GIFTS,
    webProjects: INITIAL_WEB_PROJECTS,
    infographieItems: INITIAL_INFOGRAPHIE_ITEMS,
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const loaded = getStudioCatalog();
    setCatalog(loaded);
  }, []);

  const handleSaveCatalog = (updated: StudioCatalogState) => {
    setCatalog(updated);
    saveStudioCatalog(updated);
  };

  const handleResetCatalog = () => {
    if (confirm('Voulez-vous restaurer le catalogue d’origine pour toutes les rubriques ?')) {
      const resetState: StudioCatalogState = {
        weddingModels: INITIAL_WEDDING_MODELS,
        saveTheDateItems: INITIAL_SAVE_THE_DATE,
        guestGifts: INITIAL_GUEST_GIFTS,
        webProjects: INITIAL_WEB_PROJECTS,
        infographieItems: INITIAL_INFOGRAPHIE_ITEMS,
      };
      setCatalog(resetState);
      saveStudioCatalog(resetState);
    }
  };

  const tabsCycle: NavTab[] = [
    'site-mariage',
    'formules',
    'save-the-date',
    'cadeaux',
    'dev-web',
    'infographie',
    'accueil',
  ];

  const handleCycleTab = () => {
    const currentIndex = tabsCycle.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabsCycle.length;
    setActiveTab(tabsCycle[nextIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c0c] text-white selection:bg-[#e5b869]/20 selection:text-white">
      {/* Top Navigation Bar with gold active underline and WhatsApp button */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Dynamic View based on activeTab */}
      <main className="flex-1">
        {activeTab === 'accueil' && (
          <HomeOverview onNavigateTab={handleTabChange} />
        )}

        {activeTab === 'site-mariage' && (
          <WeddingSiteSection models={catalog.weddingModels} />
        )}

        {activeTab === 'formules' && (
          <FormulesSection />
        )}

        {activeTab === 'save-the-date' && (
          <SaveTheDateSection items={catalog.saveTheDateItems} />
        )}

        {activeTab === 'cadeaux' && (
          <CadeauxSection gifts={catalog.guestGifts} />
        )}

        {activeTab === 'dev-web' && (
          <WebAndInfographieView
            mode="dev-web"
            webProjects={catalog.webProjects}
            infographieItems={catalog.infographieItems}
          />
        )}

        {activeTab === 'infographie' && (
          <WebAndInfographieView
            mode="infographie"
            webProjects={catalog.webProjects}
            infographieItems={catalog.infographieItems}
          />
        )}
      </main>

      {/* Footer with Denver location and WhatsApp action */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Status Pill matching reference screenshots */}
      <FloatingStatusPill
        activeTab={activeTab}
        onSelectNextTab={handleCycleTab}
      />

      {/* Full Admin Modal for Flore to manage all 5 sections */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        catalog={catalog}
        onSaveCatalog={handleSaveCatalog}
        onResetCatalog={handleResetCatalog}
      />
    </div>
  );
}
