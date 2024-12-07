// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2M5uW2EqBAOzcrvKyKP0-a_18WymnXPM",
  authDomain: "login-isdm.firebaseapp.com",
  projectId: "login-isdm",
  storageBucket: "login-isdm.firebasestorage.app",
  messagingSenderId: "206208247248",
  appId: "1:206208247248:web:1208a4bb5faaa079ba05d5"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

export { appFirebase,  db };