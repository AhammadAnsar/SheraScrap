import crypto from 'crypto';

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'shera_scrap_preview_secret_key_2026_authorized';

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
  const hmac = crypto.createHmac('sha256', PREVIEW_SECRET);
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
  const hmac = crypto.createHmac('sha256', PREVIEW_SECRET);
  hmac.update(payloadB64);
  const expectedSig = hmac.digest('base64url');

  if (sig !== expectedSig) {
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
    if (
      payload.entityIdOrSlug !== expectedIdOrSlug &&
      !expectedIdOrSlug.includes(payload.entityIdOrSlug) &&
      !payload.entityIdOrSlug.includes(expectedIdOrSlug)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
