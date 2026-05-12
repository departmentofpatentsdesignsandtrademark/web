import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// In AI Studio, we can use process.env for these if set via vite.config.ts or .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA07X5VSlpd-heG627EO0efFaMTgOe9rEM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dpdtgovbd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dpdtgovbd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dpdtgovbd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "689548535531",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:689548535531:web:6a17241e97112d09f540ae"
};

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the correct database ID if it's not "(default)"
// In this case, firebase-applet-config.json says "ai-studio-2791c595-2b11-49bc-a869-9d20d00f48b8"
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-2791c595-2b11-49bc-a869-9d20d00f48b8");
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
