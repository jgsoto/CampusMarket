'use strict';

// ══════════════════════════════════════════════════════════════
// MÓDULO: CreateTutoring
// Responsabilidad: sincronizar sesión, validar y publicar
// una nueva oferta de tutoría.
// ══════════════════════════════════════════════════════════════

// ── 1. Selectores ────────────────────────────────────────────
const CreateDOM = Object.freeze({
  form:         () => document.getElementById('create-tutoring-form'),
  subject:      () => document.getElementById('subject'),
  description:  () => document.getElementById('description'),
  hourlyRate:   () => document.getElementById('hourlyRate'),
  descCount:    () => document.getElementById('desc-count'),
  submitBtn:    () => document.getElementById('submit-btn'),
  toast:        () => document.getElementById('toast-container'),
});

// ── 2. API ───────────────────────────────────────────────────
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

// ── 3. Sync defensivo de sesión ──────────────────────────────
async function ensureUserSynced(clerkUser) {
  const syncPayload = {
    clerkUserId: clerkUser.id,
    fullName:    clerkUser.fullName,
    email:       clerkUser.primaryEmailAddress?.emailAddress ?? '',
  };

  console.log('[CreateTutoring] Sincronizando usuario:', syncPayload);

  try {
    const res = await CreateAPI.syncUser(clerkUser);

    if (!res.ok) {
      const body = await res.text();
      console.error('[CreateTutoring] Sync falló HTTP', res.status, body);
      throw new Error(`Sync HTTP ${res.status}: ${body}`);
    }

    const user = await res.json();
    console.log('[CreateTutoring] Sync exitoso, user.id =', user.id);

    if (!user.id) {
      throw new Error('El servidor no devolvió un ID de usuario válido');
    }

    localStorage.setItem('campusMarketUserId', user.id);
    return user.id;

  } catch (err) {
    console.error('[CreateTutoring] Error en ensureUserSynced:', err);
    const stored = localStorage.getItem('campusMarketUserId');
    console.warn('[CreateTutoring] Usando fallback localStorage:', stored);
    if (stored) return stored;
    throw new Error('No se pudo sincronizar la sesión.');
  }
}

// ── 4. Validación por campo ──────────────────────────────────
const VALIDATIONS = [
  {
    field: 'subject',
    test:  v => v.trim().length >= 3,
    msg:   'La materia debe tener al menos 3 caracteres.',
  },
  {
    field: 'description',
    test:  v => v.trim().length >= 10,
    msg:   'La descripción debe tener al menos 10 caracteres.',
  },
  {
    field: 'hourlyRate',
    test:  v => { const n = parseFloat(v); return !isNaN(n) && n >= 1; },
    msg:   'Ingresa una tarifa válida (mínimo $1.00).',
  },
];

function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const input = document.getElementById(fieldId);
  input?.classList.add('border-red-400');
  input?.classList.remove('border-gray-200');
  const span = document.createElement('span');
  span.id = `err-${fieldId}`;
  span.className = 'text-xs text-red-400 mt-1';
  span.textContent = message;
  input?.parentElement?.appendChild(span);
}

function showToast(message, type = 'success') {
  const container = CreateDOM.toast();
  if (!container) return;
  const border = { success: 'border-l-green-500', error: 'border-l-red-500', warning: 'border-l-yellow-500' }[type] ?? 'border-l-green-500';
  const toast = document.createElement('div');
  toast.className = `bg-uce-navy text-white px-5 py-3.5 rounded-xl shadow-xl text-sm border-l-4 ${border}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity .3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

function clearFieldError(fieldId) {
  document.getElementById(`err-${fieldId}`)?.remove();
  const input = document.getElementById(fieldId);
  input?.classList.remove('border-red-400');
  input?.classList.add('border-gray-200');
}

function validateAll() {
  let valid = true;
  VALIDATIONS.forEach(({ field, test, msg }) => {
    const val = document.getElementById(field)?.value ?? '';
    if (!test(val)) { showFieldError(field, msg); valid = false; }
    else clearFieldError(field);
  });
  return valid;
}

// ── 5. UI ────────────────────────────────────────────────────
function setSaving(isSaving) {
  const btn = CreateDOM.submitBtn();
  if (!btn) return;
  btn.disabled = isSaving;
  btn.innerHTML = isSaving
    ? '<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold rounded-full animate-spin-slow inline-block mr-2"></span>Publicando...'
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Publicar Tutoría`;
}

// ── 6. Bootstrap ─────────────────────────────────────────────
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
    await Swal.fire({
      title: 'Error de sesión',
      text:  'No se pudo verificar tu cuenta. Intenta iniciar sesión de nuevo.',
      icon:  'error',
      confirmButtonColor: '#0A1628',
    });
    window.location.href = '/modules/identity/signin.html';
    return;
  }

  // Contador de caracteres
  CreateDOM.description()?.addEventListener('input', function () {
    if (CreateDOM.descCount()) CreateDOM.descCount().textContent = this.value.length;
    clearFieldError('description');
  });
  CreateDOM.subject()?.addEventListener('input',    () => clearFieldError('subject'));
  CreateDOM.hourlyRate()?.addEventListener('input', () => clearFieldError('hourlyRate'));

  // Submit Formulario
  CreateDOM.form()?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    setSaving(true);
    try {
      const userId = localStorage.getItem('campusMarketUserId');
      console.log('[CreateTutoring] userId recuperado:', userId);

      if (!userId) {
        throw new Error('No se encontró el ID de usuario. Vuelve al Dashboard primero.');
      }

      const payload = {
        tutorId:     userId,
        subject:     CreateDOM.subject().value.trim(),
        description: CreateDOM.description().value.trim(),
        hourlyRate:  parseFloat(CreateDOM.hourlyRate().value)
      };

      console.log('[CreateTutoring] Payload exacto enviado:', JSON.stringify(payload));

      const res = await CreateAPI.publish(payload, userId);

      if (!res.ok) {
        const body = await res.text();
        console.error('[CreateTutoring] Backend error:', res.status, body);
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

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
        text:  'No se pudo guardar la tutoría. Verifica tu conexión e intenta de nuevo.',
        icon:  'error',
        confirmButtonColor: '#0A1628',
      });
    } finally {
      setSaving(false);
    }
  });
});