'use strict'; 

const CreateDOM = Object.freeze({
  form:         () => document.getElementById('create-tutoring-form'),
  subject:      () => document.getElementById('subject'),
  description:  () => document.getElementById('description'),
  hourlyRate:   () => document.getElementById('hourlyRate'),
  descCount:    () => document.getElementById('desc-count'),
  submitBtn:    () => document.getElementById('submit-btn'),
  toast:        () => document.getElementById('toast-container'),
});

const CreateAPI = Object.freeze({
  syncUser: (clerkUser) =>
    fetch(`${API_BASE}/api/v1/users/sync`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkUserId: clerkUser.id,
        fullName:    clerkUser.fullName,
        email:       clerkUser.primaryEmailAddress?.emailAddress ?? '',
      }),
    }),

  publish: (payload, internalUserId) =>
    fetch(`${API_BASE}/api/tutoring`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id':    internalUserId,
      },
      body: JSON.stringify(payload),
    }),
});

async function ensureUserSynced(clerkUser) {
  try {
    const res = await CreateAPI.syncUser(clerkUser);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sync HTTP ${res.status}: ${body}`);
    }
    const user = await res.json();
    if (!user.id) throw new Error('ID inválido');
    
    localStorage.setItem('campusMarketUserId', user.id);
    return user.id;
  } catch (err) {
    console.error('[CreateTutoring] Error en ensureUserSynced:', err);
    const stored = localStorage.getItem('campusMarketUserId');
    if (stored) return stored;
    throw new Error('No se pudo sincronizar la sesión.');
  }
}

const VALIDATIONS = [
  {
    field: 'subject',
    test:  v => v.trim().length >= 3,
    msg:   'La materia es obligatoria y debe tener al menos 3 caracteres.',
  },
  {
    field: 'description',
    test:  v => v.trim().length >= 10,
    msg:   'La descripción es obligatoria y debe tener al menos 10 caracteres.',
  },
  {
    field: 'hourlyRate',
    test:  v => { const n = parseFloat(v); return !isNaN(n) && n >= 1; },
    msg:   'Por favor, ingresa una tarifa válida por hora (mínimo $1.00).',
  },
];

function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const input = document.getElementById(fieldId);
  input?.classList.add('border-red-400', 'bg-red-50/30');
  input?.classList.remove('border-gray-200');
  
  const span = document.createElement('span');
  span.id = `err-${fieldId}`;
  span.className = 'text-xs text-red-500 font-medium mt-1 animate-pulse';
  span.textContent = message;
  input?.parentElement?.appendChild(span);
}

function clearFieldError(fieldId) {
  document.getElementById(`err-${fieldId}`)?.remove();
  const input = document.getElementById(fieldId);
  input?.classList.remove('border-red-400', 'bg-red-50/30');
  input?.classList.add('border-gray-200');
}

function validateAll() {
  let firstErrorField = null;
  let isValid = true;

  VALIDATIONS.forEach(({ field, test, msg }) => {
    const inputElement = document.getElementById(field);
    const val = inputElement?.value ?? '';
    
    if (!test(val)) {
      showFieldError(field, msg);
      isValid = false;
      if (!firstErrorField) firstErrorField = inputElement;
    } else {
      clearFieldError(field);
    }
  });

  if (!isValid && firstErrorField) {
    firstErrorField.focus();
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Por favor, llena todos los campos obligatorios con los formatos correctos.',
      icon: 'warning',
      confirmButtonColor: '#0A1628'
    });
  }

  return isValid;
}

function setSaving(isSaving) {
  const btn = CreateDOM.submitBtn();
  if (!btn) return;
  btn.disabled = isSaving;
  btn.innerHTML = isSaving
    ? '<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold rounded-full animate-spin inline-block mr-2"></span>Publicando...'
    : `Publicar Tutoría`;
}

window.addEventListener('load', async () => {
  await Clerk.load();
  if (!Clerk.user) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  MarketplaceLayout.mountNavbar('tutorias', Clerk.user);

  let internalUserId;
  try {
    internalUserId = await ensureUserSynced(Clerk.user);
  } catch (err) {
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  CreateDOM.description()?.addEventListener('input', function () {
    if (CreateDOM.descCount()) CreateDOM.descCount().textContent = this.value.length;
    clearFieldError('description');
  });
  
  CreateDOM.subject()?.addEventListener('input', () => clearFieldError('subject'));
  CreateDOM.hourlyRate()?.addEventListener('input', () => clearFieldError('hourlyRate'));

  CreateDOM.form()?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    setSaving(true);
    try {
      const payload = {
        tutorId:     internalUserId,
        subject:     CreateDOM.subject().value.trim(),
        description: CreateDOM.description().value.trim(),
        hourlyRate:  parseFloat(CreateDOM.hourlyRate().value)
      };

      const res = await CreateAPI.publish(payload, internalUserId);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      await Swal.fire({
        title: '¡Tutoría publicada!',
        text:  'Los estudiantes ya pueden encontrar tu anuncio.',
        icon:  'success',
        confirmButtonColor: '#0A1628',
        confirmButtonText:  'Ver catálogo',
      });
      window.location.href = '/modules/tutoring/tutoring-catalog.html';

    } catch (err) {
      console.error('[CreateTutoring] Error:', err);
      Swal.fire({
        title: 'Error al publicar',
        text:  'No se pudo guardar la tutoría en la nube. Intenta de nuevo.',
        icon:  'error',
        confirmButtonColor: '#0A1628',
      });
    } finally {
      setSaving(false);
    }
  });
});
