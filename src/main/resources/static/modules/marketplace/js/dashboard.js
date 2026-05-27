'use strict';

async function syncUser(clerkUser) {
  const res = await fetch(`${API_BASE}/api/v1/users/sync`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkUserId: clerkUser.id,
      fullName:    clerkUser.fullName,
      email:       clerkUser.primaryEmailAddress.emailAddress,
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
  document.getElementById('user-name').textContent     = name;
  document.getElementById('user-email').textContent    = clerkUser.primaryEmailAddress.emailAddress;
  document.getElementById('user-initials').textContent = getInitials(name);
}

function initSearchBar() {
  const selectorBtn      = document.getElementById('category-selector-btn');
  const dropdown         = document.getElementById('category-dropdown');
  const categoryLabel    = document.getElementById('category-label');
  const categoryChevron  = document.getElementById('category-chevron');
  const searchInput      = document.getElementById('search-input');
  const searchBtn        = document.getElementById('search-btn');

  let activeCategory = 'all';

  selectorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', isOpen);
    selectorBtn.setAttribute('aria-expanded', String(!isOpen));
    categoryChevron.style.transform = isOpen ? '' : 'rotate(180deg)';
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('category-selector-wrapper')?.contains(e.target)) {
      dropdown.classList.add('hidden');
      selectorBtn.setAttribute('aria-expanded', 'false');
      categoryChevron.style.transform = '';
    }
  });

  dropdown.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', () => {
      activeCategory = option.dataset.category;
      categoryLabel.textContent = option.dataset.label;
      dropdown.classList.add('hidden');
      selectorBtn.setAttribute('aria-expanded', 'false');
      categoryChevron.style.transform = '';
      applyFilters();
    });
  });

  searchInput.addEventListener('input', () => applyFilters());

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyFilters();
  });
  searchBtn.addEventListener('click', () => applyFilters());

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    let filtered = _catalogCache;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(l =>
        (l.categoryName ?? '').toLowerCase().includes(activeCategory)
      );
    }

    if (query) {
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        (l.categoryName ?? '').toLowerCase().includes(query)
      );
    }

    if (filtered.length) {
      renderCatalog(filtered);
    } else {
      renderEmpty(query
        ? `No se encontraron productos para "${query}".`
        : 'No hay productos en esta categoría.'
      );
    }
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
  loadCatalog();
  initSearchBar();

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await Clerk.signOut();
    window.location.href = '/index.html';
  });
});