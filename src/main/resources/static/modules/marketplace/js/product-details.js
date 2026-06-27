'use strict';

function initGallery(images) {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.getElementById('thumbnails');

    if (!images?.length) {
        mainImage.src = 'https://placehold.co/600x600?text=Sin+Imagen';
        return;
    }

    mainImage.src = images[0].url;
    mainImage.alt = 'Imagen principal del producto';

    images.forEach((img, index) => {
        const thumb = document.createElement('button');
        thumb.className = `w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                       ${index === 0 ? 'border-uce-navy' : 'border-gray-200 hover:border-uce-navy/50'}`;
        thumb.innerHTML = `<img src="${img.url}" alt="Imagen ${index + 1}"
                            class="w-full h-full object-contain bg-white" />`;
        thumb.addEventListener('click', () => {
            mainImage.src = img.url;
            thumbnails.querySelectorAll('button').forEach(b => b.classList.replace('border-uce-navy', 'border-gray-200'));
            thumb.classList.replace('border-gray-200', 'border-uce-navy');
        });
        thumbnails.appendChild(thumb);
    });
}

function renderContactRow(label, value) {
    return `
    <div>
        <p class="text-xs uppercase tracking-wide text-gray-400">
            ${label}
        </p>

        <p class="text-sm font-medium text-gray-700 mt-1">
            ${value}
        </p>
    </div>
  `;
}

function renderAction(product) {
    const container = document.getElementById('action-container');
    const currentUser = getOwnerId();

    if (product.status === 'VENDIDO') {
        container.innerHTML = `
      <div class="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-center">
        <span class="text-red-600 font-bold text-sm">Este producto ya fue vendido</span>
      </div>`;
        return;
    }

    if (product.ownerId === currentUser) {
        container.innerHTML = `
      <div class="flex gap-3">
        <span class="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3
                     text-center text-blue-700 font-semibold text-sm">
          Tu publicación
        </span>
        <a href="/modules/marketplace/my-listings.html"
           class="flex-1 bg-uce-navy text-uce-gold font-semibold text-sm px-5 py-3
                  rounded-xl text-center hover:bg-uce-navy-light transition-colors">
          Gestionar
        </a>
      </div>`;
        return;
    }

    container.innerHTML = `
<div class="bg-gray-50 border border-gray-100 rounded-xl p-5">
    <h3 class="text-sm font-semibold text-uce-navy mb-4">
        Información del vendedor
    </h3>

    <div class="flex flex-col gap-4">

        <div class="pb-4 border-b border-gray-100">
            <p class="text-lg font-bold text-gray-800">
                ${product.sellerName ?? 'No disponible'}
            </p>

            <p class="text-sm text-gray-500 mt-1">
                Calificación del vendedor
            </p>

            <div class="flex items-center gap-2 mt-1">
                <span class="text-lg font-semibold text-uce-navy">
                    ${product.sellerReputation?.toFixed(1) ?? '0.0'}
                </span>

                <span class="text-gray-400">/ 5</span>

                <span class="text-sm text-gray-500">
                    (${product.sellerReviewCount ?? 0}
                    ${(product.sellerReviewCount ?? 0) === 1 ? 'reseña' : 'reseñas'})
                </span>
            </div>
        </div>

        ${renderContactRow('Correo', product.sellerEmail ?? 'No disponible')}
        ${renderContactRow('Teléfono', product.sellerPhone ?? 'No disponible')}
        ${renderContactRow('Ubicación', product.sellerAddress ?? 'No disponible')}
        ${product.sellerSocialMedia ? renderContactRow('Redes', product.sellerSocialMedia) : ''}

        ${product.sellerPhone ? `
                <a href="https://wa.me/593${product.sellerPhone.replace(/^0/, '')}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold
                          py-3 rounded-xl transition-colors text-center">
                    Contactar por WhatsApp
                </a>` : ''}
    </div>
</div>
`;
}

async function initChatButton(product) {

    const btn = document.getElementById('chat-btn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        const buyerId = localStorage.getItem('campusMarketUserId');

        if (!buyerId) {
            alert('Debes iniciar sesión.');
            return;
        }

        try {

            const response = await fetch(`${API_BASE}/api/chat/conversations`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', 'X-User-Id': buyerId
                }, body: JSON.stringify({
                    listingId: product.id, sellerId: product.ownerId
                })
            });

            if (!response.ok) {
                throw new Error();
            }

            const conversation = await response.json();

            window.location.href = `/modules/chat/chat.html?id=${conversation.id}`;

        } catch (error) {

            console.error(error);

            alert('No se pudo iniciar la conversación.');
        }
    });
}

function renderProduct(product) {
    document.getElementById('breadcrumb-title').textContent = product.title;
    document.title = `CampusMarket | ${product.title}`;

    initGallery(product.images);

    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-category').textContent = product.categoryName ?? '';
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-date').textContent = `Publicado el ${new Date(product.createdAt).toLocaleDateString('es-EC', {dateStyle: 'long'})}`;


    const statusEl = document.getElementById('product-status');
    statusEl.textContent = product.status;
    statusEl.className = `text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${product.status === 'VENDIDO' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`;

    renderAction(product);
    initChatButton(product);

    document.getElementById('product-skeleton').remove();
    document.getElementById('product-content').hidden = false;
}

function showError(message) {
    document.getElementById('product-skeleton').hidden = true;
    document.getElementById('product-error').hidden = false;
    document.getElementById('error-message').textContent = message;
}

window.addEventListener('load', async () => {
    let authenticatedUser = null;

    try {
        if (typeof Clerk !== 'undefined') {
            await Clerk.load();

            if (Clerk.user) {
                authenticatedUser = Clerk.user;
            }
        }
        MarketplaceLayout.mountNavbar('dashboard', authenticatedUser);
    } catch (clerkError) {
        console.warn('[ProductDetails] Error cargando Clerk Navbar:', clerkError);
        MarketplaceLayout.mountNavbar('dashboard', null);
    }

    const productId = new URLSearchParams(window.location.search).get('id');

    if (!productId) {
        showError('No se especificó un producto.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/listings/${productId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        renderProduct(await res.json());
    } catch (err) {
        console.error('[ProductDetails]', err);
        showError('No se pudo cargar el producto.');
    }
});