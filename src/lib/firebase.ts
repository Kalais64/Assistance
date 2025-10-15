// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr9VZAEde6SOb1hWyyw9ODkFWtaE8LnbI",
  authDomain: "personal-learning-assistant-b8b8a.firebaseapp.com",
  projectId: "personal-learning-assistant-b8b8a",
  storageBucket: "personal-learning-assistant-b8b8a.firebasestorage.app",
  messagingSenderId: "889381252515",
  appId: "1:889381252515:web:5217869334b69b3415be16",
  measurementId: "G-L7P3NBYRF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize messaging conditionally (only in browser environment)
let messaging: any = null;

// Initialize Firebase messaging if supported
const initializeMessaging = async () => {
  if (typeof window !== 'undefined') {
    const isSupportedMessaging = await isSupported();
    if (isSupportedMessaging) {
      messaging = getMessaging(app);
      return messaging;
    }
  }
  return null;
};

export { app, auth, db, storage, functions, analytics, messaging, initializeMessaging };