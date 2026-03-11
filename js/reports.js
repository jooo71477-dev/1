import { db, auth, collection, getDocs, onAuthStateChanged, signOut } from '../firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else initReports();
});

window.logout = () => { signOut(auth); window.location.href = 'index.html'; };

async function initReports() {
    const snap = await getDocs(collection(db, "orders"));
    const salesData = { 'أحد': 0, 'اثن': 0, 'ثلا': 0, 'أرب': 0, 'خمي': 0, 'جمع': 0, 'سبت': 0 };
    const statusData = { 'pending': 0, 'completed': 0, 'cancelled': 0 };

    snap.forEach(doc => {
        const d = doc.data();
        statusData[d.status || 'pending']++;
        if (d.status === 'completed') {
            // Dummy logic for weekly sales
            const day = Math.floor(Math.random() * 7);
            const days = Object.keys(salesData);
            salesData[days[day]] += d.total_price || 0;
        }
    });

    new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels: Object.keys(salesData),
            datasets: [{
                label: 'المبيعات',
                data: Object.values(salesData),
                borderColor: '#c2213a',
                tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
            labels: ['معلق', 'مكتمل', 'ملغي'],
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: ['#ffc107', '#198754', '#dc3545']
            }]
        }
    });
}
