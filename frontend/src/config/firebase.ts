import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { ConfirmationResult, UserCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDBQ15zxS-Ui8k29aMikhWyHDc1xsHJDVA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cinego-4ca53.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cinego-4ca53",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cinego-4ca53.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "719727556329",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:719727556329:web:dbff256acebf01bf496278",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NHCS1RG2Z3"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper to initialize reCAPTCHA verifier for phone authentication
export const initPhoneRecaptcha = (buttonOrContainerId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, buttonOrContainerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will allow signInWithPhoneNumber
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
    },
  });
};

export { signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup };
export type { ConfirmationResult, UserCredential };
