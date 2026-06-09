import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "dental-manual-app-2606",
  appId: "1:188080504314:web:4944e6fa299a919a257843",
  storageBucket: "dental-manual-app-2606.firebasestorage.app",
  apiKey: "AIzaSyDzPYL0AAUUNhgadDXKGGIwXGjR1nkEQkA",
  authDomain: "dental-manual-app-2606.firebaseapp.com",
  messagingSenderId: "188080504314",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
