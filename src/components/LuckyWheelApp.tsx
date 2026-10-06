import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Coins, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Send, 
  Gift, 
  AlertCircle,
  X,
  Volume2,
  VolumeX,
  Check,
  RefreshCw,
  Share2,
  Wifi,
  Copy,
  MessageCircle,
  LogIn,
  ArrowRight,
  LogOut,
  Globe,
  Smartphone,
  ShieldCheck,
  Lock,
  Play,
  Award,
  ExternalLink,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Phone,
  Hourglass,
  Eye,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';
import { fetchRemoteSync, sendRemoteAction } from '../utils/syncService';

export interface Sector {
  label: string;
  value: number;
  color: string;
  textColor: string;
  probability: number;
  isJackpot?: boolean;
}

export const SECTORS: Sector[] = [
  { label: '50 FCFA', value: 50, color: '#f59e0b', textColor: '#ffffff', probability: 34 },
  { label: '0 FCFA', value: 0, color: '#475569', textColor: '#ffffff', probability: 27 },
  { label: '100 FCFA', value: 100, color: '#10b981', textColor: '#ffffff', probability: 18 },
  { label: '250 FCFA', value: 250, color: '#3b82f6', textColor: '#ffffff', probability: 10 },
  { label: '500 FCFA', value: 500, color: '#8b5cf6', textColor: '#ffffff', probability: 5 },
  { label: '1 000 FCFA', value: 1000, color: '#ec4899', textColor: '#ffffff', probability: 3.5 },
  { label: '5 000 FCFA 🌟', value: 5000, color: '#ea580c', textColor: '#ffffff', probability: 1.7 },
  { label: '10 000 F 👑', value: 10000, color: '#dc2626', textColor: '#ffffff', probability: 0.8, isJackpot: true },
];

export interface PlayerAccount {
  phone: string;
  registeredAt: string;
  balance: number;
  spinsLeft: number;
  totalSpinsPlayed: number;
  sharesCount: number;
  adsSeen: number;
  adClicks?: number;
}

export interface RechargeRequest {
  id: string;
  playerPhone: string;
  amount: number;
  spins: number;
  screenshotUrl: string; // Capture d'écran du paiement OM
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ShareRewardRequest {
  id: string;
  playerPhone: string;
  sharesCount: number;
  spinsReward: number;
  screenshotUrl?: string; // Capture facultative ou preuve
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface WithdrawRequest {
  id: string;
  playerPhone: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed';
}

const INITIAL_WINNERS = [
  { id: '1', phone: '697***31', gain: 10000, time: 'Il y a 2 min 🔥', isJackpot: true },
  { id: '2', phone: '655***12', gain: 1500, time: 'Il y a 6 min' },
  { id: '3', phone: '694***44', gain: 1000, time: 'Il y a 11 min' },
  { id: '4', phone: '670***89', gain: 500, time: 'Il y a 17 min' },
  { id: '5', phone: '698***01', gain: 250, time: 'Il y a 24 min' },
  { id: '6', phone: '652***99', gain: 10000, time: 'Ce matin 👑', isJackpot: true },
];

// Packs de recharge disponibles avec formule grand joueur (10 000 FCFA)
export const RECHARGE_PACKS = [
  { spins: 1, price: 300, popular: false, badge: null },
  { spins: 2, price: 600, popular: false, badge: null },
  { spins: 5, price: 1500, popular: true, badge: 'POPULAIRE' },
  { spins: 10, price: 3000, popular: false, badge: null },
  { spins: 20, price: 5000, popular: false, badge: '+2 BONUS' },
  { spins: 45, price: 10000, popular: false, badge: '👑 PACK VIP' }, // 10 000 FCFA = 45 tours (dont 12 tours offerts !)
];

interface LuckyWheelProps {
  onOpenSecretAdmin?: () => void;
  orangeReceiverNumber: string;
  minWithdrawAmount: number;
  maxSpinsPerDay: number;
  adFrequency?: number;
}

export function LuckyWheelApp({
  onOpenSecretAdmin,
  orangeReceiverNumber,
  minWithdrawAmount,
  maxSpinsPerDay,
  adFrequency = 1
}: LuckyWheelProps) {
  // Session Joueur
  const [currentUser, setCurrentUser] = useState<PlayerAccount | null>(() => {
    const saved = localStorage.getItem('active_player');
    return saved ? JSON.parse(saved) : null;
  });

  const [guestBalance, setGuestBalance] = useState<number>(() => {
    const saved = localStorage.getItem('guest_balance');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [guestSpinsLeft, setGuestSpinsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('guest_spins');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  // Liens sponsorisés supprimés - Système sans aucune pub
  // États de la roue
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modales
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Formulaires
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [rechargePack, setRechargePack] = useState(RECHARGE_PACKS[0]);
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [depositPhone, setDepositPhone] = useState(() => currentUser ? currentUser.phone : '');
  const [depositSubmitted, setDepositSubmitted] = useState(false);
  const [pendingRechargeId, setPendingRechargeId] = useState<string | null>(null);
  const [isDepositPendingApproval, setIsDepositPendingApproval] = useState(false);
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Partage à 10 personnes pour 1 tour gratuit (Soumis à validation de Flore)
  const [guestSharesCount, setGuestSharesCount] = useState<number>(() => {
    const saved = localStorage.getItem('guest_shares_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [sharePlayerPhone, setSharePlayerPhone] = useState(() => currentUser ? currentUser.phone : (depositPhone || localStorage.getItem('last_share_phone') || ''));
  const [shareProofSubmitted, setShareProofSubmitted] = useState(false);
  const [sharePendingApproval, setSharePendingApproval] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);
  const [shareRejectToast, setShareRejectToast] = useState(false);
  const shareFileInputRef = useRef<HTMLInputElement>(null);
  const [shareProofScreenshot, setShareProofScreenshot] = useState<string>('');

  // Déclencheur USSD
  const [isPromptingUSSD, setIsPromptingUSSD] = useState(false);
  const [ussdTriggered, setUssdTriggered] = useState(false);

  // Toast
  const [rechargeSuccessToast, setRechargeSuccessToast] = useState(false);

  // Déclencheur secret 3-clics
  const [logoClickCount, setLogoClickCount] = useState(0);

  // 🔄 ÉCOUTE EN TEMPS RÉEL DE LA VALIDATION PAR FLORE (RECHARGES & PARTAGES - MULTI-APPAREILS)
  useEffect(() => {
    const checkApproval = async () => {
      const userPhone = currentUser ? currentUser.phone : (depositPhone.trim() || sharePlayerPhone.trim() || localStorage.getItem('last_share_phone') || '');

      // Synchronisation distante avec le serveur
      const remoteData = await fetchRemoteSync();

      // 1. Si joueur connecté, synchroniser immédiatement avec le compte serveur
      if (currentUser && remoteData?.players?.[currentUser.phone]) {
        const serverPlayer = remoteData.players[currentUser.phone];
        if (serverPlayer.spinsLeft > currentUser.spinsLeft) {
          const addedSpins = serverPlayer.spinsLeft - currentUser.spinsLeft;
          playSound('bonus');
          setRechargeSuccessToast(true);
          setIsDepositPendingApproval(false);
          setPendingRechargeId(null);
          setDepositSubmitted(false);
          setShowRechargeModal(false);
          setCurrentUser(serverPlayer);
          setTimeout(() => setRechargeSuccessToast(false), 4500);
          return;
        }
      }

      // 2. Vérification des dépôts Orange Money (pour invité ou joueur connecté)
      const creditedIds: string[] = JSON.parse(localStorage.getItem('credited_recharge_ids') || '[]');
      const allRecharges: RechargeRequest[] = remoteData?.recharges || JSON.parse(localStorage.getItem('pending_recharges') || '[]');
      
      if (userPhone) {
        const myPending = allRecharges.find(r => r.playerPhone === userPhone && r.status === 'pending');
        const myApproved = allRecharges.find(r => r.playerPhone === userPhone && r.status === 'approved' && !creditedIds.includes(r.id));

        if (myPending) {
          setIsDepositPendingApproval(true);
          setPendingRechargeId(myPending.id);
        } else if (myApproved) {
          // Flore vient de valider sur son tableau de bord !
          setIsDepositPendingApproval(false);
          setPendingRechargeId(null);
          setDepositSubmitted(false);
          setShowRechargeModal(false);
          playSound('bonus');
          setRechargeSuccessToast(true);

          const spinsToAdd = Number(myApproved.spins) || 1;
          if (currentUser) {
            setCurrentUser(prev => prev ? ({
              ...prev,
              spinsLeft: prev.spinsLeft + spinsToAdd
            }) : null);
          } else {
            setGuestSpinsLeft(prev => prev + spinsToAdd);
          }

          creditedIds.push(myApproved.id);
          localStorage.setItem('credited_recharge_ids', JSON.stringify(creditedIds));
          setTimeout(() => setRechargeSuccessToast(false), 4500);
        } else if (!myPending) {
          setIsDepositPendingApproval(false);
        }
      }

      // 3. Vérification des récompenses de Partage (10 personnes = 1 tour après validation)
      const creditedShareIds: string[] = JSON.parse(localStorage.getItem('credited_share_ids') || '[]');
      const allShareReqs: ShareRewardRequest[] = remoteData?.shareRewards || JSON.parse(localStorage.getItem('pending_share_rewards') || '[]');
      
      if (userPhone) {
        const myPendingShare = allShareReqs.find(s => s.playerPhone === userPhone && s.status === 'pending');
        const myApprovedShare = allShareReqs.find(s => s.playerPhone === userPhone && s.status === 'approved' && !creditedShareIds.includes(s.id));
        const myRejectedShare = allShareReqs.find(s => s.playerPhone === userPhone && s.status === 'rejected');

        if (myPendingShare) {
          setSharePendingApproval(true);
        } else if (myApprovedShare) {
          // Flore a validé le partage à 10 personnes !
          setSharePendingApproval(false);
          setShareProofSubmitted(false);
          setShowShareModal(false);
          playSound('bonus');
          setShareSuccessToast(true);

          const spinsToAdd = Number(myApprovedShare.spinsReward) || 1;
          if (currentUser) {
            setCurrentUser(prev => prev ? ({
              ...prev,
              spinsLeft: prev.spinsLeft + spinsToAdd,
              sharesCount: 0
            }) : null);
          } else {
            setGuestSpinsLeft(prev => prev + spinsToAdd);
            setGuestSharesCount(0);
            localStorage.setItem('guest_shares_count', '0');
          }

          creditedShareIds.push(myApprovedShare.id);
          localStorage.setItem('credited_share_ids', JSON.stringify(creditedShareIds));
          setTimeout(() => setShareSuccessToast(false), 4500);
        } else if (myRejectedShare && sharePendingApproval) {
          setSharePendingApproval(false);
          setShareProofSubmitted(false);
          setShareRejectToast(true);
          setTimeout(() => setShareRejectToast(false), 5000);
        }
      }
    };

    const interval = setInterval(checkApproval, 2000);
    return () => clearInterval(interval);
  }, [currentUser, depositPhone, sharePlayerPhone, pendingRechargeId, sharePendingApproval]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('guest_balance', guestBalance.toString());
      localStorage.setItem('guest_spins', guestSpinsLeft.toString());
    }
  }, [guestBalance, guestSpinsLeft, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('active_player', JSON.stringify(currentUser));
      const allPlayers: Record<string, PlayerAccount> = JSON.parse(localStorage.getItem('all_players') || '{}');
      allPlayers[currentUser.phone] = currentUser;
      localStorage.setItem('all_players', JSON.stringify(allPlayers));
    }
  }, [currentUser]);

  const currentBalance = currentUser ? currentUser.balance : guestBalance;
  const currentSpins = currentUser ? currentUser.spinsLeft : guestSpinsLeft;
  const currentShares = currentUser ? currentUser.sharesCount : 0;

  // Masquage précis du numéro : affiche les 3 premiers et les 2 derniers (Ex: 697 •••• 31)
  let cleanNum = (orangeReceiverNumber || '697204431').replace(/\s+/g, '');
  if (cleanNum.startsWith('699')) {
    cleanNum = '697204431';
  }
  const prefix = cleanNum.slice(0, 3);
  const suffix = cleanNum.slice(-2);
  const maskedOrangeNumber = `${prefix} •••• ${suffix}`;

  const ussdCode = `#150*1*1*${cleanNum}*${rechargePack.price}#`;

  // 🔒 SÉCURITÉ RENFORCÉE : 5 clics ultra-rapides (moins de 1.5s) uniquement connus de Flore
  const handleSecretLogoClick = () => {
    const nextCount = logoClickCount + 1;
    if (nextCount >= 5) {
      setLogoClickCount(0);
      if (onOpenSecretAdmin) {
        onOpenSecretAdmin();
      }
    } else {
      setLogoClickCount(nextCount);
      setTimeout(() => {
        setLogoClickCount(0);
      }, 1500);
    }
  };

  const playSound = (type: 'tick' | 'win' | 'bonus') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (type === 'tick') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(420, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } else if (type === 'win') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } else if (type === 'bonus') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const pickSector = (): { index: number; sector: Sector } => {
    const totalWeight = SECTORS.reduce((acc, s) => acc + s.probability, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < SECTORS.length; i++) {
      if (random < SECTORS[i].probability) {
        return { index: i, sector: SECTORS[i] };
      }
      random -= SECTORS[i].probability;
    }
    return { index: 0, sector: SECTORS[0] };
  };

  const handleSpin = () => {
    if (isSpinning) return;

    if (!currentUser && guestSpinsLeft <= 0) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser && currentUser.spinsLeft <= 0) {
      setShowRechargeModal(true);
      return;
    }

    if (currentUser && currentUser.totalSpinsPlayed >= maxSpinsPerDay) {
      alert(`Plafond journalier atteint (${maxSpinsPerDay} tours/jour). Revenez demain pour retenter votre chance !`);
      return;
    }

    setIsSpinning(true);

    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        spinsLeft: prev.spinsLeft - 1,
        totalSpinsPlayed: prev.totalSpinsPlayed + 1
      }) : null);
    } else {
      setGuestSpinsLeft(prev => prev - 1);
    }

    // 🎯 STRATÉGIE D'ATTRACTION (PREMIER TOUR GAGNANT) :
    // Le 1er tour du joueur (visiteur ou compte avec 0 tour joué) gagne 500 FCFA pour l'accrocher.
    // Ensuite : AUCUN tour gratuit supplémentaire. Le joueur doit obligatoirement recharger pour continuer.
    const isFirstTimeSpin = (!currentUser && guestSpinsLeft === 1) || (currentUser && currentUser.totalSpinsPlayed === 0);
    
    let chosen: { index: number; sector: Sector };
    if (isFirstTimeSpin) {
      // Index 4 correspond exactement à la case 500 FCFA dans SECTORS
      const index500 = SECTORS.findIndex(s => s.value === 500);
      const chosenIndex = index500 !== -1 ? index500 : 4;
      chosen = { index: chosenIndex, sector: SECTORS[chosenIndex] };
    } else {
      chosen = pickSector();
    }
    const sectorAngle = 360 / SECTORS.length;
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetSectorCenter = chosen.index * sectorAngle + sectorAngle / 2;
    const targetAngle = rotationAngle + (extraRounds * 360) + (360 - targetSectorCenter);

    setRotationAngle(targetAngle);

    const tickInterval = setInterval(() => {
      playSound('tick');
    }, 180);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setLastWin(chosen.sector.value);
      setShowWinModal(true);

      if (chosen.sector.value > 0) {
        playSound('win');
        if (currentUser) {
          setCurrentUser(prev => prev ? ({
            ...prev,
            balance: prev.balance + chosen.sector.value
          }) : null);
        } else {
          setGuestBalance(prev => prev + chosen.sector.value);
        }
      }
    }, 4500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneInput = authPhone.trim().replace(/\s+/g, '');
    if (phoneInput.length < 9) {
      setAuthError('Veuillez entrer un numéro valide.');
      return;
    }

    const allPlayers: Record<string, PlayerAccount> = JSON.parse(localStorage.getItem('all_players') || '{}');
    let player = allPlayers[phoneInput];

    if (!player) {
      player = {
        phone: phoneInput,
        registeredAt: new Date().toLocaleDateString('fr-FR'),
        balance: guestBalance,
        spinsLeft: 0,
        totalSpinsPlayed: 1,
        sharesCount: 0,
        adsSeen: 0
      };
      allPlayers[phoneInput] = player;
      localStorage.setItem('all_players', JSON.stringify(allPlayers));
    }

    setCurrentUser(player);
    setShowAuthModal(false);
    setAuthError('');
    setShowRechargeModal(true);

    // Envoi au serveur pour que Flore voie le joueur en direct sur l'admin
    sendRemoteAction('save_player', player);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('active_player');
  };

  // GESTION DU REÇU / CAPTURE D'ÉCRAN ORANGE MONEY
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('L\'image est trop lourde. Choisissez une capture de moins de 8 Mo.');
        return;
      }
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setScreenshotData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // ENVOI DE LA PREUVE DE DÉPÔT PAR LE JOUEUR
  const handleSendDepositProof = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = depositPhone.trim() || (currentUser ? currentUser.phone : '');
    if (!phoneToUse || phoneToUse.length < 9) {
      alert('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    if (!screenshotData) {
      alert('Veuillez importer la capture d\'écran de votre confirmation de paiement Orange Money.');
      return;
    }

    setDepositSubmitted(true);
    const newReqId = Date.now().toString();
    setPendingRechargeId(newReqId);

    const pendingRecharges: RechargeRequest[] = JSON.parse(localStorage.getItem('pending_recharges') || '[]');
    const newReq: RechargeRequest = {
      id: newReqId,
      playerPhone: phoneToUse,
      amount: rechargePack.price,
      spins: rechargePack.spins,
      screenshotUrl: screenshotData,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    localStorage.setItem('pending_recharges', JSON.stringify([newReq, ...pendingRecharges]));
    setIsDepositPendingApproval(true);

    // Transmission réseau instantanée vers le tableau de bord de Flore
    sendRemoteAction('submit_recharge', newReq);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.balance < minWithdrawAmount) return;

    setWithdrawSubmitted(true);
    const amountToWithdraw = currentUser.balance;

    const pendingWithdraws: WithdrawRequest[] = JSON.parse(localStorage.getItem('pending_withdraws') || '[]');
    const newReq: WithdrawRequest = {
      id: Date.now().toString(),
      playerPhone: currentUser.phone,
      amount: amountToWithdraw,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    localStorage.setItem('pending_withdraws', JSON.stringify([newReq, ...pendingWithdraws]));
    sendRemoteAction('submit_withdraw', newReq);

    setTimeout(() => {
      setCurrentUser(prev => prev ? ({
        ...prev,
        balance: 0
      }) : null);
      setWithdrawSubmitted(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  const sectorAngle = 360 / SECTORS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative">
      <AnimatePresence>
        {rechargeSuccessToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs border-2 border-white/40"
          >
            <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400" />
            <span>Paiement validé ! Vos tours sont prêts, tournez la roue !</span>
          </motion.div>
        )}

        {shareRejectToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs border-2 border-white/40"
          >
            <AlertCircle className="w-4 h-4 text-white" />
            <span>Demande de partage non validée par la gérante. Veuillez partager à 10 personnes réelles.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 BANNIÈRE OFFICIELLE PAIEMENT SÉCURISÉ */}
      <div 
        onClick={() => {
          if (!currentUser) setShowAuthModal(true);
          else setShowRechargeModal(true);
        }}
        className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-slate-950 py-2 px-3 text-xs font-black flex items-center justify-between cursor-pointer hover:opacity-95 shadow-md"
      >
        <div className="flex items-center gap-2">
          <span className="flex p-1 bg-black/20 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
          </span>
          <span className="tracking-tight text-[11px] sm:text-xs text-white">
            ⚡ <strong>RECHARGE PAR ORANGE MONEY :</strong> Paiement sécurisé direct (Dès 300 FCFA le tour) !
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 bg-slate-950 text-orange-400 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border border-orange-500/30">
          Recharger par Orange <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      {/* Barre des gagnants en direct */}
      <div className="bg-slate-900 border-b border-slate-800 py-1.5 px-4 text-xs font-semibold text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Gains récents :</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none text-[11px]">
          {INITIAL_WINNERS.map((w) => (
            <span key={w.id} className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] ${
              w.isJackpot 
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black shadow-sm shadow-amber-500/30' 
                : 'bg-slate-950/80 border-slate-800'
            }`}>
              {w.isJackpot ? '👑' : '📱'} 
              <span className="font-mono">{w.phone}</span> a touché 
              <strong className={w.isJackpot ? 'text-amber-300 font-black' : 'text-emerald-400 font-black'}>
                {w.gain.toLocaleString('fr-FR')} FCFA
              </strong>
              <span className="text-[10px] text-slate-400">({w.time})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header Joueur (Accès secret : 3 clics sur le trophée) */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              onClick={handleSecretLogoClick}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black cursor-pointer select-none active:scale-95 transition"
              title="La Roue d'Or"
            >
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>

            <div>
              <h1 className="text-base font-black tracking-tight leading-none bg-gradient-to-r from-amber-400 via-yellow-200 to-orange-400 bg-clip-text text-transparent">
                LA ROUE D'OR 237
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                {currentUser ? `Compte : ${currentUser.phone}` : 'Mode Découverte (1er tour offert)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRulesModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Paramètres : Principe du jeu"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Paramètres</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
              title="Son On/Off"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Barre Solde & Tours restants */}
      <section className="bg-slate-900/60 border-b border-slate-800 px-4 py-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          {/* Tirelire */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-3.5 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                Votre Tirelire
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                Dès {minWithdrawAmount} F
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{currentBalance}</span>
              <span className="text-xs font-bold text-slate-400">FCFA</span>
            </div>

            <div className="mt-2">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (currentBalance / minWithdrawAmount) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>0 F</span>
                <span>{Math.round((currentBalance / minWithdrawAmount) * 100)}% pour retirer</span>
                <span>{minWithdrawAmount} F</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  setShowAuthModal(true);
                } else {
                  setShowWithdrawModal(true);
                }
              }}
              disabled={currentBalance < minWithdrawAmount}
              className={`w-full mt-2.5 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                currentBalance >= minWithdrawAmount
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 animate-pulse font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Send className="w-3 h-3" />
              {currentBalance >= minWithdrawAmount ? 'Retirer mes gains' : `Retrait dès ${minWithdrawAmount} F`}
            </button>
          </div>

          {/* Tours Disponibles (Sans les boutons qui sont uniquement sous la roue) */}
          <div className="bg-slate-950 border border-orange-500/30 rounded-2xl p-3.5 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-orange-300 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Tours de Roue
                </span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-bold">
                  300 F / tour
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-orange-400">{currentSpins}</span>
                <span className="text-xs font-bold text-slate-400">
                  {currentSpins > 1 ? 'tours débloqués' : currentSpins === 1 ? 'tour débloqué' : 'aucun tour débloqué'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {!currentUser && guestSpinsLeft > 0 
                  ? '🎁 1er tour 100% gratuit ! Tournez tout de suite.' 
                  : currentSpins > 0
                    ? `🎯 ${currentSpins} tour${currentSpins > 1 ? 's' : ''} débloqué${currentSpins > 1 ? 's' : ''} prêt${currentSpins > 1 ? 's' : ''} à tourner !`
                    : 'Rechargez ou partagez sous la roue pour débloquer des tours.'}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Statut :</span>
              <span className={currentSpins > 0 ? "text-emerald-400 font-black" : "text-amber-400 font-semibold"}>
                {currentSpins > 0 ? `${currentSpins} tour${currentSpins > 1 ? 's' : ''} débloqué${currentSpins > 1 ? 's' : ''}` : '0 tour prêt'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main / La Roue */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center justify-center">
        <div className="text-center mb-3 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 border border-red-500/40 text-red-300 text-xs font-black mb-1.5 shadow-lg">
            <Trophy className="w-4 h-4 text-amber-400 fill-current" />
            GROS LOT : 10 000 FCFA CASH 👑
          </div>
          <p className="text-[11px] text-slate-400">
            {!currentUser && guestSpinsLeft > 0
              ? 'Votre premier tour est entièrement offert sans inscription !'
              : `Accumulez vos gains et retirez par Orange Money dès ${minWithdrawAmount} FCFA.`}
          </p>
        </div>

        {/* Roue interactive */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center my-2">
          <div className="absolute -top-3 z-20 flex flex-col items-center">
            <div className="w-6 h-8 bg-gradient-to-b from-amber-300 to-amber-600 rounded-sm shadow-xl flex items-center justify-center border border-white/50 transform drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
                 style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
          </div>

          <div className="absolute inset-0 rounded-full p-2 bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-700 shadow-2xl shadow-amber-500/25 border-4 border-amber-300/40">
            <div className="w-full h-full rounded-full border-2 border-dashed border-amber-200/50 flex items-center justify-center relative">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_#fef08a]"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-134px)`,
                  }}
                />
              ))}
            </div>
          </div>

          <div 
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-inner relative transition-transform"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {SECTORS.map((sector, index) => {
                const startAngle = (index * 360) / SECTORS.length;
                const endAngle = ((index + 1) * 360) / SECTORS.length;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + sectorAngle / 2;
                const textRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 32 * Math.cos(textRad);
                const textY = 50 + 32 * Math.sin(textRad);

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={sector.color}
                      stroke="#0f172a"
                      strokeWidth="0.8"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={sector.textColor}
                      fontSize={sector.isJackpot ? "4.2" : "3.8"}
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black cursor-pointer hover:scale-105 active:scale-95 transition disabled:cursor-not-allowed group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-600/40 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider group-hover:scale-110 transition">
                {isSpinning ? '...' : 'TOURNER'}
              </span>
              <span className="text-[9px] font-bold text-slate-800">
                {currentSpins > 0 ? `${currentSpins} débloqué${currentSpins > 1 ? 's' : ''}` : '300 F'}
              </span>
            </div>
          </button>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-3 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition transform active:scale-95 ${
              currentSpins > 0
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-orange-500/25'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                La roue tourne...
              </span>
            ) : currentSpins > 0 ? (
              <>
                <Trophy className="w-5 h-5 text-slate-950" />
                <span>LANCER LE TOUR ({currentSpins} TOUR{currentSpins > 1 ? 'S' : ''} DÉBLOQUÉ{currentSpins > 1 ? 'S' : ''})</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>RECHARGER 1 TOUR (DÈS 300 FCFA)</span>
              </>
            )}
          </button>

          {/* Bouton de recharge directe */}
          <button
            onClick={() => {
              if (!currentUser) {
                setShowAuthModal(true);
              } else {
                setShowRechargeModal(true);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-orange-500/40 text-orange-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-950/40 transition active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-orange-400" />
            <span>Recharger mon compte (Orange Money uniquement)</span>
          </button>

          {/* Bouton Partager à 10 amis */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-950/40 transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Partager à 10 amis = 1 tour gratuit</span>
          </button>
        </div>
      </main>

      {/* MODALE AUTHENTIFICATION (SANS EXEMPLE DE TEXTE PRÉ-REMPLI) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-center text-white mb-1">
                Continuer à jouer
              </h3>
              <p className="text-xs text-center text-slate-400 mb-4">
                Entrez votre numéro pour sécuriser votre tirelire ({guestBalance} FCFA) et continuer la partie.
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Votre numéro de téléphone :
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder=""
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  {authError && (
                    <p className="text-[10px] text-red-400 mt-1">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <span>Valider mon numéro & Recharger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟠 MODALE RECHARGE ORANGE MONEY (AVEC PACKS JUSQU'À 10 000 FCFA) */}
      <AnimatePresence>
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowRechargeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                    OM
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">Paiement Orange Money Uniquement</h3>
                    <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Règlement 100% sécurisé via compte Orange Money
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mb-3">
                Sélectionnez le nombre de tours à débloquer :
              </p>

              {/* Sélection du pack */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {RECHARGE_PACKS.map((pack) => (
                  <button
                    key={pack.price}
                    type="button"
                    onClick={() => {
                      setRechargePack(pack);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition relative ${
                      rechargePack.price === pack.price
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pack.badge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full whitespace-nowrap">
                        {pack.badge}
                      </span>
                    )}
                    <span className="block text-base font-black text-amber-400">{pack.spins} Tour{pack.spins > 1 ? 's' : ''}</span>
                    <span className="block text-[11px] font-bold">{pack.price} FCFA</span>
                  </button>
                ))}
              </div>

              {/* FORMULAIRE DE RECHARGE PAR CAPTURE D'ÉCRAN SANS TRICHE */}
              {!isDepositPendingApproval ? (
                <form onSubmit={handleSendDepositProof} className="space-y-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl p-4">
                  {/* ÉTAPE 1 : BOUTON PAYER LE TOUR */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                      Étape 1 : Effectuez le paiement Orange Money
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Montant exact : <strong className="text-white">{rechargePack.price} FCFA</strong> vers le compte Orange Money ({maskedOrangeNumber})
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Code USSD direct :</span>
                        <span className="font-mono text-amber-400 font-black text-xs sm:text-sm">
                          #150*1*1*{cleanNum}*{rechargePack.price}#
                        </span>
                      </div>
                      <a
                        href={`tel:${encodeURIComponent(`#150*1*1*${cleanNum}*${rechargePack.price}#`)}`}
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs hover:brightness-110 shadow flex items-center gap-1.5 shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Payer le tour</span>
                      </a>
                    </div>
                  </div>

                  {/* Numéro du joueur */}
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Votre numéro de téléphone Orange :
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 697 00 00 00"
                      value={depositPhone}
                      onChange={(e) => setDepositPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
                    />
                  </div>

                  {/* ÉTAPE 2 : CHAMP POUR LA CAPTURE D'ÉCRAN */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                      Étape 2 : Mettez la capture d'écran du paiement
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Prenez une capture d'écran du SMS ou du reçu de confirmation Orange Money :
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-3.5 rounded-xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                        screenshotData 
                          ? 'border-emerald-500/60 bg-emerald-500/10' 
                          : 'border-slate-700 bg-slate-900 hover:border-amber-400'
                      }`}
                    >
                      {screenshotData ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                          <span className="text-xs text-emerald-300 font-bold">
                            Capture chargée : {screenshotName || 'Reçu_OM.jpg'}
                          </span>
                          <span className="text-[10px] text-slate-400">Cliquez pour changer d'image</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-amber-400" />
                          <span className="text-xs text-slate-200 font-bold">
                            Cliquez ici pour insérer votre capture d'écran
                          </span>
                          <span className="text-[10px] text-slate-400">Format image (JPG, PNG)</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ÉTAPE 3 : BOUTON SOUMETTRE LA DEMANDE */}
                  <button
                    type="submit"
                    disabled={!screenshotData}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                      screenshotData
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 cursor-pointer shadow-emerald-500/25 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>SOUMETTRE MON REÇU POUR VALIDATION</span>
                  </button>
                </form>
              ) : (
                /* ÉTAPE D'ATTENTE : BOUTON JOUER BLOQUÉ TANT QUE LA GÉRANTE N'A PAS VALIDÉ */
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                    <Hourglass className="w-7 h-7 text-amber-400 animate-spin" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">Vérification de votre dépôt en cours</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Votre capture d'écran a été transmise pour vérification.
                    </p>
                    <p className="text-[11px] text-amber-300 font-bold mt-1">
                      Dès vérification de votre virement Orange Money, vos tours se débloquent automatiquement !
                    </p>
                  </div>

                  {/* Bouton Jouer : Inactif tant que pas validé */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <button
                      type="button"
                      disabled={true}
                      className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-500 font-black text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700/50"
                    >
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>JOUER LE TOUR (BLOQUÉ JUSQU'À VALIDATION)</span>
                    </button>
                    <span className="text-[10px] text-slate-400 block">
                      ⏳ Cette page se débloque toute seule en direct dès confirmation de votre dépôt.
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Statut : En cours de vérification...</span>
                    <button
                      type="button"
                      onClick={() => setIsDepositPendingApproval(false)}
                      className="text-amber-400 underline hover:text-white"
                    >
                      Renvoyer une autre capture
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE VICTOIRE */}
      <AnimatePresence>
        {showWinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              {lastWin !== null && lastWin > 0 ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                    <Trophy className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-black text-amber-400 mb-1">
                    {lastWin === 10000 ? '👑 JACKPOT HISTORIQUE !' : 'BRAVO ! C\'EST GAGNÉ !'}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Votre gain a été immédiatement versé dans votre tirelire :
                  </p>

                  <div className="bg-slate-950 border border-amber-500/30 rounded-2xl py-3 px-4 mb-4">
                    <span className="text-3xl font-black text-emerald-400">+{lastWin} FCFA</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nouveau solde : <span className="font-bold text-amber-300">{currentBalance} FCFA</span>
                    </p>
                  </div>

                  {currentBalance >= minWithdrawAmount ? (
                    <p className="text-xs text-emerald-300 font-bold mb-4">
                      🎉 Félicitations ! Vous avez dépassé {minWithdrawAmount} FCFA. Vous pouvez retirer immédiatement !
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mb-4">
                      Plus que <span className="text-amber-400 font-bold">{minWithdrawAmount - currentBalance} FCFA</span> pour demander votre retrait !
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-200 mb-1">PAS DE CHANCE CETTE FOIS</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    La roue est passée tout près des 10 000 FCFA ! Rejouez dès 300 F ou profitez d'une offre gratuite.
                  </p>
                </>
              )}

              <button
                onClick={() => {
                  setShowWinModal(false);
                  if (!currentUser && guestSpinsLeft <= 0) {
                    setShowAuthModal(true);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Continuer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE RETRAIT */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Demande de Retrait Mobile</h3>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 mb-4 text-center">
                <span className="text-xs text-slate-400">Montant net à recevoir :</span>
                <p className="text-2xl font-black text-emerald-400">{currentBalance} FCFA</p>
                <p className="text-[10px] text-slate-400">
                  Vers le numéro {currentUser ? currentUser.phone : ''}
                </p>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Délai d'envoi : Traité sous 15 à 30 minutes vers votre Orange Money.</span>
                </div>

                <button
                  type="submit"
                  disabled={withdrawSubmitted}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  {withdrawSubmitted ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-slate-950" />
                      Demande enregistrée ! Virement sous peu...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Confirmer le retrait de {currentBalance} FCFA
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SUCCÈS VALIDATION DU PARTAGE (1 TOUR OFFERT) */}
      <AnimatePresence>
        {shareSuccessToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs border-2 border-white/40"
          >
            <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400" />
            <span>Partage à 10 personnes validé par l'administratrice ! +1 Tour gratuit débloqué 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💬 MODALE PARTAGE (10 PERSONNES = 1 TOUR AVEC VALIDATION DE FLORE) */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Partagez à 10 Amis & Obtenez 1 Tour</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Validation de l'administratrice requise avant déblocage
                  </p>
                </div>
              </div>

              {!sharePendingApproval ? (
                <div className="space-y-3.5 bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 mt-3">
                  {/* Progression des partages */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        Partages effectués :
                      </span>
                      <span className="text-emerald-400 font-mono text-sm font-black">
                        {(currentUser ? currentUser.sharesCount : guestSharesCount)} / 10 amis
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (((currentUser ? currentUser.sharesCount : guestSharesCount)) / 10) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Partagez le lien à 10 contacts ou groupes WhatsApp différents.
                    </p>
                  </div>

                  {/* Bouton Partager sur WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("🔥 Viens jouer à La Roue d'Or 237 ! Tente de gagner jusqu'à 10 000 FCFA cash immédiatement : " + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (currentUser) {
                        const newCount = Math.min(10, currentUser.sharesCount + 1);
                        setCurrentUser(prev => prev ? ({ ...prev, sharesCount: newCount }) : null);
                      } else {
                        const newCount = Math.min(10, guestSharesCount + 1);
                        setGuestSharesCount(newCount);
                        localStorage.setItem('guest_shares_count', newCount.toString());
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Envoyer à un ami sur WhatsApp (+1 clic)</span>
                  </a>

                  {/* Soumission de la demande après 10 partages */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const currentCount = currentUser ? currentUser.sharesCount : guestSharesCount;
                      if (currentCount < 10) {
                        alert("Vous devez partager le lien à 10 personnes avant de soumettre.");
                        return;
                      }

                      const phoneToUse = (currentUser ? currentUser.phone : (sharePlayerPhone.trim() || depositPhone.trim()));
                      if (!phoneToUse || phoneToUse.length < 9) {
                        alert("Veuillez renseigner votre numéro de téléphone Orange Money.");
                        return;
                      }

                      localStorage.setItem('last_share_phone', phoneToUse);

                      const allShareReqs: ShareRewardRequest[] = JSON.parse(localStorage.getItem('pending_share_rewards') || '[]');
                      const newReq: ShareRewardRequest = {
                        id: Date.now().toString(),
                        playerPhone: phoneToUse,
                        sharesCount: currentCount,
                        spinsReward: 1,
                        screenshotUrl: shareProofScreenshot || undefined,
                        date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        status: 'pending'
                      };

                      localStorage.setItem('pending_share_rewards', JSON.stringify([newReq, ...allShareReqs]));
                      setSharePendingApproval(true);
                      sendRemoteAction('submit_share', newReq);
                    }}
                    className="pt-2 border-t border-slate-800 space-y-2.5"
                  >
                    {!currentUser && (
                      <div>
                        <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                          Votre numéro Orange Money (pour recevoir le tour débloqué) :
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: 697 00 00 00"
                          value={sharePlayerPhone}
                          onChange={(e) => setSharePlayerPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400"
                        />
                      </div>
                    )}

                    <label className="block text-[11px] text-slate-300 font-semibold">
                      Capture d'écran de preuve de partage (Facultatif mais recommandé) :
                    </label>

                    <input
                      type="file"
                      ref={shareFileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEv) => {
                            setShareProofScreenshot(uploadEv.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />

                    <div 
                      onClick={() => shareFileInputRef.current?.click()}
                      className={`p-2.5 rounded-xl border border-dashed text-center cursor-pointer text-xs ${
                        shareProofScreenshot ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {shareProofScreenshot ? '✅ Capture de vos partages chargée' : '📷 Ajouter une capture de preuve WhatsApp'}
                    </div>

                    <button
                      type="submit"
                      disabled={(currentUser ? currentUser.sharesCount : guestSharesCount) < 10}
                      className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition ${
                        (currentUser ? currentUser.sharesCount : guestSharesCount) >= 10
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 cursor-pointer shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>DEMANDER MON TOUR GRATUIT (10/10 ATTEINT)</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* En attente de validation */
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 text-center space-y-3.5 mt-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                    <Hourglass className="w-6 h-6 text-amber-400 animate-spin" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">Demande de tour gratuit transmise</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Vos 10 partages sont en cours de vérification sécurisée.
                    </p>
                    <p className="text-[11px] text-amber-300 font-bold mt-1">
                      Votre tour gratuit s'activera dès confirmation de votre demande !
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                    <span>Statut : En cours de validation...</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📖 MODALE PARAMÈTRES & PRINCIPE DU JEU */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowRulesModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Settings className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Paramètres : Principe du Jeu</h3>
                  <p className="text-[11px] text-slate-400">Règles et fonctionnement de La Roue d'Or 237</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <span>🎁 1. Premier Tour Offert</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dès votre première visite, vous bénéficiez d'un <strong>1er tour gratuit</strong> sans inscription pour tester votre chance immédiatement.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <span>👑 2. Gains en Argent Réel & Tirelire</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    La roue permet de gagner jusqu'à <strong>10 000 FCFA cash</strong> à chaque tour. Tous vos gains sont conservés dans votre Tirelire personnelle.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-orange-400">
                    <span>⚡ 3. Retraits Directs par Orange Money</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dès que votre tirelire atteint le montant minimum de <strong>{minWithdrawAmount} FCFA</strong>, vous pouvez effectuer une demande de retrait. Le montant vous est directement transféré sur votre compte Orange Money.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span>🎯 4. Comment Débloquer des Tours</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                    <li>
                      <strong className="text-white">Recharge Orange Money :</strong> Choisissez un pack de tours (dès 300 FCFA), effectuez le virement par code USSD et téléversez votre reçu. Dès confirmation, vos tours sont débloqués.
                    </li>
                    <li>
                      <strong className="text-white">Partage WhatsApp :</strong> Partagez votre lien de jeu à 10 amis ou groupes. Une fois vérifié, 1 tour gratuit vous est accordé.
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-300">
                    <span>🔒 5. Équité et Sécurité</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Toutes les transactions sont sécurisées, sans publicité intrusive, garantissant une expérience de jeu fluide et transparente.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                J'ai compris, je joue !
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Joueur */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 px-4 text-center text-[11px] text-slate-500">
        <p>© 2026 La Roue d'Or 237 • Plateforme certifiée Mobile Cameroun</p>
      </footer>
    </div>
  );
}
