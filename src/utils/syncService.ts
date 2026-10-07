import { PlayerAccount, RechargeRequest, WithdrawRequest, ShareRewardRequest } from '../components/LuckyWheelApp';

export interface SyncData {
  players: Record<string, PlayerAccount>;
  recharges: RechargeRequest[];
  shareRewards: ShareRewardRequest[];
  withdraws: WithdrawRequest[];
}

// Code administrateur : renseigné uniquement par le tableau de bord de Flore après connexion.
let adminPin = '';
export function setAdminPin(pin: string) {
  adminPin = pin;
}
function adminHeaders(): Record<string, string> {
  return adminPin ? { 'x-admin-pin': adminPin } : {};
}

// Joueur : on ne reçoit QUE ses propres données (on passe son numéro). Flore (code admin) reçoit tout.
export async function fetchRemoteSync(phone?: string): Promise<SyncData | null> {
  try {
    const url = phone ? `/api/sync?phone=${encodeURIComponent(phone)}` : '/api/sync';
    const res = await fetch(url, { headers: adminHeaders() });
    if (res.ok) {
      const data: SyncData = await res.json();
      if (data && typeof data === 'object') {
        // Mettre à jour le localStorage local pour mise en cache
        if (data.recharges) localStorage.setItem('pending_recharges', JSON.stringify(data.recharges));
        if (data.shareRewards) localStorage.setItem('pending_share_rewards', JSON.stringify(data.shareRewards));
        if (data.withdraws) localStorage.setItem('pending_withdraws', JSON.stringify(data.withdraws));
        if (data.players) localStorage.setItem('all_players', JSON.stringify(data.players));
        return data;
      }
    }
  } catch (err) {
    // Mode déconnecté ou local
  }
  return null;
}

// Capture d'écran d'un paiement (réservée à Flore) : kind 'r' = dépôt, 's' = partage
export async function fetchScreenshot(kind: 'r' | 's', id: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/sync?shot=${encodeURIComponent(kind + ':' + id)}`, { headers: adminHeaders() });
    if (res.ok) {
      const data = await res.json();
      return typeof data?.screenshotUrl === 'string' ? data.screenshotUrl : null;
    }
  } catch (err) {
    // ignoré
  }
  return null;
}

export async function sendRemoteAction(action: string, payload: any): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ action, payload })
    });
    let data: any = null;
    try { data = await res.json(); } catch (e) { /* réponse vide */ }
    if (res.ok) {
      if (data) {
        if (data.recharges) localStorage.setItem('pending_recharges', JSON.stringify(data.recharges));
        if (data.shareRewards) localStorage.setItem('pending_share_rewards', JSON.stringify(data.shareRewards));
        if (data.withdraws) localStorage.setItem('pending_withdraws', JSON.stringify(data.withdraws));
        if (data.players) localStorage.setItem('all_players', JSON.stringify(data.players));
      }
      return { success: true, data };
    }
    // Refus du serveur (code admin, capture trop lourde, etc.) : on garde le message pour l'afficher
    return { success: false, data };
  } catch (err) {
    console.warn("Échec d'envoi réseau sync:", err);
  }
  return { success: false };
}
