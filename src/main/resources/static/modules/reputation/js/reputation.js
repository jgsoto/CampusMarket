'use strict';

const RepDOM = Object.freeze({
  loading: () => document.getElementById('page-loading'),
  content: () => document.getElementById('page-content'),
  barsContainer: () => document.getElementById('rating-bars-container'),
  globalScore: () => document.getElementById('global-score'),
  globalStars: () => document.getElementById('global-stars'),
  globalCount: () => document.getElementById('global-count'),
  reviewsContainer: () => document.getElementById('reviews-container'),
  reviewsTitle: () => document.getElementById('reviews-title'),
  filterBtns: () => document.querySelectorAll('.rev-filter-btn'),
  statMarketplace: () => document.getElementById('stat-marketplace'),
  statTutoring: () => document.getElementById('stat-tutoring'),
  statTotal: () => document.getElementById('stat-total')
});

let _allReviews = [];
let _activeFilter = 'ALL';

const Utils = {
  buildStars: (score) => '★'.repeat(Math.round(score)).padEnd(5, '☆'),
  
  normalizeType: (type) => (type || 'TUTORING').toString().toUpperCase().trim(),
  
  initBarContainer: () => {
    const container = RepDOM.barsContainer();
    if (!container) return;
    [5, 4, 3, 2, 1].forEach(s => {
      container.innerHTML += `
        <div class="flex items-center gap-3">
          <span class="w-16 shrink-0 text-right">${s} estrellas</span>
          <div class="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div id="bar-${s}" class="bg-amber-400 h-full rounded-full transition-all duration-700" style="width:0%"></div>
          </div>
          <span id="cnt-${s}" class="w-5 text-right text-gray-400 font-bold">0</span>
        </div>`;
    });
  },

  buildReviewCard: (r) => `
    <article class="flex gap-3 items-start p-4 rounded-xl border border-gray-100 bg-white">
      <div class="w-9 h-9 rounded-full bg-uce-navy/10 flex items-center justify-center font-bold text-xs text-uce-navy">
        ${r.reviewerName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex justify-between text-sm">
          <span class="font-semibold">${r.reviewerName || 'Estudiante'}</span>
          <time class="text-[10px] text-gray-400">${new Date(r.createdAt).toLocaleDateString()}</time>
        </div>
        <div class="flex items-center gap-2 text-xs mt-1">
          <span class="text-amber-400">${Utils.buildStars(r.rating || 0)}</span>
        </div>
        <p class="text-gray-600 text-sm mt-1 italic">"${r.comment || ''}"</p>
      </div>
    </article>`
};

function applyReviewFilter() {
  const container = RepDOM.reviewsContainer();
  const title = RepDOM.reviewsTitle();
  const filter = _activeFilter.toUpperCase();
  
  const visible = filter === 'ALL' 
    ? _allReviews 
    : _allReviews.filter(r => r.targetType === filter);

  if (title) title.textContent = `Opiniones recibidas (${visible.length})`;
  
  if (visible.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-10">No hay reseñas disponibles.</p>';
    return;
  }
  container.innerHTML = visible.map(r => Utils.buildReviewCard(r)).join('');
}

function updateStats(reviews) {
  const marketplace = reviews.filter(r => r.targetType === 'MARKETPLACE').length;
  const tutoring = reviews.filter(r => r.targetType === 'TUTORING').length;
  
  if (RepDOM.statMarketplace()) RepDOM.statMarketplace().textContent = marketplace;
  if (RepDOM.statTutoring()) RepDOM.statTutoring().textContent = tutoring;
  if (RepDOM.statTotal()) RepDOM.statTotal().textContent = reviews.length;
}

async function loadReputation(userId) {
  try {
    const [repRes, rawReviews] = await Promise.all([
      fetch(`${API_BASE}/api/reviews/users/${userId}/reputation`).then(r => r.json()),
      fetch(`${API_BASE}/api/reviews/users/${userId}/reviews`).then(r => r.json())
    ]);


    const reputation = repRes.reputation || repRes.score || 0;
    
    _allReviews = rawReviews.map(r => ({ 
        ...r, 
        targetType: Utils.normalizeType(r.targetType) 
    }));
    
    RepDOM.globalScore().textContent = Number(reputation).toFixed(1);
    RepDOM.globalStars().textContent = Utils.buildStars(reputation);
    RepDOM.globalCount().textContent = `(${_allReviews.length} reseña${_allReviews.length !== 1 ? 's' : ''})`;
    
    updateStats(_allReviews);
    
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    _allReviews.forEach(r => dist[Math.max(1, Math.min(5, Math.round(r.rating)))]++);
    Object.entries(dist).forEach(([s, count]) => {
      const pct = _allReviews.length > 0 ? (count / _allReviews.length) * 100 : 0;
      const bar = document.getElementById(`bar-${s}`);
      if (bar) bar.style.width = `${pct}%`;
      const cnt = document.getElementById(`cnt-${s}`);
      if (cnt) cnt.textContent = count;
    });

    applyReviewFilter();
    
    RepDOM.loading().classList.add('hidden');
    RepDOM.content().classList.remove('hidden');
  } catch (err) {
    console.error("Error:", err);
  }
}

window.addEventListener('load', async () => {
  Utils.initBarContainer();
  await Clerk.load();
  if (Clerk.user) {
    const res = await fetch(`${API_BASE}/api/v1/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkUserId: Clerk.user.id, fullName: Clerk.user.fullName, email: Clerk.user.primaryEmailAddress?.emailAddress ?? '' }),
    });
    const data = await res.json();
    const userId = data.id;

    await MarketplaceLayout.mountNavbar('reputation', Clerk.user);
    
    RepDOM.filterBtns().forEach(btn => btn.addEventListener('click', () => {
      _activeFilter = btn.dataset.type;
      applyReviewFilter();
    }));

    await loadReputation(userId);
  }
});