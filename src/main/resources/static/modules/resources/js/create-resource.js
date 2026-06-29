document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-resource-form');
    const fileInput = document.getElementById('resource-files');
    const fileListContainer = document.getElementById('file-list');
    const submitBtn = document.getElementById('btn-submit');
    const uploadZone = document.getElementById('upload-zone');

    // Manejar selección de archivos para mostrarlos en la UI
    fileInput.addEventListener('change', (e) => {
        fileListContainer.innerHTML = '';
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        files.forEach(file => {
            const p = document.createElement('p');
            p.className = "text-sm text-gray-700 bg-gray-100 p-2 rounded-lg";
            p.textContent = `📄 ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Verificar sesión con Clerk
        if (!window.Clerk || !window.Clerk.user) {
            alert("Debes iniciar sesión para compartir recursos.");
            window.Clerk.openSignIn();
            return;
        }

        const userId = getOwnerId(); // Obtener el UUID sincronizado desde localStorage
        
        // 2. Preparar los datos del formulario (FormData para multipart)
        const formData = new FormData();
        formData.append('title', document.getElementById('resource-title').value);
        formData.append('description', document.getElementById('resource-desc').value);
        formData.append('category', document.getElementById('resource-category').value);
        
        const files = fileInput.files;
        if (files.length === 0) {
            alert("Debes adjuntar al menos un archivo.");
            return;
        }

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
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
                const errorText = await response.text();
                throw new Error(errorText || 'Error al subir el recurso');
            }

            const data = await response.json();
            alert("¡Recurso compartido exitosamente!");
            window.location.href = `/modules/resources/resource-details.html?id=${data.id}`;

        } catch (error) {
            console.error('Error:', error);
            alert("Ocurrió un error: " + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Compartir Recurso';
        }
    });
});

window.addEventListener('load', async () => {
    if (window.Clerk) {
        await window.Clerk.load();
        MarketplaceLayout.mountNavbar('recursos', window.Clerk.user);
    }
});
