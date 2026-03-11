import { auth, db, storage, collection, doc, getDoc, setDoc, query, where, signOut, onAuthStateChanged, addDoc, serverTimestamp, updateDoc, ref, uploadBytes, getDownloadURL, getDocs } from './firebase-config.js';
import { supabase, supabaseData } from './supabase-config.js';
import { ROLES, hasPermission } from './roles.js';
import { initCommandPalette } from './command-palette.js';
import { logActivity } from './activity-logger.js';

// Global System State
window.currentUserData = null;
window.currentStoreId = localStorage.getItem('activeStoreId') || 'default';

// Init UI Features
applyUIDensity();
initCommandPalette();

// --- OBSERVABILITY: Global Error Tracking ---
window.onerror = async function (msg, url, lineNo, columnNo, error) {
    if (window.db) {
        try {
            await addDoc(collection(db, "incidents"), {
                storeId: window.currentStoreId || 'default',
                title: `Auto-Error: ${msg}`,
                severity: 'medium',
                status: 'open',
                details: { url, lineNo, columnNo, stack: error?.stack },
                timestamp: serverTimestamp(),
                type: 'system_error'
            });
        } catch (e) {
            console.error('Failed to log auto-error:', e);
        }
    }
    return false;
};

// --- AUTH UI CHECK ---
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    } else {
        console.log('Logged in as:', user.email);

        // Fetch User Metadata (Role, Store, etc)
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                window.currentUserData = userDoc.data();
            } else {
                // Initialize default user if not exists (First Login)
                window.currentUserData = {
                    email: user.email,
                    role: (user.email === 'jooo71477@gmail.com') ? ROLES.ADMIN : ROLES.STAFF, 
                    storeId: 'default',
                    subscription: 'free',
                    created_at: serverTimestamp()
                };
                await setDoc(doc(db, "users", user.uid), window.currentUserData);
            }

            // Update UI based on role
            applyRoleRestrictions();

        } catch (error) {
            console.error('Error fetching user metadata:', error);
        }

        // Change displayed email
        const adminEmail = document.querySelector('.user-profile small');
        if (adminEmail) adminEmail.innerText = user.email;

        // Load dashboard stats if on dashboard page
        if (window.location.pathname.endsWith('dashboard.html')) {
            loadDashboardStats();
        }
    }
});

// --- ROLE BASED UI ---
function applyRoleRestrictions() {
    if (!window.currentUserData) return;

    const role = window.currentUserData.role;

    // Hide elements based on permissions
    const restrictedElements = document.querySelectorAll('[data-permission]');
    restrictedElements.forEach(el => {
        const permission = el.getAttribute('data-permission');
        if (!hasPermission(role, permission)) {
            el.style.display = 'none';
        }
    });

    // Sidebar protection
    if (role === ROLES.READ_ONLY || role === ROLES.STAFF) {
        const settingsLink = document.querySelector('a[href="settings.html"]');
        if (settingsLink) settingsLink.style.display = 'none';

        const catLink = document.querySelector('a[href="categories.html"]');
        if (catLink && role === ROLES.READ_ONLY) catLink.style.display = 'none';
    }
}

window.logout = async () => {
    await signOut(auth);
    window.location.href = 'index.html';
};

// --- DASHBOARD STATISTICS ---
async function loadDashboardStats() {
    try {
        let productsCount = 0;
        if (supabase) {
            const { count, error: prodError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (prodError) throw prodError;
            productsCount = count;
        }

        const prodEl = document.getElementById('totalProducts');
        if (prodEl) prodEl.innerText = productsCount || 0;

        const ordersQuery = query(collection(db, "orders"), where("storeId", "==", window.currentStoreId));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersCount = ordersSnapshot.size;
        let totalSales = 0;
        let newOrdersCount = 0;

        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            if (order.status === 'completed') {
                totalSales += order.total_price || 0;
            }
            if (order.status === 'pending') {
                newOrdersCount++;
            }
        });

        const orderEl = document.getElementById('totalOrders');
        if (orderEl) orderEl.innerText = newOrdersCount || ordersCount;

        const salesEl = document.getElementById('totalSales');
        if (salesEl) salesEl.innerText = totalSales.toLocaleString() + ' EGP';

        loadRecentOrders(ordersSnapshot);
        updateGoalTracking(totalSales);

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function loadRecentOrders(ordersSnapshot) {
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;

    if (ordersSnapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-white-50">لا توجد طلبات حتى الآن</td></tr>';
        return;
    }

    const ordersList = [];
    ordersSnapshot.forEach(doc => {
        ordersList.push({ id: doc.id, ...doc.data() });
    });

    ordersList.sort((a, b) => {
        const aTime = a.created_at?.seconds || 0;
        const bTime = b.created_at?.seconds || 0;
        return bTime - aTime;
    });

    const recentOrders = ordersList.slice(0, 5);

    tableBody.innerHTML = recentOrders.map(order => {
        const date = order.created_at ? new Date(order.created_at.seconds * 1000).toLocaleDateString('ar-EG') : 'N/A';
        let statusBadge = 'bg-warning text-dark';
        let statusText = 'جديد';
        if (order.status === 'completed') {
            statusBadge = 'bg-success';
            statusText = 'مكتمل';
        }
        if (order.status === 'cancelled') {
            statusBadge = 'bg-danger';
            statusText = 'ملغي';
        }

        return `
        <tr>
            <td class="ps-4">#${order.id.substring(0, 8)}</td>
            <td>${order.user_email?.split('@')[0] || 'عميل'}</td>
            <td>${date}</td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td class="fw-bold text-success">${order.total_price} EGP</td>
            <td><a href="orders.html" class="btn btn-sm btn-outline-light">عرض</a></td>
        </tr>`;
    }).join('');
}

function applyUIDensity() {
    const isCompact = localStorage.getItem('uiDensity') === 'compact';
    document.body.classList.toggle('compact-mode', isCompact);
}

async function updateGoalTracking(currentSales) {
    try {
        const storeId = window.currentStoreId || 'default';
        const docSnap = await getDoc(doc(db, "settings", `${storeId}_goals`));
        const target = docSnap.exists() ? (docSnap.data().revenueGoal || 0) : 0;

        const prog = target > 0 ? Math.min((currentSales / target) * 100, 100) : 0;

        const bar = document.getElementById('goalProgressBar');
        if (bar) bar.style.width = `${prog}%`;

        const curD = document.getElementById('currentSalesDisplay');
        if (curD) curD.innerText = currentSales.toLocaleString();

        const tarD = document.getElementById('targetSalesDisplay');
        if (tarD) tarD.innerText = target.toLocaleString();
    } catch (e) {
        console.error('Goal track error:', e);
    }
}

export { logActivity };
