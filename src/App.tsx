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
  getStudioCatalogLocal, 
  saveStudioCatalogLocal,
  fetchCatalogFromUpstash,
  saveCatalogToUpstash,
  DEFAULT_CATALOG
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('site-mariage');
  const [catalog, setCatalog] = useState<StudioCatalogState>(() => getStudioCatalogLocal());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const local = getStudioCatalogLocal();
    setCatalog(local);

    fetchCatalogFromUpstash().then((cloudData) => {
      if (cloudData) {
        setCatalog(cloudData);
        saveStudioCatalogLocal(cloudData);
      }
    });
  }, []);

  const handleSaveCatalog = async (updated: StudioCatalogState) => {
    setCatalog(updated);
    saveStudioCatalogLocal(updated);
    await saveCatalogToUpstash(updated);
  };

  const handleResetCatalog = async () => {
    if (confirm('Voulez-vous restaurer le catalogue d’origine ?')) {
      setCatalog(DEFAULT_CATALOG);
      saveStudioCatalogLocal(DEFAULT_CATALOG);
      await saveCatalogToUpstash(DEFAULT_CATALOG);
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
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

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

      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      <FloatingStatusPill
        activeTab={activeTab}
        onSelectNextTab={handleCycleTab}
      />

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