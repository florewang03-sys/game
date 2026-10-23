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
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  useEffect(() => {
    // 1. Initial local load
    const local = getStudioCatalogLocal();
    setCatalog(local);

    // 2. Fetch from Upstash Cloud Database
    fetchCatalogFromUpstash().then(async (cloudData) => {
      if (cloudData) {
        setCatalog(cloudData);
        saveStudioCatalogLocal(cloudData);
      } else {
        // If Upstash Cloud is still empty, seed it with the current local catalog
        await saveCatalogToUpstash(local);
      }
    });
  }, []);

  const handleSaveCatalog = async (updated: StudioCatalogState): Promise<boolean> => {
    setCatalog(updated);
    saveStudioCatalogLocal(updated);

    // Sync to Upstash Cloud Database
    setIsCloudSyncing(true);
    const success = await saveCatalogToUpstash(updated);
    setIsCloudSyncing(false);
    return success;
  };

  const handleResetCatalog = async () => {
    if (confirm('Voulez-vous restaurer le catalogue d’origine pour toutes les rubriques ?')) {
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

      {/* Full Admin Modal for Flore to manage all 5 sections with Upstash sync */}
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
