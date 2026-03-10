import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBy6UIqxLi1p9cEIc_e74PWQdiXqAXfCME",
    authDomain: "icloth-4c1d5.firebaseapp.com",
    projectId: "icloth-4c1d5",
    storageBucket: "icloth-4c1d5.firebasestorage.app",
    messagingSenderId: "281323343235",
    appId: "1:281323343235:web:04ed00bc424137bfd5bab6",
    measurementId: "G-S8P5NVNK8Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Analytics: only init in production (requires https)
let analytics = null;
if (location.protocol === 'https:') {
    import("https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js")
        .then(({ getAnalytics }) => { analytics = getAnalytics(app); })
        .catch(() => {});
}

export { app, auth, db, googleProvider, analytics, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };
