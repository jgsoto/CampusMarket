document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('id');

    if (!resourceId) {
        alert("Recurso no encontrado");
        window.location.href = '/modules/resources/resources-catalog.html';
        return;
    }

    const loader = document.getElementById('loader');
    const form = document.getElementById('edit-resource-form');
    const fileInput = document.getElementById('resource-files');
    const fileListContainer = document.getElementById('file-list');
    const submitBtn = document.getElementById('btn-submit');
    const btnCancel = document.getElementById('btn-cancel');
    const uploadZone = document.getElementById('upload-zone');

    btnCancel.href = `/modules/resources/resource-details.html?id=${resourceId}`;

    let currentResource = null;

    // 1. Cargar datos del recurso
    try {
        const response = await fetch(`/api/resources/${resourceId}`);
        if (!response.ok) throw new Error('Recurso no encontrado');

        currentResource = await response.json();

        const catSelect = document.getElementById('resource-category');
        await fetchCategories(catSelect);

        document.getElementById('resource-title').value = currentResource.title;
        document.getElementById('resource-desc').value = currentResource.description;
        document.getElementById('resource-category').value = currentResource.category;

        loader.classList.add('hidden');
        form.classList.remove('hidden');

    } catch (error) {
        alert(error.message);
        window.location.href = '/modules/resources/resources-catalog.html';
    }

    // 2. Manejar selección de archivos para mostrarlos en la UI
    fileInput.addEventListener('change', (e) => {
        fileListContainer.innerHTML = '';
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        files.forEach(file => {
            const p = document.createElement('p');
            p.className = "text-sm text-gray-700 bg-gray-100 p-2 rounded-lg";
            p.textContent = `📄 ${file.name} (Se reemplazará el anterior)`;
            fileListContainer.appendChild(p);
        });
    });

    // Drag & Drop logic
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('border-uce-navy', 'bg-slate-100');
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('border-uce-navy', 'bg-slate-100');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('border-uce-navy', 'bg-slate-100');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    // 3. Enviar actualización
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!window.Clerk || !window.Clerk.user) {
            alert("Debes iniciar sesión.");
            return;
        }

        if (getOwnerId() !== currentResource.ownerId) {
            alert("No tienes permiso para editar este recurso.");
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('resource-title').value);
        formData.append('description', document.getElementById('resource-desc').value);
        formData.append('category', document.getElementById('resource-category').value);

        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            formData.append('newFiles', files[i]); // El backend espera 'newFiles'
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        try {
            const response = await fetch(`/api/resources/${resourceId}`, {
                method: 'PUT',
                headers: {
                    'X-User-Id': getOwnerId()
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al actualizar');
            }

            alert("¡Cambios guardados!");
            window.location.href = '/modules/marketplace/my-listings.html';


        } catch (error) {
            console.error('Error:', error);
            alert("Ocurrió un error: " + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Cambios';
        }
    });
});

window.addEventListener('load', async () => {
    if (window.Clerk) {
        await window.Clerk.load();
        MarketplaceLayout.mountNavbar('recursos', window.Clerk.user);
    }
});

async function fetchCategories(selectElement) {
    try {
        const response = await fetch('/api/resources/categories');
        if (response.ok) {
            const categories = await response.json();
            selectElement.innerHTML = '<option value="" disabled selected>Selecciona...</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                selectElement.appendChild(option);
            });
        } else {
            console.error('Error fetching resource categories');
            selectElement.innerHTML = '<option value="" disabled selected>Error al cargar categorías</option>';
        }
    } catch (error) {
        console.error('Network error fetching resource categories:', error);
        selectElement.innerHTML = '<option value="" disabled selected>Error de red</option>';
    }
}
