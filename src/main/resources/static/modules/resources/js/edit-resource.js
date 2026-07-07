document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('id');

    if (!resourceId) {
        showToast('Recurso no encontrado', 'error');
        setTimeout(() => {
            window.location.href = '/modules/resources/resources-catalog.html';
        }, 1500);
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
    let existingFiles = [];
    let filesToDelete = [];
    let selectedFiles = [];
    
    const existingFileListContainer = document.getElementById('existing-file-list');

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

        if (currentResource.files) {
            existingFiles = [...currentResource.files];
            renderExistingFileList();
        }

        loader.classList.add('hidden');
        form.classList.remove('hidden');

    } catch (error) {
        showToast(error.message, 'error');
        setTimeout(() => {
            window.location.href = '/modules/resources/resources-catalog.html';
        }, 1500);
    }

    function renderExistingFileList() {
        existingFileListContainer.innerHTML = '';
        if (existingFiles.length === 0) {
            existingFileListContainer.innerHTML = '<p class="text-sm text-gray-400 italic">No hay archivos actuales.</p>';
            return;
        }

        existingFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg text-sm text-gray-700";
            
            const fileInfo = document.createElement('span');
            fileInfo.textContent = `📄 ${file.filename} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = "button";
            removeBtn.className = "text-red-500 hover:text-red-700 font-bold px-2 text-lg leading-none";
            removeBtn.title = "Eliminar archivo";
            removeBtn.innerHTML = "&times;";
            removeBtn.onclick = () => {
                filesToDelete.push(file.id);
                existingFiles.splice(index, 1);
                renderExistingFileList();
            };
            
            div.appendChild(fileInfo);
            div.appendChild(removeBtn);
            existingFileListContainer.appendChild(div);
        });
    }

    // 2. Manejar selección de archivos para mostrarlos en la UI
    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        selectedFiles = selectedFiles.concat(newFiles);
        fileInput.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo
        
        renderNewFileList();
    });

    function renderNewFileList() {
        fileListContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-blue-50 p-2 rounded-lg text-sm text-blue-800";
            
            const fileInfo = document.createElement('span');
            fileInfo.textContent = `📄 ${file.name} (Nuevo) - ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = "button";
            removeBtn.className = "text-red-500 hover:text-red-700 font-bold px-2 text-lg leading-none";
            removeBtn.innerHTML = "&times;";
            removeBtn.onclick = () => {
                selectedFiles.splice(index, 1);
                renderNewFileList();
            };
            
            div.appendChild(fileInfo);
            div.appendChild(removeBtn);
            fileListContainer.appendChild(div);
        });
    }

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
            const newFiles = Array.from(e.dataTransfer.files);
            selectedFiles = selectedFiles.concat(newFiles);
            renderNewFileList();
        }
    });

    // 3. Enviar actualización
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!window.Clerk || !window.Clerk.user) {
            showToast('Debes iniciar sesión.', 'warning');
            return;
        }

        if (getOwnerId() !== currentResource.ownerId) {
            showToast('No tienes permiso para editar este recurso.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('title', document.getElementById('resource-title').value);
        formData.append('description', document.getElementById('resource-desc').value);
        formData.append('category', document.getElementById('resource-category').value);

        if (existingFiles.length === 0 && selectedFiles.length === 0) {
            showToast('El recurso debe tener al menos un archivo.', 'warning');
            return;
        }

        filesToDelete.forEach(id => {
            formData.append('filesToDelete', id);
        });

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('newFiles', selectedFiles[i]);
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

            showToast('¡Cambios guardados!', 'success');
            setTimeout(() => {
                window.location.href = '/modules/marketplace/my-listings.html';
            }, 1500);


        } catch (error) {
            console.error('Error:', error);
            if (error.message !== 'Error al actualizar') {
                showToast("Ocurrió un error: " + error.message, 'error');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Cambios';
        }
    });
});

window.addEventListener('load', async () => {
    if (window.Clerk) {
        await window.Clerk.load();
        await MarketplaceLayout.mountNavbar('recursos', window.Clerk.user);
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
