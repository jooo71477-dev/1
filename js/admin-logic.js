import { auth, db, collection, getDocs, doc, deleteDoc, updateDoc, onSnapshot, query, orderBy, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

let currentRole = 'none';

// --- Auth Monitoring ---
onAuthStateChanged(auth, (user) => {
    const loginOverlay = document.getElementById('login-overlay');
    const adminContent = document.getElementById('admin-main-content');
    
    if (user && user.email === 'jooo71477@gmail.com') { // Hardcoded Admin Email for security as requested
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
        initDashboard();
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (adminContent) adminContent.style.display = 'none';
        if (user) {
            // If logged in but NOT admin, sign out or show error
            signOut(auth);
            alert("عذراً، هذا الحساب ليس له صلاحيات دخول الإدارة.");
        }
    }
});

function initDashboard() {
    loadStats();
    listenToOrders();
    loadProducts();
}

// --- Stats Logic ---
async function loadStats() {
    const productsSnap = await getDocs(collection(db, 'products'));
    const ordersSnap = await getDocs(collection(db, 'orders'));
    
    const stats = {
        products: productsSnap.size,
        orders: ordersSnap.size,
        customers: 0 // Placeholder or calculate from unique emails in orders
    };
    
    document.getElementById('stat-total-products').innerText = stats.products;
    document.getElementById('stat-total-orders').innerText = stats.orders;
}

// --- Products Management ---
window.loadProducts = async function() {
    const productsSnap = await getDocs(collection(db, 'products'));
    const grid = document.getElementById('products-grid-body');
    if (!grid) return;
    
    grid.innerHTML = '';
    productsSnap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;
        grid.innerHTML += `
            <tr>
                <td><img src="${p.image}" style="width:50px; border-radius:8px;"></td>
                <td class="fw-bold">${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price} ج.م</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
};

window.deleteProduct = async function(id) {
    if (confirm("هل أنت متأكد من حذف المنتج؟")) {
        await deleteDoc(doc(db, 'products', id));
        loadProducts();
    }
};

// --- Orders Realtime ---
function listenToOrders() {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
        const list = document.getElementById('orders-list-body');
        if (!list) return;
        
        list.innerHTML = '';
        snapshot.forEach(docSnap => {
            const o = docSnap.data();
            list.innerHTML += `
                <div class="glass-card mb-3 p-3 gaming-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">طلب من: ${o.customerName}</h6>
                            <small class="text-white-50">${o.phone} | ${o.governorate}</small>
                        </div>
                        <div class="text-end">
                            <div class="badge bg-primary mb-1">${o.status || 'جديد'}</div>
                            <div class="fw-bold">${o.total} ج.م</div>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

// --- Login Handler ---
document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
        alert("خطأ في تسجيل الدخول: " + err.message);
    }
});

window.logout = () => signOut(auth);
