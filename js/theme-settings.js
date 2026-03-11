import { db, doc, getDoc, setDoc, serverTimestamp, auth, onAuthStateChanged } from '../firebase-config.js';
import { logActivity } from '../activity-logger.js';

const storeId = window.currentStoreId || 'default';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadTheme();
});

async function loadTheme() {
    const docSnap = await getDoc(doc(db, "settings", `${storeId}_theme`));
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('primaryColor').value = data.primaryColor || '#c2213a';
        document.getElementById('primaryColorText').value = data.primaryColor || '#c2213a';
        document.getElementById('fontFamily').value = data.fontFamily || "'Cairo', sans-serif";
        document.getElementById('borderRadius').value = data.borderRadius || 12;
        updateBorderRadiusLabel(data.borderRadius || 12);
    }
}

function updateBorderRadiusLabel(val) {
    document.getElementById('borderRadiusValue').innerText = `${val}px`;
}

document.getElementById('borderRadius').oninput = (e) => updateBorderRadiusLabel(e.target.value);
document.getElementById('primaryColor').oninput = (e) => {
    document.getElementById('primaryColorText').value = e.target.value;
};

window.saveCustomTheme = async () => {
    const data = {
        primaryColor: document.getElementById('primaryColor').value,
        fontFamily: document.getElementById('fontFamily').value,
        borderRadius: document.getElementById('borderRadius').value,
        updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "settings", `${storeId}_theme`), data);
    await logActivity('تحديث مظهر المتجر المخصص');
    Toastify({ text: "تم حفظ السمة بنجاح!", backgroundColor: "green" }).showToast();
    
    // Proactively update root styles for preview
    document.documentElement.style.setProperty('--primary-color', data.primaryColor);
    document.documentElement.style.setProperty('--border-radius', `${data.borderRadius}px`);
    document.body.style.fontFamily = data.fontFamily;
};

window.applyTheme = async (preset) => {
    let data = {};
    if (preset === 'modern') {
        data = { primaryColor: '#c2213a', fontFamily: "'Cairo', sans-serif", borderRadius: 12 };
    } else if (preset === 'classic') {
        data = { primaryColor: '#f59e0b', fontFamily: "'Tajawal', sans-serif", borderRadius: 4 };
    }
    
    await setDoc(doc(db, "settings", `${storeId}_theme`), { ...data, updatedAt: serverTimestamp() });
    await logActivity(`تطبيق سمة جاهزة: ${preset}`);
    Toastify({ text: `تم تطبيق السمة ${preset}`, backgroundColor: "blue" }).showToast();
    loadTheme();
};
