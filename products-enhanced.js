import { auth, db, collection, query, where, getDocs, doc, getDoc, signOut, onAuthStateChanged, addDoc, serverTimestamp, updateDoc, orderBy, limit } from './firebase-config.js';
import { supabase, supabaseData } from './supabase-config.js';
import { logActivity } from './activity-logger.js';

// Auth Check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadProducts();
        loadCategories();
    }
});

window.logout = async () => {
    await signOut(auth);
    window.location.href = 'index.html';
};

// Global variables
let allProducts = [];
let categories = [];
let editingProductId = null;

// ==================== LOAD CATEGORIES ====================
async function loadCategories() {
    try {
        if (!supabase) return;

        const { data: cats, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        categories = [];
        const categoryFilter = document.getElementById('categoryFilter');
        const productCategory = document.getElementById('productCategory');

        if (categoryFilter) categoryFilter.innerHTML = '<option value="">جميع الفئات</option>';
        if (productCategory) productCategory.innerHTML = '<option value="">اختر الفئة</option>';

        if (cats) {
            cats.forEach(cat => {
                const parent = cat.parent_id ? cats.find(c => c.id === cat.parent_id) : null;
                const displayName = parent ? `${parent.name} > ${cat.name}` : cat.name;
                categories.push({ ...cat, displayName });
                if (categoryFilter) categoryFilter.innerHTML += `<option value="${cat.name}">${displayName}</option>`;
                if (productCategory) productCategory.innerHTML += `<option value="${cat.name}">${displayName}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ==================== LOAD PRODUCTS ====================
async function loadProducts() {
    try {
        const products = await supabaseData.getProducts();
        allProducts = products || [];
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ==================== DISPLAY PRODUCTS ====================
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<tr><td colspan="10" class="text-center py-4 text-white-50">لا توجد منتجات</td></tr>';
        return;
    }

    grid.innerHTML = products.map(p => {
        const stock = p.stock || 0;
        const profit = (p.price || 0) - (p.cost_price || 0);

        return `
        <tr data-id="${p.id}">
            <td class="ps-4 text-center">
                <input type="checkbox" class="form-check-input product-select" data-id="${p.id}">
            </td>
            <td class="ps-2">
                <img src="${p.image_url || 'https://via.placeholder.com/300?text=No+Image'}" width="50" height="50" style="object-fit: cover; border-radius: 8px;">
            </td>
            <td><div class="fw-bold">${p.name}</div></td>
            <td>${p.category || 'بدون فئة'}</td>
            <td>${p.price} ج.م</td>
            <td><span class="badge ${stock > 0 ? 'bg-success' : 'bg-danger'}">${stock}</span></td>
            <td>${p.total_sold || 0}</td>
            <td class="fw-bold text-success">${profit.toFixed(2)} ج.م</td>
            <td><span class="badge ${p.is_active !== false ? 'bg-success' : 'bg-secondary'}">${p.is_active !== false ? 'متاح' : 'غير متاح'}</span></td>
            <td>
                <div class="btn-group">
                    <button onclick="editProduct('${p.id}')" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteProduct('${p.id}')" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// Global functions for inline actions
window.editProduct = (id) => { /* logic in modal handler */ };
window.deleteProduct = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await supabaseData.deleteProduct(id);
    loadProducts();
};
