const firebaseConfig = {
  apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
  authDomain: "ic12-e6ad7.firebaseapp.com",
  projectId: "ic12-e6ad7",
  storageBucket: "ic12-e6ad7.firebasestorage.app",
  messagingSenderId: "849964207533",
  appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
  measurementId: "G-H7S7W0CB7Q"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { 
    auth, db, storage, analytics,
    collection, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, 
    query, where, orderBy, limit, onSnapshot, getDocs, 
    serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    ref, uploadBytes, getDownloadURL, createUserWithEmailAndPassword
};
