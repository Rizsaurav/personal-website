// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogs-1297a.firebaseapp.com",
  projectId: "blogs-1297a",
  storageBucket: "blogs-1297a.appspot.com", 
  messagingSenderId: "34709737629",
  appId: "1:34709737629:web:2835b0e362477461290474",
  measurementId: "G-VY0XDKKD0Y"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
export const analytics: Analytics = getAnalytics(app);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auto-authenticate anonymously
onAuthStateChanged(auth, (user: User | null) => {
  if (!user) {
    signInAnonymously(auth).catch(console.error);
  }
});
