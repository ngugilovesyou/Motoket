// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDpyFMXLDu6U3k8Qn-YRXa9kl1n-ah0aU",
  authDomain: "motoket-1e77f.firebaseapp.com",
  projectId: "motoket-1e77f",
  storageBucket: "motoket-1e77f.firebasestorage.app",
  messagingSenderId: "199896735120",
  appId: "1:199896735120:web:47566470c1be14de116715",
  measurementId: "G-RMTNWF1SQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Optionally export the app itself
export default app;