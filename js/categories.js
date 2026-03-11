import { supabase } from '../supabase-config.js';
import { auth, onAuthStateChanged, signOut } from '../firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = 'index.html';
    else loadCategories();
});

window.logout = () => { signOut(auth); window.location.href = 'index.html'; };

async function loadCategories() {
    try {
        const { data: cats, error } = await supabase.from('categories').select('*');
        if (error) throw error;

        const tbody = document.getElementById('categoriesTable');
        const select = document.getElementById('catParent');
        
        tbody.innerHTML = cats.map(c => `
            <tr>
                <td><i class="fa-solid ${c.icon || 'fa-tag'}"></i></td>
                <td>${c.name}</td>
                <td>${c.name_en || '—'}</td>
                <td>${c.parent_id || 'رئيسية'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCat('${c.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        if (select) {
            select.innerHTML = '<option value="">بدون (رئيسية)</option>' + 
                cats.filter(c => !c.parent_id).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    } catch (e) { console.error(e); }
}

document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('catNameAr').value,
        name_en: document.getElementById('catNameEn').value,
        icon: document.getElementById('catIcon').value,
        parent_id: document.getElementById('catParent').value || null
    };

    const { error } = await supabase.from('categories').insert([data]);
    if (error) alert(error.message);
    else location.reload();
});

window.deleteCat = async (id) => {
    if (confirm('حذف؟')) {
        await supabase.from('categories').delete().eq('id', id);
        loadCategories();
    }
};
