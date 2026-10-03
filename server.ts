import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json());

const PORT = 3000;

// Cache du token Campay en mémoire
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getCampayAuthToken(username: string, password: string, environment: string) {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const baseUrl = environment === 'live' 
    ? 'https://campay.net/api/token/' 
    : 'https://demo.campay.net/api/token/';

  const resp = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Erreur authentification CamPay: ${err}`);
  }

  const data = await resp.json();
  cachedToken = data.token;
  tokenExpiresAt = now + (3500 * 1000); // 1h environ
  return cachedToken;
}

// 1. Route pour lancer la collecte (retrait mobile direct)
app.post('/api/campay/collect', async (req, res) => {
  try {
    const { amount, fromPhone, description, externalReference, appUsername, appPassword, environment } = req.body;
    
    const username = appUsername || 'LFbmOSkPsZXBBG87GVzEZ13qJJAadf2AgZ6KSAOO8cdGLehh_xLaWqecs67nGNQfSfe0tOML2wJWywDL2zBx4Q';
    const password = appPassword || 'XJouq4qlr2CLdnfa770K2_WcQqX1KgCWoKGDfU8GSIwCXirb1ndrFQ57nKcM2Btf8PfvhB0EhI2PYV18bPcImg';
    const env = environment || 'demo';

    let cleanPhone = (fromPhone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('237')) {
      cleanPhone = '237' + cleanPhone;
    }

    const token = await getCampayAuthToken(username, password, env);

    const baseUrl = env === 'live'
      ? 'https://campay.net/api/collect/'
      : 'https://demo.campay.net/api/collect/';

    const collectResp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'XAF',
        from: cleanPhone,
        description: description || `Roue d'Or 237 - ${amount} FCFA`,
        external_reference: externalReference || `ROUE-${Date.now()}`
      })
    });

    const data = await collectResp.json();
    if (!collectResp.ok) {
      return res.status(400).json({ success: false, error: data });
    }

    return res.json({
      success: true,
      reference: data.reference,
      ussd_code: data.ussd_code,
      operator: data.operator
    });
  } catch (error: any) {
    console.error('API /api/campay/collect error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Route pour vérifier le statut de la transaction (si le client a tapé son code PIN)
app.get('/api/campay/status/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const env = (req.query.environment as string) || 'demo';
    const username = (req.query.username as string) || 'LFbmOSkPsZXBBG87GVzEZ13qJJAadf2AgZ6KSAOO8cdGLehh_xLaWqecs67nGNQfSfe0tOML2wJWywDL2zBx4Q';
    const password = (req.query.password as string) || 'XJouq4qlr2CLdnfa770K2_WcQqX1KgCWoKGDfU8GSIwCXirb1ndrFQ57nKcM2Btf8PfvhB0EhI2PYV18bPcImg';

    const token = await getCampayAuthToken(username, password, env);

    const baseUrl = env === 'live'
      ? `https://campay.net/api/transaction/${reference}/`
      : `https://demo.campay.net/api/transaction/${reference}/`;

    const statusResp = await fetch(baseUrl, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await statusResp.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

async function start() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}`);
  });
}

start();
