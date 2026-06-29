'use strict';

const API_BASE = '';

function getOwnerId() {
    return localStorage.getItem('campusMarketUserId');
}

const MarketplaceLayout = (() => {

    function mountNavbar(activePage = '', clerkUser = null) {
        const placeholder = document.getElementById('navbar-placeholder');
        if (!placeholder) return;

        const links = [
            { id: 'dashboard', href: '/modules/marketplace/dashboard.html', label: 'Marketplace' },
            { id: 'tutorias', href: '/modules/tutoring/tutoring-catalog.html', label: 'Tutorías' },
            { id: 'recursos', href: '/modules/resources/dashboard.html', label: 'Recursos' },
            { id: 'reputation', href: '/modules/reputation/reputation.html', label: 'Reputación' },
        ];

        const navLinks = links.map(({ id, href, label }) => {
            const isActive = id === activePage;
            return `
        <a href="${href}"
           class="text-sm transition-colors ${isActive
                    ? 'text-uce-gold font-semibold'
                    : 'text-white/70 hover:text-uce-gold'}"
           ${isActive ? 'aria-current="page"' : ''}>
          ${label}
        </a>`;
        }).join('');

        const mobileLinks = links.map(({ id, href, label }) => {
            const isActive = id === activePage;
            return `
        <a href="${href}"
           class="py-2.5 text-sm transition-colors ${isActive
                    ? 'text-uce-gold font-bold bg-white/5 px-3 rounded-lg'
                    : 'text-white/70 hover:text-uce-gold'}">${label}</a>`;
        }).join('');

        const userName = clerkUser?.fullName ?? 'Usuario';
        const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
        const initials = userName.split(' ').filter(Boolean).slice(0, 2)
            .map(w => w[0].toUpperCase()).join('');

        const desktopActionsHtml = `
      <div class="hidden md:flex items-center gap-3">
        <div class="relative" id="profile-dropdown-wrapper">
          <button id="profile-dropdown-btn"
                  class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                         hover:bg-white/10 transition-colors group"
                  aria-haspopup="true" aria-expanded="false">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-uce-navy to-uce-navy-light border-2 border-uce-gold
                        flex items-center justify-center flex-shrink-0">
              <span class="text-uce-gold text-xs font-bold font-display">${initials}</span>
            </div>
            <span class="text-white/80 text-sm font-medium max-w-[120px] truncate
                         group-hover:text-white transition-colors">
              ${userName.split(' ')[0]}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" class="text-white/50 transition-transform duration-200"
                 id="dropdown-chevron" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div id="profile-dropdown-menu"
               class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl
                      border border-gray-100 overflow-hidden z-50 hidden"
               role="menu">
            <div class="px-4 py-4 bg-gray-50 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-uce-navy to-uce-navy-light
                            flex items-center justify-center flex-shrink-0 border-2 border-uce-gold">
                  <span class="text-uce-gold text-sm font-bold">${initials}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-uce-navy truncate">${userName}</p>
                  <p class="text-xs text-gray-400 truncate">${userEmail}</p>
                </div>
              </div>
            </div>

            <div class="py-2">
              <a href="/modules/identity/profile.html"
                 class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                        hover:bg-gray-50 transition-colors ${activePage === 'profile' ? 'text-uce-navy font-semibold' : ''}"
                 role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" class="text-gray-400" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Mi Perfil
              </a>
              <a href="/modules/marketplace/my-listings.html"
                 class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                        hover:bg-gray-50 transition-colors ${activePage === 'my-listings' ? 'text-uce-navy font-semibold' : ''}"
                 role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" class="text-gray-400" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Mis Publicaciones
              </a>
            </div>

            <div class="border-t border-gray-100 py-2">
              <button id="logout-btn"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                             hover:bg-red-50 transition-colors"
                      role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>`;

        const mobileButtonHtml = `
      <a href="/modules/marketplace/my-listings.html" class="py-2 text-sm text-white/70 hover:text-uce-gold transition-colors">Mis Publicaciones</a>
      <a href="/modules/identity/profile.html" class="py-2 text-sm text-white/70 hover:text-uce-gold transition-colors">Mi Perfil</a>
      <button id="logout-btn-mobile" class="mt-1 w-full flex items-center justify-center gap-2 py-2.5 border border-white/20 text-white/70 text-sm rounded-lg hover:bg-white/10 transition-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar Sesión
      </button>`;

        placeholder.outerHTML = `
      <header class="bg-uce-navy sticky top-0 z-50 border-b border-uce-gold/15 w-full">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a href="/modules/marketplace/dashboard.html" class="flex items-center gap-3 flex-shrink-0">
            <img src="/assets/icons/logo.png" alt="CampusMarket" class="w-9 h-9 rounded-lg object-cover" />
            <span class="font-display text-lg font-bold text-white tracking-tight">Campus<span class="text-uce-gold">Market</span></span>
          </a>
          <nav class="hidden md:flex items-center gap-6">${navLinks}</nav>
          ${desktopActionsHtml}
          <button id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" class="md:hidden flex flex-col justify-center items-center gap-1 w-10 h-10 rounded-lg hover:bg-white/10 transition-colors">
            <span class="block w-5 h-0.5 bg-white transition-all duration-300"></span>
            <span class="block w-5 h-0.5 bg-white transition-all duration-300"></span>
            <span class="block w-5 h-0.5 bg-white transition-all duration-300"></span>
          </button>
        </div>
        <nav id="mobile-menu" class="hidden flex-col gap-1 px-6 pb-5 bg-uce-navy border-t border-uce-gold/10">
          ${mobileLinks}${mobileButtonHtml}
        </nav>
      </header>`;

        _initToggle();
        _initDropdown();
        _initLogout();
    }

    function _initToggle() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('mobile-menu');
        if (!toggle || !menu) return;
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isHidden = menu.classList.toggle('hidden');
            menu.classList.toggle('flex', !isHidden);
            toggle.setAttribute('aria-expanded', String(!isHidden));
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function _initDropdown() {
        const btn = document.getElementById('profile-dropdown-btn');
        const menu = document.getElementById('profile-dropdown-menu');
        const chevron = document.getElementById('dropdown-chevron');
        if (!btn || !menu) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !menu.classList.contains('hidden');
            menu.classList.toggle('hidden', isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
            if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
        });
        document.addEventListener('click', (e) => {
            if (!document.getElementById('profile-dropdown-wrapper')?.contains(e.target)) {
                menu.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
                if (chevron) chevron.style.transform = '';
            }
        });
    }

    function _initLogout() {
        const signOut = async () => {
            if (typeof Clerk !== 'undefined') await Clerk.signOut();
            window.location.href = '/index.html';
        };
        document.getElementById('logout-btn')?.addEventListener('click', signOut);
        document.getElementById('logout-btn-mobile')?.addEventListener('click', signOut);
    }

    return { mountNavbar };
})();

function showToast(message, type = 'success') {
    const COLORS = { success: 'border-l-green-500', error: 'border-l-red-500', warning: 'border-l-yellow-400', info: 'border-l-blue-400' };
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `animate-toast bg-uce-navy text-white px-5 py-4 rounded-xl shadow-xl text-sm border-l-4 ${COLORS[type] ?? COLORS.success}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

async function showConfirm(message, confirmText = 'Confirmar') {
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            text: message, icon: 'question', showCancelButton: true,
            confirmButtonText: confirmText, cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0A1628', cancelButtonColor: '#6b7280',
        });
        return result.isConfirmed;
    }
    return window.confirm(message);
}