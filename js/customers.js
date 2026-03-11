import { db, auth, collection, getDocs, onAuthStateChanged, signOut } from '../firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadCustomers();
});

window.logout = () => { signOut(auth); window.location.href = 'index.html'; };

async function loadCustomers() {
    try {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const customers = {};
        
        ordersSnap.forEach(doc => {
            const order = doc.data();
            const email = order.customer_email || order.user_email;
            if (!email) return;
            
            if (!customers[email]) {
                customers[email] = {
                    name: order.customer_name || email.split('@')[0],
                    email: email,
                    phone: order.customer_phone || order.phone,
                    total_orders: 0,
                    total_spent: 0
                };
            }
            customers[email].total_orders++;
            if (order.status === 'completed') {
                customers[email].total_spent += order.total_price || 0;
            }
        });
        
        const tbody = document.getElementById('customersTable');
        const customersArray = Object.values(customers).sort((a, b) => b.total_spent - a.total_spent);
        
        if (customersArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">لا يوجد عملاء</td></tr>';
            return;
        }
        
        tbody.innerHTML = customersArray.map(c => {
            const isVIP = c.total_spent > 1000;
            return `
                <tr>
                    <td><div class="fw-bold">${c.name}</div><small class="text-muted">${c.email}</small></td>
                    <td>${c.phone || '—'}</td>
                    <td>${c.total_orders}</td>
                    <td class="text-success fw-bold">${c.total_spent.toFixed(2)} ج.م</td>
                    <td>${isVIP ? '<span class="badge bg-warning text-dark">VIP</span>' : ''}</td>
                    <td><button class="btn btn-sm btn-outline-info" onclick="viewCustomerDetails('${c.email}')"><i class="fa-solid fa-eye"></i></button></td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error(error);
        if (document.getElementById('customersTable')) {
            document.getElementById('customersTable').innerHTML = '<tr><td colspan="6" class="text-center text-danger">فشل التحميل</td></tr>';
        }
    }
}

window.viewCustomerDetails = (email) => { alert('تفاصيل العميل: ' + email); };
window.exportCustomers = () => { alert('جاري تصدير العملاء...'); };

document.getElementById('searchCustomers')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('#customersTable tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});
