import { db, auth, collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, onAuthStateChanged, signOut } from '../firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadCoupons();
});

window.logout = () => { signOut(auth); window.location.href = 'index.html'; };

async function loadCoupons() {
    try {
        const snap = await getDocs(collection(db, "coupons"));
        const tbody = document.getElementById('couponsTable');
        
        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">لا يوجد كوبونات</td></tr>';
            return;
        }

        tbody.innerHTML = snap.docs.map(doc => {
            const c = doc.data();
            const id = doc.id;
            return `
                <tr>
                    <td><span class="badge bg-primary fs-6">${c.code}</span></td>
                    <td>${c.type === 'percent' ? 'نسبة %' : 'مبلغ ثابت'}</td>
                    <td>${c.value}${c.type === 'percent' ? '%' : ' ج.م'}</td>
                    <td>${c.min_order || 0} ج.م</td>
                    <td>${c.expiry}</td>
                    <td>${c.usage_count || 0} / ${c.usage_limit || '∞'}</td>
                    <td><button class="btn btn-sm btn-outline-danger" onclick="deleteCoupon('${id}')"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

document.getElementById('couponForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        code: document.getElementById('code').value.toUpperCase(),
        type: document.getElementById('type').value,
        value: Number(document.getElementById('value').value),
        min_order: Number(document.getElementById('min_order').value),
        expiry: document.getElementById('expiry').value,
        usage_count: 0,
        usage_limit: null,
        created_at: serverTimestamp()
    };
    
    try {
        await addDoc(collection(db, "coupons"), data);
        alert('تمت الإضافة');
        location.reload();
    } catch (e) { alert(e.message); }
});

window.deleteCoupon = async (id) => {
    if (confirm('حذف؟')) {
        await deleteDoc(doc(db, "coupons", id));
        loadCoupons();
    }
};
