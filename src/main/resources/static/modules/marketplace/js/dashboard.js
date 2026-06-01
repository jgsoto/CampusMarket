'use strict';

let _activeStatus = 'TODOS';

async function syncUser(clerkUser) {
  const res = await fetch(`${API_BASE}/api/v1/users/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkUserId: clerkUser.id,
      fullName: clerkUser.fullName,
      email: clerkUser.primaryEmailAddress.emailAddress,
    }),
  });
  if (!res.ok) throw new Error(`Sync HTTP ${res.status}`);
  return res.json();
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('');
}

function populateUserSection(clerkUser) {
  const skeleton = document.getElementById('user-skeleton');
  if (skeleton) skeleton.remove();

  const section = document.getElementById('user-section');
  if (section) section.style.display = 'flex';

  const name = clerkUser.fullName ?? 'Usuario';
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-email').textContent = clerkUser.primaryEmailAddress.emailAddress;
  document.getElementById('user-initials').textContent = getInitials(name);
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
        b.className = isActive 
          ? "filter-btn px-4 py-2 text-xs font-semibold rounded-xl border-2 transition-all bg-uce-navy text-uce-gold border-uce-navy"
          : "filter-btn px-4 py-2 text-xs font-semibold rounded-xl border-2 transition-all bg-white text-gray-500 border-gray-200 hover:bg-gray-50";
      });
      
      applyFilters(searchInput.value);
    });
  });
}

function applyFilters(query = '') {
  const q = query.toLowerCase();

  const filtered = _catalogCache.filter(item => {
    const matchesStatus = _activeStatus === 'TODOS' || item.status === _activeStatus;
    const matchesSearch = !q || 
                          item.title.toLowerCase().includes(q) || 
                          (item.description ?? '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length > 0) {
    renderCatalog(filtered);
  } else {
    renderEmpty(q ? `No se encontraron productos para "${q}".` : 'No hay productos en este estado.');
  }
}

window.addEventListener('load', async () => {
  await Clerk.load();

  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  MarketplaceLayout.mountNavbar('dashboard', Clerk.user);

  try {
    const user = await syncUser(Clerk.user);
    localStorage.setItem('campusMarketUserId', user.id);
  } catch (err) {
    console.error('[Dashboard] syncUser failed:', err);
    showToast('No se pudo sincronizar tu sesión.', 'warning');
  }

  populateUserSection(Clerk.user);
  
  // IMPORTANTE: En tu marketplace.js (donde está loadCatalog), 
  // asegúrate de que al terminar el fetch hagas: _catalogCache = data; renderCatalog(data);
  await loadCatalog(); 
  initFilters();

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await Clerk.signOut();
    window.location.href = '/index.html';
  });
});