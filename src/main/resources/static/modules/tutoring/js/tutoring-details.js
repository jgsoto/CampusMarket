'use strict';

// ══════════════════════════════════════════════════════════════
// MÓDULO: TutoringDetails
// Responsabilidad: mostrar detalle de una tutoría, panel de
// contacto con reveal, reseñas y acción de cierre del tutor.
// ══════════════════════════════════════════════════════════════

// ── 1. Selectores ────────────────────────────────────────────
const DetailsDOM = Object.freeze({
  pageLoading:        () => document.getElementById('page-loading'),
  pageContent:        () => document.getElementById('page-content'),
  breadcrumbSubject:  () => document.getElementById('breadcrumb-subject'),
  subject:            () => document.getElementById('tutoring-subject'),
  price:              () => document.getElementById('tutoring-price'),
  description:        () => document.getElementById('tutoring-description'),
  statusBadge:        () => document.getElementById('status-badge'),
  reputationScore:    () => document.getElementById('tutor-reputation-score'),
  reputationStars:    () => document.getElementById('tutor-reputation-stars'),
  tutorInitials:      () => document.getElementById('tutor-initials'),
  tutorName:          () => document.getElementById('tutor-name'),
  tutorEmail:         () => document.getElementById('tutor-email'),
  contactPanel:       () => document.getElementById('contact-panel'),
  contactHidden:      () => document.getElementById('contact-hidden'),
  contactRevealed:    () => document.getElementById('contact-revealed'),
  revealBtn:          () => document.getElementById('reveal-contact-btn'),
  contactWhatsapp:    () => document.getElementById('contact-whatsapp'),
  contactPhoneText:   () => document.getElementById('contact-phone-text'),
  contactEmailLink:   () => document.getElementById('contact-email-link'),
  contactEmailText:   () => document.getElementById('contact-email-text'),
  contactSocialWrap:  () => document.getElementById('contact-social-wrap'),
  contactSocialText:  () => document.getElementById('contact-social-text'),
  reviewsTitle:       () => document.getElementById('reviews-title'),
  reviewsContainer:   () => document.getElementById('reviews-container'),
  reviewSection:      () => document.getElementById('review-section'),
  reviewForm:         () => document.getElementById('review-form'),
  reviewRating:       () => document.getElementById('review-rating'),
  reviewComment:      () => document.getElementById('review-comment'),
  starBtns:           () => document.querySelectorAll('.star-btn'),
  ownerActions:       () => document.getElementById('owner-actions'),
  ownerNote:          () => document.getElementById('owner-note'),
  closeOfferBtn:      () => document.getElementById('close-offer-btn'),
  toast:              () => document.getElementById('toast-container'),
});

// ── 2. API ───────────────────────────────────────────────────
const DetailsAPI = Object.freeze({
  fetchOffer:      (id)    => fetch(`${API_BASE}/api/tutoring/${id}`),
  fetchReputation: (uid)   => fetch(`${API_BASE}/api/reviews/users/${uid}/reputation`),
  fetchReviews:    (uid)   => fetch(`${API_BASE}/api/reviews/users/${uid}/reviews`),
  fetchEnrolled:   (id, uid) =>
    fetch(`${API_BASE}/api/tutoring/${id}/enrolled`, { headers: { 'X-User-Id': uid } }),
  closeOffer:      (id, uid) =>
    fetch(`${API_BASE}/api/tutoring/${id}/close`, { method: 'POST', headers: { 'X-User-Id': uid } }),
  createReview:    (payload, uid) =>
    fetch(`${API_BASE}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': uid },
      body: JSON.stringify(payload),
    }),
  deleteReview: (reviewId, uid) =>
    fetch(`${API_BASE}/api/reviews/${reviewId}`, { method: 'DELETE', headers: { 'X-User-Id': uid } }),
  updateReview: (reviewId, payload, uid) =>
    fetch(`${API_BASE}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': uid },
      body: JSON.stringify(payload),
    }),
});

// ── 3. Utilidades ────────────────────────────────────────────
function buildInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function buildStarString(score) {
  const r = Math.round(score);
  return Array.from({ length: 5 }, (_, i) => i < r ? '★' : '☆').join('');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
}

function showToast(message, type = 'success') {
  const container = DetailsDOM.toast();
  if (!container) return;
  const borderColor = { success: 'border-l-green-500', error: 'border-l-red-500', warning: 'border-l-yellow-500' }[type] ?? 'border-l-green-500';
  const toast = document.createElement('div');
  toast.className = `bg-uce-navy text-white px-5 py-3.5 rounded-xl shadow-xl text-sm border-l-4 ${borderColor}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity .3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

// ── 4. Estado de pantalla ────────────────────────────────────
function setPageLoaded() {
  DetailsDOM.pageLoading()?.classList.add('hidden');
  DetailsDOM.pageContent()?.classList.remove('hidden');
}

// ── 5. Renderizado de info principal ─────────────────────────
function renderOfferInfo(offer) {
  const isOpen = offer.status !== 'CLOSED';

  if (DetailsDOM.breadcrumbSubject()) DetailsDOM.breadcrumbSubject().textContent = offer.subject;
  if (DetailsDOM.subject())          DetailsDOM.subject().textContent            = offer.subject;
  if (DetailsDOM.price())            DetailsDOM.price().textContent              = `$${offer.hourlyRate} / hora`;
  if (DetailsDOM.description())      DetailsDOM.description().textContent        = offer.description ?? '—';

  const badge = DetailsDOM.statusBadge();
  if (badge) {
    badge.textContent  = isOpen ? 'Disponible' : 'Cerrada';
    badge.className    = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
      isOpen ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
    }`;
  }
}

// ── 6. Renderizado del panel del tutor ───────────────────────
function renderTutorPanel(offer, reputation) {
  const score = (reputation?.reputation ?? 0);
  if (DetailsDOM.reputationScore()) DetailsDOM.reputationScore().textContent = score.toFixed(1);
  if (DetailsDOM.reputationStars()) DetailsDOM.reputationStars().textContent = buildStarString(score);

  const name = offer.tutorName ?? 'Tutor UCE';
  if (DetailsDOM.tutorInitials()) DetailsDOM.tutorInitials().textContent = buildInitials(name);
  if (DetailsDOM.tutorName())     DetailsDOM.tutorName().textContent     = name;
  if (DetailsDOM.tutorEmail())    DetailsDOM.tutorEmail().textContent    = offer.tutorEmail ?? '—';
}

// ── 7. Reveal de contacto ────────────────────────────────────
function initRevealContact(offer) {
  DetailsDOM.revealBtn()?.addEventListener('click', () => {
    // Construir los links de contacto la primera vez
    const phone   = offer.tutorPhone;
    const email   = offer.tutorEmail;
    const social  = offer.tutorSocialMedia;

    if (phone) {
      const wa = DetailsDOM.contactWhatsapp();
      const ph = DetailsDOM.contactPhoneText();
      if (wa && ph) {
        wa.href = `https://wa.me/${phone.replace(/\D/g, '')}`;
        ph.textContent = phone;
        wa.classList.remove('hidden');
      }
    }
    if (email) {
      const el = DetailsDOM.contactEmailLink();
      const et = DetailsDOM.contactEmailText();
      if (el && et) {
        el.href = `mailto:${email}`;
        et.textContent = email;
        el.classList.remove('hidden');
      }
    }
    if (social) {
      const sw = DetailsDOM.contactSocialWrap();
      const st = DetailsDOM.contactSocialText();
      if (sw && st) {
        st.textContent = social;
        sw.classList.remove('hidden');
      }
    }

    DetailsDOM.contactHidden()?.classList.add('hidden');
    DetailsDOM.contactRevealed()?.classList.remove('hidden');
  });
}

// ── 8. Reseñas ───────────────────────────────────────────────
function buildReviewCardHTML(review, currentUserId) {
  const isOwner  = review.reviewerId === currentUserId;
  const initials = buildInitials(review.reviewerName ?? 'U');
  const stars    = buildStarString(review.rating ?? 0);
  const ownerBtns = isOwner
    ? `<div class="flex gap-2">
         <button class="edit-review-btn text-[10px] font-semibold text-blue-500 hover:underline" data-id="${review.id}" data-rating="${review.rating}" data-comment="${encodeURIComponent(review.comment ?? '')}">Editar</button>
         <button class="delete-review-btn text-[10px] font-semibold text-red-400 hover:underline" data-id="${review.id}">Eliminar</button>
       </div>` : '';

  return `
    <article class="review-card flex gap-3 items-start p-4 rounded-xl border border-gray-100 bg-white">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-uce-navy/10 to-uce-navy/20 flex items-center justify-center flex-shrink-0 font-bold text-xs text-uce-navy" aria-hidden="true">
        ${initials}
      </div>
      <div class="flex flex-col gap-1 w-full min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div>
            <span class="font-semibold text-gray-800 text-sm">${review.reviewerName ?? 'Estudiante'}</span>
            <div class="text-amber-400 text-xs mt-0.5">${stars}</div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <time class="text-[10px] text-gray-400">${formatDate(review.createdAt)}</time>
            ${ownerBtns}
          </div>
        </div>
        <p class="text-gray-600 text-xs mt-1 italic">"${review.comment ?? 'Sin comentario'}"</p>
      </div>
    </article>`;
}

function renderReviews(reviews, currentUserId) {
  const container = DetailsDOM.reviewsContainer();
  const title     = DetailsDOM.reviewsTitle();
  if (!container) return;

  if (title) title.textContent = `Opiniones (${reviews.length})`;

  if (!reviews.length) {
    container.innerHTML = `<p class="text-sm text-gray-400 text-center py-8 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">Aún no hay opiniones para este tutor.</p>`;
    return;
  }

  container.innerHTML = reviews.map(r => buildReviewCardHTML(r, currentUserId)).join('');
  initReviewActions(currentUserId);
}

function initReviewActions(currentUserId) {
  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const confirmed = await Swal.fire({
        text: '¿Eliminar tu reseña?', icon: 'warning',
        showCancelButton: true, confirmButtonText: 'Eliminar',
        confirmButtonColor: '#ef4444', cancelButtonText: 'Cancelar',
      });
      if (!confirmed.isConfirmed) return;
      const res = await DetailsAPI.deleteReview(btn.dataset.id, currentUserId);
      if (res.ok) { showToast('Reseña eliminada.'); location.reload(); }
      else showToast('No se pudo eliminar la reseña.', 'error');
    });
  });

  document.querySelectorAll('.edit-review-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const { value: formValues } = await Swal.fire({
        title: 'Editar reseña',
        html: `
          <select id="swal-rating" class="swal2-input">
            ${[1,2,3,4,5].map(n => `<option value="${n}" ${n == btn.dataset.rating ? 'selected' : ''}>${n} estrella${n > 1 ? 's' : ''}</option>`).join('')}
          </select>
          <textarea id="swal-comment" class="swal2-textarea" placeholder="Comentario">${decodeURIComponent(btn.dataset.comment)}</textarea>`,
        showCancelButton: true, confirmButtonText: 'Guardar',
        confirmButtonColor: '#0A1628',
        preConfirm: () => ({
          rating:  parseInt(document.getElementById('swal-rating').value),
          comment: document.getElementById('swal-comment').value,
        }),
      });
      if (!formValues) return;
      const res = await DetailsAPI.updateReview(btn.dataset.id, formValues, currentUserId);
      if (res.ok) { showToast('Reseña actualizada.'); location.reload(); }
      else showToast('No se pudo actualizar la reseña.', 'error');
    });
  });
}

// ── 9. Estrellas interactivas del formulario ─────────────────
function initStarRating() {
  const stars = DetailsDOM.starBtns();
  const input = DetailsDOM.reviewRating();
  stars.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.value);
      if (input) input.value = val;
      stars.forEach((s, i) => {
        s.classList.toggle('selected', i < val);
        s.classList.toggle('text-amber-400', i < val);
        s.classList.toggle('text-gray-300', i >= val);
      });
    });
    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.dataset.value);
      stars.forEach((s, i) => s.classList.toggle('text-amber-300', i < val));
    });
    btn.addEventListener('mouseleave', () => {
      const currentVal = parseInt(input?.value ?? 0);
      stars.forEach((s, i) => {
        s.classList.toggle('text-amber-400', i < currentVal);
        s.classList.toggle('text-gray-300', i >= currentVal);
        s.classList.remove('text-amber-300');
      });
    });
  });
}

// ── 10. Formulario de reseña ─────────────────────────────────
async function initReviewForm(offer, currentUserId) {
  const section = DetailsDOM.reviewSection();
  const form    = DetailsDOM.reviewForm();
  if (!section || !form) return;

  // Solo mostrar si: no es el tutor, oferta cerrada, y estuvo inscrito
  if (offer.tutorId === currentUserId || offer.status !== 'CLOSED') return;

  try {
    const res      = await DetailsAPI.fetchEnrolled(offer.id, currentUserId);
    const enrolled = res.ok ? await res.json() : false;
    if (!enrolled) return;
  } catch { return; }

  section.classList.remove('hidden');
  initStarRating();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const rating  = parseInt(DetailsDOM.reviewRating()?.value ?? '0');
    const comment = DetailsDOM.reviewComment()?.value?.trim() ?? '';

    if (!rating) { showToast('Selecciona una calificación.', 'warning'); return; }
    if (!comment) { showToast('Escribe un comentario.', 'warning'); return; }

    const payload = {
      reviewedUserId: offer.tutorId,
      targetId:       offer.id,
      targetType:     'TUTORING',
      rating,
      comment,
    };

    const res = await DetailsAPI.createReview(payload, currentUserId);
    if (res.ok) { showToast('¡Reseña publicada!'); location.reload(); }
    else showToast('No se pudo publicar la reseña.', 'error');
  });
}

// ── 11. Acciones del propietario ─────────────────────────────
function initOwnerActions(offer, currentUserId) {
  if (offer.tutorId !== currentUserId) return;

  // Ocultar panel de contacto, mostrar nota de propietario
  DetailsDOM.contactPanel()?.classList.add('hidden');
  DetailsDOM.ownerNote()?.classList.remove('hidden');

  const ownerDiv = DetailsDOM.ownerActions();
  const closeBtn = DetailsDOM.closeOfferBtn();
  if (!ownerDiv || !closeBtn) return;

  ownerDiv.classList.remove('hidden');

  if (offer.status === 'CLOSED') {
    closeBtn.disabled    = true;
    closeBtn.textContent = 'Tutoría ya cerrada';
    return;
  }

  closeBtn.addEventListener('click', async () => {
    const confirmed = await Swal.fire({
      title: '¿Cerrar esta tutoría?',
      text: 'El anuncio dejará de aparecer como disponible.',
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, cerrar', cancelButtonText: 'No',
      confirmButtonColor: '#ef4444',
    });
    if (!confirmed.isConfirmed) return;

    closeBtn.disabled = true;
    const res = await DetailsAPI.closeOffer(offer.id, currentUserId);
    if (res.ok) { showToast('Tutoría marcada como cerrada.'); location.reload(); }
    else { showToast('No se pudo cerrar la tutoría.', 'error'); closeBtn.disabled = false; }
  });
}

// ── 12. Orquestación principal ───────────────────────────────
async function loadDetails(offerId, currentUserId) {
  try {
    const offerRes = await DetailsAPI.fetchOffer(offerId);
    if (!offerRes.ok) throw new Error(`HTTP ${offerRes.status}`);
    const offer = await offerRes.json();

    const [repRes, revRes] = await Promise.allSettled([
      DetailsAPI.fetchReputation(offer.tutorId),
      DetailsAPI.fetchReviews(offer.tutorId),
    ]);

    const reputation = repRes.status === 'fulfilled' && repRes.value.ok
      ? await repRes.value.json() : { reputation: 0 };
    const reviews    = revRes.status === 'fulfilled' && revRes.value.ok
      ? await revRes.value.json() : [];

    renderOfferInfo(offer);
    renderTutorPanel(offer, reputation);
    renderReviews(reviews, currentUserId);
    initRevealContact(offer);
    initOwnerActions(offer, currentUserId);
    await initReviewForm(offer, currentUserId);

    setPageLoaded();
  } catch (err) {
    console.error('[TutoringDetails] Error:', err);
    DetailsDOM.pageLoading()?.replaceWith(
      Object.assign(document.createElement('p'), {
        className: 'text-red-400 text-sm py-10 text-center',
        textContent: 'No se pudo cargar la tutoría.',
      })
    );
  }
}

// ── 13. Bootstrap ────────────────────────────────────────────
window.addEventListener('load', async () => {
  await Clerk.load();
  if (!Clerk.user) { window.location.href = '/modules/identity/signin.html'; return; }

  const userId  = localStorage.getItem('campusMarketUserId');
  const offerId = new URLSearchParams(window.location.search).get('id');

  if (!offerId) {
    await Swal.fire({ text: 'No se especificó la tutoría.', icon: 'warning' });
    window.location.href = '/modules/tutoring/tutoring-catalog.html';
    return;
  }

  MarketplaceLayout.mountNavbar('tutorias', Clerk.user);
  await loadDetails(offerId, userId);
});