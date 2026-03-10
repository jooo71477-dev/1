import { db, auth } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    limit, 
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const viewContent = document.getElementById('main-view');
    const ordersBadge = document.getElementById('ordersBadge');

    // State
    let currentSection = 'overview';
    let stats = {
        totalSales: 0,
        ordersCount: 0,
        productsCount: 0,
        customersCount: 0
    };

    // Initialize
    renderSection('overview');
    listenToOrdersBadge();

    // Section Switching Logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (!section) return;
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderSection(section);
        });
    });

    // Logout Logic
    document.querySelector('.logout-btn').addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'admin-login.html';
        });
    });

    async function renderSection(section) {
        currentSection = section;
        viewContent.innerHTML = `
            <div class="coming-soon-wrapper">
                <div class="coming-soon-card">
                    <div class="cs-icon"><i class="fa-solid fa-hourglass-half"></i></div>
                    <h2>${section.charAt(0).toUpperCase() + section.slice(1)} Section</h2>
                    <p>This module is currently under development. Stay tuned for updates!</p>
                    <div class="coming-soon-progress">
                        <div class="cs-bar"></div>
                    </div>
                    <span class="cs-tag">GAMING SOON</span>
                </div>
            </div>
        `;
    }

    // --- OVERVIEW SECTION ---
    async function renderOverview() {
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));

        stats.productsCount = productsSnap.size;
        stats.ordersCount = ordersSnap.size;
        stats.customersCount = usersSnap.size;
        
        let totalRevenue = 0;
        ordersSnap.forEach(doc => {
            totalRevenue += (doc.data().total || 0);
        });
        stats.totalSales = totalRevenue;

        viewContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="color: #22c55e;"><i class="fa-solid fa-money-bill-trend-up"></i></div>
                        <span class="stat-change up">+12%</span>
                    </div>
                    <div class="stat-number">LE ${stats.totalSales.toLocaleString()}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="color: #c2213a;"><i class="fa-solid fa-cart-shopping"></i></div>
                        <span class="stat-change up">+5%</span>
                    </div>
                    <div class="stat-number">${stats.ordersCount}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="color: #f59e0b;"><i class="fa-solid fa-shirt"></i></div>
                    </div>
                    <div class="stat-number">${stats.productsCount}</div>
                    <div class="stat-label">Active Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon" style="color: #3b82f6;"><i class="fa-solid fa-users"></i></div>
                    </div>
                    <div class="stat-number">${stats.customersCount}</div>
                    <div class="stat-label">Total Customers</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container table-card">
                    <div class="card-header">
                        <h3>Recent Orders</h3>
                        <button class="btn-ghost btn-sm" onclick="document.querySelector('[data-section=orders]').click()">View All</button>
                    </div>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="recentOrdersTable"></tbody>
                    </table>
                </div>
                <div class="chart-container">
                    <canvas id="salesChart"></canvas>
                </div>
            </div>
        `;

        // Fill recent orders
        const recentOrdersTable = document.getElementById('recentOrdersTable');
        const recentQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQuery);
        
        if (recentSnap.empty) {
            recentOrdersTable.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">No recent orders</td></tr>';
        } else {
            recentSnap.forEach(doc => {
                const order = doc.data();
                const statusClass = order.status?.toLowerCase() || 'pending';
                recentOrdersTable.innerHTML += `
                    <tr>
                        <td>#${doc.id.slice(-6).toUpperCase()}</td>
                        <td>${order.customerName || 'Guest'}</td>
                        <td>LE ${order.total || 0}</td>
                        <td><span class="status-label ${statusClass}">${order.status || 'Pending'}</span></td>
                    </tr>
                `;
            });
        }

        initSalesChart();
    }

    // --- PRODUCTS SECTION ---
    async function renderProducts() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Products Management</h2>
                <button class="add-btn" id="openProductModal">
                    <i class="fa-solid fa-plus"></i> Add New Product
                </button>
            </div>
            <div class="table-card">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody"></tbody>
                </table>
            </div>
        `;

        const tbody = document.getElementById('productsTableBody');
        const snap = await getDocs(collection(db, 'products'));

        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px;">No products found. Start by adding one!</td></tr>';
        } else {
            snap.forEach(docSnap => {
                const p = docSnap.data();
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${p.images?.[0] || 'logo/logo2..png'}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;"></td>
                        <td><strong>${p.name}</strong></td>
                        <td>${p.category || 'Uncategorized'}</td>
                        <td>LE ${p.priceAfter}</td>
                        <td><span class="badge ${p.stock > 10 ? 'badge-green' : 'badge-red'}">${p.stock}</span></td>
                        <td>
                            <button class="view-btn edit-product" data-id="${docSnap.id}"><i class="fa-solid fa-pen"></i></button>
                            <button class="view-btn delete-product" data-id="${docSnap.id}" style="color:var(--red)"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        // Add Product Event
        document.getElementById('openProductModal').onclick = () => showProductModal();
        
        // Delete Product Event
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Are you sure you want to delete this product?')) {
                    await deleteDoc(doc(db, 'products', btn.dataset.id));
                    renderSection('products');
                }
            };
        });
    }

    // --- ORDERS SECTION ---
    async function renderOrders() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Customer Orders</h2>
            </div>
            <div class="table-card">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody"></tbody>
                </table>
            </div>
        `;

        const tbody = document.getElementById('ordersTableBody');
        const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));

        snap.forEach(docSnap => {
            const o = docSnap.data();
            const date = o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : 'N/A';
            tbody.innerHTML += `
                <tr>
                    <td>#${docSnap.id.slice(-6).toUpperCase()}</td>
                    <td>${o.customerName}<br><small>${o.phone}</small></td>
                    <td>${date}</td>
                    <td>LE ${o.total}</td>
                    <td><span class="status-label ${o.status?.toLowerCase() || 'pending'}">${o.status || 'Pending'}</span></td>
                    <td>
                        <button class="btn-ghost btn-sm view-order" data-id="${docSnap.id}">Manage</button>
                    </td>
                </tr>
            `;
        });
    }

    // --- MODALS & UTILS ---
    function showProductModal(productId = null) {
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <h2 style="margin-bottom:24px;">${productId ? 'Edit Product' : 'Add New Product'}</h2>
            <form id="productForm">
                <div class="stats-grid" style="grid-template-columns: 2fr 1fr;">
                    <div>
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="pName" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="pDesc" rows="4" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:10px; color:white; padding:10px;"></textarea>
                        </div>
                        <div class="stats-grid" style="margin-top:16px;">
                            <div class="form-group">
                                <label>Price Before (Optional)</label>
                                <input type="number" id="pPriceBefore">
                            </div>
                            <div class="form-group">
                                <label>Price Now (Sale Price)</label>
                                <input type="number" id="pPriceAfter" required>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="pCat">
                                <option value="jackets">Jackets</option>
                                <option value="tshirts">T-Shirts</option>
                                <option value="hoodies">Hoodies</option>
                                <option value="pants">Pants</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" id="pStock" value="50" required>
                        </div>
                        <div class="form-group">
                            <label>Image URL</label>
                            <input type="text" id="pImg" placeholder="https://...">
                        </div>
                    </div>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:24px;">
                    <button type="button" class="btn btn-ghost close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Product</button>
                </div>
            </form>
        `;

        modal.style.display = 'block';

        modal.querySelector('.close').onclick = () => modal.style.display = 'none';
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';

        document.getElementById('productForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('pName').value,
                desc: document.getElementById('pDesc').value,
                priceBefore: Number(document.getElementById('pPriceBefore').value) || 0,
                priceAfter: Number(document.getElementById('pPriceAfter').value),
                category: document.getElementById('pCat').options[document.getElementById('pCat').selectedIndex].text,
                categoryKey: document.getElementById('pCat').value,
                stock: Number(document.getElementById('pStock').value),
                images: [document.getElementById('pImg').value || 'logo/logo2..png'],
                createdAt: new Date()
            };

            await addDoc(collection(db, 'products'), data);
            modal.style.display = 'none';
            renderSection('products');
        };
    }

    function initSalesChart() {
        const ctx = document.getElementById('salesChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Weekly Sales',
                    data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
                    borderColor: '#c2213a',
                    backgroundColor: 'rgba(194, 33, 58, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)' } },
                    x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)' } }
                }
            }
        });
    }

    function listenToOrdersBadge() {
        onSnapshot(query(collection(db, 'orders'), where('status', '==', 'Pending')), (snap) => {
            ordersBadge.textContent = snap.size;
            ordersBadge.style.display = snap.size > 0 ? 'inline-block' : 'none';
        });
    }
});
