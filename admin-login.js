import { auth, signInWithEmailAndPassword, onAuthStateChanged } from './firebase-config.js';

// Single source of truth for admin email
const ADMIN_EMAIL = 'm13@gmail.com';

// If already logged in as admin, skip the login page
onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        window.location.replace('admin.html');
    }
});

const loginForm = document.getElementById('adminLoginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
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
        const msg = ['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-email']
            .includes(error.code)
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
    loginBtn.disabled = state;
    loginBtn.style.opacity = state ? '0.7' : '1';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}

// Clear error message when user starts typing again
[emailInput, passwordInput].forEach((input) => {
    input.addEventListener('input', () => {
        if (errorMsg.style.display === 'block') {
            errorMsg.style.display = 'none';
        }
    });
});
