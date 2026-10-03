import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  tokenExpiresAt = now + (3500 * 1000);
  return cachedToken;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const reference = (req.query.reference as string) || '';
    const env = (req.query.environment as string) || 'demo';
    const username = (req.query.username as string) || 'LFbmOSkPsZXBBG87GVzEZ13qJJAadf2AgZ6KSAOO8cdGLehh_xLaWqecs67nGNQfSfe0tOML2wJWywDL2zBx4Q';
    const password = (req.query.password as string) || 'XJouq4qlr2CLdnfa770K2_WcQqX1KgCWoKGDfU8GSIwCXirb1ndrFQ57nKcM2Btf8PfvhB0EhI2PYV18bPcImg';

    if (!reference) {
      return res.status(400).json({ error: 'Missing reference' });
    }

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
}
