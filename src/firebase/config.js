import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHOlE61340tdzZ3vPd2KmIW8cqRtBDb7A",
  authDomain: "natara-hub.firebaseapp.com",
  projectId: "natara-hub",
  storageBucket: "natara-hub.firebasestorage.app",
  messagingSenderId: "718241603922",
  appId: "1:718241603922:web:fc84837c034c90b5ce5a8b",
  measurementId: "G-QF74W2Y94Y",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db,
};