import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import config from '../../firebase-applet-config.json';

export const cloudStorageEnabled = () => process.env.VERCEL === '1' || process.env.CMS_STORAGE === 'firestore';
export function adminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const credential = raw ? cert(JSON.parse(raw)) : process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
    ? cert({ projectId: process.env.FIREBASE_PROJECT_ID || config.projectId, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') })
    : applicationDefault();
  return initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID || config.projectId, storageBucket: process.env.FIREBASE_STORAGE_BUCKET || config.storageBucket });
}
export const database = () => getFirestore(adminApp(), process.env.FIREBASE_DATABASE_ID || config.firestoreDatabaseId || '(default)');
export const mediaBucket = () => getStorage(adminApp()).bucket();
export const storeCollection = () => database().collection(process.env.FIREBASE_CMS_COLLECTION || 'shera_cms_v2');
