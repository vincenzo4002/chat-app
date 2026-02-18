
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQuvmV18hF6n-em6sdHZrNKaEXklfRXeE",
  authDomain: "chat-app-gs-de7bc.firebaseapp.com",
  projectId: "chat-app-gs-de7bc",
  storageBucket: "chat-app-gs-de7bc.firebasestorage.app",
  messagingSenderId: "501500005079",
  appId: "1:501500005079:web:d24f838ffa92ba2a6cfe92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
