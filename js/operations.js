import { db, doc, getDoc, setDoc, collection, addDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, auth, onAuthStateChanged } from '../firebase-config.js';
import { logActivity } from '../activity-logger.js';

const storeId = window.currentStoreId || 'default';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else {
        loadMaintenanceStatus();
        loadIncidents();
        loadDecisions();
    }
});

// --- MAINTENANCE MODE ---
const mSwitch = document.getElementById('maintenanceSwitch');
const mDetails = document.getElementById('maintenanceDetails');

async function loadMaintenanceStatus() {
    const docSnap = await getDoc(doc(db, "settings", `${storeId}_maintenance`));
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (mSwitch) mSwitch.checked = data.enabled;
        if (document.getElementById('maintenanceMsg')) document.getElementById('maintenanceMsg').value = data.message || '';
        if (mDetails) mDetails.style.display = data.enabled ? 'block' : 'none';
    }
}

if (mSwitch) {
    mSwitch.onchange = () => {
        mDetails.style.display = mSwitch.checked ? 'block' : 'none';
    };
}

const btnSaveMaintenance = document.getElementById('btnSaveMaintenance');
if (btnSaveMaintenance) {
    btnSaveMaintenance.onclick = async () => {
        await setDoc(doc(db, "settings", `${storeId}_maintenance`), {
            enabled: mSwitch.checked,
            message: document.getElementById('maintenanceMsg').value,
            updatedBy: auth.currentUser.email,
            updatedAt: serverTimestamp()
        });
        await logActivity('تحديث وضع الصيانة', { enabled: mSwitch.checked });
        Toastify({ text: "تم تحديث الإعدادات", backgroundColor: "blue" }).showToast();
    };
}

// --- INCIDENT MANAGEMENT ---
const incidentForm = document.getElementById('incidentForm');
if (incidentForm) {
    incidentForm.onsubmit = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "incidents"), {
            storeId,
            title: document.getElementById('incidentTitle').value,
            severity: document.getElementById('incidentSeverity').value,
            status: 'open',
            timestamp: serverTimestamp(),
            reportedBy: auth.currentUser.email
        });
        incidentForm.reset();
        loadIncidents();
        Toastify({ text: "تم تسجيل العطل", backgroundColor: "red" }).showToast();
    };
}

async function loadIncidents() {
    const q = query(collection(db, "incidents"), where("storeId", "==", storeId), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const tbody = document.getElementById('incidentsTable');
    if (!tbody) return;

    tbody.innerHTML = snapshot.docs.map(docSnap => {
        const inc = docSnap.data();
        const date = inc.timestamp ? new Date(inc.timestamp.seconds * 1000).toLocaleString('ar-EG') : '...';
        const severityBadge = inc.severity === 'high' ? 'bg-danger' : (inc.severity === 'medium' ? 'bg-warning text-dark' : 'bg-info text-dark');
        const statusBadge = inc.status === 'open' ? 'text-danger border border-danger p-1 rounded' : 'text-success p-1';

        return `
        <tr>
            <td><small>${date}</small></td>
            <td>${inc.title}</td>
            <td><span class="badge ${severityBadge}">${inc.severity}</span></td>
            <td><span class="small ${statusBadge}">${inc.status === 'open' ? 'نشط' : 'محلول'} <i class="fa-solid ${inc.status === 'open' ? 'fa-circle-dot' : 'fa-check'}"></i></span></td>
            <td>
                ${inc.status === 'open' ? `<button onclick="resolveIncident('${docSnap.id}')" class="btn btn-sm btn-outline-success">تم الحل</button>` : '<small class="text-white-50">تم الحل</small>'}
            </td>
        </tr>`;
    }).join('') || '<tr><td colspan="5" class="text-center py-4">لا توجد أعطال مسجلة</td></tr>';
}

window.resolveIncident = async (id) => {
    await updateDoc(doc(db, "incidents", id), { status: 'resolved', resolvedAt: serverTimestamp() });
    loadIncidents();
    Toastify({ text: "تم تحديث الحالة", backgroundColor: "green" }).showToast();
};

// --- DECISION LOGS ---
const decisionForm = document.getElementById('decisionForm');
if (decisionForm) {
    decisionForm.onsubmit = async (e) => {
        e.preventDefault();
        const text = document.getElementById('decisionText').value;
        await addDoc(collection(db, "decisions"), {
            storeId,
            text,
            user: auth.currentUser.email,
            timestamp: serverTimestamp()
        });
        decisionForm.reset();
        loadDecisions();
        Toastify({ text: "تم تسجيل القرار", backgroundColor: "green" }).showToast();
    };
}

async function loadDecisions() {
    const q = query(collection(db, "decisions"), where("storeId", "==", storeId), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const div = document.getElementById('decisionHistory');
    if (!div) return;

    div.innerHTML = snap.docs.map(d => {
        const dec = d.data();
        const dDate = dec.timestamp ? new Date(dec.timestamp.seconds * 1000).toLocaleString('ar-EG') : '...';
        return `<div class="mb-2 pb-2 border-bottom border-secondary">
            <span class="text-white">${dec.text}</span>
            <div class="x-small text-white-50 mt-1"><i class="fa-solid fa-clock me-1"></i> ${dDate} • ${dec.user?.split('@')[0]}</div>
        </div>`;
    }).join('') || 'لا يوجد قرارات مسجلة.';
}
