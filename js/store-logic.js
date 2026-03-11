import { auth, db, collection, addDoc, getDocs, onSnapshot, query, where, orderBy, serverTimestamp, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase-config.js';

let cart = [];
const saved = localStorage.getItem('icloth_cart');
if (saved) cart = JSON.parse(saved);

let currentUser = null;
let products = [];

// --- Auth Monitoring ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const authText = document.getElementById('auth-text');
    if (user) {
        if (authText) authText.innerText = user.displayName.split(' ')[0];
    } else {
        if (authText) authText.innerText = 'دخول';
    }
    updateCartUI();
});

// --- Store Logic ---
export async function loadProducts() {
    const productsSnap = await getDocs(collection(db, 'products'));
    products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('shop-grid');
    if (!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                <img src="${p.image}" alt="${p.name}">
                <button class="add-to-cart-btn" onclick="addToCart('${p.id}')">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="p-3">
                <h5 class="fw-bold">${p.name}</h5>
                <div class="text-primary fw-bold">${p.price} ج.م</div>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    const existing = cart.find(x => x.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...p, quantity: 1 });
    
    updateCartUI();
    saveCart();
};

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    counts.forEach(c => c.innerText = total);
    
    // ... Additional UI updates for cart drawer if exists
}

function saveCart() {
    localStorage.setItem('icloth_cart', JSON.stringify(cart));
}

// --- Customer Auth ---
window.loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        alert("خطأ في الدخول: " + e.message);
    }
};

window.logoutUser = () => signOut(auth).then(() => location.reload());

// --- Checkout Logic ---
window.placeOrder = async (orderData) => {
    try {
        await addDoc(collection(db, 'orders'), {
            ...orderData,
            createdAt: serverTimestamp(),
            status: 'جديد',
            userEmail: currentUser ? currentUser.email : 'guest'
        });
        cart = [];
        saveCart();
        alert("تم الطلب بنجاح!");
        location.reload();
    } catch (e) {
        alert("خطأ في الطلب: " + e.message);
    }
};

// Start
loadProducts();
