import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

// Keep this in sync with admin-login.js
const ADMIN_EMAIL = 'm13@gmail.com';

// Hide body immediately to prevent flash of content before auth check
document.body.style.visibility = 'hidden';

// Auth state listener - runs once Firebase resolves the session
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
        // Not logged in or not the admin → redirect to login
        window.location.replace('admin-login.html');
    } else {
        // Authenticated admin → reveal the page
        document.body.style.visibility = 'visible';
        attachLogout();
    }
});

function attachLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
            } catch (e) {
                console.error('Logout error:', e);
            }
            window.location.replace('admin-login.html');
        });
    }
}
