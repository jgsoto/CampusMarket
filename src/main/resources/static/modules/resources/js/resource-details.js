document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('id');

    if (!resourceId) {
        alert("Recurso no encontrado");
        window.location.href = '/modules/resources/dashboard.html';
        return;
    }

    const loader = document.getElementById('loader');
    const content = document.getElementById('content-container');
    
    // UI Elements
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    const resTitle = document.getElementById('res-title');
    const resCategory = document.getElementById('res-category');
    const resDesc = document.getElementById('res-desc');
    const resOwner = document.getElementById('res-owner');
    const filesList = document.getElementById('files-list');
    const ownerActions = document.getElementById('owner-actions');
    const btnEdit = document.getElementById('btn-edit');
    const btnDelete = document.getElementById('btn-delete');

    try {
        const response = await fetch(`/api/resources/${resourceId}`);
        if (!response.ok) throw new Error('Recurso no encontrado');
        
        const resource = await response.json();
        
        breadcrumbTitle.textContent = resource.title;
        resTitle.textContent = resource.title;
        resCategory.textContent = resource.category;
        resDesc.textContent = resource.description;
        resOwner.textContent = `Compartido por: ${resource.ownerName}`;

        // Archivos
        if (resource.files && resource.files.length > 0) {
            resource.files.forEach(file => {
                const fileEl = document.createElement('div');
                fileEl.className = "flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100";
                
                const mbSize = (file.size / (1024 * 1024)).toFixed(2);
                
                fileEl.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">📄</span>
                        <div>
                            <p class="text-sm font-medium text-gray-800">${file.filename}</p>
                            <p class="text-xs text-gray-500">${mbSize} MB</p>
                        </div>
                    </div>
                    <a href="${file.url}" target="_blank" download
                       class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-uce-navy hover:bg-gray-50 transition-colors shadow-sm">
                        Descargar
                    </a>
                `;
                filesList.appendChild(fileEl);
            });
        } else {
            filesList.innerHTML = `<p class="text-sm text-gray-500">No hay archivos adjuntos.</p>`;
        }

        // Mostrar acciones si el usuario actual es el dueño
        window.addEventListener('load', () => {
            // Esperar a que Clerk cargue
            setTimeout(() => {
                if (window.Clerk && window.Clerk.user && getOwnerId() === resource.ownerId) {
                    ownerActions.classList.remove('hidden');
                }
            }, 1000);
        });

        loader.classList.add('hidden');
        content.classList.remove('hidden');

        // Botón Editar
        btnEdit.addEventListener('click', () => {
            window.location.href = `/modules/resources/edit-resource.html?id=${resource.id}`;
        });

        // Botón Eliminar
        btnDelete.addEventListener('click', async () => {
            if (!confirm('¿Estás seguro de que deseas eliminar este recurso y todos sus archivos? Esta acción no se puede deshacer.')) return;
            
            btnDelete.disabled = true;
            btnDelete.textContent = 'Eliminando...';
            try {
                const response = await fetch(`/api/resources/${resourceId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-User-Id': getOwnerId()
                    }
                });

                if (!response.ok) throw new Error('Error al eliminar');
                
                alert('Recurso eliminado correctamente');
                window.location.href = '/modules/resources/dashboard.html';

            } catch (err) {
                alert(err.message);
                btnDelete.disabled = false;
                btnDelete.textContent = 'Eliminar';
            }
        });

    } catch (error) {
        console.error(error);
        loader.textContent = "Error al cargar el recurso.";
    }
});

window.addEventListener('load', async () => {
    if (window.Clerk) {
        await window.Clerk.load();
        MarketplaceLayout.mountNavbar('recursos', window.Clerk.user);
    }
});
