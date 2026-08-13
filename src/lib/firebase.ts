import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Using your provided Shera Scrap Haraj Firebase config as default,
// while keeping Vercel Environment Variables as an optional override just in case.
const config = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyDir79PQBltoEE-F3eapLI1zM6zGHCZkS8",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "sherascrapharaj.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "sherascrapharaj",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "sherascrapharaj.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "713243469294",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:713243469294:web:9542112320254043c01aff"
};

const app = getApps().length > 0 ? getApp() : initializeApp(config);

export const db = getFirestore(app);
export const auth = getAuth(app);
