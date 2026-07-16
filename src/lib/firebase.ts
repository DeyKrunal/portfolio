import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * All values come from VITE_FIREBASE_* env vars (see .env.example).
 * Firebase web config is not a secret in the traditional sense — it's
 * safe to ship in a client bundle — but it must still be paired with
 * Firestore/Storage Security Rules (see firestore.rules / storage.rules)
 * to actually restrict who can read/write what. The config alone grants
 * no access.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const app = firebaseEnabled
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

  console.log(getAuth().currentUser);
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = new GoogleAuthProvider();
