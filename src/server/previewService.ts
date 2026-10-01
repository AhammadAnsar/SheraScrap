import crypto from 'crypto';

const localPreviewSecret = crypto.randomBytes(32).toString('hex');
export function previewSecret(): string {
  if (process.env.PREVIEW_SECRET) return process.env.PREVIEW_SECRET;
  // A domain-separated key avoids another mandatory deployment secret when
  // Firebase's server key is already configured. Never expose the original key.
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try { privateKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON).private_key; } catch {}
  }
  if (privateKey) return crypto.createHmac('sha256', privateKey.replace(/\\n/g, '\n')).update('shera-scrap:content-preview:v1').digest('hex');
  return localPreviewSecret;
}

export interface PreviewTokenPayload {
  entityType: 'post' | 'page';
  entityIdOrSlug: string;
  userEmail: string;
  exp: number; // timestamp in ms
}

/**
 * Generate a cryptographically signed, time-limited preview token (1 hour)
 */
export function generatePreviewToken(
  entityType: 'post' | 'page',
  entityIdOrSlug: string,
  userEmail: string
): string {
  const payload: PreviewTokenPayload = {
    entityType,
    entityIdOrSlug,
    userEmail,
    exp: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', previewSecret());
  hmac.update(payloadB64);
  const sig = hmac.digest('base64url');

  return `${payloadB64}.${sig}`;
}

/**
 * Verify a preview token against requested entity
 */
export function verifyPreviewToken(
  token: string,
  expectedType: 'post' | 'page',
  expectedIdOrSlug: string
): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, sig] = parts;

  // Recompute signature
  const hmac = crypto.createHmac('sha256', previewSecret());
  hmac.update(payloadB64);
  const expectedSig = hmac.digest('base64url');

  if (sig.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return false;
  }

  try {
    const raw = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: PreviewTokenPayload = JSON.parse(raw);

    // Check expiration
    if (Date.now() > payload.exp) {
      return false;
    }

    // Check type match
    if (payload.entityType !== expectedType) {
      return false;
    }

    // Check entity ID or slug match (flexible for either id or slug)
    if (payload.entityIdOrSlug !== expectedIdOrSlug) return false;

    return true;
  } catch {
    return false;
  }
}
