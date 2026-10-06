import { PlayerAccount, RechargeRequest, WithdrawRequest, ShareRewardRequest } from '../components/LuckyWheelApp';

export interface SyncData {
  players: Record<string, PlayerAccount>;
  recharges: RechargeRequest[];
  shareRewards: ShareRewardRequest[];
  withdraws: WithdrawRequest[];
}

export async function fetchRemoteSync(): Promise<SyncData | null> {
  try {
    const res = await fetch('/api/sync');
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

export async function sendRemoteAction(action: string, payload: any): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        if (data.recharges) localStorage.setItem('pending_recharges', JSON.stringify(data.recharges));
        if (data.shareRewards) localStorage.setItem('pending_share_rewards', JSON.stringify(data.shareRewards));
        if (data.withdraws) localStorage.setItem('pending_withdraws', JSON.stringify(data.withdraws));
        if (data.players) localStorage.setItem('all_players', JSON.stringify(data.players));
      }
      return { success: true, data };
    }
  } catch (err) {
    console.warn("Échec d'envoi réseau sync:", err);
  }
  return { success: false };
}
