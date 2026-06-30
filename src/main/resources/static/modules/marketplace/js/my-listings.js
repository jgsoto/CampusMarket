'use strict';

const STATUS_STYLES = {
  BORRADOR:  { badge: 'bg-yellow-50 text-yellow-700',  label: 'Borrador'  },
  PUBLICADA: { badge: 'bg-green-50 text-green-700',    label: 'Publicada' },
  VENDIDO:   { badge: 'bg-gray-100 text-gray-500',     label: 'Vendido'   },
};

const ListingsDOM = Object.freeze({
  tabProducts:   () => document.getElementById('tab-products'),
  tabTutoring:   () => document.getElementById('tab-tutoring'),
  tabResources:  () => document.getElementById('tab-resources'),
  secProducts:   () => document.getElementById('section-products'),
  secTutoring:   () => document.getElementById('section-tutoring'),
  secResources:  () => document.getElementById('section-resources'),
  productsGrid:  () => document.getElementById('my-listings-container'),
  tutoringGrid:  () => document.getElementById('my-tutoring-container'),
  resourcesGrid: () => document.getElementById('my-resources-container'),
  btnNewPub:     () => document.getElementById('btn-new-publication'),
});

function initTabs() {
  const btnProd = ListingsDOM.tabProducts();
  const btnTut = ListingsDOM.tabTutoring();
  const btnRes = ListingsDOM.tabResources();
  const secProd = ListingsDOM.secProducts();
  const secTut = ListingsDOM.secTutoring();
  const secRes = ListingsDOM.secResources();
  const btnNew = ListingsDOM.btnNewPub();

  btnProd?.addEventListener('click', () => {
    secProd.classList.replace('hidden', 'block');
    secTut.classList.replace('block', 'hidden');
    secRes.classList.replace('block', 'hidden');
    btnProd.className = "px-6 py-3 text-sm font-bold border-b-2 border-uce-navy text-uce-navy transition-all";
    btnTut.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    btnRes.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    
    if (btnNew) btnNew.href = "/modules/marketplace/create-listing.html";
  });

  btnTut?.addEventListener('click', () => {
    secTut.classList.replace('hidden', 'block');
    secProd.classList.replace('block', 'hidden');
    secRes.classList.replace('block', 'hidden');
    btnTut.className = "px-6 py-3 text-sm font-bold border-b-2 border-uce-navy text-uce-navy transition-all";
    btnProd.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    btnRes.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    
    if (btnNew) btnNew.href = "/modules/tutoring/create-tutoring.html";
  });

  btnRes?.addEventListener('click', () => {
    secRes.classList.replace('hidden', 'block');
    secProd.classList.replace('block', 'hidden');
    secTut.classList.replace('block', 'hidden');
    btnRes.className = "px-6 py-3 text-sm font-bold border-b-2 border-uce-navy text-uce-navy transition-all";
    btnProd.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    btnTut.className = "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-uce-navy transition-all";
    
    if (btnNew) btnNew.href = "/modules/resources/create-resource.html";
  });
}

function createMyListingCard(listing) {
  const style = STATUS_STYLES[listing.status] ?? STATUS_STYLES.BORRADOR;
  const isSold = listing.status === 'VENDIDO';
  const thumb = listing.images?.find(i => i.thumbnail)?.url
            ?? listing.images?.[0]?.url
            ?? 'https://placehold.co/400x300?text=Sin+Imagen';

  const card = document.createElement('article');
  card.className = `bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col`;

  card.innerHTML = `
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img src="${thumb}" alt="${listing.title}" loading="lazy" class="w-full h-full object-cover ${isSold ? 'opacity-50 grayscale' : ''}" onerror="this.src='https://placehold.co/400x300?text=Sin+Imagen'" />
      <span class="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.badge}">
        ${style.label}
      </span>
    </div>
    <div class="p-5 flex flex-col gap-2 flex-1">
      <h3 class="font-display text-base font-bold text-uce-navy leading-snug line-clamp-2">${listing.title}</h3>
      <p class="text-xs text-gray-400">${listing.categoryName ?? ''}</p>
      <p class="text-xs text-gray-500 line-clamp-2 flex-1">${listing.description}</p>
      <span class="font-display text-xl font-bold text-uce-navy mt-1">$${listing.price.toFixed(2)}</span>
    </div>
    <div class="px-5 pb-5 flex flex-wrap gap-2">
      ${!isSold ? `<button onclick="openEditModal('${listing.id}', \`${listing.title.replace(/`/g, '\\`')}\`, \`${listing.description.replace(/`/g, '\\`')}\`, ${listing.price})" class="flex-1 py-2 rounded-lg text-xs font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">Editar</button>` : ''}
      ${listing.status === 'BORRADOR' ? `<button onclick="publishListing('${listing.id}')" class="flex-1 py-2 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors">Publicar</button>` : ''}
      ${listing.status === 'PUBLICADA' ? `<button onclick="markAsSold('${listing.id}')" class="flex-1 py-2 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">Marcar vendido</button>` : ''}
      ${isSold ? `<span class="flex-1 py-2 rounded-lg text-xs font-semibold text-center bg-gray-100 text-gray-400">Vendido</span>` : ''}
      <button onclick="deleteListing('${listing.id}')" class="py-2 px-3 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="inline"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    </div>
  `;
  return card;
}

function createMyTutoringCard(offer) {
  const isClosed = offer.status === 'CLOSED';
  const card = document.createElement('article');
  card.className = `bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-3`;

  card.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-bold text-uce-navy text-sm line-clamp-2">${offer.subject}</h3>
      <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${isClosed ? 'bg-gray-100 text-gray-400' : 'bg-emerald-100 text-emerald-700'}">
        ${isClosed ? 'Cerrada' : 'Activa'}
      </span>
    </div>
    <p class="text-xs text-gray-400 line-clamp-2">${offer.description}</p>
    <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
      <span class="font-bold text-emerald-600 text-sm">$${offer.hourlyRate}/h</span>
      <button onclick="window.location.href='/modules/tutoring/tutoring-details.html?id=${offer.id}'" class="px-4 py-1.5 bg-uce-navy text-uce-gold text-xs font-bold rounded-xl hover:bg-uce-navy-light transition-all">
        Gestionar
      </button>
    </div>
  `;
  return card;
}

async function loadMyListings() {
  const container = ListingsDOM.productsGrid();
  const ownerId = getOwnerId();

  if (!ownerId) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-sm text-red-500">No se encontró la sesión local. Vuelve al <a href="/modules/marketplace/dashboard.html" class="underline font-semibold">Dashboard</a>.</div>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/listings/me`, { headers: { 'X-User-Id': ownerId } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const listings = await res.json();
    container.innerHTML = '';

    if (!listings.length) {
      container.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 gap-4"><p class="text-gray-500 text-sm">Aún no tienes publicaciones en el Marketplace.</p></div>`;
      return;
    }
    listings.forEach(l => container.appendChild(createMyListingCard(l)));
  } catch (err) {
    console.error('[MyListings] Error:', err);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-sm text-red-500">Error al cargar tus publicaciones.</div>`;
  }
}

async function loadMyTutoring() {
  const container = ListingsDOM.tutoringGrid();
  const ownerId = getOwnerId();

  try {
    const res = await fetch(`${API_BASE}/api/tutoring`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const offers = await res.json();
    const myOffers = offers.filter(o => o.tutorId === ownerId);
    container.innerHTML = '';

    if (!myOffers.length) {
      container.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 gap-4"><p class="text-gray-500 text-sm">No has publicado ofertas de tutoría aún.</p></div>`;
      return;
    }
    myOffers.forEach(o => container.appendChild(createMyTutoringCard(o)));
  } catch (err) {
    console.error('[MyTutoring] Error:', err);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-sm text-red-500">Error al cargar tutorías.</div>`;
  }
}

function openEditModal(id, title, desc, price) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-desc').value = desc;
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

async function handleEditSubmit(e) {
  e.preventDefault();
  const ownerId = getOwnerId();
  const id = document.getElementById('edit-id').value;

  const formData = new FormData();
  formData.append('title', document.getElementById('edit-title').value.trim());
  formData.append('description', document.getElementById('edit-desc').value.trim());
  formData.append('price', parseFloat(document.getElementById('edit-price').value));

  const files = document.getElementById('edit-images').files;
  for (const file of files) formData.append('images', file);

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}`, {
      method: 'PUT',
      headers: { 'X-User-Id': ownerId },
      body: formData,
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
      method: 'DELETE',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Publicación actualizada.', 'success');
    loadMyListings();
  } catch (err) {
    console.error('[MyListings] Error:', err);
  }
}

async function publishListing(id) {
  const ok = await showConfirm('¿Publicar este producto ahora?', 'Publicar');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}/publish`, {
      method: 'POST',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('¡Producto publicado exitosamente!', 'success');
    loadMyListings();
  } catch (err) {
    console.error('[MyListings] Error:', err);
  }
}

async function markAsSold(id) {
  const ok = await showConfirm('¿Marcar como vendido? Esta acción no se puede deshacer.', 'Marcar vendido');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/listings/${id}/mark-sold`, {
      method: 'POST',
      headers: { 'X-User-Id': getOwnerId() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Producto marcado como vendido.', 'success');
    loadMyListings();
  } catch (err) {
    console.error('[MyListings] Error:', err);
  }
}

window.addEventListener('load', async () => {
  await Clerk.load();
  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  MarketplaceLayout.mountNavbar('my-listings', Clerk.user);
  initTabs();
  
  await Promise.all([loadMyListings(), loadMyTutoring(), loadMyResources()]);

  document.getElementById('edit-listing-form').addEventListener('submit', handleEditSubmit);
  document.getElementById('edit-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEditModal();
  });
});

function createMyResourceCard(resource) {
  const card = document.createElement('article');
  card.className = `bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col h-full`;
  
  const fileCount = resource.files ? resource.files.length : 0;
  
  card.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <span class="inline-block px-3 py-1 bg-uce-navy/5 text-uce-navy text-xs font-bold rounded-lg">${resource.category || 'Recurso'}</span>
      <span class="text-gray-400 text-xs flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        ${fileCount} arch.
      </span>
    </div>
    <h3 class="font-display font-bold text-gray-800 text-lg mb-2 line-clamp-2">${resource.title}</h3>
    <p class="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">${resource.description}</p>
    <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto gap-2">
      <button onclick="window.location.href='/modules/resources/edit-resource.html?id=${resource.id}'" class="flex-1 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-xl hover:bg-yellow-100 transition-all">
        Editar
      </button>
      <button onclick="deleteMyResource('${resource.id}')" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    </div>
  `;
  return card;
}

async function deleteMyResource(id) {
  const ok = await showConfirm('¿Estás seguro de que quieres eliminar este recurso? Todos sus archivos serán borrados de forma permanente.', 'Eliminar recurso');
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/api/resources/${id}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': getOwnerId() }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('Recurso eliminado correctamente.', 'success');
    loadMyResources();
  } catch (err) {
    console.error('[MyResources] Error eliminando:', err);
    showToast('No se pudo eliminar el recurso.', 'error');
  }
}

async function loadMyResources() {
  const container = ListingsDOM.resourcesGrid();
  const ownerId = getOwnerId();

  if (!ownerId) return;

  try {
    const res = await fetch(`${API_BASE}/api/resources/owner`, { headers: { 'X-User-Id': ownerId } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const resources = await res.json();
    container.innerHTML = '';

    if (!resources.length) {
      container.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-20 gap-4"><p class="text-gray-500 text-sm">No has subido ningún recurso académico aún.</p></div>`;
      return;
    }
    resources.forEach(r => container.appendChild(createMyResourceCard(r)));
  } catch (err) {
    console.error('[MyResources] Error:', err);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-sm text-red-500">Error al cargar recursos.</div>`;
  }
}