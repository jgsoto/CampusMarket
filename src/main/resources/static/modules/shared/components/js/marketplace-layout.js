'use strict';

const API_BASE = '';

let _navbarCache = null;
let _navbarInitialized = false;

async function getUserProfile() {
    const cached = sessionStorage.getItem('campusMarketProfile');

    if (cached) {
        return JSON.parse(cached);
    }

    const userId = getOwnerId();
    if (!userId) return null;

    const response = await fetch(`${API_BASE}/api/users/profile/${userId}`);

    if (!response.ok) return null;

    const profile = await response.json();

    sessionStorage.setItem(
        'campusMarketProfile',
        JSON.stringify(profile)
    );

    return profile;
}

function getOwnerId() {
    return localStorage.getItem('campusMarketUserId');
}

const MarketplaceLayout = (() => {

    async function mountNavbar(activePage = '', clerkUser = null) {
        const placeholder = document.getElementById('navbar-placeholder');
        if (!placeholder) return;

        if (_navbarInitialized) {
            updateActivePage(activePage);
            return;
        }

        const userName = clerkUser?.fullName ?? 'Usuario';
        const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
        const userId = getOwnerId();

        let profileImage = null;

        try {
            if (userId) {
                const response = await fetch(`${API_BASE}/api/users/profile/${userId}`);
                if (response.ok) {
                    const profile = await response.json();
                    profileImage = profile.photoUrl;
                }
            }
        } catch (e) {
            console.error("No se pudo cargar la foto", e);
        }

        const initials = userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(w => w[0].toUpperCase())
            .join('');

        const links = [
            { id: 'dashboard', href: '/modules/marketplace/dashboard.html', label: 'Marketplace' },
            { id: 'tutorias', href: '/modules/tutoring/tutoring-catalog.html', label: 'Tutorías' },
            { id: 'recursos', href: '/modules/resources/resources-catalog.html', label: 'Recursos' },
            { id: 'reputation', href: '/modules/reputation/reputation.html', label: 'Reputación' },
        ];

        const navLinks = renderLinks(links, activePage);
        const mobileLinks = renderMobileLinks(links, activePage);

        const html = `
        <header class="bg-uce-navy sticky top-0 z-50 border-b border-uce-gold/15 w-full">
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

                <a href="/modules/marketplace/dashboard.html" class="flex items-center gap-3">
                    <img src="/assets/icons/logo.png" class="w-9 h-9 rounded-lg"/>
                    <span class="font-bold text-white">Campus<span class="text-uce-gold">Market</span></span>
                </a>

                <nav class="hidden md:flex gap-6">${navLinks}</nav>

                ${renderUser(profileImage, initials, userName, userEmail, activePage)}

                <button id="nav-toggle" class="md:hidden">☰</button>

            </div>

            <nav id="mobile-menu" class="hidden flex-col px-6 pb-5">
                ${mobileLinks}
            </nav>
        </header>
    `;

        placeholder.outerHTML = html;

        _navbarInitialized = true;

        _initToggle();
        _initDropdown();
        _initLogout();
    }

    function updateActivePage(activePage) {
        document.querySelectorAll("nav a").forEach(a => {
            a.classList.remove("text-uce-gold", "font-semibold");
            a.classList.add("text-white/70");

            if (a.dataset.id === activePage) {
                a.classList.add("text-uce-gold", "font-semibold");
            }
        });
    }

    function renderLinks(links, activePage) {
        return links.map(l => `
        <a href="${l.href}"
           data-id="${l.id}"
           class="${l.id === activePage
            ? 'text-uce-gold font-semibold'
            : 'text-white/70 hover:text-uce-gold'}">
            ${l.label}
        </a>
    `).join('');
    }

    function renderMobileLinks(links, activePage) {
        return links.map(l => `
        <a href="${l.href}"
           class="py-2 text-sm ${l.id === activePage ? 'text-uce-gold' : 'text-white/70'}">
            ${l.label}
        </a>
    `).join('');
    }

    function renderUser(photo, initials, name, email, activePage) {
        return `
        <div class="flex items-center gap-3">

            <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                ${photo
            ? `<img src="${photo}" class="w-full h-full object-cover">`
            : `<span class="text-xs font-bold">${initials}</span>`
        }

            </div>

            <span class="text-white/80 text-sm">${name.split(' ')[0]}</span>

        </div>
    `;
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