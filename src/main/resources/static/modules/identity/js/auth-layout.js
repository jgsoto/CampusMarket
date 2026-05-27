
'use strict';

const AuthLayout = (() => {

  // ── SVG íconos reutilizables ──────────────────────────────
  const ICONS = {
    shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>`,
    star:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
             </svg>`,
    users:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
             </svg>`,
    book:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
               <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
             </svg>`,
    store:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
               <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
             </svg>`,
  };

  // ── Renderiza un ítem de feature ──────────────────────────
  function renderFeature({ icon, text }) {
    return `
      <li class="flex items-center gap-3 text-white/70 text-xs lg:text-sm">
        <span class="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-uce-gold/10 border border-uce-gold/20
                     flex items-center justify-center text-uce-gold flex-shrink-0">
          ${ICONS[icon] ?? ICONS.shield}
        </span>
        ${text}
      </li>`;
  }

  // ── HTML completo del panel izquierdo ─────────────────────
  function buildPanel({ title, subtitle, features }) {
    const featureItems = features.map(renderFeature).join('');

    return `
      <aside class="flex flex-col justify-center px-6 py-8 lg:px-16 lg:py-12
                    w-full lg:w-1/2 relative z-10
                    border-b lg:border-b-0 lg:border-r border-white/10">
        <div class="max-w-md mx-auto lg:mx-0 flex flex-col gap-6 lg:gap-10 w-full">

          <!-- Logo -->
          <a href="/index.html" class="flex items-center gap-3">
            <img src="/assets/icons/logo.png"
                 alt="CampusMarket Logo"
                 class="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover" />
            <span class="font-display text-lg lg:text-xl font-bold text-white">
              Campus<span class="text-uce-gold">Market</span>
            </span>
          </a>

          <!-- Título y subtítulo -->
          <div class="flex flex-col gap-2 lg:gap-4">
            <h1 class="font-display text-2xl lg:text-4xl font-bold text-white leading-tight">
              ${title}
            </h1>
            <p class="text-white/60 text-sm lg:text-lg leading-relaxed">
              ${subtitle}
            </p>
          </div>

          <!-- Lista de features -->
          <ul class="hidden sm:flex flex-col gap-3 lg:gap-4">
            ${featureItems}
          </ul>

          <!-- Badge institucional -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                      bg-uce-gold/8 border border-uce-gold/20
                      text-[11px] lg:text-xs text-white/50 w-fit">
            ${ICONS.shield}
            Exclusivo para correos
            <strong class="text-uce-gold-light ml-1">@uce.edu.ec</strong>
          </div>

        </div>
      </aside>`;
  }

  // ── Fondo decorativo (idéntico en signin y signup) ────────
  function buildBackground() {
    return `
      <div class="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full
                    bg-uce-gold opacity-10 blur-[100px]"></div>
        <div class="absolute -bottom-16 left-[5%] w-[350px] h-[350px] rounded-full
                    opacity-10 blur-[80px]"
             style="background:radial-gradient(circle,#2A4A7F,transparent)"></div>
        <div class="absolute inset-0 bg-grid-gold"></div>
      </div>`;
  }

  // ── API pública ───────────────────────────────────────────
  function mount(config) {
    const container = document.getElementById('auth-branding');
    if (!container) {
      console.error('[AuthLayout] No se encontró #auth-branding en el DOM');
      return;
    }

    // Inserta el fondo antes del contenedor
    container.insertAdjacentHTML('beforebegin', buildBackground());

    // Reemplaza el placeholder con el panel completo
   container.className = "w-full lg:w-1/2 bg-uce-navy flex flex-col justify-center relative z-10";
    container.innerHTML = buildPanel(config);
  }

  return { mount, ICONS };

})();