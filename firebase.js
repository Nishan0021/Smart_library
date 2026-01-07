import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBejZIDDBLUgOkoJClxYoypTbA8gVUQdJE",
  authDomain: "smart-library-nie.firebaseapp.com",
  projectId: "smart-library-nie",
  storageBucket: "smart-library-nie.firebasestorage.app",
  messagingSenderId: "779369963714",
  appId: "1:779369963714:web:cf697fdbd5e0db2bdc9b5b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
