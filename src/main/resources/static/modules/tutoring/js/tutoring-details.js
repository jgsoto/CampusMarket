'use strict';

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
  editOfferBtn:       () => document.getElementById('edit-offer-btn'),
  deleteOfferBtn:     () => document.getElementById('delete-offer-btn'),
  closeOfferBtn:      () => document.getElementById('close-offer-btn'),
  enrollContainer:    () => document.getElementById('enroll-container'),
  toast:              () => document.getElementById('toast-container'),
});

const DetailsAPI = Object.freeze({
  fetchOffer:      (id)      => fetch(`${API_BASE}/api/tutoring/${id}`),
  fetchReputation: (uid)     => fetch(`${API_BASE}/api/reviews/users/${uid}/reputation`),
  fetchReviews:    (uid)     => fetch(`${API_BASE}/api/reviews/users/${uid}/reviews`),
  fetchEnrolled:   (id, uid) => fetch(`${API_BASE}/api/tutoring/${id}/enrolled`, { headers: { 'X-User-Id': uid } }),
  closeOffer:      (id, uid) => fetch(`${API_BASE}/api/tutoring/${id}/close`, { method: 'POST', headers: { 'X-User-Id': uid } }),
  createReview: (payload, uid) => fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': uid },
    body: JSON.stringify(payload),
  }),
  deleteReview: (reviewId, uid) => fetch(`${API_BASE}/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': uid },
  }),
  updateReview: (reviewId, payload, uid) => fetch(`${API_BASE}/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': uid },
    body: JSON.stringify(payload),
  }),
});

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
  const border = { success: 'border-l-green-500', error: 'border-l-red-500', warning: 'border-l-yellow-500' }[type] ?? 'border-l-green-500';
  const toast = document.createElement('div');
  toast.className = `bg-uce-navy text-white px-5 py-3.5 rounded-xl shadow-xl text-sm border-l-4 ${border}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function renderOfferInfo(offer) {
  const isOpen = offer.status !== 'CLOSED';
  if (DetailsDOM.breadcrumbSubject()) DetailsDOM.breadcrumbSubject().textContent = offer.subject;
  if (DetailsDOM.subject())           DetailsDOM.subject().textContent = offer.subject;
  if (DetailsDOM.price())             DetailsDOM.price().textContent = `$${offer.hourlyRate} / hora`;
  if (DetailsDOM.description())       DetailsDOM.description().textContent = offer.description ?? '—';

  const badge = DetailsDOM.statusBadge();
  if (badge) {
    badge.textContent = isOpen ? 'Disponible' : 'Cerrada';
    badge.className   = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
      isOpen ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
             : 'bg-gray-100 text-gray-500 border border-gray-200'
    }`;
  }
}

function renderTutorPanel(offer, reputation) {
  const score = reputation?.reputation ?? 0;
  if (DetailsDOM.reputationScore()) DetailsDOM.reputationScore().textContent = score.toFixed(1);
  if (DetailsDOM.reputationStars()) DetailsDOM.reputationStars().textContent = buildStarString(score);

  const name = offer.tutorName ?? 'Tutor UCE';
  if (DetailsDOM.tutorInitials()) DetailsDOM.tutorInitials().textContent = buildInitials(name);
  if (DetailsDOM.tutorName())     DetailsDOM.tutorName().textContent = name;
  if (DetailsDOM.tutorEmail())    DetailsDOM.tutorEmail().textContent = offer.tutorEmail ?? '—';
}

function initRevealContact(offer) {
  DetailsDOM.revealBtn()?.addEventListener('click', () => {
    const { tutorPhone: phone, tutorEmail: email, tutorSocialMedia: social } = offer;
    if (phone) {
      const wa = DetailsDOM.contactWhatsapp(), ph = DetailsDOM.contactPhoneText();
      if (wa && ph) { wa.href = `https://wa.me/${phone.replace(/\D/g, '')}`; ph.textContent = phone; wa.classList.remove('hidden'); }
    }
    if (email) {
      const el = DetailsDOM.contactEmailLink(), et = DetailsDOM.contactEmailText();
      if (el && et) { el.href = `mailto:${email}`; et.textContent = email; el.classList.remove('hidden'); }
    }
    if (social) {
      const sw = DetailsDOM.contactSocialWrap(), st = DetailsDOM.contactSocialText();
      if (sw && st) { st.textContent = social; sw.classList.remove('hidden'); }
    }
    DetailsDOM.contactHidden()?.classList.add('hidden');
    DetailsDOM.contactRevealed()?.classList.remove('hidden');
  });
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

  container.innerHTML = reviews.map(review => {
    // FIX: String() en ambos lados — UUID del backend vs string del localStorage
    const isOwner  = String(review.reviewerId) === String(currentUserId);
    const initials = buildInitials(review.reviewerName ?? 'U');
    const stars    = buildStarString(review.rating ?? 0);
    const ownerBtns = isOwner ? `
      <div class="flex gap-2 mt-2">
        <button class="edit-review-btn text-[10px] font-semibold text-blue-500 hover:underline"
          data-id="${review.id}" data-rating="${review.rating}"
          data-comment="${encodeURIComponent(review.comment ?? '')}">Editar</button>
        <button class="delete-review-btn text-[10px] font-semibold text-red-400 hover:underline"
          data-id="${review.id}">Eliminar</button>
      </div>` : '';

    return `
      <article class="review-card flex gap-3 items-start p-4 rounded-xl border border-gray-100 bg-white">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-uce-navy/10 to-uce-navy/20 flex items-center justify-center flex-shrink-0 font-bold text-xs text-uce-navy">
          ${initials}
        </div>
        <div class="flex flex-col gap-1 w-full min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-semibold text-gray-800 text-sm">${review.reviewerName ?? 'Estudiante'}</span>
              <div class="text-amber-400 text-xs mt-0.5">${stars}</div>
            </div>
            <time class="text-[10px] text-gray-400">${formatDate(review.createdAt)}</time>
          </div>
          <p class="text-gray-600 text-xs mt-1 italic">"${review.comment ?? 'Sin comentario'}"</p>
          ${ownerBtns}
        </div>
      </article>`;
  }).join('');

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
  });
}

async function initReviewForm(offer, currentUserId) {
  const section = DetailsDOM.reviewSection();
  const form    = DetailsDOM.reviewForm();
  if (!section || !form) return;

  // No mostrar formulario si el usuario es el tutor o si la tutoría no está cerrada
  if (String(offer.tutorId) === String(currentUserId) || offer.status !== 'CLOSED') return;

  try {
    const enrollRes = await DetailsAPI.fetchEnrolled(offer.id, currentUserId);
    const enrolled  = enrollRes.ok ? await enrollRes.json() : false;
    if (!enrolled) return;

    const reviewsRes = await DetailsAPI.fetchReviews(offer.tutorId);
    const allReviews = reviewsRes.ok ? await reviewsRes.json() : [];

    // FIX: usar offer.id (no offerId, que no existe en este scope)
    // FIX: String() en ambos lados para comparación segura UUID vs string
    const alreadyReviewed = allReviews.some(
      r => String(r.reviewerId) === String(currentUserId) && String(r.targetId) === String(offer.id)
    );

    if (alreadyReviewed) { section.classList.add('hidden'); return; }
  } catch (err) {
    console.error('[TutoringDetails] initReviewForm error:', err);
    return;
  }

  section.classList.remove('hidden');
  initStarRating();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const rating  = parseInt(DetailsDOM.reviewRating()?.value ?? '0');
    const comment = DetailsDOM.reviewComment()?.value?.trim() ?? '';

    if (!rating)  { showToast('Selecciona una calificación.', 'warning'); return; }
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

async function initEnrollmentButton(offer, offerId, currentUserId) {
  if (String(offer.tutorId) === String(currentUserId)) return;

  const container = DetailsDOM.enrollContainer();
  if (!container) return;

  let isAlreadyEnrolled = false;
  try {
    const checkRes = await DetailsAPI.fetchEnrolled(offerId, currentUserId);
    if (checkRes.ok) isAlreadyEnrolled = await checkRes.json();
  } catch (err) {
    console.warn('[TutoringDetails] fetchEnrolled error:', err);
  }

  if (isAlreadyEnrolled) {
    let alreadyReviewed = false;
    try {
      const reviewsRes = await DetailsAPI.fetchReviews(offer.tutorId);
      const allReviews = reviewsRes.ok ? await reviewsRes.json() : [];
      // FIX: String() en ambos lados para comparación segura
      alreadyReviewed = allReviews.some(
        r => String(r.reviewerId) === String(currentUserId) && String(r.targetId) === String(offerId)
      );
    } catch (e) {
      console.warn('[TutoringDetails] fetchReviews error:', e);
    }

    if (offer.status === 'CLOSED' && alreadyReviewed) {
       container.innerHTML = `
    <div class="w-full bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-800 font-semibold text-sm mb-4">
      ✓ Ya dejaste tu reseña para esta tutoría
    </div>`;
  return;
}
    if (offer.status === 'CLOSED' && !alreadyReviewed) {
      container.innerHTML = `
        <div class="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 text-center text-blue-800 font-semibold text-sm mb-4">
          🎓 La tutoría ha terminado. Deja tu reseña abajo
        </div>`;
      DetailsDOM.contactHidden()?.classList.add('hidden');
      DetailsDOM.contactRevealed()?.classList.remove('hidden');
      DetailsDOM.revealBtn()?.click();
      return;
    }

    container.innerHTML = `
      <div class="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-emerald-800 font-semibold text-sm mb-4">
        ✓ Ya estás inscrito a esta tutoría
      </div>`;
    DetailsDOM.contactHidden()?.classList.add('hidden');
    DetailsDOM.contactRevealed()?.classList.remove('hidden');
    DetailsDOM.revealBtn()?.click();
    return;
  }

  if (offer.status === 'CLOSED') return;

  container.innerHTML = `
    <button id="enroll-btn" class="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md mb-4 transform hover:-translate-y-0.5">
      🎓 Inscribirme a esta Tutoría
    </button>`;

  document.getElementById('enroll-btn').addEventListener('click', async () => {
    const confirmed = await Swal.fire({
      title: '¿Inscribirte en la tutoría?',
      text: 'Te registrarás como alumno oficial para esta asignatura.',
      icon: 'question', showCancelButton: true,
      confirmButtonText: 'Sí, inscribirme', cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
    });
    if (!confirmed.isConfirmed) return;

    const res = await fetch(`${API_BASE}/api/tutoring/${offerId}/enroll`, {
      method: 'POST', headers: { 'X-User-Id': currentUserId },
    });
    if (res.ok) {
      await Swal.fire('¡Inscripción Exitosa!', 'Has quedado registrado. Ya puedes ver los datos del tutor.', 'success');
      location.reload();
    } else {
      Swal.fire({ title: 'Registro existente', text: 'Ya te encuentras registrado en esta tutoría.', icon: 'info', confirmButtonColor: '#0A1628' });
    }
  });
}

function initOwnerActions(offer, offerId, currentUserId) {
  // FIX: String() para comparación segura UUID vs string
  if (String(offer.tutorId) !== String(currentUserId)) return;

  DetailsDOM.contactPanel()?.classList.add('hidden');
  DetailsDOM.ownerNote()?.classList.remove('hidden');

  const ownerDiv  = DetailsDOM.ownerActions();
  const closeBtn  = DetailsDOM.closeOfferBtn();
  const editBtn   = DetailsDOM.editOfferBtn();
  const deleteBtn = DetailsDOM.deleteOfferBtn();

  if (ownerDiv) ownerDiv.classList.remove('hidden');

  if (offer.status === 'CLOSED') {
    if (closeBtn) {
      closeBtn.disabled   = true;
      closeBtn.className  = 'px-5 py-2.5 bg-gray-300 text-gray-500 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed';
      closeBtn.textContent = 'Tutoría ya cerrada';
    }
  } else if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      const confirmed = await Swal.fire({
        title: '¿Cerrar esta tutoría?',
        text: 'El anuncio dejará de aparecer disponible en el catálogo de alumnos.',
        icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Sí, cerrar', cancelButtonText: 'No', confirmButtonColor: '#ef4444',
      });
      if (!confirmed.isConfirmed) return;
      closeBtn.disabled = true;
      const res = await DetailsAPI.closeOffer(offerId, currentUserId);
      if (res.ok) { showToast('Tutoría marcada como cerrada.'); location.reload(); }
      else { showToast('No se pudo cerrar la tutoría.', 'error'); closeBtn.disabled = false; }
    });
  }

  editBtn?.addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Tutoría',
      html: `
        <input id="swal-subject" class="swal2-input" placeholder="Título" value="${offer.subject}">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Descripción">${offer.description ?? ''}</textarea>
        <input id="swal-rate" type="number" class="swal2-input" placeholder="Tarifa por hora ($)" value="${offer.hourlyRate}">`,
      showCancelButton: true, confirmButtonText: 'Guardar cambios', confirmButtonColor: '#0A1628',
      preConfirm: () => ({
        subject:     document.getElementById('swal-subject').value.trim(),
        description: document.getElementById('swal-description').value.trim(),
        hourlyRate:  parseFloat(document.getElementById('swal-rate').value),
      }),
    });
    if (!formValues || !formValues.subject || isNaN(formValues.hourlyRate)) return;
    const res = await fetch(`${API_BASE}/api/tutoring/${offerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': currentUserId },
      body: JSON.stringify(formValues),
    });
    if (res.ok) { location.reload(); }
    else { showToast('Error al actualizar la tutoría.', 'error'); }
  });

  deleteBtn?.addEventListener('click', async () => {
    const confirmed = await Swal.fire({
      title: '¿Eliminar tutoría?', text: 'Esta acción borrará la publicación de forma permanente.',
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#ef4444', cancelButtonText: 'Cancelar',
    });
    if (!confirmed.isConfirmed) return;
    const res = await fetch(`${API_BASE}/api/tutoring/${offerId}`, { method: 'DELETE', headers: { 'X-User-Id': currentUserId } });
    if (res.ok) { window.location.href = '/modules/tutoring/tutoring-catalog.html'; }
    else { showToast('Error al eliminar la tutoría.', 'error'); }
  });
}

async function loadDetails(offerId, currentUserId) {
  try {
    const offerRes = await DetailsAPI.fetchOffer(offerId);
    if (!offerRes.ok) throw new Error(`HTTP ${offerRes.status}`);
    const offer = await offerRes.json();

    const revRes     = await DetailsAPI.fetchReviews(offer.tutorId);
    const allReviews = revRes.ok ? await revRes.json() : [];

    // FIX: String() para comparación segura UUID (JSON) vs string (URL param)
    const filteredReviews = allReviews.filter(r => String(r.targetId) === String(offerId));

    // FIX: declarar localScore antes del if para evitar ReferenceError
    let localScore = 0;
    if (filteredReviews.length > 0) {
      localScore = filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length;
    }

    renderOfferInfo(offer);
    renderTutorPanel(offer, { reputation: localScore });
    renderReviews(filteredReviews, currentUserId);
    initRevealContact(offer);

    await initEnrollmentButton(offer, offerId, currentUserId);
    initOwnerActions(offer, offerId, currentUserId);
    await initReviewForm(offer, currentUserId);

    DetailsDOM.pageLoading()?.classList.add('hidden');
    DetailsDOM.pageContent()?.classList.remove('hidden');
  } catch (err) {
    console.error('[TutoringDetails] loadDetails error:', err);
  }
}

window.addEventListener('load', async () => {
  await Clerk.load();
  if (!Clerk.user) { window.location.href = '/modules/identity/signin.html'; return; }

  // FIX: siempre hacer sync con el backend para obtener el UUID interno correcto
  // (no leer solo del localStorage, que puede estar vacío o desactualizado)
  const syncRes = await fetch(`${API_BASE}/api/v1/users/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkUserId: Clerk.user.id,
      fullName:    Clerk.user.fullName,
      email:       Clerk.user.primaryEmailAddress?.emailAddress ?? '',
    }),
  });
  const syncData = await syncRes.json();
  const userId   = String(syncData.id);
  localStorage.setItem('campusMarketUserId', userId);

  const offerId = new URLSearchParams(window.location.search).get('id');
  if (!offerId) { window.location.href = '/modules/tutoring/tutoring-catalog.html'; return; }

  MarketplaceLayout.mountNavbar('tutorias', Clerk.user);
  await loadDetails(offerId, userId);
});