'use strict';

const EditDOM = Object.freeze({
  form: () => document.getElementById('edit-tutoring-form'),
  loader: () => document.getElementById('loader'),
  idInput: () => document.getElementById('tutoring-id'),
  subjectInput: () => document.getElementById('subject'),
  descriptionInput: () => document.getElementById('description'),
  descCount: () => document.getElementById('desc-count'),
  hourlyRateInput: () => document.getElementById('hourlyRate'),
  submitBtn: () => document.getElementById('submit-btn'),
  cancelBtn: () => document.getElementById('btn-cancel'),
  toast: () => document.getElementById('toast-container'),
});

function showToast(message, type = 'success') {
  const container = EditDOM.toast();
  if (!container) return;

  const border = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500'
  }[type] ?? 'border-l-green-500';

  const toast = document.createElement('div');
  toast.className = `bg-uce-navy text-white px-5 py-3.5 rounded-xl shadow-xl text-sm border-l-4 ${border} transform transition-all duration-300 translate-y-0 opacity-100`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.replace('translate-y-0', 'translate-y-4');
    toast.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function initCounters() {
  const desc = EditDOM.descriptionInput();
  const descCount = EditDOM.descCount();

  if (desc && descCount) {
    desc.addEventListener('input', () => {
      descCount.textContent = desc.value.length;
    });
  }
}

async function loadTutoringData(offerId) {
  try {
    const res = await fetch(`${API_BASE}/api/tutoring/${offerId}`);
    if (!res.ok) throw new Error('No se pudo cargar la tutoría');
    const data = await res.json();
    
    // Check if the current user is the owner
    const userId = localStorage.getItem('campusMarketUserId');
    if (String(data.tutorId) !== String(userId)) {
      showToast('No tienes permiso para editar esta tutoría', 'error');
      setTimeout(() => window.location.href = '/modules/marketplace/my-listings.html', 1500);
      return;
    }

    if (data.status === 'CLOSED') {
      showToast('Esta tutoría ya se encuentra cerrada y no puede editarse.', 'warning');
      setTimeout(() => window.location.href = '/modules/marketplace/my-listings.html', 2000);
      return;
    }

    EditDOM.idInput().value = data.id;
    EditDOM.subjectInput().value = data.subject;
    EditDOM.descriptionInput().value = data.description || '';
    EditDOM.hourlyRateInput().value = data.hourlyRate;
    
    if (EditDOM.descCount()) {
        EditDOM.descCount().textContent = (data.description || '').length;
    }

    EditDOM.loader().classList.add('hidden');
    EditDOM.form().classList.remove('hidden');

  } catch (err) {
    console.error('[EditTutoring] Error al cargar:', err);
    EditDOM.loader().textContent = 'Error al cargar los datos. Intenta recargar la página.';
    EditDOM.loader().classList.replace('text-gray-400', 'text-red-500');
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const userId = localStorage.getItem('campusMarketUserId');
  if (!userId) {
    showToast('Sesión no válida.', 'error');
    return;
  }

  const submitBtn = EditDOM.submitBtn();
  const offerId = EditDOM.idInput().value;
  
  const payload = {
    subject: EditDOM.subjectInput().value.trim(),
    description: EditDOM.descriptionInput().value.trim(),
    hourlyRate: parseFloat(EditDOM.hourlyRateInput().value),
  };

  if (!payload.subject || !payload.description || isNaN(payload.hourlyRate)) {
    showToast('Por favor, completa todos los campos correctamente.', 'warning');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin h-4 w-4 text-uce-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Guardando...
  `;

  try {
    const res = await fetch(`${API_BASE}/api/tutoring/${offerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('No se pudo guardar la tutoría');

    showToast('Tutoría actualizada correctamente.', 'success');
    
    setTimeout(() => {
      window.location.href = '/modules/marketplace/my-listings.html';
    }, 1000);

  } catch (err) {
    console.error('[EditTutoring] Error:', err);
    showToast('Error al actualizar. Revisa tu conexión.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Guardar Cambios
    `;
  }
}

window.addEventListener('load', async () => {
  await Clerk.load();
  
  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  // Sincronizar usuario
  try {
    const syncRes = await fetch(`${API_BASE}/api/v1/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkUserId: Clerk.user.id,
        fullName: Clerk.user.fullName,
        email: Clerk.user.primaryEmailAddress?.emailAddress ?? '',
      }),
    });
    const syncData = await syncRes.json();
    localStorage.setItem('campusMarketUserId', String(syncData.id));
  } catch (err) {
    console.warn('[EditTutoring] Error de sincronización local', err);
  }

  await MarketplaceLayout.mountNavbar('tutorias', Clerk.user);
  
  const params = new URLSearchParams(window.location.search);
  const offerId = params.get('id');
  
  if (!offerId) {
    window.location.href = '/modules/tutoring/tutoring-catalog.html';
    return;
  }

  EditDOM.cancelBtn()?.addEventListener('click', () => {
      window.location.href = '/modules/marketplace/my-listings.html';
  });

  initCounters();
  await loadTutoringData(offerId);

  EditDOM.form()?.addEventListener('submit', handleSubmit);
});
