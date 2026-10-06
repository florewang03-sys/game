import fs from 'fs';
import path from 'path';

// Fichier de stockage partagé (compatible serveur Node/Express et Vercel Serverless)
function getDbFilePath(): string {
  try {
    const localDataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    return path.join(localDataDir, 'wheel_database.json');
  } catch (e) {
    return '/tmp/wheel_database.json';
  }
}

interface GameState {
  players: Record<string, any>;
  recharges: any[];
  shareRewards: any[];
  withdraws: any[];
}

let inMemoryState: GameState = {
  players: {},
  recharges: [],
  shareRewards: [],
  withdraws: []
};

function loadState(): GameState {
  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      inMemoryState = JSON.parse(content);
    } else if (fs.existsSync('/tmp/wheel_database.json')) {
      const content = fs.readFileSync('/tmp/wheel_database.json', 'utf8');
      inMemoryState = JSON.parse(content);
    }
  } catch (e) {
    // Fallback mémoire
  }
  return inMemoryState;
}

function saveState(state: GameState) {
  inMemoryState = state;
  try {
    const filePath = getDbFilePath();
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    try {
      fs.writeFileSync('/tmp/wheel_database.json', JSON.stringify(state, null, 2), 'utf8');
    } catch (err) {
      // Ignore if read-only
    }
  }
}

export default async function handler(req: any, res: any) {
  // En-têtes CORS pour autoriser tous les appareils
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const state = loadState();

  if (req.method === 'GET') {
    return res.status(200).json(state);
  }

  if (req.method === 'POST') {
    const { action, payload } = req.body || {};

    // 1. Enregistrement d'un joueur
    if (action === 'save_player') {
      if (payload && payload.phone) {
        state.players[payload.phone] = {
          ...(state.players[payload.phone] || {}),
          ...payload
        };
        saveState(state);
      }
      return res.status(200).json({ success: true, players: state.players });
    }

    // 2. Soumission d'une recharge (Orange Money)
    if (action === 'submit_recharge') {
      state.recharges = [payload, ...state.recharges.filter(r => r.id !== payload.id)];
      // Créer ou enregistrer le joueur si nécessaire
      if (payload.playerPhone && !state.players[payload.playerPhone]) {
        state.players[payload.playerPhone] = {
          phone: payload.playerPhone,
          pin: '0000',
          balance: 0,
          spinsLeft: 0,
          totalSpinsPlayed: 0,
          sharesCount: 0,
          createdAt: new Date().toISOString()
        };
      }
      saveState(state);
      return res.status(200).json({ success: true, recharges: state.recharges, players: state.players });
    }

    // 3. Validation d'une recharge par Flore (Crédite automatiquement les tours !)
    if (action === 'approve_recharge') {
      const { id } = payload;
      const recharge = state.recharges.find(r => r.id === id);
      if (recharge) {
        recharge.status = 'approved';
        const spinsToAdd = Number(recharge.spins) || 1;
        const phone = recharge.playerPhone;
        if (phone) {
          if (!state.players[phone]) {
            state.players[phone] = {
              phone,
              pin: '0000',
              balance: 0,
              spinsLeft: spinsToAdd,
              totalSpinsPlayed: 0,
              sharesCount: 0,
              createdAt: new Date().toISOString()
            };
          } else {
            state.players[phone].spinsLeft = (Number(state.players[phone].spinsLeft) || 0) + spinsToAdd;
          }
        }
      }
      saveState(state);
      return res.status(200).json({ success: true, recharges: state.recharges, players: state.players });
    }

    // 4. Rejet d'une recharge
    if (action === 'reject_recharge') {
      const { id } = payload;
      state.recharges = state.recharges.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
      saveState(state);
      return res.status(200).json({ success: true, recharges: state.recharges });
    }

    // 5. Soumission d'un partage à 10 amis
    if (action === 'submit_share') {
      state.shareRewards = [payload, ...state.shareRewards.filter(s => s.id !== payload.id)];
      saveState(state);
      return res.status(200).json({ success: true, shareRewards: state.shareRewards });
    }

    // 6. Validation d'un partage par Flore (Crédite 1 tour gratuit !)
    if (action === 'approve_share') {
      const { id } = payload;
      const share = state.shareRewards.find(s => s.id === id);
      if (share) {
        share.status = 'approved';
        const spinsToAdd = Number(share.spinsReward) || 1;
        const phone = share.playerPhone;
        if (phone) {
          if (!state.players[phone]) {
            state.players[phone] = {
              phone,
              pin: '0000',
              balance: 0,
              spinsLeft: spinsToAdd,
              totalSpinsPlayed: 0,
              sharesCount: 0,
              createdAt: new Date().toISOString()
            };
          } else {
            state.players[phone].spinsLeft = (Number(state.players[phone].spinsLeft) || 0) + spinsToAdd;
            state.players[phone].sharesCount = 0;
          }
        }
      }
      saveState(state);
      return res.status(200).json({ success: true, shareRewards: state.shareRewards, players: state.players });
    }

    // 7. Rejet d'un partage
    if (action === 'reject_share') {
      const { id } = payload;
      state.shareRewards = state.shareRewards.map(s => s.id === id ? { ...s, status: 'rejected' } : s);
      saveState(state);
      return res.status(200).json({ success: true, shareRewards: state.shareRewards });
    }

    // 8. Consommation d'un tour lors d'un spin
    if (action === 'consume_spin') {
      const { phone, gain } = payload || {};
      if (phone && state.players[phone]) {
        const curSpins = Number(state.players[phone].spinsLeft) || 0;
        state.players[phone].spinsLeft = Math.max(0, curSpins - 1);
        state.players[phone].totalSpinsPlayed = (Number(state.players[phone].totalSpinsPlayed) || 0) + 1;
        if (gain !== undefined) {
          state.players[phone].balance = (Number(state.players[phone].balance) || 0) + Number(gain);
        }
        saveState(state);
      }
      return res.status(200).json({ success: true, players: state.players });
    }

    // 9. Demande de retrait
    if (action === 'submit_withdraw') {
      state.withdraws = [payload, ...state.withdraws.filter(w => w.id !== payload.id)];
      if (payload.playerPhone && state.players[payload.playerPhone]) {
        state.players[payload.playerPhone].balance = 0;
      }
      saveState(state);
      return res.status(200).json({ success: true, withdraws: state.withdraws, players: state.players });
    }

    // 10. Confirmation de retrait effectué
    if (action === 'complete_withdraw') {
      const { id } = payload;
      state.withdraws = state.withdraws.map(w => w.id === id ? { ...w, status: 'completed' } : w);
      saveState(state);
      return res.status(200).json({ success: true, withdraws: state.withdraws });
    }

    return res.status(400).json({ error: 'Action non reconnue' });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
