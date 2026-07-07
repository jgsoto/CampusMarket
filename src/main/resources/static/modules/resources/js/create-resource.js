document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-resource-form');
    const fileInput = document.getElementById('resource-files');
    const fileListContainer = document.getElementById('file-list');
    const submitBtn = document.getElementById('btn-submit');
    const uploadZone = document.getElementById('upload-zone');
    const categorySelect = document.getElementById('resource-category');

    // Cargar las categorías dinámicamente
    fetchCategories(categorySelect);

    let selectedFiles = [];

    // Manejar selección de archivos para mostrarlos en la UI
    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        selectedFiles = selectedFiles.concat(newFiles);
        fileInput.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo

        renderFileList();
    });

    function renderFileList() {
        fileListContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg text-sm text-gray-700";
            
            const fileInfo = document.createElement('span');
            fileInfo.textContent = `📄 ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = "button";
            removeBtn.className = "text-red-500 hover:text-red-700 font-bold px-2 text-lg leading-none";
            removeBtn.innerHTML = "&times;";
            removeBtn.onclick = () => {
                selectedFiles.splice(index, 1);
                renderFileList();
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
            renderFileList();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Verificar sesión con Clerk
        if (!window.Clerk || !window.Clerk.user) {
            showToast('Debes iniciar sesión para compartir recursos.', 'warning');
            setTimeout(() => {
                window.Clerk.openSignIn();
            }, 1000);
            return;
        }

        const userId = getOwnerId(); // Obtener el UUID sincronizado desde localStorage
        
        // 2. Preparar los datos del formulario (FormData para multipart)
        const formData = new FormData();
        formData.append('title', document.getElementById('resource-title').value);
        formData.append('description', document.getElementById('resource-desc').value);
        formData.append('category', document.getElementById('resource-category').value);
        
        if (selectedFiles.length === 0) {
            showToast('Debes adjuntar al menos un archivo.', 'warning');
            return;
        }

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Subiendo...';

        try {
            // 3. Enviar al Backend (ResourceController)
            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: {
                    'X-User-Id': userId // Cabecera de seguridad
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message === "No se proporcionaron archivos.") {
                    showToast('Ocurrió un error al subir los archivos al servidor.', 'error');
                } else {
                    showToast(`Error al crear: ${errorData.message}`, 'error');
                }
                throw new Error(errorData.message || 'Error al subir el recurso');
            }

            const data = await response.json();
            showToast('¡Recurso compartido exitosamente!', 'success');
            setTimeout(() => {
                window.location.href = `/modules/resources/resource-details.html?id=${data.id}`;
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            if (error.message !== 'Error al subir el recurso') {
                showToast("Ocurrió un error: " + error.message, 'error');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Compartir Recurso';
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
