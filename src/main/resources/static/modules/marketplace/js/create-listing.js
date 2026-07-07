'use strict';

let _selectedFiles = [];

const FIELDS = {
    title: () => document.getElementById('listing-title'),
    desc: () => document.getElementById('listing-desc'),
    price: () => document.getElementById('listing-price'),
    category: () => document.getElementById('listing-category'),
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

    if (fieldId === 'listing-price') {
        const num = parseFloat(value);
        if (!value || isNaN(num) || num < 0.01) {
            showFieldError(fieldId, ERRORS.price);
            return false;
        }
        clearFieldError(fieldId);
        return true;
    }

    if (!value) {
        const key = fieldId.replace('listing-', '');
        showFieldError(fieldId, ERRORS[key]);
        return false;
    }

    clearFieldError(fieldId);
    return true;
}

function validateAll() {
    const results = [validateField('listing-title'), validateField('listing-desc'), validateField('listing-price'), validateField('listing-category'),];
    return results.every(Boolean);
}

function initRealTimeValidation() {
    ['listing-title', 'listing-desc', 'listing-price', 'listing-category'].forEach(id => {
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
    document.getElementById('image-count').textContent = `${_selectedFiles.length} / 5`;
}

function renderGallery() {
    const mainContainer = document.getElementById('main-preview-container');
    const thumbnailsRow = document.getElementById('thumbnails-row');
    const clearBtn = document.getElementById('btn-clear-images');
    const uploadZone = document.getElementById('upload-zone');

    thumbnailsRow.innerHTML = '';

    if (!_selectedFiles.length) {
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
    uploadZone.classList.toggle('hidden', _selectedFiles.length >= 5);

    _selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = ({target}) => {
            const src = target.result;
            if (index === 0) setMainImage(src, file.name);

            const thumb = document.createElement('button');
            thumb.type = 'button';
            thumb.className = `relative aspect-square rounded-xl overflow-hidden bg-gray-100
                         border-2 transition-all group
                         ${index === 0 ? 'border-uce-navy' : 'border-transparent hover:border-uce-navy/50'}`;
            thumb.setAttribute('aria-label', `Ver imagen ${index + 1}`);
            thumb.innerHTML = `
        <img src="${src}" alt="${file.name}" class="w-full h-full object-contain bg-white" />
        <button type="button"
                class="remove-img absolute top-1 right-1 w-5 h-5 rounded-full
                       bg-red-500 text-white flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                data-index="${index}"
                aria-label="Eliminar imagen ${index + 1}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>`;

            thumb.addEventListener('click', (e) => {
                if (e.target.closest('.remove-img')) return;
                setMainImage(src, file.name);
                thumbnailsRow.querySelectorAll('button').forEach(b => b.classList.replace('border-uce-navy', 'border-transparent'));
                thumb.classList.replace('border-transparent', 'border-uce-navy');
            });

            thumbnailsRow.appendChild(thumb);
        };
        reader.readAsDataURL(file);
    });

    updateImageCount();
}

function initImageGallery() {
    const input = document.getElementById('listing-images');

    input.addEventListener('change', () => {
        const remaining = 5 - _selectedFiles.length;
        _selectedFiles = [..._selectedFiles, ...Array.from(input.files).slice(0, remaining)];
        input.value = '';
        renderGallery();
    });

    document.getElementById('thumbnails-row').addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-img');
        if (!removeBtn) return;
        _selectedFiles.splice(parseInt(removeBtn.dataset.index, 10), 1);
        renderGallery();
    });

    document.getElementById('btn-clear-images').addEventListener('click', () => {
        _selectedFiles = [];
        input.value = '';
        renderGallery();
    });
}

function initDescCounter() {
    const textarea = document.getElementById('listing-desc');
    const counter = document.getElementById('desc-count');
    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
    });
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
        button.innerHTML = "Corregir texto";
    }

}

async function submitForm(isPublish) {
    if (!validateAll()) {
        document.querySelector('[id^="error-listing"]')
            ?.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    const ownerId = getOwnerId();
    if (!ownerId) {
        showToast('Sesión no encontrada. Inicia sesión nuevamente.', 'error');
        window.location.href = '/modules/identity/signin.html';
        return;
    }

    const btn = isPublish ? document.getElementById('btn-publish') : document.getElementById('btn-draft');
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold
                               rounded-full animate-spin inline-block mr-2"></span>
                   ${isPublish ? 'Publicando...' : 'Guardando...'}`;

    try {
        const formData = new FormData();
        formData.append('title', FIELDS.title().value.trim());
        formData.append('description', FIELDS.desc().value.trim());
        formData.append('price', parseFloat(FIELDS.price().value));
        formData.append('categoryId', FIELDS.category().value);
        formData.append('ownerId', ownerId);
        formData.append('publish', isPublish);

        for (const file of _selectedFiles) {
            formData.append('images', file);
        }

        const res = await fetch(`${API_BASE}/api/listings`, {
            method: 'POST', body: formData,
        });

        if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);

        showToast(isPublish ? 'Producto publicado exitosamente.' : 'Guardado como borrador.', 'success');

        setTimeout(() => {
            window.location.href = '/modules/marketplace/my-listings.html';
        }, 1200);

    } catch (err) {
        console.error('[CreateListing]', err);
        showToast('No se pudo crear la publicación. Intenta de nuevo.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/modules/identity/signin.html';
        return;
    }

    await MarketplaceLayout.mountNavbar('create', Clerk.user);
    initRealTimeValidation();
    initImageGallery();
    initDescCounter();

    document
        .getElementById("btn-ai-improve")
        ?.addEventListener("click", improveDescription);

    document
        .getElementById("btn-ai-title")
        ?.addEventListener("click", generateTitle);

    document
        .getElementById("btn-ai-correct")
        ?.addEventListener("click", correctText);

    document.getElementById('btn-draft').addEventListener('click', () => submitForm(false));
    document.getElementById('btn-publish').addEventListener('click', () => submitForm(true));
});