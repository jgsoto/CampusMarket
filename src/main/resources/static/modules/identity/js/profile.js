'use strict';

const ProfileDOM = Object.freeze({
  loading:             () => document.getElementById('profile-loading'),
  form:                () => document.getElementById('profile-form'),
  saveBtn:             () => document.getElementById('save-btn'),
  cancelBtn:           () => document.getElementById('cancel-btn'),
  charCount:           () => document.getElementById('char-count'),
  toastContainer:      () => document.getElementById('toast-container'),
  avatarInitials:      () => document.getElementById('avatar-initials'),
  displayName:         () => document.getElementById('display-name'),
  displayEmail:        () => document.getElementById('display-email'),
  trustScore:          () => document.getElementById('trust-score'),
  statListings:        () => document.getElementById('stat-listings'),
  statTutorings:       () => document.getElementById('stat-tutorings'),
  statReviews:         () => document.getElementById('stat-reviews'),
  sidebarContact:      () => document.getElementById('sidebar-contact'),
  sidebarContactItems: () => document.getElementById('sidebar-contact-items'),
  profName:            () => document.getElementById('prof-name'),
  profEmail:           () => document.getElementById('prof-email'),
  profPhone:           () => document.getElementById('prof-phone'),
  profAddress:         () => document.getElementById('prof-address'),
  profSocial:          () => document.getElementById('prof-social'),
  profDesc:            () => document.getElementById('prof-desc'),
  reputationBigScore:   () => document.getElementById('reputation-big-score'),
  reputationBigStars:   () => document.getElementById('reputation-big-stars'),
  reputationTotalCount: () => document.getElementById('reputation-total-count'),
  opinionsTitle:        () => document.getElementById('opinions-title'),
  profileReviews:       () => document.getElementById('profile-reviews'),
});

const ProfileAPI = Object.freeze({
  fetchProfile:     (userId)           => fetch(`${API_BASE}/api/users/profile/${userId}`),
  updateProfile:    (userId, payload)  => fetch(`${API_BASE}/api/users/profile/me`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
    body:    JSON.stringify(payload),
  }),
  fetchAllListings: ()                 => fetch(`${API_BASE}/api/listings`),
  fetchReputation:  (userId)           => fetch(`${API_BASE}/api/reviews/users/${userId}/reputation`),
  fetchReviews:     (userId)           => fetch(`${API_BASE}/api/reviews/users/${userId}/reviews`),
});

function buildInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function buildStarString(score) {
  const rounded = Math.round(score);
  return Array.from({ length: 5 }, (_, i) => i < rounded ? '★' : '☆').join('');
}

function formatDate(iso) {
  if (!iso) return 'Fecha no disponible';
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
}

function setLoadingState(isLoading) {
  const loading = ProfileDOM.loading();
  const form = ProfileDOM.form();
  if (loading) loading.style.display = isLoading ? 'flex' : 'none';
  if (form) form.style.display = isLoading ? 'none' : 'flex';
}

function setSavingState(isSaving) {
  const btn = ProfileDOM.saveBtn();
  if (!btn) return;
  btn.disabled = isSaving;
  btn.innerHTML = isSaving
    ? '<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold rounded-full animate-spin-slow inline-block mr-2" aria-hidden="true"></span>Guardando...'
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Guardar cambios`;
}

function populateForm(profile) {
  ProfileDOM.profName().value = profile.fullName ?? '';
  ProfileDOM.profEmail().value = profile.email ?? '';
  ProfileDOM.profPhone().value = profile.phone ?? '';
  ProfileDOM.profAddress().value = profile.address ?? '';
  ProfileDOM.profSocial().value = profile.socialMedia ?? '';
  ProfileDOM.profDesc().value = profile.description ?? '';
  const descLen = (profile.description ?? '').length;
  if (ProfileDOM.charCount()) ProfileDOM.charCount().textContent = descLen;
}

function populateSidebar(profile) {
  const name = profile.fullName ?? 'Usuario UCE';
  const el = ProfileDOM;
  el.avatarInitials().textContent = buildInitials(name);
  el.displayName().textContent = name;
  el.displayEmail().textContent = profile.email ?? '—';
  el.trustScore().textContent = `${(profile.trustScore ?? 0).toFixed(1)} / 5.0`;

  const contacts = [
    profile.phone && { icon: '📱', label: profile.phone },
    profile.socialMedia && { icon: '🔗', label: profile.socialMedia },
    profile.address && { icon: '📍', label: profile.address },
  ].filter(Boolean);

  const itemsContainer = ProfileDOM.sidebarContactItems();
  const contactCard = ProfileDOM.sidebarContact();
  if (contacts.length && itemsContainer && contactCard) {
    itemsContainer.innerHTML = contacts
      .map(c => `<div class="flex items-start gap-2 text-sm text-gray-600"><span class="shrink-0">${c.icon}</span><span class="break-all text-xs">${c.label}</span></div>`)
      .join('');
    contactCard.classList.remove('hidden');
  }
}

function readFormPayload() {
  return {
    phone: ProfileDOM.profPhone().value.trim(),
    address: ProfileDOM.profAddress().value.trim(),
    socialMedia: ProfileDOM.profSocial().value.trim(),
    description: ProfileDOM.profDesc().value.trim(),
  };
}

function buildReviewCardHTML(review) {
  const rating = Math.max(1, Math.min(5, Math.round(review.rating ?? 0)));
  const starStr = buildStarString(rating);
  const name = review.reviewerName ?? 'Estudiante UCE';
  const date = formatDate(review.createdAt);
  const initials = buildInitials(name);
  const comment = review.comment ?? 'Sin comentario escrito';

  return `
    <article class="review-card flex gap-4 items-start p-4 rounded-xl border border-gray-100 bg-white">
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-uce-navy/10 to-uce-navy/20 flex items-center justify-center flex-shrink-0 font-bold text-xs text-uce-navy" aria-hidden="true">${initials}</div>
      <div class="flex flex-col gap-1 w-full min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span class="font-bold text-gray-800 text-sm">${name}</span>
          <time class="text-xs text-gray-400 shrink-0">${date}</time>
        </div>
        <span class="text-amber-500 text-xs" aria-label="Calificación ${rating} de 5 estrellas">${starStr}</span>
        <p class="text-gray-600 text-sm mt-0.5 italic">"${comment}"</p>
      </div>
    </article>`;
}

async function loadUserStats(userId) {
  try {
    const res = await ProfileAPI.fetchAllListings();
    if (res.ok) {
      const allListings = await res.json();
      const mine = allListings.filter(item => item.ownerId === userId || item.userId === userId);
      if (ProfileDOM.statListings()) ProfileDOM.statListings().textContent = mine.length;
    } else {
      if (ProfileDOM.statListings()) ProfileDOM.statListings().textContent = '0';
    }
  } catch {
    if (ProfileDOM.statListings()) ProfileDOM.statListings().textContent = '0';
  }
  if (ProfileDOM.statTutorings()) ProfileDOM.statTutorings().textContent = '0';
  if (ProfileDOM.statReviews())   ProfileDOM.statReviews().textContent   = '0';
}

async function loadReputationAndReviews(userId) {
  try {
    const repRes = await ProfileAPI.fetchReputation(userId);
    if (repRes.ok) {
      const { reputation = 0 } = await repRes.json();
      if (ProfileDOM.trustScore())         ProfileDOM.trustScore().textContent = `${reputation.toFixed(1)} / 5.0`;
      if (ProfileDOM.reputationBigScore()) ProfileDOM.reputationBigScore().textContent = reputation.toFixed(1);
      if (ProfileDOM.reputationBigStars()) ProfileDOM.reputationBigStars().textContent = buildStarString(reputation);
    }
  } catch (err) {
    console.warn('[Profile] No se pudo cargar la reputación:', err);
  }

  const reviewsContainer = ProfileDOM.profileReviews();
  if (!reviewsContainer) return;

  try {
    const revRes = await ProfileAPI.fetchReviews(userId);
    if (!revRes.ok) {
      reviewsContainer.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">No se pudieron recuperar las opiniones.</p>';
      return;
    }

    const reviews = await revRes.json();
    const total = reviews.length;

    if (ProfileDOM.reputationTotalCount()) ProfileDOM.reputationTotalCount().textContent = `(${total} reseñas)`;
    if (ProfileDOM.opinionsTitle())        ProfileDOM.opinionsTitle().textContent        = `Opiniones sobre el vendedor (${total})`;
    if (ProfileDOM.statReviews())          ProfileDOM.statReviews().textContent          = total;

    if (total === 0) {
      reviewsContainer.innerHTML = `<p class="text-sm text-gray-400 text-center py-10 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">Este estudiante todavía no registra opiniones como vendedor.</p>`;
      return;
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const fragment = document.createDocumentFragment();

    reviews.forEach(review => {
      const rating = Math.max(1, Math.min(5, Math.round(review.rating ?? 0)));
      distribution[rating]++;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = buildReviewCardHTML(review);
      fragment.appendChild(wrapper.firstElementChild);
    });

    reviewsContainer.innerHTML = '';
    reviewsContainer.appendChild(fragment);

    for (let star = 1; star <= 5; star++) {
      const pct  = total > 0 ? (distribution[star] / total) * 100 : 0;
      const bar  = document.getElementById(`bar-${star}`);
      const cnt  = document.getElementById(`count-${star}`);
      if (bar) bar.style.width       = `${pct}%`;
      if (cnt) cnt.textContent       = distribution[star];
    }
  } catch (err) {
    console.error('[Profile] Error procesando reseñas:', err);
    reviewsContainer.innerHTML = '<p class="text-xs text-red-500 py-4">Error interno al cargar las opiniones.</p>';
  }
}

async function loadProfile(userId) {
  setLoadingState(true);
  try {
    const res = await ProfileAPI.fetchProfile(userId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const profile = await res.json();
    populateForm(profile);
    populateSidebar(profile);
    await Promise.allSettled([loadUserStats(userId), loadReputationAndReviews(userId)]);
  } catch (err) {
    console.error('[Profile] Error al cargar el perfil:', err);
    if (ProfileDOM.avatarInitials()) ProfileDOM.avatarInitials().textContent = '??';
    if (ProfileDOM.displayName())    ProfileDOM.displayName().textContent    = 'Error de carga';
  } finally {
    setLoadingState(false);
  }
}

async function saveProfile(userId) {
  setSavingState(true);
  try {
    const res = await ProfileAPI.updateProfile(userId, readFormPayload());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    showToast('Perfil actualizado correctamente.', 'success');
    await loadProfile(userId);
  } catch (err) {
    console.error('[Profile] Error al guardar el perfil:', err);
    Swal.fire({ title: 'Error', text: 'No se pudo actualizar el perfil.', icon: 'error' });
  } finally {
    setSavingState(false);
  }
}

function initTabs() {
  const tabs   = document.querySelectorAll('.profile-tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(targetId)?.classList.add('active');
    });
  });
}

window.addEventListener('load', async () => {
  const userId = localStorage.getItem('campusMarketUserId');
  if (!userId) {
    await Swal.fire({ title: 'Inicia sesión', text: 'Debes iniciar sesión para ver tu perfil.', icon: 'warning', confirmButtonColor: '#0A1628' });
    window.location.href = '/modules/identity/signin.html';
    return;
  }
  await Clerk.load();
  MarketplaceLayout.mountNavbar('profile', Clerk.user);
  initTabs();
  await loadProfile(userId);

  ProfileDOM.form()?.addEventListener('submit', e => { e.preventDefault(); saveProfile(userId); });
  ProfileDOM.profDesc()?.addEventListener('input', function () {
    if (ProfileDOM.charCount()) ProfileDOM.charCount().textContent = this.value.length;
  });
  ProfileDOM.cancelBtn()?.addEventListener('click', () => loadProfile(userId));
});