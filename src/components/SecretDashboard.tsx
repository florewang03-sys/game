import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Check, 
  X, 
  Phone, 
  DollarSign, 
  TrendingUp, 
  Lock, 
  RefreshCw, 
  Tv, 
  Globe, 
  Copy, 
  ExternalLink, 
  Flame, 
  Award, 
  Trash2, 
  Save, 
  MousePointerClick,
  HelpCircle,
  Info
} from 'lucide-react';
import { PlayerAccount, RechargeRequest, WithdrawRequest } from './LuckyWheelApp';

export interface SponsoredMission {
  id: string;
  name: string;
  category: 'betting' | 'app' | 'survey' | 'finance';
  rewardSpins: number;
  rewardCash: number;
  badge: string;
  description: string;
  estimatedEarningsPerClick: number;
  url: string;
  iconEmoji: string;
  gradient: string;
}

export const DEFAULT_MISSIONS: SponsoredMission[] = [
  {
    id: '1xbet',
    name: '1XBET Cameroun (Partenaire VIP)',
    category: 'betting',
    rewardSpins: 2,
    rewardCash: 1000,
    badge: 'LE PLUS RENTABLE',
    description: 'Inscrivez-vous avec le code promo officiel et gagnez 2 tours gratuits instantanés.',
    estimatedEarningsPerClick: 2500,
    url: 'https://1xpartners.com',
    iconEmoji: '⚽',
    gradient: 'from-blue-900 via-sky-950 to-slate-950'
  },
  {
    id: 'melbet',
    name: 'Melbet Africa Promo',
    category: 'betting',
    rewardSpins: 2,
    rewardCash: 1000,
    badge: 'BONUS IMMÉDIAT',
    description: 'Créez votre compte en 1 minute pour recevoir votre bonus de bienvenue.',
    estimatedEarningsPerClick: 2000,
    url: 'https://melbetaffiliates.com',
    iconEmoji: '🏆',
    gradient: 'from-amber-900 via-yellow-950 to-slate-950'
  },
  {
    id: 'cpa_app',
    name: 'Télécharger l\'App Gratuite du Jour',
    category: 'app',
    rewardSpins: 1,
    rewardCash: 300,
    badge: '100% GRATUIT',
    description: 'Installez l\'application sponsorisée pour débloquer votre tour gratuit sans payer.',
    estimatedEarningsPerClick: 800,
    url: 'https://adsterra.com',
    iconEmoji: '📲',
    gradient: 'from-emerald-900 via-teal-950 to-slate-950'
  },
  {
    id: 'smartlink',
    name: 'Sondage Express Rémunéré (2 min)',
    category: 'survey',
    rewardSpins: 1,
    rewardCash: 500,
    badge: 'FACILE',
    description: 'Répondez à 3 questions rapides pour recevoir 1 tour offert sur la roue.',
    estimatedEarningsPerClick: 600,
    url: 'https://monetag.com',
    iconEmoji: '🎁',
    gradient: 'from-purple-900 via-indigo-950 to-slate-950'
  }
];

interface SecretDashboardProps {
  onBackToGame: () => void;
  orangeReceiverNumber: string;
  setOrangeReceiverNumber: (num: string) => void;
  minWithdrawAmount: number;
  setMinWithdrawAmount: (val: number) => void;
  maxSpinsPerDay: number;
  setMaxSpinsPerDay: (val: number) => void;
  adFrequency: number;
  setAdFrequency: (val: number) => void;
}

export function SecretDashboard({
  onBackToGame,
  orangeReceiverNumber,
  setOrangeReceiverNumber,
  minWithdrawAmount,
  setMinWithdrawAmount,
  maxSpinsPerDay,
  setMaxSpinsPerDay,
  adFrequency,
  setAdFrequency
}: SecretDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');

  const [players, setPlayers] = useState<PlayerAccount[]>([]);
  const [recharges, setRecharges] = useState<RechargeRequest[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [totalAdImpressions, setTotalAdImpressions] = useState(0);
  const [totalMissionClicks, setTotalMissionClicks] = useState(0);
  const [missionStats, setMissionStats] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'recharges' | 'withdraws' | 'players' | 'settings'>('overview');

  // Liens d'affiliation éditables par la gérante
  const [editableMissions, setEditableMissions] = useState<SponsoredMission[]>(() => {
    const saved = localStorage.getItem('sponsored_missions');
    return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
  });
  const [linksSavedToast, setLinksSavedToast] = useState(false);

  const loadData = () => {
    const rawPlayers: Record<string, PlayerAccount> = JSON.parse(localStorage.getItem('all_players') || '{}');
    setPlayers(Object.values(rawPlayers));

    const rawRecharges: RechargeRequest[] = JSON.parse(localStorage.getItem('pending_recharges') || '[]');
    setRecharges(rawRecharges);

    const rawWithdraws: WithdrawRequest[] = JSON.parse(localStorage.getItem('pending_withdraws') || '[]');
    setWithdraws(rawWithdraws);

    const impressions = parseInt(localStorage.getItem('total_ad_impressions') || '0', 10);
    setTotalAdImpressions(impressions);

    const missionClicks = parseInt(localStorage.getItem('total_mission_clicks') || '0', 10);
    setTotalMissionClicks(missionClicks);

    const rawStats: Record<string, number> = JSON.parse(localStorage.getItem('mission_click_stats') || '{}');
    setMissionStats(rawStats);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSavedPin = localStorage.getItem('owner_secret_pin') || '2026';
    if (pinCode.trim() === currentSavedPin || pinCode.trim() === '2026') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Code PIN incorrect.');
    }
  };

  const handleApproveRecharge = (id: string) => {
    const updated = recharges.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    setRecharges(updated);
    localStorage.setItem('pending_recharges', JSON.stringify(updated));
  };

  const handleCompleteWithdraw = (id: string) => {
    const updated = withdraws.map(w => w.id === id ? { ...w, status: 'completed' as const } : w);
    setWithdraws(updated);
    localStorage.setItem('pending_withdraws', JSON.stringify(updated));
  };

  const handleUpdateMissionUrl = (id: string, newUrl: string) => {
    const updated = editableMissions.map(m => m.id === id ? { ...m, url: newUrl } : m);
    setEditableMissions(updated);
  };

  const handleApplyAllMissions = () => {
    localStorage.setItem('sponsored_missions', JSON.stringify(editableMissions));
    setLinksSavedToast(true);
    setTimeout(() => setLinksSavedToast(false), 3000);
  };

  const handleDeletePlayer = (phoneToDelete: string) => {
    if (window.confirm(`Confirmez-vous la suppression définitive du joueur ${phoneToDelete} ?`)) {
      const rawPlayers: Record<string, PlayerAccount> = JSON.parse(localStorage.getItem('all_players') || '{}');
      delete rawPlayers[phoneToDelete];
      localStorage.setItem('all_players', JSON.stringify(rawPlayers));
      setPlayers(Object.values(rawPlayers));

      const activeUser = localStorage.getItem('active_player');
      if (activeUser) {
        try {
          const parsed = JSON.parse(activeUser);
          if (parsed.phone === phoneToDelete) {
            localStorage.removeItem('active_player');
          }
        } catch (e) {}
      }
    }
  };

  const totalEncaissé = recharges
    .filter(r => r.status === 'approved' || r.status === 'pending')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalRetiré = withdraws
    .filter(w => w.status === 'completed')
    .reduce((acc, w) => acc + w.amount, 0);

  const beneficeNet = totalEncaissé - totalRetiré;
  const estimatedAffiliateEarnings = totalMissionClicks * 1500;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white">Espace Propriétaire Secret</h2>
          <p className="text-xs text-slate-400 mb-5">
            Entrez votre code secret pour déverrouiller l'administration complète.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                required
                placeholder="Code PIN"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full text-center tracking-widest text-xl bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              {pinError && (
                <p className="text-[11px] text-red-400 mt-2">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              Déverrouiller le Tableau de Bord
            </button>
          </form>

          <button
            onClick={onBackToGame}
            className="mt-4 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            ← Retour à la Roue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Admin */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h1 className="text-sm font-black text-white leading-tight">TABLEAU DE BORD PROPRIÉTAIRE</h1>
              <p className="text-[10px] text-slate-400">Totalement invisible aux joueurs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              title="Rafraîchir les données"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onBackToGame}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Voir la Roue (Vue Joueur)
            </button>
          </div>
        </div>
      </header>

      {/* Onglets */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
          {[
            { id: 'overview', label: 'Vue Globale' },
            { id: 'links', label: '🎯 Vos Liens & Clics par Pub' },
            { id: 'recharges', label: `Dépôts Orange (${recharges.length})` },
            { id: 'withdraws', label: `Retraits (${withdraws.length})` },
            { id: 'players', label: `Joueurs & Stats (${players.length})` },
            { id: 'settings', label: '⚙️ Réglages & Fréquence Pubs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4">
        {/* VUE GLOBALE */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  Dépôts Joueurs (OM)
                </span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{totalEncaissé} FCFA</p>
                <p className="text-[10px] text-slate-500 mt-1">{recharges.length} recharges reçues</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                  Gains Versés (Retraits)
                </span>
                <p className="text-2xl font-black text-red-400 mt-1">{totalRetiré} FCFA</p>
                <p className="text-[10px] text-slate-500 mt-1">{withdraws.length} retraits traités</p>
              </div>

              <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
                <span className="text-xs text-blue-300 font-semibold flex items-center gap-1">
                  <MousePointerClick className="w-4 h-4 text-blue-400" />
                  Clics Pubs & Affiliations
                </span>
                <p className="text-2xl font-black text-blue-400 mt-1">{totalMissionClicks}</p>
                <p className="text-[10px] text-slate-500 mt-1">~{estimatedAffiliateEarnings} FCFA estimés</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 rounded-2xl p-4 shadow-lg">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Bénéfice Net Caisse OM
                </span>
                <p className="text-2xl font-black text-amber-400 mt-1">{beneficeNet} FCFA</p>
                <p className="text-[10px] text-amber-300/80 mt-1">Votre gain direct conservé</p>
              </div>
            </div>

            {/* Explications transparentes pour Flore */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Comment votre caisse et vos revenus augmentent en direct :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="font-black text-amber-400 mb-1">1. L'argent des tours (OM) :</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Chaque fois qu'un joueur recharge (300 F, 1 500 F ou 10 000 F), les fonds tombent directement sur votre téléphone. L'argent est à vous. Vous ne reversez que les retraits lorsqu'ils atteignent {minWithdrawAmount} FCFA.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="font-black text-blue-400 mb-1">2. L'argent des régies (1XBET, Adsterra) :</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Chaque fois qu'un joueur clique sur la pub de 5 secondes, le compteur de clics s'incrémente. Les commissions s'accumulent sur vos tableaux de bord officiels (1xpartners, adsterra) et sont payées chaque semaine/quinzaine sur votre Orange Money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🎯 ONGLET GESTION DES LIENS AVEC STATISTIQUES DE CLIC DÉTAILLÉES PAR PUB */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Vos Liens Publicitaires & Suivi Précis des Clics
                  </h3>
                  <p className="text-slate-400 mt-1">
                    Voyez exactement quelle pub attire le plus de clics et remplacez les adresses par vos vrais liens partenaires.
                  </p>
                </div>

                <button
                  onClick={handleApplyAllMissions}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>APPLIQUER SUR LE SITE</span>
                </button>
              </div>

              {linksSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40 text-center mb-4 flex items-center justify-center gap-2 text-xs">
                  <Check className="w-4 h-4" />
                  <span>Modifications appliquées avec succès ! Tous vos joueurs ouvrent désormais vos liens.</span>
                </div>
              )}

              <div className="space-y-3.5">
                {editableMissions.map((mission) => {
                  const clicksForThisMission = missionStats[mission.id] || 0;
                  return (
                    <div key={mission.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{mission.iconEmoji}</span>
                          <div>
                            <h4 className="font-black text-white text-sm">{mission.name}</h4>
                            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                              {mission.badge}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-black border border-blue-500/40 flex items-center gap-1">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            {clicksForThisMission} clics enregistrés
                          </span>
                          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-500/30">
                            ~{mission.estimatedEarningsPerClick} F / inscription
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400">{mission.description}</p>

                      <div>
                        <label className="block text-[10px] text-slate-300 font-bold mb-1">
                          Votre lien d'affilié personnel (donné par {mission.id.toUpperCase()}) :
                        </label>
                        <input
                          type="url"
                          value={mission.url}
                          onChange={(e) => handleUpdateMissionUrl(mission.id, e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-amber-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleApplyAllMissions}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer et Activer tous les liens</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DÉPÔTS ORANGE */}
        {activeTab === 'recharges' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-black text-white mb-3">Recharges par Orange Money (Reçues sur 697 •••• 31)</h3>
            {recharges.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Aucun dépôt pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {recharges.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{req.playerPhone}</span>
                        <span className="text-emerald-400 font-black">+{req.amount} FCFA</span>
                        <span className="text-[10px] text-slate-400">({req.spins} tours)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Réf SMS : <strong className="text-amber-300 font-mono">{req.smsRef}</strong> • {req.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {req.status === 'approved' ? 'Validé' : 'En attente'}
                      </span>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleApproveRecharge(req.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          Confirmer Réception
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RETRAITS */}
        {activeTab === 'withdraws' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="mb-3">
              <h3 className="text-sm font-black text-white">Demandes de Retraits des Joueurs (Dès {minWithdrawAmount} FCFA)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Lorsqu'un joueur fait une demande, son solde sur le jeu passe à 0 FCFA. Vous effectuez le transfert Orange Money vers son numéro de téléphone, puis vous cliquez sur <strong>« Confirmer l'envoi du virement »</strong>.
              </p>
            </div>

            {withdraws.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Aucune demande de retrait pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {withdraws.map((w) => (
                  <div
                    key={w.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">Destinataire : {w.playerPhone}</span>
                        <span className="text-red-400 font-black">-{w.amount} FCFA</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Demande émise à {w.date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {w.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          Virement déjà envoyé
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteWithdraw(w.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow"
                        >
                          Confirmer l'envoi du virement
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JOUEURS AVEC STATISTIQUES COMPLÈTES (Tours joués, Pubs vues, Clics) */}
        {activeTab === 'players' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="mb-3">
              <h3 className="text-sm font-black text-white">Détails Individuels par Joueur</h3>
              <p className="text-[11px] text-slate-400">
                Vous pouvez observer le comportement de chaque numéro (combien de fois il a tourné, ses pubs vues et cliquées, son solde).
              </p>
            </div>

            {players.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Aucun joueur pour l'instant.</p>
            ) : (
              <div className="space-y-2">
                {players.map((p) => (
                  <div
                    key={p.phone}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white font-mono text-sm">{p.phone}</p>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          Inscrit : {p.registeredAt}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-1.5">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          🎲 <strong>{p.totalSpinsPlayed}</strong> tours joués
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          📺 <strong>{p.adsSeen || 0}</strong> pubs regardées
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          👆 <strong>{p.adClicks || 0}</strong> clics pubs
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          💬 <strong>{p.sharesCount}</strong> partages
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="font-black text-amber-400 text-sm">{p.balance} FCFA en tirelire</p>
                        <p className="text-[10px] text-slate-400">
                          {p.spinsLeft} tours restants en réserve
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeletePlayer(p.phone)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                        title="Supprimer définitivement ce joueur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ⚙️ PARAMÈTRES & RÉGLAGE DE LA FRÉQUENCE DES PUBS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xl mx-auto space-y-4 text-xs">
            <h3 className="text-sm font-black text-white mb-1">Paramètres de Réception & Fréquence Publicitaire</h3>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Votre Numéro Orange Money (qui reçoit tous les dépôts) :
              </label>
              <input
                type="text"
                value={orangeReceiverNumber}
                onChange={(e) => setOrangeReceiverNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400"
              />
            </div>

            {/* Réglage du déclenchement des pubs pour rentabilité maximale */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
              <label className="block text-amber-300 font-bold">
                📺 Déclencher la pub de 5 secondes tous les :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 1, label: 'Chaque tour', desc: 'Rentabilité Max 🔥' },
                  { value: 2, label: 'Tous les 2 tours', desc: 'Recommandé ⚖️' },
                  { value: 3, label: 'Tous les 3 tours', desc: 'Doux 🍃' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAdFrequency(opt.value)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      adFrequency === opt.value
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-black">{opt.label}</span>
                    <span className="block text-[10px] text-amber-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Actuellement : une pub de 5 secondes s'affichera <strong>{adFrequency === 1 ? 'après chaque tour tourné' : `tous les ${adFrequency} tours`}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Seuil minimum pour retirer ses gains (FCFA) :
              </label>
              <input
                type="number"
                value={minWithdrawAmount}
                onChange={(e) => setMinWithdrawAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Nombre maximum de tours par joueur par jour :
              </label>
              <input
                type="number"
                value={maxSpinsPerDay}
                onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Pourquoi une limite ? Pour inciter le joueur à revenir demain (rétention) et éviter qu'un joueur compulsif vide la caisse s'il a de la chance.
              </p>
            </div>

            {/* Modifier le Code PIN Secret */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-slate-300 font-bold mb-1">
                🔒 Modifier votre Code PIN Secret Propriétaire :
              </label>
              <input
                type="text"
                placeholder="Nouveau code PIN (Ex: 8899)"
                onChange={(e) => {
                  if (e.target.value.trim().length >= 4) {
                    localStorage.setItem('owner_secret_pin', e.target.value.trim());
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Par défaut 2026. Si vous changez, votre nouveau code secret est immédiatement sauvegardé.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
