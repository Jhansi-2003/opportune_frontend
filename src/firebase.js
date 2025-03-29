// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Import getAuth here

const firebaseConfig = {
  apiKey: "AIzaSyBwqIAx0MmQanUsU6EVfmrzCKBh7bujzPE",
  authDomain: "my-auth-17854.firebaseapp.com",
  projectId: "my-auth-17854",
  storageBucket: "my-auth-17854.appspot.com", // fixed typo here: should be 'appspot.com'
  messagingSenderId: "318249504060",
  appId: "1:318249504060:web:8b72a565319e7743d8e239",
  measurementId: "G-YP1HB3H779"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ This is what you'll import in other files
