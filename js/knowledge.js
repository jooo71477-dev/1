import { db, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, serverTimestamp, auth, onAuthStateChanged } from '../firebase-config.js';
import { logActivity } from '../activity-logger.js';

const kForm = document.getElementById('knowledgeForm');
const kGrid = document.getElementById('knowledgeGrid');
const kSearch = document.getElementById('knowledgeSearch');
let allKnowledge = [];

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadKnowledge();
});

async function loadKnowledge() {
    try {
        const storeId = window.currentStoreId || 'default';
        const q = query(collection(db, "knowledge_base"), where("storeId", "==", storeId), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        allKnowledge = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderKnowledge(allKnowledge);
    } catch (e) {
        console.error(e);
        kGrid.innerHTML = '<div class="col-12 text-center text-danger">فشل تحميل البيانات</div>';
    }
}

function renderKnowledge(data) {
    if (data.length === 0) {
        kGrid.innerHTML = '<div class="col-12 text-center py-5 text-white-50">لا يوجد محتوى حالياً. قم بإضافة أول دليل تشغيل!</div>';
        return;
    }

    kGrid.innerHTML = data.map(k => `
        <div class="col-md-6 col-lg-4">
            <div class="glass-card h-100 p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25">${k.category}</span>
                    <button onclick="deleteKnowledge('${k.id}')" class="btn btn-sm text-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
                <h5 class="fw-bold text-white mb-3">${k.title}</h5>
                <p class="text-white-50 small mb-4 text-truncate-3" style="white-space: pre-wrap;">${k.content}</p>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                    <small class="text-white-50"><i class="fa-solid fa-clock me-1"></i> ${k.timestamp ? new Date(k.timestamp.seconds * 1000).toLocaleDateString('ar-EG') : '...'}</small>
                    <button onclick="viewKnowledge('${k.id}')" class="btn btn-sm btn-outline-light">اقرأ المزيد</button>
                </div>
            </div>
        </div>
    `).join('');
}

if (kForm) {
    kForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;

        try {
            const data = {
                title: document.getElementById('kTitle').value,
                category: document.getElementById('kCategory').value,
                content: document.getElementById('kContent').value,
                storeId: window.currentStoreId || 'default',
                timestamp: serverTimestamp(),
                createdBy: auth.currentUser.email
            };

            await addDoc(collection(db, "knowledge_base"), data);
            await logActivity('إضافة دليل تشغيل (SOP)', { title: data.title });

            Toastify({ text: "تم إضافة الدليل بنجاح", backgroundColor: "green" }).showToast();
            bootstrap.Modal.getInstance(document.getElementById('addKnowledgeModal')).hide();
            kForm.reset();
            loadKnowledge();
        } catch (e) {
            console.error(e);
        } finally {
            btn.disabled = false;
        }
    };
}

window.viewKnowledge = (id) => {
    const k = allKnowledge.find(item => item.id === id);
    Swal.fire({
        title: k.title,
        html: `<div class="text-start text-white p-3" style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6;">${k.content}</div>`,
        background: '#0d0d0d',
        color: '#fff',
        confirmButtonColor: '#c2213a',
        confirmButtonText: 'إغلاق',
        width: '700px'
    });
};

window.deleteKnowledge = async (id) => {
    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'سيتم حذف هذا الدليل نهائياً',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء',
        background: '#0d0d0d', color: '#fff',
        confirmButtonColor: '#c2213a'
    });

    if (result.isConfirmed) {
        await deleteDoc(doc(db, "knowledge_base", id));
        Toastify({ text: "تم الحذف", backgroundColor: "orange" }).showToast();
        loadKnowledge();
    }
};

if (kSearch) {
    kSearch.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allKnowledge.filter(k =>
            k.title.toLowerCase().includes(term) ||
            k.category.toLowerCase().includes(term) ||
            k.content.toLowerCase().includes(term)
        );
        renderKnowledge(filtered);
    };
}
