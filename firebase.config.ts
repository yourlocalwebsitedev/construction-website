// Firebase Configuration
// TODO: Replace these values with your actual Firebase project config
// Get these from: Firebase Console → Project Settings → Your apps → Web app

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ6ngXNhUvSES8bJiRjveIIV8bicP_w1k",
  authDomain: "kl-profinish-plastering-llc.firebaseapp.com",
  projectId: "kl-profinish-plastering-llc",
  storageBucket: "kl-profinish-plastering-llc.firebasestorage.app",
  messagingSenderId: "720423465952",
  appId: "1:720423465952:web:fdd8a9de27c8dae3c47185",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
