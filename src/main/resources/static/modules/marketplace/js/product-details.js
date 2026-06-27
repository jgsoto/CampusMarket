'use strict';

function initGallery(images) {
  const mainImage  = document.getElementById('main-image');
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
      thumbnails.querySelectorAll('button').forEach(b =>
        b.classList.replace('border-uce-navy', 'border-gray-200')
      );
      thumb.classList.replace('border-gray-200', 'border-uce-navy');
    });
    thumbnails.appendChild(thumb);
  });
}

function renderContactRow(label, value) {
  return `
    <div class="flex gap-2 text-sm">
      <span class="text-gray-400 min-w-20">${label}:</span>
      <span class="text-gray-700 font-medium">${value}</span>
    </div>`;
}

function renderAction(product) {
  const container   = document.getElementById('action-container');
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
    <div class="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Contactar al vendedor</p>
      <div class="flex flex-col gap-2">
        ${renderContactRow('Vendedor',  product.sellerName    ?? 'No disponible')}
        ${renderContactRow('Email',     product.sellerEmail   ?? 'No disponible')}
        ${renderContactRow('Teléfono',  product.sellerPhone   ?? 'No disponible')}
        ${renderContactRow('Ubicación', product.sellerAddress ?? 'No disponible')}
        ${product.sellerSocialMedia ? renderContactRow('Redes', product.sellerSocialMedia) : ''}
      </div>
      ${product.sellerPhone ? `
        <a href="https://wa.me/593${product.sellerPhone.replace(/^0/, '')}"
           target="_blank" rel="noopener noreferrer"
           class="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold
                  text-sm py-3 rounded-xl text-center transition-colors flex items-center
                  justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar por WhatsApp
        </a>` : ''}
    </div>`;
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

      const response = await fetch(
          `${API_BASE}/api/chat/conversations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': buyerId
            },
            body: JSON.stringify({
              listingId: product.id,
              sellerId: product.ownerId
            })
          }
      );

      if (!response.ok) {
        throw new Error();
      }

      const conversation = await response.json();

      window.location.href =
          `/modules/chat/chat.html?id=${conversation.id}`;

    } catch (error) {

      console.error(error);

      alert('No se pudo iniciar la conversación.');
    }
  });
}

function renderProduct(product) {
  document.getElementById('breadcrumb-title').textContent     = product.title;
  document.title                                              = `CampusMarket | ${product.title}`;

  initGallery(product.images);

  document.getElementById('product-title').textContent        = product.title;
  document.getElementById('product-category').textContent     = product.categoryName ?? '';
  document.getElementById('product-price').textContent        = `$${product.price.toFixed(2)}`;
  document.getElementById('product-description').textContent  = product.description;
  document.getElementById('product-date').textContent         =
    `Publicado el ${new Date(product.createdAt).toLocaleDateString('es-EC', { dateStyle: 'long' })}`;


  const ratingEl = document.getElementById('product-rating-container');
  if (ratingEl) {
    ratingEl.innerHTML = '';
  }

  const statusEl      = document.getElementById('product-status');
  statusEl.textContent = product.status;
  statusEl.className   = `text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
    product.status === 'VENDIDO' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
  }`;

  renderAction(product);
  initChatButton(product);

  document.getElementById('product-skeleton').remove();
  document.getElementById('product-content').hidden = false;
}

function showError(message) {
  document.getElementById('product-skeleton').hidden    = true;
  document.getElementById('product-error').hidden       = false;
  document.getElementById('error-message').textContent  = message;
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