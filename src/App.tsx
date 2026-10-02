import React, { useState, useEffect } from 'react';
import { LuckyWheelApp } from './components/LuckyWheelApp';
import { SecretDashboard } from './components/SecretDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'wheel' | 'admin'>('wheel');

  // Numéro Orange Money officiel de réception de Flore : 697204431
  const [orangeReceiverNumber, setOrangeReceiverNumber] = useState<string>(() => {
    const saved = localStorage.getItem('admin_orange_number');
    if (!saved || saved.includes('699000000') || saved.startsWith('699')) {
      localStorage.setItem('admin_orange_number', '697204431');
      return '697204431';
    }
    return saved;
  });

  const [minWithdrawAmount, setMinWithdrawAmount] = useState<number>(() => {
    const saved = localStorage.getItem('admin_min_withdraw');
    return saved ? parseInt(saved, 10) : 1500;
  });

  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState<number>(() => {
    const saved = localStorage.getItem('admin_max_spins');
    return saved ? parseInt(saved, 10) : 15;
  });

  // Fréquence des pubs : afficher une pub tous les N tours (par défaut 1 = chaque tour pour rentabilité max, ou 2)
  const [adFrequency, setAdFrequency] = useState<number>(() => {
    const saved = localStorage.getItem('admin_ad_frequency');
    return saved ? parseInt(saved, 10) : 1; // 1 = pub après chaque tour !
  });

  useEffect(() => {
    localStorage.setItem('admin_orange_number', orangeReceiverNumber);
    localStorage.setItem('admin_min_withdraw', minWithdrawAmount.toString());
    localStorage.setItem('admin_max_spins', maxSpinsPerDay.toString());
    localStorage.setItem('admin_ad_frequency', adFrequency.toString());
  }, [orangeReceiverNumber, minWithdrawAmount, maxSpinsPerDay, adFrequency]);

  if (currentView === 'admin') {
    return (
      <SecretDashboard
        onBackToGame={() => setCurrentView('wheel')}
        orangeReceiverNumber={orangeReceiverNumber}
        setOrangeReceiverNumber={setOrangeReceiverNumber}
        minWithdrawAmount={minWithdrawAmount}
        setMinWithdrawAmount={setMinWithdrawAmount}
        maxSpinsPerDay={maxSpinsPerDay}
        setMaxSpinsPerDay={setMaxSpinsPerDay}
        adFrequency={adFrequency}
        setAdFrequency={setAdFrequency}
      />
    );
  }

  return (
    <LuckyWheelApp
      onOpenSecretAdmin={() => setCurrentView('admin')}
      orangeReceiverNumber={orangeReceiverNumber}
      minWithdrawAmount={minWithdrawAmount}
      maxSpinsPerDay={maxSpinsPerDay}
      adFrequency={adFrequency}
    />
  );
}
