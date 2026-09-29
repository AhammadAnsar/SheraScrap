import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/domain';
import { loadStore, logAuditEvent } from '../data/repository';
import firebaseConfig from '../../firebase-applet-config.json';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  permissions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  administrator: [
    'posts:*',
    'pages:*',
    'services:*',
    'locations:*',
    'categories:*',
    'tags:*',
    'media:*',
    'redirects:*',
    'settings:*',
    'inquiries:*',
    'audit:view',
    'sync:*'
  ],
  editor: [
    'posts:create',
    'posts:edit',
    'posts:publish',
    'posts:delete',
    'services:*',
    'locations:*',
    'categories:*',
    'tags:*',
    'media:upload',
    'media:delete',
    'inquiries:view',
    'inquiries:manage'
  ],
  author: [
    'posts:create',
    'posts:edit',
    'media:upload'
  ],
  viewer: [
    'content:view'
  ]
};

// Check if user has required permission
export function hasPermission(user: AuthUser, requiredPermission: string): boolean {
  if (user.role === 'super_admin' || user.permissions.includes('*')) {
    return true;
  }
  if (user.permissions.includes(requiredPermission)) {
    return true;
  }
  // Wildcard match, e.g. "posts:*" matches "posts:delete"
  const prefix = requiredPermission.split(':')[0];
  if (user.permissions.includes(`${prefix}:*`)) {
    return true;
  }
  return false;
}

// In-memory token cache for performance (valid for 5 minutes)
const tokenCache = new Map<string, { user: AuthUser; expiresAt: number }>();

/**
 * Server-side verification of Firebase ID Token
 * 1. Checks token against Google Identity Toolkit API
 * 2. Fetches authoritative user record and role from repository store
 * 3. Enforces super_admin role on canonical owner email
 */
export async function verifyIdToken(idToken: string): Promise<AuthUser | null> {
  if (!idToken || typeof idToken !== 'string') {
    return null;
  }

  const cleanToken = idToken.trim();

  // Check cache
  const cached = tokenCache.get(cleanToken);
  if (cached && cached.expiresAt > Date.now()) {
    const current = loadStore().users.find(u => u.email.toLowerCase() === cached.user.email);
    if (!current) return null;
    return { ...cached.user, role: current.role, permissions: ROLE_PERMISSIONS[current.role] || [] };
  }

  let email = '';
  let uid = '';

  if (cleanToken.startsWith('test-token:')) return null;
  {
    // 2. Authoritative verification via Google Identity Toolkit REST API
    try {
      const apiKey = firebaseConfig.apiKey || process.env.FIREBASE_API_KEY;
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: cleanToken })
      });

      if (!res.ok) {
        console.warn(`[AUTH] Google token verification failed with status ${res.status}`);
        return null;
      }

      const data = await res.json();
      if (!data.users || data.users.length === 0) {
        return null;
      }

      const googleUser = data.users[0];
      if (!googleUser.emailVerified || googleUser.disabled) return null;
      email = googleUser.email?.toLowerCase() || '';
      uid = googleUser.localId || '';
    } catch (err) {
      console.error('[AUTH] Failed to connect to Identity Toolkit:', err);
      return null;
    }
  }

  if (!email) {
    return null;
  }

  // 3. Authoritative Role & User Lookup in Server Store
  const store = loadStore();
  const matchedUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.id === uid);

  let role: UserRole = 'viewer';
  let name = matchedUser ? matchedUser.name : 'Authorized User';
  let username = matchedUser ? matchedUser.username : email.split('@')[0];

  if (!matchedUser) return null;
  role = matchedUser.role;

  const permissions = ROLE_PERMISSIONS[role] || [];

  const authUser: AuthUser = {
    id: uid,
    email,
    name,
    username,
    role,
    permissions
  };

  // Cache valid token for 5 minutes
  tokenCache.set(cleanToken, {
    user: authUser,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return authUser;
}

// Express Request Augmentation
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Middleware: Soft extract user if Authorization header is present
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (!authHeader) {
    req.user = undefined;
    return next();
  }

  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : String(authHeader).trim();

  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const user = await verifyIdToken(token);
    req.user = user || undefined;
  } catch (e) {
    req.user = undefined;
  }
  next();
}

// Middleware: Strictly require valid authenticated user
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required to perform this action',
      code: 'AUTH_REQUIRED'
    });
  }
  next();
}

// Middleware: Require specific permission string
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized: Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!hasPermission(req.user, permission)) {
      logAuditEvent({
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        entityType: 'security',
        entityId: permission,
        userId: req.user.id,
        userName: `${req.user.name} (${req.user.role})`,
        details: `Forbidden: User lacks permission '${permission}'`
      });

      return res.status(403).json({
        error: `Forbidden: Your role (${req.user.role}) does not have permission '${permission}'`,
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredPermission: permission,
        userRole: req.user.role
      });
    }

    next();
  };
}

// Middleware: Require one of specific roles
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized: Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAuditEvent({
        action: 'UNAUTHORIZED_ROLE_ACCESS',
        entityType: 'security',
        entityId: req.originalUrl,
        userId: req.user.id,
        userName: `${req.user.name} (${req.user.role})`,
        details: `Forbidden: Role '${req.user.role}' not in [${allowedRoles.join(', ')}]`
      });

      return res.status(403).json({
        error: `Forbidden: Role '${req.user.role}' is not authorized for this resource`,
        code: 'INSUFFICIENT_ROLE',
        userRole: req.user.role,
        allowedRoles
      });
    }

    next();
  };
}
