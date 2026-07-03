'use strict';

let _catalogCache = [];

function createCard(listing) {
    const isSold = listing.status === 'VENDIDO';

    const imageUrl = listing.images?.length > 0 ? listing.images[0].url : 'https://placehold.co/400x300?text=Sin+Imagen';

    const stars = "★".repeat(Math.round(listing.sellerReputation ?? 0)) + "☆".repeat(5 - Math.round(listing.sellerReputation ?? 0));

    const card = document.createElement('article');

    card.className = `bg-white border border-gray-100 rounded-2xl overflow-hidden
     shadow-sm hover:shadow-lg hover:-translate-y-1
     transition-all duration-300 flex flex-col group`;

    card.innerHTML = `

    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">

      <img
        src="${imageUrl}"
        alt="${listing.title}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300
               group-hover:scale-105 ${isSold ? 'opacity-50 grayscale' : ''}" />

      ${isSold ? `
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
              VENDIDO
            </span>
          </div>` : ''}

      <span
        class="absolute bottom-2 left-2 bg-uce-navy/80 text-uce-gold
               text-[10px] font-semibold uppercase tracking-wider
               px-2 py-0.5 rounded-full backdrop-blur-sm">

        ${listing.categoryName ?? 'General'}

      </span>

    </div>

    <div class="p-5 flex flex-col gap-3 flex-1">

      <h3
        class="font-display text-base font-bold text-uce-navy
               leading-snug line-clamp-2
               ${isSold ? 'opacity-50' : ''}">

        ${listing.title}

      </h3>

      <p
        class="text-xs text-gray-500 line-clamp-2 flex-1
               ${isSold ? 'opacity-50' : ''}">

        ${listing.description}

      </p>

      <div class="flex items-center justify-between pt-3 border-t border-gray-100">

        <div class="flex flex-col">

          <span class="text-sm font-semibold text-gray-800">
            ${listing.sellerName ?? 'Vendedor'}
          </span>

          ${listing.sellerReviewCount > 0 ? `
              <div class="flex items-center gap-1 mt-0.5">

                <span class="text-amber-400 text-xs">
                  ${stars}
                </span>

                <span class="text-xs text-gray-500">
                  ${listing.sellerReputation.toFixed(1)}
                </span>

              </div>
              ` : `
              <span class="text-xs text-gray-400 mt-0.5">
                Sin reseñas
              </span>
              `}

        </div>

        <span
          class="font-bold text-emerald-600 text-sm${isSold ? 'opacity-50' : ''}">

          $${listing.price.toFixed(2)}

        </span>

      </div>

    </div>

    <div class="px-5 pb-5">

      <button
        onclick="window.location.href='/modules/marketplace/product-details.html?id=${listing.id}'"
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all
        ${isSold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-uce-navy text-uce-gold hover:bg-uce-navy-light'}">

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
      <p class="text-gray-500 text-sm">${message}</p>
    </div>`;
}

function renderError() {
    const container = document.getElementById('catalog-container');
    container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p class="text-gray-500 text-sm">Error al cargar los productos.</p>
      <button onclick="loadCatalog()" class="text-uce-navy underline text-sm">Intentar de nuevo</button>
    </div>`;
}

async function loadCatalog() {
    const container = document.getElementById('catalog-container');
    container.innerHTML = Array(8).fill(0).map(() => `<div class="skeleton rounded-2xl h-72"></div>`).join('');

    try {
        const res = await fetch(`${API_BASE}/api/listings`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const listings = await res.json();
        _catalogCache = listings;
        renderCatalog(listings);
    } catch (err) {
        console.error('[Marketplace] Error:', err);
        renderError();
    }
}

function renderCatalog(listings) {
    const container = document.getElementById('catalog-container');
    container.innerHTML = '';

    if (!listings.length) {
        renderEmpty();
        return;
    }

    listings.forEach(listing => {
        container.appendChild(createCard(listing));
    });
}