'use strict';

let _selectedFiles = [];
let _retainedImages = [];

const FIELDS = {
    id: () => document.getElementById('edit-id'),
    title: () => document.getElementById('edit-title'),
    desc: () => document.getElementById('edit-desc'),
    price: () => document.getElementById('edit-price'),
    category: () => document.getElementById('edit-category'),
};

const AI = {
    improveDescription: async () => {
        const response = await fetch(`${API_BASE}/api/listings/ai/improve-description`, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                text: FIELDS.desc().value
            })
        });
        if (!response.ok) throw new Error();
        return response.json();
    },

    generateTitle: async () => {
        const response = await fetch(`${API_BASE}/api/listings/ai/generate-title`, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                text: FIELDS.desc().value
            })
        });
        if (!response.ok) throw new Error();
        return response.json();
    },

    correctText: async () => {
        const response = await fetch(`${API_BASE}/api/listings/ai/correct-text`, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                text: FIELDS.desc().value
            })
        });
        if (!response.ok) throw new Error();
        return response.json();
    }
};

const ERRORS = {
    title: 'El título es obligatorio.',
    desc: 'La descripción es obligatoria.',
    price: 'Ingresa un precio válido mayor a $0.00.',
    category: 'Selecciona una categoría.',
};

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const existing = document.getElementById(`error-${fieldId}`);
    if (existing) existing.remove();
    input.classList.add('border-red-400');
    input.classList.remove('border-gray-200', 'border-uce-navy');
    const error = document.createElement('span');
    error.id = `error-${fieldId}`;
    error.className = 'text-xs text-red-400 mt-1';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const existing = document.getElementById(`error-${fieldId}`);
    if (existing) existing.remove();
    input.classList.remove('border-red-400');
    input.classList.add('border-gray-200');
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();

    if (fieldId === 'edit-price') {
        const num = parseFloat(value);
        if (!value || isNaN(num) || num < 0.01) {
            showFieldError(fieldId, ERRORS.price);
            return false;
        }
        clearFieldError(fieldId);
        return true;
    }

    if (!value) {
        const key = fieldId.replace('edit-', '');
        showFieldError(fieldId, ERRORS[key]);
        return false;
    }
    clearFieldError(fieldId);
    return true;
}

function validateAll() {
    const results = [validateField('edit-title'), validateField('edit-desc'), validateField('edit-price'), validateField('edit-category')];
    return results.every(Boolean);
}

function initRealTimeValidation() {
    ['edit-title', 'edit-desc', 'edit-price', 'edit-category'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('blur', () => validateField(id));
        el.addEventListener('input', () => {
            if (document.getElementById(`error-${id}`)) validateField(id);
        });
    });
}

function setMainImage(src, alt) {
    document.getElementById('main-preview-img').src = src;
    document.getElementById('main-preview-img').alt = alt;
}

function updateImageCount() {
    const total = _retainedImages.length + _selectedFiles.length;
    document.getElementById('image-count').textContent = `${total} / 5`;
}

function renderGallery() {
    const mainContainer = document.getElementById('main-preview-container');
    const thumbnailsRow = document.getElementById('thumbnails-row');
    const clearBtn = document.getElementById('btn-clear-images');
    const uploadZone = document.getElementById('upload-zone');

    thumbnailsRow.innerHTML = '';
    const totalCount = _retainedImages.length + _selectedFiles.length;

    if (totalCount === 0) {
        mainContainer.classList.add('hidden');
        thumbnailsRow.classList.add('hidden');
        clearBtn.classList.add('hidden');
        uploadZone.classList.remove('hidden');
        updateImageCount();
        return;
    }

    mainContainer.classList.remove('hidden');
    thumbnailsRow.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    uploadZone.classList.toggle('hidden', totalCount >= 5);

    let currentIndex = 0;

    _retainedImages.forEach((img, index) => {
        const src = img.url;
        if (currentIndex === 0) setMainImage(src, 'Imagen actual');
        
        const thumb = createThumbnailElement(src, currentIndex, 'retained', index);
        thumbnailsRow.appendChild(thumb);
        currentIndex++;
    });

    _selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        const absoluteIndex = currentIndex;
        reader.onload = ({target}) => {
            const src = target.result;
            if (absoluteIndex === 0) setMainImage(src, file.name);

            const thumb = createThumbnailElement(src, absoluteIndex, 'file', index);
            thumbnailsRow.appendChild(thumb);
        };
        reader.readAsDataURL(file);
        currentIndex++;
    });

    updateImageCount();
}

function createThumbnailElement(src, absoluteIndex, type, arrayIndex) {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = `relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-all group ${absoluteIndex === 0 ? 'border-uce-navy' : 'border-transparent hover:border-uce-navy/50'}`;
    thumb.innerHTML = `
        <img src="${src}" class="w-full h-full object-contain bg-white" />
        <button type="button"
                class="remove-img absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                data-type="${type}" data-index="${arrayIndex}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>`;

    thumb.addEventListener('click', (e) => {
        if (e.target.closest('.remove-img')) return;
        setMainImage(src, 'Imagen');
        document.getElementById('thumbnails-row').querySelectorAll('button.group').forEach(b => b.classList.replace('border-uce-navy', 'border-transparent'));
        thumb.classList.replace('border-transparent', 'border-uce-navy');
    });
    return thumb;
}

function initImageGallery() {
    const input = document.getElementById('edit-images');
    input.addEventListener('change', () => {
        const remaining = 5 - (_retainedImages.length + _selectedFiles.length);
        _selectedFiles = [..._selectedFiles, ...Array.from(input.files).slice(0, remaining)];
        input.value = '';
        renderGallery();
    });

    document.getElementById('thumbnails-row').addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-img');
        if (!removeBtn) return;
        
        const type = removeBtn.dataset.type;
        const index = parseInt(removeBtn.dataset.index, 10);
        
        if (type === 'retained') {
            _retainedImages.splice(index, 1);
        } else {
            _selectedFiles.splice(index, 1);
        }
        renderGallery();
    });

    document.getElementById('btn-clear-images').addEventListener('click', () => {
        _selectedFiles = [];
        _retainedImages = [];
        input.value = '';
        renderGallery();
    });
}

function initDescCounter() {
    const textarea = document.getElementById('edit-desc');
    const counter = document.getElementById('desc-count');
    if(textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }
}

async function improveDescription() {
    if (!FIELDS.desc().value.trim()) {
        showToast("Primero escribe una descripción.", "warning");
        return;
    }
    try {
        const button = document.getElementById("btn-ai-improve");
        button.disabled = true;
        button.innerHTML = "Mejorando...";
        const response = await AI.improveDescription();
        FIELDS.desc().value = response.result;
        document.getElementById("desc-count").textContent = response.result.length;
        showToast("Descripción mejorada.", "success");
    } catch {
        showToast("No se pudo mejorar la descripción.", "error");
    } finally {
        const button = document.getElementById("btn-ai-improve");
        button.disabled = false;
        button.innerHTML = "Mejorar descripción";
    }
}

async function generateTitle() {
    if (!FIELDS.desc().value.trim()) {
        showToast("Primero escribe una descripción.", "warning");
        return;
    }
    try {
        const button = document.getElementById("btn-ai-title");
        button.disabled = true;
        button.innerHTML = "Generando...";
        const response = await AI.generateTitle();
        FIELDS.title().value = response.result;
        showToast("Título generado.", "success");
    } catch {
        showToast("No se pudo generar el título.", "error");
    } finally {
        const button = document.getElementById("btn-ai-title");
        button.disabled = false;
        button.innerHTML = "Generar título";
    }
}

async function correctText() {
    if (!FIELDS.desc().value.trim()) {
        showToast("Primero escribe una descripción.", "warning");
        return;
    }
    try {
        const button = document.getElementById("btn-ai-correct");
        button.disabled = true;
        button.innerHTML = "Corrigiendo...";
        const response = await AI.correctText();
        FIELDS.desc().value = response.result;
        document.getElementById("desc-count").textContent = response.result.length;
        showToast("Texto corregido.", "success");
    } catch {
        showToast("No se pudo corregir el texto.", "error");
    } finally {
        const button = document.getElementById("btn-ai-correct");
        button.disabled = false;
        button.innerHTML = "Corregir ortografía";
    }
}

async function submitForm(e) {
    e.preventDefault();
    if (!validateAll()) {
        document.querySelector('[id^="error-edit"]')
            ?.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    const userId = localStorage.getItem('campusMarketUserId');
    if (!userId) {
        showToast('Sesión no encontrada. Inicia sesión nuevamente.', 'error');
        return;
    }

    const id = FIELDS.id().value;
    const btn = document.getElementById('btn-publish');
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold
                               rounded-full animate-spin inline-block mr-2"></span>
                   Guardando...`;

    try {
        const formData = new FormData();
        formData.append('title', FIELDS.title().value.trim());
        formData.append('description', FIELDS.desc().value.trim());
        formData.append('price', parseFloat(FIELDS.price().value));
        // Note: Backend might not support categoryId update, but sending it just in case
        
        for (const file of _selectedFiles) {
            formData.append('images', file);
        }
        for (const retained of _retainedImages) {
            formData.append('retainedImageUrls', retained.url);
        }

        const res = await fetch(`${API_BASE}/api/listings/${id}`, {
            method: 'PUT', 
            headers: { 'X-User-Id': userId },
            body: formData,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        showToast('Producto actualizado exitosamente.', 'success');

        setTimeout(() => {
            window.location.href = '/modules/marketplace/my-listings.html';
        }, 1200);

    } catch (err) {
        console.error('[EditListing]', err);
        showToast('No se pudo actualizar la publicación.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

async function loadListingData(listingId) {
    try {
        const res = await fetch(`${API_BASE}/api/listings/${listingId}`);
        if (!res.ok) throw new Error('No se encontró el producto');
        const data = await res.json();
        
        const userId = localStorage.getItem('campusMarketUserId');
        if (String(data.ownerId) !== String(userId)) {
            showToast('No tienes permiso para editar este producto', 'error');
            setTimeout(() => window.location.href = '/modules/marketplace/my-listings.html', 1500);
            return;
        }

        FIELDS.id().value = data.id;
        FIELDS.title().value = data.title;
        FIELDS.desc().value = data.description || '';
        FIELDS.price().value = data.price;
        
        const select = FIELDS.category();
        Array.from(select.options).forEach(opt => {
            if (opt.text === data.categoryName) {
                select.value = opt.value;
            }
        });
        
        if (data.images && data.images.length > 0) {
            _retainedImages = data.images.map(img => ({ url: img.url }));
            renderGallery();
        }
        
        if (document.getElementById("desc-count")) {
            document.getElementById("desc-count").textContent = (data.description || '').length;
        }

        document.getElementById('loader').classList.add('hidden');
        document.getElementById('edit-listing-form').classList.remove('hidden');

    } catch (err) {
        console.error('[EditListing] Error loading:', err);
        document.getElementById('loader').textContent = 'Error al cargar los datos. Intenta recargar la página.';
        document.getElementById('loader').classList.replace('text-gray-400', 'text-red-500');
    }
}

window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/modules/identity/signin.html';
        return;
    }

    // Sincronizar usuario
    try {
        const syncRes = await fetch(`${API_BASE}/api/v1/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clerkUserId: Clerk.user.id,
                fullName: Clerk.user.fullName,
                email: Clerk.user.primaryEmailAddress?.emailAddress ?? '',
            }),
        });
        const syncData = await syncRes.json();
        localStorage.setItem('campusMarketUserId', String(syncData.id));
    } catch (err) {
        console.warn('[EditListing] Error de sincronización local', err);
    }

    await MarketplaceLayout.mountNavbar('none', Clerk.user);
    initRealTimeValidation();
    initImageGallery();
    initDescCounter();

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');
    
    if (!listingId) {
        window.location.href = '/modules/marketplace/my-listings.html';
        return;
    }

    await loadListingData(listingId);

    document.getElementById("btn-ai-improve")?.addEventListener("click", improveDescription);
    document.getElementById("btn-ai-title")?.addEventListener("click", generateTitle);
    document.getElementById("btn-ai-correct")?.addEventListener("click", correctText);

    document.getElementById('edit-listing-form').addEventListener('submit', submitForm);
});
