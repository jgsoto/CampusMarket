document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.getElementById('resources-grid');
    const loader = document.getElementById('loader');
    const emptyState = document.getElementById('empty-state');
    
    const inputKeyword = document.getElementById('search-keyword');
    const selectCategory = document.getElementById('search-category');

    // Cargar categorías
    fetchCategories();

    async function fetchCategories() {
        try {
            const response = await fetch('/api/resources/categories');
            if (response.ok) {
                const categories = await response.json();
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    selectCategory.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching resource categories:', error);
        }
    }

    let currentRequestId = 0;

    async function loadResources() {
        const requestId = ++currentRequestId;
        
        // Solo mostramos loader si el grid está vacío, para que no parpadee al tipear
        if (grid.children.length === 0) {
            loader.classList.remove('hidden');
        }
        emptyState.classList.add('hidden');

        try {
            const keyword = inputKeyword.value;
            const category = selectCategory.value;
            
            let url = '/api/resources/search?';
            if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
            if (category) url += `category=${encodeURIComponent(category)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar recursos');

            const resources = await response.json();
            
            // Si hay una petición más reciente, ignoramos esta respuesta
            if (currentRequestId !== requestId) return;

            grid.innerHTML = ''; // Limpiamos justo antes de agregar
            loader.classList.add('hidden');

            if (resources.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }

            resources.forEach(resource => {
                const card = document.createElement('a');
                card.href = `/modules/resources/resource-details.html?id=${resource.id}`;
                card.className = "bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col h-full";
                
                const fileCount = resource.files ? resource.files.length : 0;
                const categoryColor = getCategoryColor(resource.category);

                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-3">
                        <span class="px-2.5 py-1 rounded-md text-xs font-medium ${categoryColor}">
                            ${resource.category}
                        </span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">${resource.title}</h3>
                    <p class="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">${resource.description}</p>
                    <div class="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                        <span>Por: ${resource.ownerName}</span>
                        <span class="flex items-center gap-1">📎 ${fileCount} archivo(s)</span>
                    </div>
                `;
                grid.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            loader.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.innerHTML = `<p class="text-red-500">Ocurrió un error al cargar los recursos.</p>`;
        }
    }

    function getCategoryColor(category) {
        switch(category) {
            case 'Apuntes': return 'bg-blue-50 text-blue-600';
            case 'Examenes': return 'bg-red-50 text-red-600';
            case 'Libros': return 'bg-green-50 text-green-600';
            case 'Proyectos': return 'bg-purple-50 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    let searchTimeout;
    
    inputKeyword.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadResources, 300);
    });

    selectCategory.addEventListener('change', loadResources);
    
    // Cargar inicialmente
    loadResources();
});

window.addEventListener('load', async () => {
    if (window.Clerk) {
        await window.Clerk.load();
        await MarketplaceLayout.mountNavbar('recursos', window.Clerk.user);
    }
});
