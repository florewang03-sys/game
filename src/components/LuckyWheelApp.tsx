import React, { useState, useEffect } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { DEFAULT_MISSIONS, SponsoredMission } from './SecretDashboard';
import { 
  requestCampayCollect, 
  checkCampayTransactionStatus, 
  detectCameroonOperator,
  formatCameroonPhone
} from '../utils/campay';

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
  smsRef: string;
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

  // Liens sponsorisés configurables (1XBET, Melbet, CPAGrip, etc.)
  const [missions, setMissions] = useState<SponsoredMission[]>(() => {
    const saved = localStorage.getItem('sponsored_missions');
    return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
  });

  // Recharger les missions depuis le localStorage chaque fois qu'on ouvre ou qu'on affiche une pub
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sponsored_missions');
      if (saved) {
        try {
          setMissions(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // États de la roue
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 📺 PUB AUTOMATIQUE 5 SECONDES CONNECTÉE AUX LIENS SPONSORISÉS
  const [showAutoAd, setShowAutoAd] = useState(false);
  const [autoAdTimer, setAutoAdTimer] = useState(5);
  const [canCloseAutoAd, setCanCloseAutoAd] = useState(false);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [spinsSinceLastAd, setSpinsSinceLastAd] = useState(0);

  // Modales
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);

  // Formulaires
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [rechargePack, setRechargePack] = useState(RECHARGE_PACKS[0]);
  const [smsReference, setSmsReference] = useState('');
  const [rechargeSubmitted, setRechargeSubmitted] = useState(false);
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);

  // 🚀 SYSTÈME PAIEMENT AUTOMATIQUE STYLE DGSN (Campay Direct Push)
  const [payerPhone, setPayerPhone] = useState(() => currentUser ? currentUser.phone : '');
  const [isProcessingCampay, setIsProcessingCampay] = useState(false);
  const [campayStep, setCampayStep] = useState<'idle' | 'waiting_pin' | 'verifying' | 'success' | 'failed'>('idle');
  const [campayStatusMsg, setCampayStatusMsg] = useState('');
  const [campayRef, setCampayRef] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<'orange' | 'mtn' | 'unknown'>('orange');

  // Déclencheur USSD
  const [isPromptingUSSD, setIsPromptingUSSD] = useState(false);
  const [ussdTriggered, setUssdTriggered] = useState(false);

  // Toast
  const [rechargeSuccessToast, setRechargeSuccessToast] = useState(false);

  // Déclencheur secret 3-clics
  const [logoClickCount, setLogoClickCount] = useState(0);

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

  useEffect(() => {
    let interval: any = null;
    if (showAutoAd && autoAdTimer > 0) {
      interval = setInterval(() => {
        setAutoAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (showAutoAd && autoAdTimer === 0) {
      setCanCloseAutoAd(true);
    }
    return () => clearInterval(interval);
  }, [showAutoAd, autoAdTimer]);

  const playSound = (type: 'tick' | 'win' | 'bonus' | 'ad_1xbet' | 'ad_melbet' | 'ad_app' | 'ad_default') => {
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
      } else if (type === 'ad_1xbet') {
        // Jingle sportif dynamique style 1XBET (cuivres fanfare stade)
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.12);
          osc.stop(audioCtx.currentTime + idx * 0.12 + 0.25);
        });
      } else if (type === 'ad_melbet') {
        // Jingle casino chic style Melbet
        const notes = [523, 659, 783, 1046];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
        });
      } else if (type === 'ad_app' || type === 'ad_default') {
        // Son carillon digital techno style application mobile
        [600, 800, 1200].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.14, audioCtx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.09 + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.09);
          osc.stop(audioCtx.currentTime + idx * 0.09 + 0.22);
        });
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Annonce vocale synthétisée comme sur les vrais sites ou radios camerounaises
  const speakAdAnnouncement = (mission: SponsoredMission) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      let text = `Offre spéciale : découvrez ${mission.name} et recevez des tours gratuits !`;
      if (mission.id === '1xbet') {
        text = 'Publicité : Rejoignez 1XBET Cameroun avec votre code promo et gagnez des tours gratuits !';
      } else if (mission.id === 'melbet') {
        text = 'Publicité : Melbet Cameroun, tentez votre chance avec un bonus exclusif !';
      } else if (mission.id === 'cpa_app') {
        text = 'Sponsor : Téléchargez l\'application gratuite pour débloquer votre tour immédiat !';
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
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

  const triggerAutoAd = () => {
    setAutoAdTimer(5);
    setCanCloseAutoAd(false);
    const nextIndex = (currentMissionIndex + 1) % missions.length;
    setCurrentMissionIndex(nextIndex);
    setShowAutoAd(true);

    const currentMissionObj = missions[nextIndex] || missions[0];

    // Jouer le jingle sonore personnalisé selon le sponsor
    if (currentMissionObj.id === '1xbet') {
      playSound('ad_1xbet');
    } else if (currentMissionObj.id === 'melbet') {
      playSound('ad_melbet');
    } else {
      playSound('ad_app');
    }

    // Lancer l'annonce sonore vocale comme sur les vrais sites ou radios
    setTimeout(() => {
      speakAdAnnouncement(currentMissionObj);
    }, 450);

    const currentTotalAds = parseInt(localStorage.getItem('total_ad_impressions') || '0', 10);
    localStorage.setItem('total_ad_impressions', (currentTotalAds + 1).toString());
  };

  const handleCloseAutoAd = () => {
    setShowAutoAd(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentUser) {
      setCurrentUser(prev => prev ? ({ ...prev, adsSeen: (prev.adsSeen || 0) + 1 }) : null);
    }
  };

  const handleClaimMission = (mission: SponsoredMission) => {
    window.open(mission.url, '_blank');

    // Total clics globaux
    const clicks = parseInt(localStorage.getItem('total_mission_clicks') || '0', 10);
    localStorage.setItem('total_mission_clicks', (clicks + 1).toString());

    // Clics par mission individuelle (pour savoir qui clique sur quelle pub)
    const stats: Record<string, number> = JSON.parse(localStorage.getItem('mission_click_stats') || '{}');
    stats[mission.id] = (stats[mission.id] || 0) + 1;
    localStorage.setItem('mission_click_stats', JSON.stringify(stats));

    playSound('bonus');
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        spinsLeft: prev.spinsLeft + mission.rewardSpins,
        adClicks: (prev.adClicks || 0) + 1
      }) : null);
    } else {
      setGuestSpinsLeft(prev => prev + mission.rewardSpins);
    }

    setShowMissionsModal(false);
    setRechargeSuccessToast(true);
    setTimeout(() => setRechargeSuccessToast(false), 3500);
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

    const nextSpinsCount = spinsSinceLastAd + 1;
    setSpinsSinceLastAd(nextSpinsCount);

    // 🎯 STRATÉGIE D'ATTRACTION (PREMIER TOUR GAGNANT) :
    // Si c'est le 1er tour du joueur (visiteur ou compte avec 0 tour joué),
    // on lui fait obligatoirement gagner 500 FCFA pour l'accrocher et lui donner envie de recharger !
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

      if (nextSpinsCount >= adFrequency) {
        setSpinsSinceLastAd(0);
        setTimeout(() => {
          triggerAutoAd();
        }, 1500);
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
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('active_player');
  };

  const handleShareWhatsApp = () => {
    const textToShare = encodeURIComponent(
      `🎁 Viens tenter le Gros Lot de 10 000 FCFA sur La Roue d'Or 237 ! Tourne la roue gratuitement : ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${textToShare}`, '_blank');

    if (currentUser) {
      const nextCount = currentUser.sharesCount + 1;
      let newSpins = currentUser.spinsLeft;

      if (nextCount % 10 === 0) {
        playSound('bonus');
        newSpins += 2;
      }

      setCurrentUser({
        ...currentUser,
        sharesCount: nextCount,
        spinsLeft: newSpins
      });
    } else {
      setShowAuthModal(true);
    }
  };

  // 🚀 SYSTÈME PAIEMENT AUTOMATIQUE STYLE DGSN (Vraie vérification bancaire)
  const handleStartAutomaticPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = payerPhone.trim() || (currentUser ? currentUser.phone : '');
    if (!phoneToUse || phoneToUse.length < 9) {
      alert('Veuillez entrer un numéro de téléphone valide (Orange ou MTN).');
      return;
    }

    const op = detectCameroonOperator(phoneToUse);
    setDetectedOperator(op);
    setIsProcessingCampay(true);
    setCampayStep('waiting_pin');
    setCampayStatusMsg(`Envoi de la demande de prélèvement de ${rechargePack.price} FCFA sur le ${phoneToUse}...`);

    try {
      // 1. Envoyer la demande de débit réelle vers Orange / MTN
      const res = await requestCampayCollect({
        amount: rechargePack.price,
        fromPhone: phoneToUse,
        description: `Roue d'Or 237 - ${rechargePack.spins} tour(s)`,
        externalReference: `ROUE-${Date.now()}`
      });

      if (!res.success || !res.reference) {
        throw new Error(res.error || "Impossible d'initier la transaction");
      }

      const ref = res.reference;
      setCampayRef(ref);

      const ussdInfo = res.ussdCode ? ` (Composez ${res.ussdCode} si la popup ne s'ouvre pas)` : '';
      setCampayStatusMsg(
        `Une demande de retrait de ${rechargePack.price} FCFA a été envoyée sur votre téléphone${ussdInfo}. Entrez votre code PIN secret pour valider.`
      );

      // 2. Interroger CamPay toutes les 3 secondes pour savoir quand le joueur tape son code
      let attempts = 0;
      const maxAttempts = 25; // 75 secondes max

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await checkCampayTransactionStatus(ref);

          if (statusRes.status === 'SUCCESSFUL') {
            clearInterval(pollInterval);
            setCampayStep('success');
            setCampayStatusMsg(`Paiement de ${rechargePack.price} FCFA confirmé par l'opérateur !`);
            playSound('bonus');

            // Enregistrer dans l'historique des encaissements
            const pendingRecharges: RechargeRequest[] = JSON.parse(localStorage.getItem('pending_recharges') || '[]');
            const newReq: RechargeRequest = {
              id: Date.now().toString(),
              playerPhone: phoneToUse,
              amount: rechargePack.price,
              spins: rechargePack.spins,
              smsRef: ref,
              date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              status: 'approved'
            };
            localStorage.setItem('pending_recharges', JSON.stringify([newReq, ...pendingRecharges]));

            // Créditer les tours UNIQUEMENT maintenant
            if (currentUser) {
              setCurrentUser(prev => prev ? ({
                ...prev,
                spinsLeft: prev.spinsLeft + rechargePack.spins
              }) : null);
            } else {
              setGuestSpinsLeft(prev => prev + rechargePack.spins);
            }

            setTimeout(() => {
              setIsProcessingCampay(false);
              setCampayStep('idle');
              setShowRechargeModal(false);
              setRechargeSuccessToast(true);
              setTimeout(() => setRechargeSuccessToast(false), 3500);
            }, 2500);
          } else if (statusRes.status === 'FAILED') {
            clearInterval(pollInterval);
            setCampayStep('failed');
            setCampayStatusMsg('Paiement refusé ou annulé par l\'opérateur.');
            setIsProcessingCampay(false);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setCampayStep('failed');
            setCampayStatusMsg('Délai d\'attente dépassé. Aucun tour n\'a été débité.');
            setIsProcessingCampay(false);
          }
        } catch (e) {
          console.warn("Vérification statut...", e);
        }
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setCampayStep('failed');
      setCampayStatusMsg(err.message || 'La transaction n\'a pas pu être envoyée à l\'opérateur.');
      setIsProcessingCampay(false);
    }
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsReference.trim()) return;

    setRechargeSubmitted(true);

    const pendingRecharges: RechargeRequest[] = JSON.parse(localStorage.getItem('pending_recharges') || '[]');
    const newReq: RechargeRequest = {
      id: Date.now().toString(),
      playerPhone: currentUser ? currentUser.phone : 'Client Direct',
      amount: rechargePack.price,
      spins: rechargePack.spins,
      smsRef: smsReference.trim(),
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    localStorage.setItem('pending_recharges', JSON.stringify([newReq, ...pendingRecharges]));

    setTimeout(() => {
      if (currentUser) {
        setCurrentUser(prev => prev ? ({
          ...prev,
          spinsLeft: prev.spinsLeft + rechargePack.spins
        }) : null);
      } else {
        setGuestSpinsLeft(prev => prev + rechargePack.spins);
      }

      playSound('bonus');
      setRechargeSubmitted(false);
      setShowRechargeModal(false);
      setSmsReference('');
      setUssdTriggered(false);

      setRechargeSuccessToast(true);
      setTimeout(() => setRechargeSuccessToast(false), 3500);
    }, 1200);
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

    setTimeout(() => {
      setCurrentUser(prev => prev ? ({
        ...prev,
        balance: 0
      }) : null);
      setWithdrawSubmitted(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  const currentMission = missions[currentMissionIndex] || missions[0];
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
            <span>Bonus validé ! Vos tours sont prêts, tournez la roue !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 BANNIÈRE VIRALE WHATSAPP */}
      <div 
        onClick={() => setShowShareModal(true)}
        className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white py-2 px-3 text-xs font-black flex items-center justify-between cursor-pointer hover:opacity-95 shadow-md"
      >
        <div className="flex items-center gap-2">
          <span className="flex p-1 bg-white/20 rounded-full animate-bounce">
            <Wifi className="w-3.5 h-3.5" />
          </span>
          <span className="tracking-tight text-[11px] sm:text-xs">
            🎁 <strong>BONUS :</strong> Partagez à 10 amis WhatsApp et recevez <strong>2 TOURS GRATUITS</strong> !
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 bg-white text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
          Partager <Share2 className="w-3 h-3" />
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
              onClick={() => setShowShareModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-xs font-bold text-emerald-400 hover:bg-emerald-600/30 flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Partager</span>
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

          {/* Tours Disponibles */}
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
                <span className="text-xs font-bold text-slate-400">{currentSpins > 1 ? 'tours prêts' : 'tour prêt'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {!currentUser && guestSpinsLeft > 0 
                  ? '🎁 1er tour 100% gratuit ! Tournez tout de suite.' 
                  : currentUser 
                    ? `Joué : ${currentUser.totalSpinsPlayed} / ${maxSpinsPerDay} tours max/jour`
                    : 'Rechargez dès 300 F pour continuer'}
              </p>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  setShowAuthModal(true);
                } else {
                  setShowRechargeModal(true);
                }
              }}
              className="w-full mt-2.5 py-1.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition transform active:scale-95"
            >
              <Gift className="w-3.5 h-3.5" />
              Recharger (Dès 300 F)
            </button>
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
                {currentSpins > 0 ? `${currentSpins} prêt` : '300 F'}
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
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/25'
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
                LANCER LE TOUR ({currentSpins} disponible)
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                RECHARGER 1 TOUR (300 FCFA)
              </>
            )}
          </button>

          {/* Bouton de partage WhatsApp */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-950/40 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Partager à 10 amis = 2 Tours GRATUITS</span>
          </button>
        </div>
      </main>

      {/* 🎯 MODALE MISSIONS / LIENS SPONSORISÉS */}
      <AnimatePresence>
        {showMissionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowMissionsModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-white">Débloquer des Tours Gratuits</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Choisissez une offre partenaire pour débloquer immédiatement <strong>1 à 2 tours offerts</strong> :
              </p>

              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => handleClaimMission(mission)}
                    className={`p-3.5 rounded-2xl bg-gradient-to-r ${mission.gradient} border border-white/10 hover:border-amber-400/50 cursor-pointer transition transform active:scale-98 shadow-md flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl mt-0.5">{mission.iconEmoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="text-xs font-black text-white">{mission.name}</h4>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                            {mission.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-tight">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="block text-xs font-black text-amber-300">
                        +{mission.rewardSpins} Tour{mission.rewardSpins > 1 ? 's' : ''}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Ouvrir <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📺 MODALE PLEIN ÉCRAN TOTAL : PUBLICITÉ INTERSTITIELLE 5 SECONDES IMMERSIVE */}
      <AnimatePresence>
        {showAutoAd && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/98 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full mx-auto my-auto flex flex-col justify-between"
            >
              {/* En-tête plein écran avec décompte */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-amber-400 text-xs uppercase tracking-wider font-black">
                  <Globe className="w-4 h-4" />
                  Sponsor Officiel Cameroun
                </span>

                {canCloseAutoAd ? (
                  <button
                    onClick={handleCloseAutoAd}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 px-4 py-1.5 rounded-full font-black text-xs transition shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    <span>Passer la publicité</span>
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-3.5 py-1.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span className="text-white font-mono font-black text-xs">
                      Fermeture dans {autoAdTimer}s
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu publicitaire géant adapté à tous écrans */}
              <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${currentMission.gradient} border-2 border-amber-500/30 text-center shadow-2xl space-y-4`}>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 flex items-center justify-center text-5xl shadow-xl border border-white/20">
                  {currentMission.iconEmoji}
                </div>

                <div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    {currentMission.badge}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {currentMission.name}
                  </h3>

                  {/* Indicateur Audio Spot Publicitaire Réel */}
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-amber-300 font-bold bg-amber-500/10 py-1 px-3 rounded-full border border-amber-500/20 max-w-xs mx-auto">
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    </span>
                    <span>Spot publicitaire audio en cours</span>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed max-w-sm mx-auto">
                  {currentMission.description}
                </p>

                {/* Bouton d'action géant */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleClaimMission(currentMission);
                      setShowAutoAd(false);
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 active:scale-95 transition cursor-pointer"
                  >
                    <span>PROFITER DE L'OFFRE (+{currentMission.rewardSpins} Tour{currentMission.rewardSpins > 1 ? 's' : ''})</span>
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    🎁 Le lien s'ouvre dans un nouvel onglet sans perdre votre partie en cours.
                  </p>
                </div>
              </div>

              {/* Pied de pub */}
              <div className="mt-4 text-center">
                {canCloseAutoAd ? (
                  <button
                    onClick={handleCloseAutoAd}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition border border-slate-700"
                  >
                    ← Reprendre mes tours sur la Roue d'Or
                  </button>
                ) : (
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    Lecture publicitaire obligatoire ({autoAdTimer}s restantes)
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    <h3 className="text-sm font-black text-white leading-tight">Paiement Mobile Automatique</h3>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Orange Money & MTN Mobile Money (Agréé)
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
                      setCampayStep('idle');
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

              {/* FORMULAIRE OFFICIEL DGSN STYLE DIRECT PUSH */}
              {campayStep === 'idle' && (
                <form onSubmit={handleStartAutomaticPayment} className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Votre numéro de téléphone (Orange ou MTN) :
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 697 00 00 00 ou 670 00 00 00"
                      value={payerPhone || (currentUser ? currentUser.phone : '')}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      Retrait sécurisé direct : aucune application téléphone ne s'ouvre.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-slate-950" />
                    <span>LANCER LE PAIEMENT AUTOMATIQUE ({rechargePack.price} FCFA)</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Compte marchand certifié CamPay</span>
                    <span className="text-amber-400 font-mono">DGSN Instant Push</span>
                  </div>
                </form>
              )}

              {/* ÉTAPE DGSN 1 : EN ATTENTE DU CODE PIN SUR LE TÉLÉPHONE */}
              {campayStep === 'waiting_pin' && (
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">Retrait en cours sur votre téléphone</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Une alerte de <strong>{rechargePack.price} FCFA</strong> a été envoyée sur votre téléphone.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-semibold">
                    👉 Veuillez taper votre code secret sur votre téléphone pour valider...
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Réf de transaction : <span className="font-mono text-slate-400">{campayRef}</span>
                  </p>
                </div>
              )}

              {/* ÉTAPE DGSN 2 : VALIDATION BANCAIRE */}
              {campayStep === 'verifying' && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6 animate-pulse text-emerald-400" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">Code PIN reçu !</h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Validation finale avec l'opérateur en cours...
                    </p>
                  </div>
                </div>
              )}

              {/* ÉTAPE DGSN 3 : SUCCÈS TOTAL */}
              {campayStep === 'success' && (
                <div className="bg-slate-950 border border-emerald-500 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-emerald-400">Paiement validé avec succès !</h4>
                    <p className="text-xs text-white font-bold mt-1">
                      +{rechargePack.spins} Tour{rechargePack.spins > 1 ? 's' : ''} débloqué{rechargePack.spins > 1 ? 's' : ''} !
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Vous pouvez lancer la roue immédiatement. Bonne chance !
                  </p>
                </div>
              )}

              {/* ÉTAPE DGSN 4 : ERREUR / ANNULATION */}
              {campayStep === 'failed' && (
                <div className="bg-slate-950 border border-red-500/40 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-red-400">Paiement non finalisé</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Le code PIN n'a pas été saisi ou le solde est insuffisant.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCampayStep('idle')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
                  >
                    Réessayer
                  </button>
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

      {/* MODALE PARTAGE VIRAL */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
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

              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-center text-emerald-400 mb-1">
                Partagez & Gagnez 2 Tours Gratuits
              </h3>
              <p className="text-xs text-center text-slate-300 mb-4">
                Envoyez le lien à vos amis ou dans vos groupes WhatsApp. Dès 10 partages, 2 tours gratuits vous sont offerts !
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 mb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mb-2">
                  <span>Partages validés :</span>
                  <span className="text-sm text-emerald-400 font-black">{currentShares % 10} / 10</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((currentShares % 10) / 10) * 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-2">
                  Plus que <strong>{10 - (currentShares % 10)} partages</strong> pour débloquer vos 2 tours !
                </p>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-95 mb-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Partager sur WhatsApp
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
