'use strict';

//  Almacena el catálogo en memoria para realizar filtrados locales instantáneos sin saturar la API con re-fetches.
let _catalogCache = [];

function createCard(listing, reputation = 0) {
  const isSold    = listing.status === 'VENDIDO';
  const imageUrl  = listing.images?.length > 0
    ? listing.images[0].url
    : 'https://placehold.co/400x300?text=Sin+Imagen';

  const card = document.createElement('article');
  card.className = `bg-white border border-gray-100 rounded-2xl overflow-hidden
                    shadow-sm hover:shadow-lg hover:-translate-y-1
                    transition-all duration-300 flex flex-col`;
  card.dataset.title       = listing.title.toLowerCase();
  card.dataset.category    = (listing.categoryName ?? '').toLowerCase();
  card.dataset.description = (listing.description ?? '').toLowerCase();

  card.innerHTML = `
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img src="${imageUrl}"
           alt="${listing.title}"
           loading="lazy"
          class="w-full h-full object-contain bg-white transition-transform duration-300
                 group-hover:scale-105 ${isSold ? 'opacity-50' : ''}" />
      ${isSold ? `
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            AGOTADO
          </span>
        </div>` : ''}
      <span class="absolute bottom-2 left-2 bg-uce-navy/80 text-uce-gold
                   text-[10px] font-semibold uppercase tracking-wider
                   px-2 py-0.5 rounded-full backdrop-blur-sm">
        ${listing.categoryName ?? 'Sin categoría'}
      </span>
    </div>

    <div class="p-5 flex flex-col gap-3 flex-1">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-display text-base font-bold text-uce-navy leading-snug
                   line-clamp-2 ${isSold ? 'opacity-50' : ''}">
          ${listing.title}
        </h3>
      </div>

      <p class="text-xs text-gray-500 line-clamp-2 flex-1 ${isSold ? 'opacity-50' : ''}">
        ${listing.description}
      </p>

      <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span class="font-display text-xl font-bold text-uce-navy ${isSold ? 'opacity-50' : ''}">
          $${listing.price.toFixed(2)}
        </span>
        <span class="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full
                     ${isSold
                       ? 'bg-gray-100 text-gray-400'
                       : 'bg-green-50 text-green-700'}">
          ${listing.status}
        </span>
      </div>
    </div>

    <div class="px-5 pb-5">
      <button
        onclick="window.location.href='/modules/marketplace/product-details.html?id=${listing.id}'"
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all
               ${isSold
                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 : 'bg-uce-navy text-uce-gold hover:bg-uce-navy-light'}">
        ${isSold ? 'No disponible' : 'Ver producto'}
      </button>
    </div>
  `;

  return card;
}

function renderEmpty(message = 'No hay productos disponibles.') {
  const container = document.getElementById('catalog-container');
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" class="text-gray-400" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <p class="text-gray-500 text-sm">${message}</p>
      <a href="/modules/marketplace/create-listing.html"
         class="text-sm font-semibold text-uce-navy underline underline-offset-4 hover:text-uce-gold transition-colors">
        Sé el primero en publicar
      </a>
    </div>`;
}

function renderError() {
  const container = document.getElementById('catalog-container');
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" class="text-red-400" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p class="text-gray-500 text-sm">Error al cargar los productos.</p>
      <button onclick="loadCatalog()"
              class="text-sm font-semibold text-uce-navy underline underline-offset-4 hover:text-uce-gold transition-colors">
        Intentar de nuevo
      </button>
    </div>`;
}

async function loadCatalog() {
  const container = document.getElementById('catalog-container');

  container.innerHTML = Array(8).fill(0).map(() =>
    `<div class="skeleton rounded-2xl h-72"></div>`
  ).join('');

  try {
    const res = await fetch(`${API_BASE}/api/listings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const listings = await res.json();
    _catalogCache  = listings;

    renderCatalog(listings);

  } catch (err) {
    console.error('[Marketplace] Error cargando catálogo:', err);
    renderError();
  }
}

async function renderCatalog(listings) {
  const container = document.getElementById('catalog-container');
  container.innerHTML = '';

  if (!listings.length) {
    renderEmpty();
    return;
  }
 for (const listing of listings){
  container.appendChild(createCard(listing));
  }
}

function filterCatalog(query) {
  if (!query) {
    renderCatalog(_catalogCache);
    return;
  }

  const filtered = _catalogCache.filter(l =>
    l.title.toLowerCase().includes(query)       ||
    l.description.toLowerCase().includes(query) ||
    (l.categoryName ?? '').toLowerCase().includes(query)
  );

  renderCatalog(filtered.length ? filtered : []);

  if (!filtered.length) {
    renderEmpty(`No se encontraron productos para "${query}".`);
  }
}