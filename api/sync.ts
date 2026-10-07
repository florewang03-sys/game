import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// =============================================================================
//  LA ROUE D'OR 237 — SERVEUR (api/sync.ts)
//
//  • Sur Vercel  : les données sont dans UPSTASH REDIS (une seule copie partagée).
//  • En local    : les données sont dans le fichier data/wheel_database.json.
//  • Le serveur est l'unique source de vérité : il tire les lots, crédite et
//    décompte les tours, calcule les retraits. Le téléphone du joueur ne décide de rien.
// =============================================================================

interface GameState {
  players: Record<string, any>;
  recharges: any[];
  shareRewards: any[];
  withdraws: any[];
}

const emptyState = (): GameState => ({ players: {}, recharges: [], shareRewards: [], withdraws: [] });

function normalizeState(raw: any): GameState {
  const s = emptyState();
  if (raw && typeof raw === 'object') {
    if (raw.players && typeof raw.players === 'object') s.players = raw.players;
    if (Array.isArray(raw.recharges)) s.recharges = raw.recharges;
    if (Array.isArray(raw.shareRewards)) s.shareRewards = raw.shareRewards;
    if (Array.isArray(raw.withdraws)) s.withdraws = raw.withdraws;
  }
  return s;
}

// -----------------------------------------------------------------------------
//  Réglages (modifiables dans les variables d'environnement de Vercel)
// -----------------------------------------------------------------------------
const MAX_SPINS_PER_VALIDATION = 100; // plafond de tours débloqués en une seule validation
const MAX_FREE_BALANCE = 500;         // seul gain autorisé avant inscription (le tour gratuit)
const MAX_PENDING_RECHARGES = 3;      // demandes de dépôt en attente par joueur
const MAX_SCREENSHOT_CHARS = 900_000; // taille max d'une capture (après compression côté téléphone)
const KEEP_HISTORY = 1000;            // nombre de demandes terminées conservées par liste
const SHOT_TTL_DAYS = Math.max(1, Number(process.env.SHOT_TTL_DAYS) || 30); // durée de conservation des captures
const MIN_WITHDRAW = Math.max(1, Number(process.env.MIN_WITHDRAW) || 100);   // plancher serveur du retrait

// 🔐 Code administrateur (variable ADMIN_PIN dans Vercel, sinon 2026)
const ADMIN_PIN = String(process.env.ADMIN_PIN || '2026');
const MAX_PIN_FAILS = 10; // essais ratés autorisés par adresse IP (15 minutes)
const ADMIN_ACTIONS = [
  'approve_recharge', 'reject_recharge',
  'approve_share', 'reject_share',
  'complete_withdraw', 'admin_set_spins'
];

// 🎡 Table des lots — TIRAGE FAIT ICI, PAR LE SERVEUR. L'ordre des cases n'a pas d'importance :
// le jeu retrouve la case à partir de la valeur. Le total des pourcentages doit faire 100.
const WHEEL: { value: number; p: number }[] = [
  { value: 50, p: 34.7 },
  { value: 0, p: 27 },
  { value: 100, p: 18 },
  { value: 250, p: 10 },
  { value: 500, p: 5 },
  { value: 1000, p: 3.5 },
  { value: 5000, p: 1.7 },
  { value: 10000, p: 0.1 }
];

function drawPrize(): number {
  const roll = crypto.randomInt(0, 1_000_000) / 10_000; // 0.0000 → 99.9999
  const total = WHEEL.reduce((a, w) => a + w.p, 0);
  const target = (roll / 100) * total;
  let acc = 0;
  for (const w of WHEEL) {
    acc += w.p;
    if (target < acc) return w.value;
  }
  return WHEEL[WHEEL.length - 1].value;
}

// -----------------------------------------------------------------------------
//  Petits outils
// -----------------------------------------------------------------------------
function toInt(value: any, fallback = 0): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}
const isPhone = (v: any): v is string => typeof v === 'string' && /^\+?\d{8,15}$/.test(v);
const isId = (v: any): v is string => typeof v === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(v);
const nowTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala' });
const nowDate = () => new Date().toLocaleDateString('fr-FR', { timeZone: 'Africa/Douala' });

function ensurePlayer(state: GameState, phone: string) {
  if (!state.players[phone]) {
    state.players[phone] = {
      phone,
      pin: '0000',
      registeredAt: nowDate(),
      createdAt: new Date().toISOString(),
      balance: 0,
      spinsLeft: 0,
      totalSpinsPlayed: 0,
      sharesCount: 0,
      adsSeen: 0
    };
  }
  return state.players[phone];
}

// Ce que le public (un joueur) a le droit de voir : UNIQUEMENT ses propres données.
function publicView(state: GameState, phone?: string) {
  if (!isPhone(phone)) return emptyState();
  const p = state.players[phone];
  return {
    players: p ? { [phone]: p } : {},
    recharges: state.recharges.filter(r => r.playerPhone === phone),
    shareRewards: state.shareRewards.filter(s => s.playerPhone === phone),
    withdraws: state.withdraws.filter(w => w.playerPhone === phone)
  };
}

// On garde toutes les demandes en attente + les 1000 dernières terminées (évite que la base grossisse sans fin)
function trimList(list: any[], pendingStatus: string): any[] {
  const pending = list.filter(x => x.status === pendingStatus);
  const done = list.filter(x => x.status !== pendingStatus).slice(0, KEEP_HISTORY);
  const keepIds = new Set([...pending, ...done].map(x => x.id));
  return list.filter(x => keepIds.has(x.id));
}
function trimState(state: GameState) {
  state.recharges = trimList(state.recharges, 'pending');
  state.shareRewards = trimList(state.shareRewards, 'pending');
  state.withdraws = trimList(state.withdraws, 'pending');
}

// -----------------------------------------------------------------------------
//  Stockage : Redis (Vercel) ou fichier (local)
// -----------------------------------------------------------------------------
interface Store {
  load(): Promise<GameState>;
  save(state: GameState): Promise<void>;
  withLock<T>(fn: () => Promise<T>): Promise<T>;
  putShot(key: string, data: string): Promise<void>;
  getShot(key: string): Promise<string | null>;
  failCount(ip: string): Promise<number>;
  addFail(ip: string): Promise<void>;
}

class BusyError extends Error {}
class NoDbError extends Error {}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function createRedisStore(url: string, token: string): Promise<Store> {
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({ url, token });
  const STATE_KEY = 'wheel:state';
  const LOCK_KEY = 'wheel:lock';

  return {
    async load() {
      const raw: any = await redis.get(STATE_KEY);
      return normalizeState(typeof raw === 'string' ? JSON.parse(raw) : raw);
    },
    async save(state) {
      await redis.set(STATE_KEY, state);
    },
    // Verrou : deux actions au même instant (ex. deux validations) passent l'une après l'autre.
    async withLock(fn) {
      const token = 't_' + crypto.randomBytes(12).toString('hex');
      let acquired = false;
      for (let i = 0; i < 50 && !acquired; i++) {
        const ok = await redis.set(LOCK_KEY, token, { nx: true, px: 8000 });
        if (ok) acquired = true;
        else await sleep(60 + Math.floor(Math.random() * 80));
      }
      if (!acquired) throw new BusyError();
      try {
        return await fn();
      } finally {
        try {
          const cur = await redis.get(LOCK_KEY);
          if (cur === token) await redis.del(LOCK_KEY);
        } catch (e) { /* le verrou expire tout seul après 8 s */ }
      }
    },
    async putShot(key, data) {
      await redis.set('wheel:shot:' + key, data, { ex: SHOT_TTL_DAYS * 86400 });
    },
    async getShot(key) {
      const v: any = await redis.get('wheel:shot:' + key);
      return typeof v === 'string' ? v : null;
    },
    async failCount(ip) {
      const v: any = await redis.get('wheel:fail:' + ip);
      return toInt(v);
    },
    async addFail(ip) {
      const n = await redis.incr('wheel:fail:' + ip);
      if (n === 1) await redis.expire('wheel:fail:' + ip, 900);
    }
  };
}

function createFileStore(): Store {
  const dir = path.join(process.cwd(), 'data');
  const dbFile = path.join(dir, 'wheel_database.json');
  const shotFile = path.join(dir, 'wheel_shots.json');
  const ensureDir = () => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
  const readJson = (file: string, fallback: any) => {
    try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; } catch (e) { return fallback; }
  };
  let chain: Promise<any> = Promise.resolve();
  const fails = new Map<string, number>();

  return {
    async load() { return normalizeState(readJson(dbFile, null)); },
    async save(state) { ensureDir(); fs.writeFileSync(dbFile, JSON.stringify(state, null, 2), 'utf8'); },
    withLock(fn) {
      const run = chain.then(fn, fn);
      chain = run.catch(() => undefined);
      return run;
    },
    async putShot(key, data) {
      ensureDir();
      const shots = readJson(shotFile, {});
      const limit = Date.now() - SHOT_TTL_DAYS * 86400000;
      for (const k of Object.keys(shots)) if (shots[k].t < limit) delete shots[k];
      shots[key] = { t: Date.now(), d: data };
      fs.writeFileSync(shotFile, JSON.stringify(shots), 'utf8');
    },
    async getShot(key) { const s = readJson(shotFile, {})[key]; return s ? s.d : null; },
    async failCount(ip) { return fails.get(ip) || 0; },
    async addFail(ip) { fails.set(ip, (fails.get(ip) || 0) + 1); (setTimeout(() => fails.delete(ip), 900000) as any).unref?.(); }
  };
}

let storePromise: Promise<Store> | null = null;
function getStore(): Promise<Store> {
  if (!storePromise) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (url && token) {
      storePromise = createRedisStore(url, token);
    } else if (process.env.VERCEL) {
      // Sur Vercel, un fichier n'est PAS fiable (plusieurs copies, effacé à tout moment) : on refuse plutôt que de mentir.
      return Promise.reject(new NoDbError());
    } else {
      storePromise = Promise.resolve(createFileStore());
    }
  }
  return storePromise;
}

// -----------------------------------------------------------------------------
//  Code administrateur
// -----------------------------------------------------------------------------
function clientIp(req: any): string {
  const xf = req.headers?.['x-forwarded-for'];
  return String((Array.isArray(xf) ? xf[0] : xf) || req.socket?.remoteAddress || 'inconnue').split(',')[0].trim();
}

function pinMatches(sent: any): boolean {
  if (typeof sent !== 'string') return false;
  const a = Buffer.from(sent.trim());
  const b = Buffer.from(ADMIN_PIN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// 'ok' = code correct | 'denied' = absent ou faux | 'blocked' = trop d'essais ratés depuis cette adresse
async function checkAdmin(req: any, store: Store): Promise<'ok' | 'denied' | 'blocked'> {
  const ip = clientIp(req);
  if (pinMatches(req.headers?.['x-admin-pin'])) {
    return (await store.failCount(ip)) >= MAX_PIN_FAILS ? 'blocked' : 'ok';
  }
  await store.addFail(ip);
  return (await store.failCount(ip)) >= MAX_PIN_FAILS ? 'blocked' : 'denied';
}

// -----------------------------------------------------------------------------
//  Actions
// -----------------------------------------------------------------------------
type Result = { status: number; body: any; dirty?: boolean };
const fail = (status: number, error: string): Result => ({ status, body: { success: false, error } });

async function saveScreenshot(store: Store, kind: 'r' | 's', id: string, data: any): Promise<boolean | 'too_big'> {
  if (typeof data !== 'string' || !data.startsWith('data:image/')) return false;
  if (data.length > MAX_SCREENSHOT_CHARS) return 'too_big';
  await store.putShot(`${kind}:${id}`, data);
  return true;
}

async function applyAction(state: GameState, action: string, payload: any, store: Store): Promise<Result> {
  payload = payload || {};

  // 1. Enregistrement d'un joueur (inscription après le tour gratuit)
  // Le joueur ne peut JAMAIS fixer ses tours ni son solde : seul le serveur les modifie.
  if (action === 'save_player') {
    if (!isPhone(payload.phone)) return fail(400, 'Numéro invalide');
    const existing = state.players[payload.phone];
    if (existing) {
      existing.sharesCount = Math.max(0, toInt(payload.sharesCount, existing.sharesCount));
      existing.adsSeen = Math.max(0, toInt(payload.adsSeen, existing.adsSeen));
      if (payload.adClicks !== undefined) existing.adClicks = Math.max(0, toInt(payload.adClicks));
    } else {
      state.players[payload.phone] = {
        phone: payload.phone,
        pin: '0000',
        registeredAt: nowDate(),
        createdAt: new Date().toISOString(),
        balance: Math.min(MAX_FREE_BALANCE, Math.max(0, toInt(payload.balance))), // seulement le gain du tour gratuit
        spinsLeft: 0,
        totalSpinsPlayed: 1,
        sharesCount: 0,
        adsSeen: Math.max(0, toInt(payload.adsSeen))
      };
    }
    return { status: 200, body: { success: true, ...publicView(state, payload.phone) }, dirty: true };
  }

  // 2. Demande de dépôt (Orange Money) : toujours enregistrée "en attente"
  if (action === 'submit_recharge') {
    if (!isId(payload.id) || !isPhone(payload.playerPhone)) return fail(400, 'Demande invalide');
    if (!state.recharges.some(r => r.id === payload.id)) {
      const pendingCount = state.recharges.filter(r => r.playerPhone === payload.playerPhone && r.status === 'pending').length;
      if (pendingCount >= MAX_PENDING_RECHARGES) return fail(429, 'Trop de demandes en attente');
      const shot = await saveScreenshot(store, 'r', payload.id, payload.screenshotUrl);
      if (shot === 'too_big') return fail(413, 'Capture trop lourde');
      state.recharges = [
        {
          id: payload.id,
          playerPhone: payload.playerPhone,
          amount: Math.min(1_000_000, Math.max(0, toInt(payload.amount))),
          spins: Math.min(MAX_SPINS_PER_VALIDATION, Math.max(1, toInt(payload.spins, 1))),
          date: String(payload.date || nowTime()).slice(0, 40),
          hasScreenshot: shot === true,
          status: 'pending'
        },
        ...state.recharges
      ];
      ensurePlayer(state, payload.playerPhone);
    }
    return { status: 200, body: { success: true, ...publicView(state, payload.playerPhone) }, dirty: true };
  }

  // 3. Validation d'un dépôt par Flore (code admin)
  // Flore choisit le NOMBRE DE TOURS. Crédité UNE SEULE FOIS (une demande déjà traitée est ignorée).
  if (action === 'approve_recharge') {
    const recharge = state.recharges.find(r => r.id === payload.id);
    if (recharge && recharge.status === 'pending') {
      const chosen = toInt(payload.spins, 0);
      const spinsToAdd = Math.min(MAX_SPINS_PER_VALIDATION, chosen >= 1 ? chosen : Math.max(1, toInt(recharge.spins, 1)));
      recharge.status = 'approved';
      recharge.spins = spinsToAdd;
      recharge.approvedAt = new Date().toISOString();
      const player = ensurePlayer(state, recharge.playerPhone);
      player.spinsLeft = Math.max(0, toInt(player.spinsLeft)) + spinsToAdd;
    }
    return { status: 200, body: { success: true, recharges: state.recharges, players: state.players }, dirty: true };
  }

  // 4. Refus d'un dépôt (uniquement s'il est encore en attente)
  if (action === 'reject_recharge') {
    state.recharges = state.recharges.map(r => (r.id === payload.id && r.status === 'pending') ? { ...r, status: 'rejected' } : r);
    return { status: 200, body: { success: true, recharges: state.recharges }, dirty: true };
  }

  // 5. Demande de récompense de partage (10 personnes)
  if (action === 'submit_share') {
    if (!isId(payload.id) || !isPhone(payload.playerPhone)) return fail(400, 'Demande invalide');
    if (!state.shareRewards.some(s => s.id === payload.id)) {
      if (state.shareRewards.some(s => s.playerPhone === payload.playerPhone && s.status === 'pending')) {
        return fail(429, 'Une demande de partage est déjà en attente');
      }
      const shot = await saveScreenshot(store, 's', payload.id, payload.screenshotUrl);
      if (shot === 'too_big') return fail(413, 'Capture trop lourde');
      state.shareRewards = [
        {
          id: payload.id,
          playerPhone: payload.playerPhone,
          sharesCount: Math.max(0, toInt(payload.sharesCount)),
          spinsReward: 1,
          date: String(payload.date || nowTime()).slice(0, 40),
          hasScreenshot: shot === true,
          status: 'pending'
        },
        ...state.shareRewards
      ];
    }
    return { status: 200, body: { success: true, ...publicView(state, payload.playerPhone) }, dirty: true };
  }

  // 6. Validation d'un partage (crédite le tour gratuit UNE SEULE FOIS)
  if (action === 'approve_share') {
    const share = state.shareRewards.find(s => s.id === payload.id);
    if (share && share.status === 'pending') {
      const spinsToAdd = Math.min(MAX_SPINS_PER_VALIDATION, Math.max(1, toInt(share.spinsReward, 1)));
      share.status = 'approved';
      const player = ensurePlayer(state, share.playerPhone);
      player.spinsLeft = Math.max(0, toInt(player.spinsLeft)) + spinsToAdd;
      player.sharesCount = 0;
    }
    return { status: 200, body: { success: true, shareRewards: state.shareRewards, players: state.players }, dirty: true };
  }

  // 7. Refus d'un partage
  if (action === 'reject_share') {
    state.shareRewards = state.shareRewards.map(s => (s.id === payload.id && s.status === 'pending') ? { ...s, status: 'rejected' } : s);
    return { status: 200, body: { success: true, shareRewards: state.shareRewards }, dirty: true };
  }

  // 8. 🎡 TOUR DE ROUE : le SERVEUR décompte le tour ET tire le lot. Le joueur ne choisit rien.
  if (action === 'spin') {
    if (!isPhone(payload.phone) || !state.players[payload.phone]) {
      return { status: 200, body: { success: false, error: 'unknown_player' } };
    }
    const player = state.players[payload.phone];
    const spins = toInt(player.spinsLeft);
    if (spins <= 0) {
      return { status: 200, body: { success: false, error: 'no_spins', player } };
    }
    // Plafond de tours PAR JOUR (réglage de Flore dans le tableau de bord) : on compte les tours d'aujourd'hui seulement
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Douala' });
    if (player.dayKey !== today) {
      player.dayKey = today;
      player.daySpins = 0;
    }
    const maxPerDay = Math.min(1000, toInt(payload.maxPerDay, 0));
    if (maxPerDay >= 1 && toInt(player.daySpins) >= maxPerDay) {
      return { status: 200, body: { success: false, error: 'daily_limit', player } };
    }
    player.daySpins = toInt(player.daySpins) + 1;

    const win = drawPrize();
    player.spinsLeft = spins - 1;
    player.totalSpinsPlayed = toInt(player.totalSpinsPlayed) + 1;
    player.balance = toInt(player.balance) + win;
    return { status: 200, body: { success: true, win, player }, dirty: true };
  }

  // 9. 💸 DEMANDE DE RETRAIT : le montant est calculé par le SERVEUR (tout le solde), jamais envoyé par le téléphone.
  if (action === 'submit_withdraw') {
    if (!isPhone(payload.playerPhone) || !state.players[payload.playerPhone]) return fail(400, 'Joueur inconnu');
    const player = state.players[payload.playerPhone];
    const amount = toInt(player.balance);
    if (amount < MIN_WITHDRAW) {
      return { status: 200, body: { success: false, error: 'below_min', player } };
    }
    const withdraw = {
      id: 'W' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
      playerPhone: payload.playerPhone,
      amount,
      date: nowTime(),
      status: 'pending'
    };
    player.balance = 0;
    state.withdraws = [withdraw, ...state.withdraws];
    return { status: 200, body: { success: true, withdraw, player }, dirty: true };
  }

  // 10. Retrait payé (code admin)
  if (action === 'complete_withdraw') {
    state.withdraws = state.withdraws.map(w => (w.id === payload.id && w.status === 'pending') ? { ...w, status: 'completed' } : w);
    return { status: 200, body: { success: true, withdraws: state.withdraws }, dirty: true };
  }

  // 11. Ajustement manuel du nombre de tours d'un joueur (code admin)
  if (action === 'admin_set_spins') {
    const n = toInt(payload.spins, -1);
    if (!isPhone(payload.phone) || !state.players[payload.phone] || n < 0 || n > 1000) return fail(400, 'Ajustement invalide');
    state.players[payload.phone].spinsLeft = n;
    return { status: 200, body: { success: true, players: state.players }, dirty: true };
  }

  return fail(400, 'Action non reconnue');
}

// -----------------------------------------------------------------------------
//  Point d'entrée
// -----------------------------------------------------------------------------
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const store = await getStore();

    // ---------- LECTURE ----------
    if (req.method === 'GET') {
      const isAdminCall = typeof req.headers?.['x-admin-pin'] === 'string' && req.headers['x-admin-pin'] !== '';
      const adminState = isAdminCall ? await checkAdmin(req, store) : 'denied';

      // Capture d'écran d'un paiement : réservée à Flore
      const shotKey = req.query?.shot;
      if (typeof shotKey === 'string') {
        if (adminState !== 'ok' || !/^[rs]:[A-Za-z0-9_-]{1,40}$/.test(shotKey)) {
          return res.status(adminState === 'blocked' ? 429 : 401).json({ error: 'Code administrateur requis' });
        }
        return res.status(200).json({ screenshotUrl: await store.getShot(shotKey) });
      }

      const state = await store.load();
      if (adminState === 'ok') return res.status(200).json(state);
      if (adminState === 'blocked') return res.status(429).json({ error: 'Trop d\'essais, réessayez dans 15 minutes' });
      // Public : seulement les données du joueur demandé (jamais la liste des autres numéros)
      return res.status(200).json(publicView(state, typeof req.query?.phone === 'string' ? req.query.phone : undefined));
    }

    // ---------- ÉCRITURE ----------
    if (req.method === 'POST') {
      const { action, payload } = req.body || {};
      if (typeof action !== 'string') return res.status(400).json({ success: false, error: 'Action manquante' });

      // 🔐 Valider, refuser, ajuster, payer : code administrateur obligatoire
      if (ADMIN_ACTIONS.includes(action)) {
        const check = await checkAdmin(req, store);
        if (check === 'blocked') return res.status(429).json({ success: false, error: 'Trop d\'essais, réessayez dans 15 minutes' });
        if (check !== 'ok') return res.status(401).json({ success: false, error: 'Code administrateur requis' });
      }

      // Une action à la fois : chargement → modification → sauvegarde, sous verrou
      const result = await store.withLock(async () => {
        const state = await store.load();
        const r = await applyAction(state, action, payload, store);
        if (r.dirty) {
          trimState(state);
          await store.save(state);
        }
        return r;
      });
      return res.status(result.status).json(result.body);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (e: any) {
    if (e instanceof NoDbError) {
      return res.status(503).json({ success: false, error: 'Base de données non configurée (Upstash Redis)' });
    }
    if (e instanceof BusyError) {
      return res.status(503).json({ success: false, error: 'Serveur occupé, réessayez' });
    }
    console.error('sync error:', e);
    return res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
}
