import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-EH4jZOvDj_IotMEhCAdOOG24up8A33o",
  authDomain: "svecha-1242.firebaseapp.com",
  databaseURL: "https://svecha-1242-default-rtdb.firebaseio.com",
  projectId: "svecha-1242",
  storageBucket: "svecha-1242.appspot.com",
  messagingSenderId: "970944664071",
  appId: "1:970944664071:web:aeb50e6e461bfb839510a2",
  measurementId: "G-NT69PWVKJW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
auth.languageCode = "ru";
const firestore = getFirestore(app);

console.log("Firebase initialized");
console.log("Firebase auth instance:", auth);
console.log("Firebase firestore instance:", firestore);

export { app, database, auth, firestore };
