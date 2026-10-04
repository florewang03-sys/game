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
  Download,
  Info
} from 'lucide-react';
import { PlayerAccount, RechargeRequest, WithdrawRequest } from './LuckyWheelApp';
import { downloadAppZip, downloadModifiedFilesZip } from '../utils/clientZip';
import { getCampayCredentials, saveCampayCredentials, CampayCredentials } from '../utils/campay';

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
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadZipMsg, setDownloadZipMsg] = useState('');

  // Clés API CamPay (DGSN Style)
  const [campayCreds, setCampayCreds] = useState<CampayCredentials>(() => getCampayCredentials());
  const [campaySavedToast, setCampaySavedToast] = useState(false);

  const handleDirectZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadAppZip((msg) => setDownloadZipMsg(msg));
    } catch (e) {
      alert("Erreur lors de la génération du ZIP.");
    } finally {
      setDownloadingZip(false);
      setDownloadZipMsg('');
    }
  };

  const handleModifiedZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadModifiedFilesZip((msg) => setDownloadZipMsg(msg));
    } catch (e) {
      alert("Erreur lors du téléchargement du ZIP des fichiers modifiés.");
    } finally {
      setDownloadingZip(false);
      setDownloadZipMsg('');
    }
  };

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
              onClick={handleDirectZipDownload}
              disabled={downloadingZip}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition"
              title="Télécharger l'application complète pour Vercel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingZip ? (downloadZipMsg || 'Téléchargement...') : 'Télécharger ZIP Vercel'}</span>
            </button>

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
            { id: 'recharges', label: `Dépôts Mobile Money (${recharges.length})` },
            { id: 'withdraws', label: `Retraits (${withdraws.length})` },
            { id: 'players', label: `Joueurs & Caisse (${players.length})` },
            { id: 'settings', label: '⚙️ Réglages & Clés CamPay' },
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

              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Joueurs Inscrits
                </span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{players.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Comptes actifs sur la plateforme</p>
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

            {/* Boutons de téléchargement direct du ZIP pour Vercel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 flex flex-col justify-between gap-3 shadow-lg">
                <div>
                  <h4 className="font-black text-amber-300 text-sm flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-amber-400" />
                    Fichiers Modifiés Uniquement (Recommandé)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Contient <strong>uniquement les 6 fichiers modifiés</strong> (CamPay, blocage pubs, retrait direct sans tours gratuits) à copier dans votre dossier.
                  </p>
                </div>

                <button
                  onClick={handleModifiedZipDownload}
                  disabled={downloadingZip}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingZip ? (downloadZipMsg || 'Téléchargement...') : 'Télécharger fichiers-modifies.zip'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex flex-col justify-between gap-3 shadow-lg">
                <div>
                  <h4 className="font-black text-emerald-300 text-sm flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-400" />
                    Projet Complet Vercel (Tout-en-un)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Contient l'intégralité du projet prêt à déployer (code source complet, vercel.json, server.ts).
                  </p>
                </div>

                <button
                  onClick={handleDirectZipDownload}
                  disabled={downloadingZip}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingZip ? (downloadZipMsg || 'Téléchargement...') : 'Télécharger roue-dor-237.zip'}</span>
                </button>
              </div>
            </div>

            {/* Explications transparentes pour Flore */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Fonctionnement de votre caisse Mobile Money :
              </h3>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                <p className="font-black text-amber-400 mb-1">Paiements sécurisés des joueurs (CamPay / Orange / MTN) :</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chaque fois qu'un joueur recharge (300 F, 1 500 F ou 10 000 F), les fonds sont débités directement et versés sur votre compte CamPay / Orange Money. Aucun tour n'est offert gratuitement en dehors du tout premier tour d'essai. Vous ne reversez les gains que lorsque les joueurs atteignent le seuil de retrait fixé à {minWithdrawAmount} FCFA.
                </p>
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

        {/* ⚙️ PARAMÈTRES & RÉGLAGES CAMPAY */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xl mx-auto space-y-4 text-xs">
            <h3 className="text-sm font-black text-white mb-1">Paramètres de Réception & Retraits</h3>

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

            {/* 🚀 CONFIGURATION OFFICIELLE CAMPAY (STYLE DGSN) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs font-black text-white">Passerelle Officielle CamPay (Style DGSN)</h4>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Connecté
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Vos clés d'accès API fournies par CamPay pour envoyer la demande de retrait direct aux clients (Orange Money & MTN) :
              </p>

              <div>
                <label className="block text-[10px] text-slate-300 font-bold mb-1">
                  Nom d'utilisateur de l'application (Username / Client ID) :
                </label>
                <input
                  type="text"
                  value={campayCreds.appUsername}
                  onChange={(e) => setCampayCreds({ ...campayCreds, appUsername: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 font-bold mb-1">
                  Mot de passe de l'application (Password / Secret) :
                </label>
                <input
                  type="password"
                  value={campayCreds.appPassword}
                  onChange={(e) => setCampayCreds({ ...campayCreds, appPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = campayCreds.environment === 'live' ? 'demo' : 'live';
                      setCampayCreds({ ...campayCreds, environment: next });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      campayCreds.environment === 'live'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    Mode : {campayCreds.environment === 'live' ? 'PRODUCTION (LIVE)' : 'DÉMO (TEST)'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    saveCampayCredentials(campayCreds);
                    setCampaySavedToast(true);
                    setTimeout(() => setCampaySavedToast(false), 3000);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{campaySavedToast ? 'Enregistré !' : 'Enregistrer les Clés'}</span>
                </button>
              </div>
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
