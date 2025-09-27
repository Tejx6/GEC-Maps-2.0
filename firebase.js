// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQjIMktyr_JBIrPeiQ-Td9rrSgUwjYpJg",
  authDomain: "gec-maps-new.firebaseapp.com",
  projectId: "gec-maps-new",
  storageBucket: "gec-maps-new.appspot.com",
  messagingSenderId: "237573621235",
  appId: "1:237573621235:web:a00d3e94b7221ea95cbe86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
