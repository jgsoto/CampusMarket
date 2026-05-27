/**
 * my-listings.js — Módulo Marketplace
 * CampusMarket · Universidad Central del Ecuador · 2025
 *
 * Responsabilidades:
 *  - Cargar publicaciones del usuario autenticado
 *  - Renderizar cards con acciones según estado
 *  - Editar, publicar, marcar vendido y eliminar
 */

'use strict';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  BORRADOR:  { badge: 'bg-yellow-50 text-yellow-700',  label: 'Borrador'  },
  PUBLICADA: { badge: 'bg-green-50 text-green-700',    label: 'Publicada' },
  VENDIDO:   { badge: 'bg-gray-100 text-gray-500',     label: 'Vendido'   },
};

// ─── Render de una card ───────────────────────────────────────────────────────
function createMyListingCard(listing) {
  const style    = STATUS_STYLES[listing.status] ?? STATUS_STYLES.BORRADOR;
  const isSold   = listing.status === 'VENDIDO';
  const thumb    = listing.images?.find(i => i.thumbnail)?.url
                ?? listing.images?.[0]?.url
                ?? 'https://placehold.co/400x300?text=Sin+Imagen';

  const card = document.createElement('article');
  card.className = `bg-white border border-gray-100 rounded-2xl overflow-hidden
                    shadow-sm flex flex-col`;

  card.innerHTML = `
    <!-- Imagen -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img src="${thumb}" alt="${listing.title}" loading="lazy"
           class="w-full h-full object-cover ${isSold ? 'opacity-50 grayscale' : ''}"
           onerror="this.src='https://placehold.co/400x300?text=Sin+Imagen'" />
      <span class="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider
                   px-2.5 py-1 rounded-full ${style.badge}">
        ${style.label}
      </span>
    </div>

    <!-- Contenido -->
    <div class="p-5 flex flex-col gap-2 flex-1">
      <h3 class="font-display text-base font-bold text-uce-navy leading-snug line-clamp-2">
        ${listing.title}
      </h3>
      <p class="text-xs text-gray-400">${listing.categoryName ?? ''}</p>
      <p class="text-xs text-gray-500 line-clamp-2 flex-1">${listing.description}</p>
      <span class="font-display text-xl font-bold text-uce-navy mt-1">
        $${listing.price.toFixed(2)}
      </span>
    </div>

    <!-- Acciones -->
    <div class="px-5 pb-5 flex flex-wrap gap-2">
      ${!isSold ? `
        <button onclick="openEditModal('${listing.id}', \`${listing.title.replace(/`/g, '\\`')}\`, \`${listing.description.replace(/`/g, '\\`')}\`, ${listing.price})"
                class="flex-1 py-2 rounded-lg text-xs font-semibold
                       bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
          Editar
        </button>` : ''}

      ${listing.status === 'BORRADOR' ? `
        <button onclick="publishListing('${listing.id}')"
                class="flex-1 py-2 rounded-lg text-xs font-semibold
                       bg-green-500 text-white hover:bg-green-600 transition-colors">
          Publicar
        </button>` : ''}

      ${listing.status === 'PUBLICADA' ? `
        <button onclick="markAsSold('${listing.id}')"
                class="flex-1 py-2 rounded-lg text-xs font-semibold
                       bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          Marcar vendido
        </button>` : ''}

      ${isSold ? `
        <span class="flex-1 py-2 rounded-lg text-xs font-semibold text-center
                     bg-gray-100 text-gray-400">
          Vendido
        </span>` : ''}

      <button onclick="deleteListing('${listing.id}')"
              class="py-2 px-3 rounded-lg text-xs font-semibold
                     bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" aria-hidden="true" class="inline">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  `;

  return card;
}

// ─── Cargar mis publicaciones ─────────────────────────────────────────────────
async function loadMyListings() {
  const container = document.getElementById('my-listings-container');
  const ownerId   = getOwnerId();

  if (!ownerId) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-sm text-red-500">
        No se encontró la sesión local. Vuelve al
        <a href="/modules/marketplace/dashboard.html" class="underline font-semibold">Dashboard</a>.
      </div>`;
    return;
  }

  // Skeletons
  container.innerHTML = Array(3).fill(0).map(() =>
    `<div class="skeleton rounded-2xl h-80"></div>`
  ).join('');

  try {
    const res = await fetch(`${API_BASE}/api/listings/me`, {
      headers: { 'X-User-Id': ownerId },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const listings = await res.json();
    container.innerHTML = '';

    if (!listings.length) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.5" class="text-gray-400" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
          </div>
          <p class="text-gray-500 text-sm">Aún no tienes publicaciones.</p>
          <a href="/modules/marketplace/create-listing.html"
             class="text-sm font-semibold text-uce-navy underline underline-offset-4">
            Crear mi primera publicación
          </a>
        </div>`;
      return;
    }

    listings.forEach(l => container.appendChild(createMyListingCard(l)));

  } catch (err) {
    console.error('[MyListings] Error:', err);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-sm text-red-500">
      Error al cargar tus publicaciones.</div>`;
  }
}

// ─── Modal editar ─────────────────────────────────────────────────────────────
function openEditModal(id, title, desc, price) {
  document.getElementById('edit-id').value    = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-desc').value  = desc;
  document.getElementById('edit-price').value = price;
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.getElementById('edit-images').value = '';
}

// ─── Acciones API ─────────────────────────────────────────────────────────────
async function handleEditSubmit(e) {
  e.preventDefault();
  const ownerId = getOwnerId();
  const id      = document.getElementById('edit-id').value;

  const formData = new FormData();
  formData.append('title',       document.getElementById('edit-title').value.trim());
  formData.append('description', document.getElementById('edit-desc').value.trim());
  formData.append('price',       parseFloat(document.getElementById('edit-price').value));

  const files = document.getElementById('edit-images').files;
  for (const file of files) formData.append('images', file);

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}`, {
      method:  'PUT',
      headers: { 'X-User-Id': ownerId },
      body:    formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Publicación actualizada correctamente.', 'success');
    closeEditModal();
    loadMyListings();

  } catch (err) {
    console.error('[MyListings] Error editando:', err);
    showToast('No se pudo actualizar la publicación.', 'error');
  }
}

async function deleteListing(id) {
  const ok = await showConfirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.', 'Eliminar');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}`, {
      method:  'DELETE',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Publicación eliminada.', 'success');
    loadMyListings();

  } catch (err) {
    console.error('[MyListings] Error eliminando:', err);
    showToast('No se pudo eliminar la publicación.', 'error');
  }
}

async function publishListing(id) {
  const ok = await showConfirm('¿Publicar este producto ahora?', 'Publicar');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}/publish`, {
      method:  'POST',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('¡Producto publicado exitosamente!', 'success');
    loadMyListings();

  } catch (err) {
    console.error('[MyListings] Error publicando:', err);
    showToast('No se pudo publicar el producto.', 'error');
  }
}

async function markAsSold(id) {
  const ok = await showConfirm('¿Marcar como vendido? Esta acción no se puede deshacer.', 'Marcar vendido');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}/mark-sold`, {
      method:  'POST',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Producto marcado como vendido.', 'success');
    loadMyListings();

  } catch (err) {
    console.error('[MyListings] Error marcando vendido:', err);
    showToast('No se pudo actualizar el estado.', 'error');
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
window.addEventListener('load', async () => {
  await Clerk.load();

  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  MarketplaceLayout.mountNavbar('my-listings', Clerk.user);
  loadMyListings();

  document.getElementById('edit-listing-form')
    .addEventListener('submit', handleEditSubmit);

  // Cerrar modal al hacer click fuera
  document.getElementById('edit-modal')
    .addEventListener('click', e => {
      if (e.target === e.currentTarget) closeEditModal();
    });
});