// Serverless API pour CamPay
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    return res.status(500).json({ success: false, error: error.message });
  }
}
