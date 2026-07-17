// Paste the config object Firebase gave you when you registered your Web App here.
// Firebase Console → Project Settings → General → "Your apps" → Web app → SDK setup and configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP9_Yty7qhpIU_j5WfJxc3U-F-4Nn3pG4",
  authDomain: "justhinkkit.firebaseapp.com",
  projectId: "justhinkkit",
  storageBucket: "justhinkkit.firebasestorage.app",
  messagingSenderId: "405656007971",
  appId: "1:405656007971:web:7df2e15af0de9efda68896",
  measurementId: "G-ZZQ737YRPQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
