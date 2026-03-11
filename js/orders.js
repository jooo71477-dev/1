import { db, auth, collection, getDocs, updateDoc, doc, onAuthStateChanged, signOut, query, orderBy } from '../firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadOrders();
});

window.logout = () => { signOut(auth); window.location.href = 'index.html'; };

async function loadOrders() {
    try {
        const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
        const snap = await getDocs(q);
        const tbody = document.getElementById('ordersTable');
        
        tbody.innerHTML = snap.docs.map(doc => {
            const o = doc.data();
            const id = doc.id;
            const date = o.created_at ? new Date(o.created_at.seconds * 1000).toLocaleDateString('ar-EG') : '—';
            
            let badge = 'bg-warning';
            if (o.status === 'completed') badge = 'bg-success';
            if (o.status === 'cancelled') badge = 'bg-danger';

            return `
                <tr>
                    <td>#${id.substring(0,8)}</td>
                    <td>${o.customer_name || 'عميل'}</td>
                    <td>${date}</td>
                    <td><span class="badge ${badge}">${o.status}</span></td>
                    <td class="fw-bold">${o.total_price} ج.م</td>
                    <td>
                        <select onchange="updateStatus('${id}', this.value)" class="form-select form-select-sm d-inline-block w-auto">
                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>معلق</option>
                            <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                        </select>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

window.updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    loadOrders();
};
