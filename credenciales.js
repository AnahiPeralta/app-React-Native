// Importar los paquetes necesarios
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2M5uW2EqBAOzcrvKyKP0-a_18WymnXPM",
  authDomain: "login-isdm.firebaseapp.com",
  projectId: "login-isdm",
  storageBucket: "login-isdm.appspot.com",
  messagingSenderId: "206208247248",
  appId: "1:206208247248:web:1208a4bb5faaa079ba05d5"
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(appFirebase);

// Inicializar Auth con persistencia para React Native
const auth = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage) // Configuración de persistencia
});

// Exportar las instancias de Firebase
export { appFirebase, db, auth };
