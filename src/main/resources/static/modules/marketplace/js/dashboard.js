'use strict';

let _activeStatus = 'TODOS';
let _activeCategory = 'TODAS';

async function syncUser(clerkUser) {
    const res = await fetch(`${API_BASE}/api/v1/users/sync`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            clerkUserId: clerkUser.id, fullName: clerkUser.fullName, email: clerkUser.primaryEmailAddress.emailAddress,
        }),
    });
    if (!res.ok) throw new Error(`Sync HTTP ${res.status}`);
    return res.json();
}

async function fetchUserProfile(userId) {

    const res = await fetch(`${API_BASE}/api/users/profile/${userId}`);

    if (!res.ok) {
        throw new Error(`Profile HTTP ${res.status}`);
    }

    return res.json();

}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).slice(0, 2)
        .map(w => w[0].toUpperCase()).join('');
}

function renderAvatar(user) {

    const photo = document.getElementById('user-photo');
    const avatar = document.getElementById('user-avatar');
    const initials = document.getElementById('user-initials');

    if (!photo || !avatar || !initials) return;

    if (user.photoUrl) {

        photo.src = user.photoUrl;
        photo.classList.remove('hidden');

        avatar.classList.add('hidden');

    } else {

        initials.textContent = getInitials(user.fullName);

        avatar.classList.remove('hidden');
        photo.classList.add('hidden');

    }

}

function populateUserSection(user) {

    const skeleton = document.getElementById('user-skeleton');
    if (skeleton) skeleton.remove();

    const section = document.getElementById('user-section');
    if (section) section.style.display = 'flex';

    document.getElementById('user-name').textContent = user.fullName ?? 'Usuario';

    document.getElementById('user-email').textContent = user.email ?? user.primaryEmailAddress?.emailAddress ?? '';

    renderAvatar(user);

}

function initFilters() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');

    searchInput.addEventListener('input', () => applyFilters(searchInput.value));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            _activeStatus = btn.dataset.filter;

            filterBtns.forEach(b => {
                const isActive = b.dataset.filter === _activeStatus;
                b.className = isActive ? "filter-btn px-4 py-2 text-xs font-semibold rounded-xl border-2 transition-all bg-uce-navy text-uce-gold border-uce-navy" : "filter-btn px-4 py-2 text-xs font-semibold rounded-xl border-2 transition-all bg-white text-gray-500 border-gray-200 hover:bg-gray-50";
            });

            applyFilters(searchInput.value);
        });
    });
}

function applyFilters(query = '') {
    const q = query.toLowerCase();

    const filtered = _catalogCache.filter(item => {
        const matchesStatus = _activeStatus === 'TODOS' || item.status === _activeStatus;
        const matchesSearch = !q || item.title.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q);

        const matchesCategory = _activeCategory === 'TODAS' || item.categoryName === _activeCategory;
        return matchesStatus && matchesSearch && matchesCategory;

    });

    if (filtered.length > 0) {
        renderCatalog(filtered);
    } else {
        renderEmpty(q ? `No se encontraron productos para "${q}".` : 'No hay productos en este estado.');
    }
}

async function initCategories() {
    try {
        const res = await fetch(`${API_BASE}/api/listings/categories`);
        if (!res.ok) throw new Error('Error al cargar categorías');
        const categories = await res.json();

        const select = document.getElementById('category-select');
        if (!select) return;


        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            select.appendChild(option);
        });


        select.addEventListener('change', (e) => {
            _activeCategory = e.target.value;
            applyFilters(document.getElementById('search-input').value);
        });

    } catch (err) {
        console.error('[Dashboard] Error cargando categorías:', err);
    }
}


window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/modules/identity/signin.html';
        return;
    }

    await MarketplaceLayout.mountNavbar('dashboard', Clerk.user);

    let user;

    try {

        user = await syncUser(Clerk.user);

        localStorage.setItem('campusMarketUserId', user.id);

        // Obtener información completa del perfil
        const profile = await fetchUserProfile(user.id);

        // Agregar la foto al usuario
        user.photoUrl = profile.photoUrl;

    } catch (err) {

        console.error('[Dashboard] Error:', err);

        showToast('No se pudo cargar tu perfil.', 'warning');

    }

    populateUserSection(user);

    // IMPORTANTE: En tu marketplace.js (donde está loadCatalog),
    // asegúrate de que al terminar el fetch hagas: _catalogCache = data; renderCatalog(data);
    await loadCatalog();
    initFilters();
    initCategories();

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await Clerk.signOut();
        window.location.href = '/index.html';
    });
});