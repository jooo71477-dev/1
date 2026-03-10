import { auth, signInWithEmailAndPassword, onAuthStateChanged } from './firebase-config.js';

const ADMIN_EMAIL = 'mm13@gmail.com';

// If already logged in as admin, skip the login page
onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        window.location.replace('admin.html');
    }
});

const loginForm = document.getElementById('adminLoginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnText = document.getElementById('btnText');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Restrict to admin email only
    if (email !== ADMIN_EMAIL) {
        showError('Access denied. Admin privileges required.');
        return;
    }

    setLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace('admin.html');
    } catch (error) {
        const msg = error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
            ? 'Invalid email or password.'
            : 'Login failed. Please try again.';
        showError(msg);
    } finally {
        setLoading(false);
    }
});

function setLoading(state) {
    btnText.style.display = state ? 'none' : 'inline';
    loader.style.display = state ? 'block' : 'none';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}
