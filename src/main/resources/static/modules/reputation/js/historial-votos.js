'use strict';

const HistDOM = Object.freeze({
  loading: () => document.getElementById('page-loading'),
  content: () => document.getElementById('page-content'),
  selectors: {
    breadcrumb: document.getElementById('breadcrumb-name'),
    userName: document.getElementById('user-name'),
    initials: document.getElementById('user-initials'),
    stars: document.getElementById('user-score-stars'),
    score: document.getElementById('user-score-text'),
    count: document.getElementById('user-review-count'),
    title: document.getElementById('reviews-title'),
    container: document.getElementById('reviews-container')
  }
});

const Formatters = {
  stars: (score) => '★'.repeat(Math.round(score)).padEnd(5, '☆'),
  initials: (name) => name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?',
  date: (iso) => iso ? new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
};

const UI = {
  renderHeader: (reviews, reputation, name) => {
    const total = reviews.length;
    const { breadcrumb, userName, initials, stars, score, count, title } = HistDOM.selectors;
    
    breadcrumb.textContent = name;
    userName.textContent = name;
    initials.textContent = Formatters.initials(name);
    stars.textContent = Formatters.stars(reputation);
    score.textContent = reputation.toFixed(1);
    count.textContent = `(${total} reseña${total !== 1 ? 's' : ''})`;
    title.textContent = `Opiniones sobre ${name} (${total})`;
  },

  renderReviews: (reviews) => {
    const container = HistDOM.selectors.container;
    if (!reviews.length) {
      container.innerHTML = `<p class="text-sm text-gray-400 text-center py-10">Sin reseñas aún.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(review => {
      const div = document.createElement('div');
      div.innerHTML = UI.createReviewCard(review);
      fragment.appendChild(div.firstElementChild);
    });
    container.replaceChildren(fragment);
  },

  createReviewCard: (r) => {
    const isMarket = r.targetType === 'MARKETPLACE';
    return `
    <article class="flex gap-3 items-start p-4 rounded-xl border border-gray-100 bg-white">
      <div class="w-9 h-9 rounded-full bg-uce-navy/10 flex items-center justify-center font-bold text-xs text-uce-navy">
        ${Formatters.initials(r.reviewerName)}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex justify-between text-sm">
          <span class="font-semibold">${r.reviewerName || 'Estudiante'}</span>
          <time class="text-[10px] text-gray-400">${Formatters.date(r.createdAt)}</time>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-amber-400">${Formatters.stars(r.rating || 0)}</span>
          <span class="px-2 py-0.5 rounded-full font-bold ${isMarket ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}">
            ${r.targetType}
          </span>
        </div>
        <p class="text-gray-600 text-sm mt-1">"${r.comment || ''}"</p>
      </div>
    </article>`;
  }
};

async function loadHistorial(userId) {
  try {
    const [rep, rev] = await Promise.all([
      fetch(`${API_BASE}/api/reviews/users/${userId}/reputation`).then(r => r.json()),
      fetch(`${API_BASE}/api/reviews/users/${userId}/reviews`).then(r => r.json())
    ]);

    const name = rev[0]?.reviewedUserName || 'Estudiante UCE';
    UI.renderHeader(rev, rep.reputation || 0, name);
    UI.renderReviews(rev);

    HistDOM.loading().classList.add('hidden');
    HistDOM.content().classList.remove('hidden');
  } catch (err) {
    console.error('Error loading history:', err);
  }
}

window.addEventListener('load', async () => {
  await Clerk.load();
  if (!Clerk.user) return window.location.href = '/modules/identity/signin.html';

  const userId = new URLSearchParams(window.location.search).get('userId');
  if (!userId) return window.location.href = '/modules/marketplace/dashboard.html';

  MarketplaceLayout.mountNavbar('', Clerk.user);
  await loadHistorial(userId);
});