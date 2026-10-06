/**
 * Client API CamPay connecté au serveur Proxy (Compatible Dev & Vercel)
 * Ne crédite JAMAIS sans confirmation bancaire de l'opérateur (Orange / MTN)
 */

export interface CampayCredentials {
  appUsername: string;
  appPassword: string;
  environment: 'demo' | 'live';
}

export interface CollectPaymentParams {
  amount: number;
  fromPhone: string;
  description: string;
  externalReference?: string;
}

export interface CollectPaymentResponse {
  success: boolean;
  reference?: string;
  ussdCode?: string;
  operator?: string;
  message?: string;
  error?: string;
}

export interface TransactionStatusResponse {
  reference: string;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  amount: number;
  operator?: string;
  code?: string;
  reason?: string;
}

export const DEFAULT_CAMPAY_CREDENTIALS: CampayCredentials = {
  appUsername: 'LFbmOSkPsZXBBG87GVzEZ13qJJAadf2AgZ6KSAOO8cdGLehh_xLaWqecs67nGNQfSfe0tOML2wJWywDL2zBx4Q',
  appPassword: 'XJouq4qlr2CLdnfa770K2_WcQqX1KgCWoKGDfU8GSIwCXirb1ndrFQ57nKcM2Btf8PfvhB0EhI2PYV18bPcImg',
  environment: 'demo'
};

export function getCampayCredentials(): CampayCredentials {
  const saved = localStorage.getItem('campay_credentials');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return DEFAULT_CAMPAY_CREDENTIALS;
}

export function saveCampayCredentials(creds: CampayCredentials) {
  localStorage.setItem('campay_credentials', JSON.stringify(creds));
}

export function formatCameroonPhone(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('237') && clean.length === 12) {
    return clean;
  }
  if (clean.length === 9) {
    return '237' + clean;
  }
  return clean;
}

export function detectCameroonOperator(phone: string): 'orange' | 'mtn' | 'unknown' {
  const clean = phone.replace(/[^0-9]/g, '');
  const local9 = clean.startsWith('237') ? clean.slice(3) : clean;
  if (local9.startsWith('69') || local9.startsWith('655') || local9.startsWith('656') || local9.startsWith('657') || local9.startsWith('658') || local9.startsWith('659')) {
    return 'orange';
  }
  if (local9.startsWith('67') || local9.startsWith('650') || local9.startsWith('651') || local9.startsWith('652') || local9.startsWith('653') || local9.startsWith('654') || local9.startsWith('68')) {
    return 'mtn';
  }
  return 'unknown';
}

/**
 * 1. Envoie la VRAIE requête de débit au serveur (qui contacte Orange / MTN)
 */
export async function requestCampayCollect(params: CollectPaymentParams): Promise<CollectPaymentResponse> {
  const creds = getCampayCredentials();
  const formattedPhone = formatCameroonPhone(params.fromPhone);

  const payload = {
    amount: params.amount,
    fromPhone: formattedPhone,
    description: params.description,
    externalReference: params.externalReference,
    appUsername: creds.appUsername,
    appPassword: creds.appPassword,
    environment: creds.environment
  };

  // Tenter l'endpoint Express ou la fonction serverless Vercel
  const endpoints = ['/api/campay/collect', '/api/campay-collect'];
  let lastErrorMessage = '';

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          reference: data.reference,
          ussdCode: data.ussd_code,
          operator: data.operator,
          message: 'Demande de débit envoyée sur votre téléphone'
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn(`Erreur sur ${endpoint}:`, errData);
        if (errData && typeof errData === 'object') {
          if (errData.error) {
            lastErrorMessage = typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error);
          } else if (errData.message) {
            lastErrorMessage = errData.message;
          }
        }
      }
    } catch (e: any) {
      console.warn(`Fetch échoué sur ${endpoint}:`, e);
      lastErrorMessage = e.message || 'Erreur réseau';
    }
  }

  // Si l'API renvoie une erreur détaillée (ex: mauvais identifiants ou compte demo), la transmettre clairement
  const detailedError = lastErrorMessage 
    ? `Échec de l'envoi : ${lastErrorMessage}` 
    : "Impossible d'initier la demande avec l'opérateur. Vérifiez vos clés CamPay ou utilisez le code USSD direct.";
  throw new Error(detailedError);
}

/**
 * 2. Vérification STRICTE du statut réel auprès de CamPay
 * Bloque tant que le joueur n'a pas tapé son code secret PIN
 */
export async function checkCampayTransactionStatus(reference: string): Promise<TransactionStatusResponse> {
  const creds = getCampayCredentials();

  const endpoints = [
    `/api/campay/status/${reference}?environment=${creds.environment}&username=${encodeURIComponent(creds.appUsername)}&password=${encodeURIComponent(creds.appPassword)}`,
    `/api/campay-status?reference=${reference}&environment=${creds.environment}&username=${encodeURIComponent(creds.appUsername)}&password=${encodeURIComponent(creds.appPassword)}`
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        return {
          reference,
          status: data.status || 'PENDING',
          amount: parseFloat(data.amount) || 0,
          operator: data.operator,
          code: data.code,
          reason: data.reason
        };
      }
    } catch (e) {}
  }

  return { reference, status: 'PENDING', amount: 0 };
}
