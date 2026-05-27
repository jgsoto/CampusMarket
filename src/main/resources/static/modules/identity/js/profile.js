'use strict';
const DOM = {
  loading: () => document.getElementById('profile-loading'),
  form: () => document.getElementById('profile-form'),
  saveBtn: () => document.getElementById('save-btn'),
  cancelBtn: () => document.getElementById('cancel-btn'),
  charCount: () => document.getElementById('char-count'),
  toastContainer: () => document.getElementById('toast-container'),
  avatarInitials: () => document.getElementById('avatar-initials'),
  displayName: () => document.getElementById('display-name'),
  displayEmail: () => document.getElementById('display-email'),
  trustScore: () => document.getElementById('trust-score'),
  statListings: () => document.getElementById('stat-listings'),
  statTutorings: () => document.getElementById('stat-tutorings'),
  statReviews: () => document.getElementById('stat-reviews'),
  profName: () => document.getElementById('prof-name'),
  profEmail: () => document.getElementById('prof-email'),
  profPhone: () => document.getElementById('prof-phone'),
  profAddress: () => document.getElementById('prof-address'),
  profSocial: () => document.getElementById('prof-social'),
  profDesc: () => document.getElementById('prof-desc'),
};

function showToast(message, type = 'success') {
  const colors = {
    success: 'border-l-green-500',
    error:   'border-l-red-500',
    warning: 'border-l-yellow-500',
  };
  const container = DOM.toastContainer();
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `transition-all duration-300 transform translate-y-0 opacity-100 bg-uce-navy text-white px-5 py-4 rounded-xl shadow-xl text-sm border-l-4 ${colors[type] || colors.success}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.className = toast.className.replace('opacity-100 translate-y-0', 'opacity-0 translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setLoading(on) {
  DOM.loading().style.display = on ? 'flex' : 'none';
  DOM.form().style.display    = on ? 'none' : 'flex';
}

function setSaving(on) {
  const btn = DOM.saveBtn();
  if (!btn) return;
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold rounded-full animate-spin inline-block mr-2"></span>Guardando...'
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Guardar cambios`;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(w => w).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function populateForm(p) {
  DOM.profName().value    = p.fullName    || '';
  DOM.profEmail().value   = p.email       || '';
  DOM.profPhone().value   = p.phone       || '';
  DOM.profAddress().value = p.address     || '';
  DOM.profSocial().value  = p.socialMedia || '';
  DOM.profDesc().value    = p.description || '';
  DOM.charCount().textContent = (p.description || '').length;
}

function populateSidebar(p) {
  const name = p.fullName || 'Usuario UCE';
  DOM.avatarInitials().textContent = getInitials(name);
  DOM.displayName().textContent    = name;
  DOM.displayEmail().textContent   = p.email || '—';
  DOM.trustScore().textContent     = Math.round(p.trustScore || 100);
}

function readFormPayload() {
  return {
    phone:       DOM.profPhone().value,
    address:     DOM.profAddress().value,
    socialMedia: DOM.profSocial().value,
    description: DOM.profDesc().value
  };
}

async function loadUserStats(userId) {
  try {
    const res = await fetch(`${API_BASE}/api/listings`);
    
    if (res.ok) {
      const allListings = await res.json();
      
      // SOLUCIÓN: Filtramos en caliente para contar solo las que coincidan con tu ID
      const myListings = allListings.filter(item => item.ownerId === userId || item.userId === userId);
      
      DOM.statListings().textContent = myListings.length;
    } else {
      DOM.statListings().textContent = '0';
    }
  } catch (err) {
    console.error('[Stats] Error procesando listados:', err);
    DOM.statListings().textContent = '0';
  }
  
  DOM.statTutorings().textContent = '0';
  DOM.statReviews().textContent    = '0';
}

async function loadProfile(userId) {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/users/profile/${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const profile = await res.json();
    populateForm(profile);
    populateSidebar(profile);
    await loadUserStats(userId);
  } catch (err) {
    console.error('[Profile] Error en fetch:', err);
    showToast('No se pudo cargar el perfil desde el servidor.', 'error');
    DOM.avatarInitials().textContent = '??';
    DOM.displayName().textContent = 'Error de carga';
  } finally {
    setLoading(false);
  }
}

async function saveProfile(userId) {
  setSaving(true);
  const payload = readFormPayload();

  try {
    const res = await fetch(`${API_BASE}/api/users/profile/me`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Id': userId 
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    showToast('Perfil actualizado correctamente.', 'success');
    loadProfile(userId);
  } catch (err) {
    console.error('[Profile] Error actualizando:', err);
    Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
  } finally {
    setSaving(false);
  }
}

window.addEventListener('load', async () => {
  const userId = localStorage.getItem('campusMarketUserId');

  if (!userId) {
    Swal.fire({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para ver tu perfil.',
      icon: 'warning',
      confirmButtonColor: '#0A1628',
    }).then(() => { window.location.href = '/modules/identity/signin.html'; });
    return;
  }

  await Clerk.load();

  MarketplaceLayout.mountNavbar('profile', Clerk.user);

  loadProfile(userId);

  DOM.form().addEventListener('submit', e => { 
    e.preventDefault(); 
    saveProfile(userId); 
  });

  DOM.profDesc().addEventListener('input', function () {
    DOM.charCount().textContent = this.value.length;
  });

  DOM.cancelBtn().addEventListener('click', () => loadProfile(userId));
});