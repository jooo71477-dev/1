import { db, doc, getDoc, setDoc, serverTimestamp, auth, onAuthStateChanged } from '../firebase-config.js';
import { logActivity } from '../activity-logger.js';

const storeId = window.currentStoreId || 'default';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadWhatsAppSettings();
});

async function loadWhatsAppSettings() {
    try {
        const docSnap = await getDoc(doc(db, "settings", `${storeId}_whatsapp`));
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('whatsappNumber').value = data.number || '';
            document.getElementById('apiToken').value = data.token || '';
            document.getElementById('apiProvider').value = data.provider || '';
            document.getElementById('autoOrderConfirmation').checked = data.autoConfirm !== false;
            document.getElementById('autoShippingUpdate').checked = data.autoShip !== false;
            
            const badge = document.getElementById('connectionStatus');
            if (data.number && data.token) {
                badge.innerText = 'متصل';
                badge.className = 'badge bg-success';
            }
        }
    } catch (e) { console.error(e); }
}

document.getElementById('apiSettingsForm').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        number: document.getElementById('whatsappNumber').value,
        token: document.getElementById('apiToken').value,
        provider: document.getElementById('apiProvider').value,
        updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "settings", `${storeId}_whatsapp`), data, { merge: true });
    await logActivity('تحديث إعدادات WhatsApp API');
    Toastify({ text: "تم الحفظ بنجاح", backgroundColor: "green" }).showToast();
    loadWhatsAppSettings();
};

document.getElementById('autoSendSettings').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        autoConfirm: document.getElementById('autoOrderConfirmation').checked,
        autoShip: document.getElementById('autoShippingUpdate').checked,
        updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "settings", `${storeId}_whatsapp`), data, { merge: true });
    await logActivity('تحديث تفضيلات الإرسال التلقائي');
    Toastify({ text: "تم تحديث التفضيلات", backgroundColor: "blue" }).showToast();
};
