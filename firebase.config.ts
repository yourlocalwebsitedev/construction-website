// Firebase Configuration
// TODO: Replace these values with your actual Firebase project config
// Get these from: Firebase Console → Project Settings → Your apps → Web app

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvVYa_F0lhBLLKTEGLbjKfjBwkelTZkzU",
  authDomain: "kl-profinish-plastering-de401.firebaseapp.com",
  projectId: "kl-profinish-plastering-de401",
  storageBucket: "kl-profinish-plastering-de401.firebasestorage.app",
  messagingSenderId: "792202671835",
  appId: "1:792202671835:web:0bad7a77753196d143befe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
