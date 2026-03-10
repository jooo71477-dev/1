document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const viewContent = document.getElementById('main-view');

    // Default View: Overview
    renderSection('overview');

    // Section Switching Logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const section = item.getAttribute('data-section');
            renderSection(section);
        });
    });

    function renderSection(section) {
        // Clear interval if exists (for flash sale)
        if (window.flashTimer) clearInterval(window.flashTimer);

        switch (section) {
            case 'overview': renderOverview(); break;
            case 'orders': renderOrders(); break;
            case 'products': renderProducts(); break;
            case 'categories': renderCategories(); break;
            case 'offers': renderOffers(); break;
            case 'flashsale': renderFlashSale(); break;
            case 'customers': renderTopCustomers(); break;
            case 'shipping': renderShipping(); break;
            case 'coupons': renderCoupons(); break;
            case 'banners': renderBanners(); break;
            case 'reviews': renderReviews(); break;
            case 'settings': renderSettings(); break;
            default:
                viewContent.innerHTML = `<h2 style="text-align:center; padding: 50px; opacity:0.5;">Section "${section}" Coming Soon...</h2>`;
        }
    }

    // --- VIEW RENDERING FUNCTIONS ---

    function renderOverview() {
        viewContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                        <span class="stat-change up">+12%</span>
                    </div>
                    <div class="stat-number">128</div>
                    <div class="stat-label">Total Orders Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon"><i class="fa-solid fa-money-bill-trend-up"></i></div>
                        <span class="stat-change up">+8%</span>
                    </div>
                    <div class="stat-number">LE 45,200</div>
                    <div class="stat-label">Total Sales (March)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                        <span class="stat-change up">+5%</span>
                    </div>
                    <div class="stat-number">1,420</div>
                    <div class="stat-label">Total Customers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon"><i class="fa-solid fa-bolt"></i></div>
                        <span class="stat-change up">Active</span>
                    </div>
                    <div class="stat-number">3</div>
                    <div class="stat-label">Active Flash Sales</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <div class="card-header">
                        <h3>Sales Analytics (Last 7 Days)</h3>
                    </div>
                    <canvas id="salesChart" style="height:300px;"></canvas>
                </div>
                <div class="chart-container">
                    <div class="card-header">
                        <h3>Top Selling Products</h3>
                    </div>
                    <div class="top-products-list">
                        <div class="top-item" style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid var(--border-color);">
                            <span>Cropped Jacket (Black)</span>
                            <strong>142 Sold</strong>
                        </div>
                        <div class="top-item" style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid var(--border-color);">
                            <span>Oversized Tee</span>
                            <strong>98 Sold</strong>
                        </div>
                        <div class="top-item" style="display:flex; justify-content:space-between; padding:15px;">
                            <span>Winter Hoodie</span>
                            <strong>76 Sold</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
        initChart();
    }

    function renderOrders() {
        viewContent.innerHTML = `
            <div class="table-card">
                <div class="card-header">
                    <h3>All Orders</h3>
                    <div class="search-box" style="width:250px;">
                        <input type="text" placeholder="Search orders...">
                    </div>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Governorate</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#1024</td>
                            <td>Ahmed Mohamed</td>
                            <td>010204512060</td>
                            <td>Cairo</td>
                            <td>2</td>
                            <td>LE 850.00</td>
                            <td><span class="status-label pending">New Order</span></td>
                            <td>10/03/2026</td>
                            <td><button class="view-btn" onclick="openOrderModal('1024')"><i class="fa-solid fa-eye"></i></button></td>
                        </tr>
                        <tr>
                            <td>#1023</td>
                            <td>Yousef Adly</td>
                            <td>01234567890</td>
                            <td>Giza</td>
                            <td>1</td>
                            <td>LE 699.00</td>
                            <td><span class="status-label shipped">Shipped</span></td>
                            <td>09/03/2026</td>
                            <td><button class="view-btn" onclick="openOrderModal('1023')"><i class="fa-solid fa-eye"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Sample products data
    const products = [
        { id: 1, name: 'Cropped Jacket (Black)', sku: 'II10', category: 'Jackets', priceBefore: 2000, priceAfter: 699, stock: 42, sizes: ['S','M','L','XL'], pinned: true },
        { id: 2, name: 'Oversized Tee (White)', sku: 'OT22', category: 'T-Shirts', priceBefore: 450, priceAfter: 299, stock: 120, sizes: ['S','M','L','XL','XXL'], pinned: false },
        { id: 3, name: 'Winter Hoodie (Grey)', sku: 'WH55', category: 'Hoodies', priceBefore: 1200, priceAfter: 850, stock: 18, sizes: ['M','L','XL'], pinned: false },
    ];

    function renderProducts() {
        const discPct = (b, a) => Math.round(((b - a) / b) * 100);
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Product Inventory</h2>
                <div style="display:flex; gap:15px;">
                    <button class="add-btn" style="background:var(--card-bg); border:1px solid var(--border-color); color:white;"><i class="fa-solid fa-sort"></i> Reorder</button>
                    <button class="add-btn" onclick="openProductModal()"><i class="fa-solid fa-plus"></i> Add Product</button>
                </div>
            </div>
            <div class="products-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px;">
                ${products.map(p => `
                <div onclick="openProductDetailModal(${p.id})" style="background:var(--card-bg); padding:20px; border-radius:20px; border:1px solid var(--border-color); position:relative; cursor:pointer; transition:all 0.3s;" onmouseover="this.style.borderColor='var(--accent-green)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateY(0)'">
                    ${p.pinned ? `<div style="position:absolute; top:15px; left:15px; z-index:10;"><i class="fa-solid fa-thumbtack" style="color:var(--accent-green); background:rgba(0,0,0,0.5); padding:6px; border-radius:8px;" title="Pinned to Homepage"></i></div>` : ''}
                    <div style="width:100%; height:190px; background:rgba(255,255,255,0.03); border-radius:15px; display:flex; align-items:center; justify-content:center; margin-bottom:15px; position:relative;">
                        <i class="fa-solid fa-shirt" style="font-size:3rem; opacity:0.08;"></i>
                        <span style="position:absolute; top:10px; right:10px; background:var(--accent-red); font-size:0.7rem; padding:3px 8px; border-radius:8px;">${discPct(p.priceBefore, p.priceAfter)}% OFF</span>
                    </div>
                    <h3 style="font-size:1rem; margin-bottom:5px;">${p.name}</h3>
                    <p style="font-size:0.78rem; opacity:0.5; margin-bottom:10px;">SKU: ${p.sku} | ${p.category}</p>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-weight:700; color:var(--accent-green);">LE ${p.priceAfter}</span>
                        <span style="text-decoration:line-through; opacity:0.4; font-size:0.8rem;">LE ${p.priceBefore}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; padding-top:12px; border-top:1px solid var(--border-color);">
                        <span class="status-label ${p.stock > 0 ? 'shipped' : 'cancelled'}" style="font-size:0.7rem;">Stock: ${p.stock}</span>
                        <div onclick="event.stopPropagation()">
                            <i class="fa-solid fa-pen-to-square" style="cursor:pointer; margin-right:12px; opacity:0.6;"></i>
                            <i class="fa-solid fa-trash" style="cursor:pointer; color:var(--accent-red); opacity:0.6;"></i>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        `;
    }

    window.openProductDetailModal = function(productId) {
        const p = [{ id: 1, name: 'Cropped Jacket (Black)', sku: 'II10', category: 'Jackets', priceBefore: 2000, priceAfter: 699, stock: 42, sizes: ['S','M','L','XL'], pinned: true, desc: 'Premium quality cropped jacket, perfect for casual outings. Made from high-grade fabric with a modern slim cut.' },
                   { id: 2, name: 'Oversized Tee (White)', sku: 'OT22', category: 'T-Shirts', priceBefore: 450, priceAfter: 299, stock: 120, sizes: ['S','M','L','XL','XXL'], pinned: false, desc: 'Comfortable oversized t-shirt. 100% cotton with a relaxed fit. Perfect for everyday wear.' },
                   { id: 3, name: 'Winter Hoodie (Grey)', sku: 'WH55', category: 'Hoodies', priceBefore: 1200, priceAfter: 850, stock: 18, sizes: ['M','L','XL'], pinned: false, desc: 'Warm and cozy winter hoodie. Fleece lining for extra warmth. Kangaroo pocket with drawstring hood.' }]
            .find(x => x.id === productId);
        if (!p) return;

        const disc = Math.round(((p.priceBefore - p.priceAfter) / p.priceBefore) * 100);
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';

        modalContent.innerHTML = `
            <span class="close" onclick="closeModal()">&times;</span>
            <div style="display:grid; grid-template-columns: 1fr 1.3fr; gap:40px;">
                <!-- Left: Image Gallery -->
                <div>
                    <div style="width:100%; height:320px; background:rgba(255,255,255,0.03); border-radius:20px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color); margin-bottom:15px;">
                        <i class="fa-solid fa-shirt" style="font-size:6rem; opacity:0.08;"></i>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(4,1fr); gap:10px;">
                        ${[1,2,3,4].map(i => `<div style="height:65px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-image" style="opacity:0.08;"></i></div>`).join('')}
                    </div>
                    <div style="margin-top:20px; display:flex; gap:10px;">
                        ${p.pinned
                            ? `<div style="display:flex; align-items:center; gap:8px; padding:10px 15px; background:rgba(128,214,17,0.1); border:1px solid var(--accent-green); border-radius:10px; font-size:0.8rem; color:var(--accent-green);"><i class="fa-solid fa-thumbtack"></i> Pinned to Homepage</div>`
                            : `<button style="padding:10px 15px; background:none; border:1px solid var(--border-color); color:white; border-radius:10px; font-size:0.8rem; cursor:pointer;"><i class="fa-solid fa-thumbtack"></i> Pin to Homepage</button>`}
                    </div>
                </div>

                <!-- Right: Product Info -->
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                        <div>
                            <span style="font-size:0.75rem; opacity:0.5; letter-spacing:1px; text-transform:uppercase;">${p.category} · SKU: ${p.sku}</span>
                            <h2 style="font-size:1.6rem; margin:8px 0;">${p.name}</h2>
                        </div>
                        <span style="background:var(--accent-red); padding:6px 12px; border-radius:10px; font-weight:700; font-size:0.9rem;">${disc}% OFF</span>
                    </div>

                    <p style="font-size:0.9rem; line-height:1.7; opacity:0.7; margin-bottom:25px;">${p.desc}</p>

                    <div style="display:flex; align-items:baseline; gap:15px; margin-bottom:25px;">
                        <span style="font-size:2rem; font-weight:800; color:var(--accent-green);">LE ${p.priceAfter}</span>
                        <span style="text-decoration:line-through; opacity:0.4; font-size:1.1rem;">LE ${p.priceBefore}</span>
                    </div>

                    <div style="margin-bottom:25px;">
                        <p style="font-size:0.8rem; opacity:0.5; margin-bottom:12px; letter-spacing:1px;">AVAILABLE SIZES</p>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            ${p.sizes.map(s => `<div style="width:50px; height:50px; border:1px solid var(--border-color); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:0.85rem; cursor:pointer; transition:0.2s;" onmouseover="this.style.borderColor='var(--accent-green)'" onmouseout="this.style.borderColor='var(--border-color)'">${s}</div>`).join('')}
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:20px; background:rgba(255,255,255,0.02); border-radius:15px; border:1px solid var(--border-color); margin-bottom:25px;">
                        <div><p style="font-size:0.75rem; opacity:0.5;">STOCK</p><p style="font-size:1.4rem; font-weight:700; color:${p.stock < 20 ? 'var(--accent-red)' : 'var(--accent-green)'}">${p.stock} units</p></div>
                        <div><p style="font-size:0.75rem; opacity:0.5;">SAVED AMOUNT</p><p style="font-size:1.4rem; font-weight:700;">LE ${p.priceBefore - p.priceAfter}</p></div>
                    </div>

                    <div style="display:flex; gap:15px;">
                        <button class="add-btn" style="flex:1; padding:16px;" onclick="closeModal()"><i class="fa-solid fa-pen-to-square"></i> Edit Product</button>
                        <button style="padding:16px 20px; background:none; border:1px solid var(--accent-red); color:var(--accent-red); border-radius:12px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    };

    function renderOffers() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Special Offers & Rules</h2>
                <button class="add-btn"><i class="fa-solid fa-plus"></i> Create Offer</button>
            </div>
            <div class="offers-container" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap:20px;">
                <div class="stat-card" style="border-left:5px solid var(--accent-green);">
                    <h3>Bulk Discount</h3>
                    <p style="font-size:0.9rem; margin:15px 0; opacity:0.7;">Buy 2 Get 1 FREE on all T-shirts.</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="status-label shipped">Active</span>
                        <button style="background:none; border:none; color:white; cursor:pointer;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                </div>
                <div class="stat-card" style="border-left:5px solid var(--accent-red);">
                    <h3>Category Offer</h3>
                    <p style="font-size:0.9rem; margin:15px 0; opacity:0.7;">30% OFF on Mid-Winter Collection.</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="status-label shipped">Active</span>
                        <button style="background:none; border:none; color:white; cursor:pointer;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFlashSale() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Flash Sales (Limited Time)</h2>
                <button class="add-btn" style="background:var(--accent-red);">+ New Flash Sale</button>
            </div>
            <div class="table-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="color:var(--accent-red);"><i class="fa-solid fa-bolt"></i> Midnight Mega Deal</h3>
                        <p style="font-size:0.9rem; margin-top:5px; opacity:0.6;">Started Today - Ends Tonight</p>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:0.75rem; color:var(--text-muted);">Ending In:</span>
                        <div id="flashTimer" style="font-family:monospace; font-size:1.8rem; font-weight:700; color:var(--accent-green);">11:59:59</div>
                    </div>
                </div>
                <!-- Progress of sale -->
                <div style="margin-top:25px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:8px;">
                        <span>Products Sold: 142/200</span>
                        <span>71% Claimed</span>
                    </div>
                    <div style="width:100%; height:10px; background:rgba(255,255,255,0.05); border-radius:10px;">
                        <div style="width:71%; height:100%; background:var(--accent-red); border-radius:10px; box-shadow: 0 0 15px var(--accent-red);"></div>
                    </div>
                </div>
            </div>
        `;
        startFlashCountdown();
    }

    function startFlashCountdown() {
        let seconds = 12 * 3600;
        const display = document.getElementById('flashTimer');
        if (!display) return;

        window.flashTimer = setInterval(() => {
            seconds--;
            if (seconds <= 0) clearInterval(window.flashTimer);
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            display.innerText = `${h}:${m}:${s}`;
        }, 1000);
    }

    function renderTopCustomers() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Top & VIP Customers</h2>
            </div>
            <div class="table-card">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Total Orders</th>
                            <th>Total Spend</th>
                            <th>Loyalty Badge</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>#1</td><td>Mohamed Ali</td><td>01020304050</td><td>24</td><td>LE 15,400</td><td><span class="status-label shipped" style="background:#FFD700; color:black;">👑 VIP Gold</span></td></tr>
                        <tr><td>#2</td><td>Sara Ahmed</td><td>01122334455</td><td>18</td><td>LE 12,200</td><td><span class="status-label shipped" style="background:#C0C0C0; color:black;">🥈 Silver</span></td></tr>
                        <tr><td>#3</td><td>Khaled Ibrahim</td><td>01223344556</td><td>12</td><td>LE 8,500</td><td><span class="status-label shipped" style="background:#CD7F32; color:white;">🥉 Bronze</span></td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderSettings() {
        viewContent.innerHTML = `
            <div class="settings-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <!-- Staff Management -->
                <div class="table-card" style="margin:0;">
                    <h3>Staff Roles & Permissions</h3>
                    <div style="margin-top:20px;">
                        <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:15px; border:1px solid var(--border-color); margin-bottom:15px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                <strong>Ahmed (Orders Manager)</strong>
                                <span class="status-label shipped" style="font-size:0.7rem;">Active</span>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.8rem;">
                                <label><input type="checkbox" checked disabled> View Orders</label>
                                <label><input type="checkbox" checked disabled> WhatsApp CRM</label>
                                <label><input type="checkbox" disabled> Manage Products</label>
                                <label><input type="checkbox" disabled> Delete Staff</label>
                            </div>
                        </div>
                        <button class="add-btn" style="width:100%; height:45px; background:none; border:1px solid var(--accent-green); color:var(--accent-green);">+ Invite New Staff</button>
                    </div>
                </div>

                <!-- WhatsApp Hub -->
                <div class="table-card" style="margin:0;">
                    <h3>WhatsApp CRM Automation</h3>
                    <p style="font-size:0.8rem; opacity:0.6; margin-bottom:20px;">Auto-send messages based on order status.</p>
                    <div class="msg-templates">
                        <div style="margin-bottom:15px;">
                            <label style="display:block; font-size:0.75rem; color:var(--accent-green); margin-bottom:5px;">ON NEW ORDER</label>
                            <textarea style="width:100%; height:60px; background:var(--sidebar-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; color:white; font-size:0.8rem;">Thanks for your order #{{id}}! We received it successfully.</textarea>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; font-size:0.75rem; color:var(--accent-green); margin-bottom:5px;">ON SHIPPING</label>
                            <textarea style="width:100%; height:60px; background:var(--sidebar-bg); border:1px solid var(--border-color); border-radius:8px; padding:10px; color:white; font-size:0.8rem;">Great news! Order #{{id}} is on the way.</textarea>
                        </div>
                    </div>
                </div>

                <!-- Maintenance Mode -->
                <div class="table-card" style="margin:0; grid-column: span 2;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3>Maintenance Mode Settings</h3>
                        <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-top:20px;">
                        <div class="form-group"><label>Reason</label><input type="text" placeholder="Updates" style="width:100%;"></div>
                        <div class="form-group"><label>Est. Duration</label><input type="text" placeholder="2 Hours" style="width:100%;"></div>
                        <button class="add-btn" style="height:45px; margin-top:22px;">Save Maintenance Policy</button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- OTHER UI HELPERS ---

    function initChart() {
        const ctx = document.getElementById('salesChart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Sales (LE)',
                    data: [12000, 19000, 15000, 25000, 22000, 32000, 42000],
                    borderColor: '#80d611',
                    backgroundColor: 'rgba(128, 214, 17, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#80d611'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } },
                    x: { grid: { display: false }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } }
                }
            }
        });
    }

    // Modal Global Functions
    window.openOrderModal = function (id) {
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';

        modalContent.innerHTML = `
            <span class="close" onclick="closeModal()">&times;</span>
            <div class="modal-grid" style="display:grid; grid-template-columns: 320px 1fr; gap:40px;">
                <div class="order-sidebar" style="border-right:1px solid var(--border-color); padding-right:35px;">
                    <h2 style="margin-bottom:25px;">Order #${id}</h2>
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; border:1px solid var(--border-color);">
                        <h4 style="font-size:0.75rem; opacity:0.5; margin-bottom:12px; letter-spacing:1px;">👤 CUSTOMER</h4>
                        <p style="font-weight:700; font-size:1.1rem;">Ahmed Mohamed</p>
                        <p style="color:var(--text-muted); font-size:0.9rem;">010204512060</p>
                        <hr style="margin:15px 0; opacity:0.1;">
                        <p style="color:var(--accent-green); font-size:0.85rem; font-weight:600;"><i class="fa-solid fa-history"></i> 3 Previous Orders</p>
                        <a href="https://wa.me/2010204512060" target="_blank" style="display:flex; align-items:center; justify-content:center; gap:10px; background:#25D366; color:white; text-decoration:none; padding:12px; border-radius:12px; font-weight:700; font-size:0.9rem; margin-top:20px;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                    </div>
                </div>
                <div class="order-main">
                    <h4 style="margin-bottom:20px; opacity:0.7; letter-spacing:1px;">📦 ORDER ITEMS</h4>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:18px; background:rgba(255,255,255,0.03); border-radius:15px; border:1px solid var(--border-color); margin-bottom:12px;">
                        <div style="display:flex; gap:20px;">
                            <div style="width:50px; height:70px; background:rgba(255,255,255,0.05); border-radius:8px;"></div>
                            <div>
                                <p style="font-weight:700;">Cropped Jacket (Black)</p>
                                <p style="font-size:0.8rem; opacity:0.4;">Size: M | SKU: II10</p>
                            </div>
                        </div>
                        <strong>LE 699.00</strong>
                    </div>
                    
                    <div style="margin-top:35px; padding:25px; background:rgba(255,255,255,0.02); border-radius:20px; border:1px solid var(--border-color);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px; opacity:0.6; font-size:0.9rem;"><span>Items (1)</span><span>LE 699.00</span></div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px; opacity:0.6; font-size:0.9rem;"><span>Shipping (Cairo)</span><span>LE 50.00</span></div>
                        <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:15px; margin-top:10px; font-weight:800; font-size:1.5rem; color:var(--accent-green);"><span>Total Final</span><span>LE 749.00</span></div>
                    </div>

                    <div style="margin-top:40px;">
                        <label style="display:block; font-size:0.8rem; opacity:0.5; margin-bottom:12px;">UPDATE ORDER STATUS</label>
                        <div style="display:flex; gap:15px;">
                            <select style="flex-grow:1; background:var(--sidebar-bg); border:1px solid var(--border-color); color:white; padding:15px; border-radius:12px; font-weight:600; outline:none;">
                                <option>New Order</option><option>Preparing</option><option selected>Shipped</option><option>Delivered</option><option>Cancelled</option>
                            </select>
                            <button class="add-btn" style="padding:0 35px;">Save Status</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    window.closeModal = function () {
        document.getElementById('orderModal').style.display = 'none';
    };

    window.openProductModal = function () {
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';

        modalContent.innerHTML = `
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 style="margin-bottom:30px;">Add New Product</h2>
            <form style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;" onsubmit="event.preventDefault(); alert('Product Created!')">
                <div class="form-group"><label>Product Title</label><input type="text" placeholder="e.g. Deluxe Hoodie" required style="width:100%;"></div>
                <div class="form-group"><label>SKU Code</label><input type="text" placeholder="SKU-123" required style="width:100%;"></div>
                <div class="form-group"><label>Price Before (LE)</label><input type="number" value="1000" id="pBefore" oninput="upDisc()" style="width:100%;"></div>
                <div class="form-group"><label>Price After (LE)</label><input type="number" value="800" id="pAfter" oninput="upDisc()" style="width:100%;"></div>
                <div class="form-group"><label>Auto-Discount</label><input type="text" value="20%" id="pDisc" readonly style="width:100%; border:none; background:rgba(255,255,255,0.05); color:var(--accent-green); font-weight:800;"></div>
                <div class="form-group"><label>Initial Stock</label><input type="number" value="50" style="width:100%;"></div>
                <div class="form-group" style="grid-column: span 2;">
                    <label>Product Images</label>
                    <div style="border:2px dashed var(--border-color); height:120px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0.5; cursor:pointer;">
                        <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; margin-bottom:10px;"></i>
                        <span>Upload Images</span>
                    </div>
                </div>
                <button type="submit" class="add-btn" style="grid-column: span 2; padding:18px;">Save Product</button>
            </form>
        `;
    };

    window.upDisc = function () {
        const b = parseFloat(document.getElementById('pBefore').value) || 0;
        const a = parseFloat(document.getElementById('pAfter').value) || 0;
        const d = document.getElementById('pDisc');
        if (b > 0) d.value = Math.round(((b - a) / b) * 100) + '%';
    };

    function renderBanners() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Banners & Promotions</h2>
                <button class="add-btn"><i class="fa-solid fa-plus"></i> Upload Banner</button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="table-card" style="margin:0; padding:0; overflow:hidden;">
                    <div style="height:140px; background:linear-gradient(135deg,#042a25,#0a5548); display:flex; align-items:center; justify-content:center;">
                        <span style="opacity:0.3; font-size:2rem;"><i class="fa-solid fa-image"></i></span>
                    </div>
                    <div style="padding:20px; display:flex; justify-content:space-between; align-items:center;">
                        <div><p style="font-weight:600;">Summer Sale Banner</p><p style="font-size:0.8rem; opacity:0.5;">Homepage - Hero Slot</p></div>
                        <span class="status-label shipped">Active</span>
                    </div>
                </div>
                <div class="table-card" style="margin:0; border:2px dashed var(--border-color); display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:200px;">
                    <div style="text-align:center; opacity:0.3;">
                        <i class="fa-solid fa-plus" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                        <span>Add New Banner</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderReviews() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Customer Reviews</h2>
            </div>
            <div class="table-card">
                <table class="admin-table">
                    <thead><tr><th>Customer</th><th>Product</th><th>Rating</th><th>Comment</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>Mohamed Ali</td>
                            <td>Cropped Jacket</td>
                            <td>⭐⭐⭐⭐⭐</td>
                            <td style="max-width:200px; font-size:0.85rem; opacity:0.8;">Amazing quality, very comfortable!</td>
                            <td>08/03/2026</td>
                            <td><button class="view-btn" style="background:var(--accent-red); border:none; border-radius:8px; color:white; padding:6px 12px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
                        </tr>
                        <tr>
                            <td>Sara Ahmed</td>
                            <td>Oversized Tee</td>
                            <td>⭐⭐⭐⭐</td>
                            <td style="max-width:200px; font-size:0.85rem; opacity:0.8;">Good quality, fast shipping.</td>
                            <td>07/03/2026</td>
                            <td><button class="view-btn" style="background:var(--accent-red); border:none; border-radius:8px; color:white; padding:6px 12px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderCategories() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Category Tree</h2>
                <button class="add-btn"><i class="fa-solid fa-plus"></i> Add Category</button>
            </div>
            <div class="table-card">
                <ul style="list-style:none; font-size:0.95rem;">
                    <li style="margin-bottom:15px;">
                        <div style="display:flex; align-items:center; gap:10px; padding:12px; background:rgba(255,255,255,0.03); border-radius:10px;">
                            <i class="fa-solid fa-folder-open" style="color:var(--accent-green);"></i> <strong>Men</strong>
                            <div style="margin-left:auto; display:flex; gap:10px;"><i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i><i class="fa-solid fa-trash" style="cursor:pointer; color:var(--accent-red); opacity:0.5;"></i></div>
                        </div>
                        <ul style="list-style:none; margin-left:30px; margin-top:8px; border-left:1px solid var(--border-color); padding-left:15px;">
                            <li style="padding:8px 0; opacity:0.7; display:flex; justify-content:space-between;">T-Shirts <i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i></li>
                            <li style="padding:8px 0; opacity:0.7; display:flex; justify-content:space-between;">Jackets <i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i></li>
                            <li style="padding:8px 0; opacity:0.7; display:flex; justify-content:space-between;">Pants <i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i></li>
                        </ul>
                    </li>
                    <li style="margin-bottom:15px;">
                        <div style="display:flex; align-items:center; gap:10px; padding:12px; background:rgba(255,255,255,0.03); border-radius:10px;">
                            <i class="fa-solid fa-folder" style="color:var(--accent-green);"></i> <strong>Women</strong>
                            <div style="margin-left:auto; display:flex; gap:10px;"><i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i><i class="fa-solid fa-trash" style="cursor:pointer; color:var(--accent-red); opacity:0.5;"></i></div>
                        </div>
                    </li>
                    <li style="margin-bottom:15px;">
                        <div style="display:flex; align-items:center; gap:10px; padding:12px; background:rgba(255,255,255,0.03); border-radius:10px;">
                            <i class="fa-solid fa-folder" style="color:var(--accent-green);"></i> <strong>Kids</strong>
                            <div style="margin-left:auto; display:flex; gap:10px;"><i class="fa-solid fa-pen" style="cursor:pointer; opacity:0.5;"></i><i class="fa-solid fa-trash" style="cursor:pointer; color:var(--accent-red); opacity:0.5;"></i></div>
                        </div>
                    </li>
                </ul>
            </div>
        `;
    }

    function renderShipping() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Shipping Rates by Governorate</h2>
                <button class="add-btn"><i class="fa-solid fa-plus"></i> Add Area</button>
            </div>
            <div class="table-card" style="margin-top:0;">
                <table class="admin-table">
                    <thead><tr><th>Governorate</th><th>Price (LE)</th><th>Est. Delivery</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>Cairo</td><td>LE 50</td><td>24-48 Hours</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>Giza</td><td>LE 50</td><td>24-48 Hours</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>Alexandria</td><td>LE 60</td><td>2-3 Days</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>Beni Suef</td><td>LE 65</td><td>3-5 Days</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>Aswan</td><td>LE 75</td><td>4-6 Days</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>Luxor</td><td>LE 75</td><td>4-6 Days</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                        <tr><td>New Valley</td><td>LE 90</td><td>5-7 Days</td><td><i class="fa-solid fa-pen" style="cursor:pointer;"></i></td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderCoupons() {
        viewContent.innerHTML = `
            <div class="card-header">
                <h2>Coupons & Promo Codes</h2>
                <button class="add-btn"><i class="fa-solid fa-plus"></i> Create Coupon</button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
                <div style="background:linear-gradient(135deg, var(--secondary-teal), var(--primary-teal)); border:1px dashed var(--accent-green); padding:25px; border-radius:20px; position:relative; overflow:hidden;">
                    <div style="font-size:1.6rem; font-weight:800; color:var(--accent-green); letter-spacing:2px;">SAVE20</div>
                    <p style="margin:10px 0; opacity:0.7;">20% OFF on all products</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; font-size:0.8rem;">
                        <span>Used: 42 times</span>
                        <span class="status-label shipped">Active</span>
                    </div>
                    <div style="position:absolute; bottom:-15px; right:-15px; font-size:5rem; opacity:0.05;"><i class="fa-solid fa-ticket"></i></div>
                </div>
                <div style="background:linear-gradient(135deg, #2a0010, #5a0022); border:1px dashed var(--accent-red); padding:25px; border-radius:20px; position:relative; overflow:hidden;">
                    <div style="font-size:1.6rem; font-weight:800; color:var(--accent-red); letter-spacing:2px;">KIDS30</div>
                    <p style="margin:10px 0; opacity:0.7;">30% OFF on Kids category</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; font-size:0.8rem;">
                        <span>Used: 17 times</span>
                        <span class="status-label shipped">Active</span>
                    </div>
                    <div style="position:absolute; bottom:-15px; right:-15px; font-size:5rem; opacity:0.05;"><i class="fa-solid fa-ticket"></i></div>
                </div>
            </div>
        `;
    }

});
