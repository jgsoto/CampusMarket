'use strict';

// ══════════════════════════════════════════════════════════════
// MÓDULO: TutoringCatalog
// Responsabilidad: listar, filtrar y buscar ofertas de tutoría.
// ══════════════════════════════════════════════════════════════

// ── 1. Selectores ────────────────────────────────────────────
const CatalogDOM = Object.freeze({
  grid:         () => document.getElementById('tutoring-catalog'),
  searchInput:  () => document.getElementById('search-input'),
  filterBtns:   () => document.querySelectorAll('.filter-btn'),
  resultsCount: () => document.getElementById('results-count'),
});

// ── 2. Estado local ──────────────────────────────────────────
let _allOffers     = [];
let _activeFilter  = 'ALL';
let _searchQuery   = '';

// ── 3. API ───────────────────────────────────────────────────
const CatalogAPI = Object.freeze({
  fetchOffers:     ()        => fetch(`${API_BASE}/api/tutoring`),
  fetchReputation: (tutorId) => fetch(`${API_BASE}/api/reviews/users/${tutorId}/reputation`),
});

// ── 4. Utilidades ────────────────────────────────────────────
function buildInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function buildStarString(score) {
  const r = Math.round(score);
  return Array.from({ length: 5 }, (_, i) => i < r ? '★' : '☆').join('');
}

function truncate(text, max = 120) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max) + '…';
}

// ── 5. Renderizado de tarjeta ────────────────────────────────
function buildCardHTML(offer, reputation) {
  const isOpen    = offer.status !== 'CLOSED';
  const badgeCls  = isOpen
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    : 'bg-gray-100 text-gray-500 border border-gray-200';
  const badgeText = isOpen ? 'Disponible' : 'Cerrada';
  const initials  = buildInitials(offer.tutorName);
  const stars     = buildStarString(reputation);
  const score     = Number(reputation).toFixed(1);

  return `
    <article class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 cursor-pointer group"
             data-id="${offer.id}" role="article" aria-label="Tutoría de ${offer.subject}">

      <div class="flex items-start justify-between gap-2">
        <h3 class="font-display font-bold text-uce-navy text-base group-hover:text-uce-navy-light transition-colors leading-tight">
          ${offer.subject}
        </h3>
        <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex-shrink-0 ${badgeCls}">
          ${badgeText}
        </span>
      </div>

      <p class="text-sm text-gray-500 leading-relaxed flex-1">${truncate(offer.description)}</p>

      <div class="flex items-center justify-between pt-3 border-t border-gray-100">

  <div class="flex flex-col">
    <span class="text-sm font-semibold text-gray-800">
      ${offer.tutorName}
    </span>

    <div class="flex items-center gap-1 mt-0.5">
      <span class="text-amber-400 text-xs">${stars}</span>

      <span class="text-xs text-gray-500">
        ${score}
      </span>
    </div>
  </div>

  <span class="font-bold text-emerald-600 text-sm">
    $${offer.hourlyRate}/h
  </span>

</div>

    </article>`;
}

function applyFilters() {
  const query = _searchQuery.toLowerCase();

  const visible = _allOffers.filter(({ offer }) => {
    const matchesFilter =
      _activeFilter === 'ALL'   ? true :
      _activeFilter === 'OPEN'  ? offer.status !== 'CLOSED' :
      _activeFilter === 'CLOSED'? offer.status === 'CLOSED' : true;

    const matchesSearch = !query ||
      offer.subject.toLowerCase().includes(query) ||
      (offer.description ?? '').toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const grid = CatalogDOM.grid();
  const count = CatalogDOM.resultsCount();

  if (!grid) return;

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <p class="text-gray-400 text-sm">No se encontraron tutorías con esos criterios.</p>
        <button onclick="resetFilters()" class="mt-3 text-uce-navy text-xs font-semibold underline hover:no-underline">
          Ver todas
        </button>
      </div>`;
  } else {
    grid.innerHTML = visible.map(({ offer, reputation }) => buildCardHTML(offer, reputation)).join('');
    grid.querySelectorAll('article[data-id]').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `/modules/tutoring/tutoring-details.html?id=${card.dataset.id}`;
      });
    });
  }

  if (count) {
    count.textContent = `${visible.length} ${visible.length === 1 ? 'resultado' : 'resultados'}`;
  }
}

function resetFilters() {
  _activeFilter = 'ALL';
  _searchQuery  = '';
  if (CatalogDOM.searchInput()) CatalogDOM.searchInput().value = '';
  styleFilterBtns();
  applyFilters();
}

function styleFilterBtns() {
  CatalogDOM.filterBtns().forEach(b => {
    const isActive = b.dataset.filter === _activeFilter;
    b.classList.toggle('active-filter', isActive);
    b.classList.toggle('bg-uce-navy',    isActive);
    b.classList.toggle('text-uce-gold',  isActive);
    b.classList.toggle('border-uce-navy',isActive);
    b.classList.toggle('bg-white',       !isActive);
    b.classList.toggle('text-gray-500',  !isActive);
    b.classList.toggle('border-gray-200',!isActive);
  });
}

// ── 7. Carga de datos ────────────────────────────────────────
async function loadOffers() {
  const grid = CatalogDOM.grid();
  try {
    const res = await CatalogAPI.fetchOffers();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const offers = await res.json();

    if (!offers.length) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <p class="text-gray-400 text-sm">No hay tutorías publicadas aún.</p>
          <a href="/modules/tutoring/create-tutoring.html" class="mt-3 inline-block text-uce-navy text-xs font-semibold underline hover:no-underline">
            Sé el primero en publicar
          </a>
        </div>`;
      return;
    }

    const withRep = await Promise.all(
      offers.map(async offer => {
        try {
          const r = await CatalogAPI.fetchReputation(offer.tutorId);
          const d = r.ok ? await r.json() : { reputation: 0 };
          return { offer, reputation: d.reputation ?? 0 };
        } catch {
          return { offer, reputation: 0 };
        }
      })
    );

    _allOffers = withRep;
    applyFilters();

  } catch (err) {
    console.error('[TutoringCatalog] Error cargando ofertas:', err);
    grid.innerHTML = `<p class="col-span-full text-sm text-red-400 text-center py-10">Error al cargar las tutorías.</p>`;
  }
}

// ── 8. Bootstrap ─────────────────────────────────────────────
window.addEventListener('load', async () => {
  await Clerk.load();

  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  await MarketplaceLayout.mountNavbar('tutorias', Clerk.user);
  styleFilterBtns();

  CatalogDOM.filterBtns().forEach(btn => {
    btn.addEventListener('click', () => {
      _activeFilter = btn.dataset.filter;
      styleFilterBtns();
      applyFilters();
    });
  });

  let debounceTimer;
  CatalogDOM.searchInput()?.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      _searchQuery = this.value.trim();
      applyFilters();
    }, 250);
  });

  await loadOffers();
});