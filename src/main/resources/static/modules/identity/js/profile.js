'use strict';

const ProfileDOM = Object.freeze({
    loading: () => document.getElementById('profile-loading'),
    form: () => document.getElementById('profile-form'),
    saveBtn: () => document.getElementById('save-btn'),
    cancelBtn: () => document.getElementById('cancel-btn'),
    charCount: () => document.getElementById('char-count'),
    toastContainer: () => document.getElementById('toast-container'),
    avatarInitials: () => document.getElementById('avatar-initials'),
    displayName: () => document.getElementById('display-name'),
    displayEmail: () => document.getElementById('display-email'),
    trustScore: () => document.getElementById('trust-score'),
    statListings: () => document.getElementById('stat-listings'),
    statTutorings: () => document.getElementById('stat-tutorings'),
    statReviews: () => document.getElementById('stat-reviews'),
    sidebarContact: () => document.getElementById('sidebar-contact'),
    sidebarContactItems: () => document.getElementById('sidebar-contact-items'),
    profName: () => document.getElementById('prof-name'),
    profEmail: () => document.getElementById('prof-email'),
    profPhone: () => document.getElementById('prof-phone'),
    profAddress: () => document.getElementById('prof-address'),
    profSocial: () => document.getElementById('prof-social'),
    profDesc: () => document.getElementById('prof-desc'),
    profileImage: () => document.getElementById('profile-image'),
    photoInput: () => document.getElementById('photo-input'),
    changePhotoBtn: () => document.getElementById('change-photo-btn'),
});

const ProfileAPI = Object.freeze({
    fetchProfile: (userId) => fetch(`${API_BASE}/api/users/profile/${userId}`),
    updateProfile: (userId, payload) => fetch(`${API_BASE}/api/users/profile/me`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'X-User-Id': userId},
        body: JSON.stringify(payload),
    }),
    fetchAllListings: () => fetch(`${API_BASE}/api/listings`),
    fetchTutoring: () => fetch(`${API_BASE}/api/tutoring`),
    fetchEnrolled: (offerId, userId) => fetch(`${API_BASE}/api/tutoring/${offerId}/enrolled`, {headers: {'X-User-Id': userId}}),
    fetchReputation: (userId) => fetch(`${API_BASE}/api/reviews/users/${userId}/reputation`),
    fetchReviews: (userId) => fetch(`${API_BASE}/api/reviews/users/${userId}/reviews`),
    uploadPhoto: (userId, formData) =>
        fetch(`${API_BASE}/api/users/profile/photo`, {
            method: 'POST',
            headers: {
                'X-User-Id': userId
            },
            body: formData
        }),
});

function buildInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function setLoadingState(isLoading) {
    const loading = ProfileDOM.loading();
    const form = ProfileDOM.form();
    if (loading) loading.style.display = isLoading ? 'flex' : 'none';
    if (form) form.style.display = isLoading ? 'none' : 'flex';
}

function setSavingState(isSaving) {
    const btn = ProfileDOM.saveBtn();
    if (!btn) return;
    btn.disabled = isSaving;
    btn.innerHTML = isSaving
        ? '<span class="w-4 h-4 border-2 border-uce-gold/30 border-t-uce-gold rounded-full animate-spin inline-block mr-2" aria-hidden="true"></span>Guardando...'
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Guardar cambios`;
}

function populateForm(profile) {
    ProfileDOM.profName().value = profile.fullName ?? '';
    ProfileDOM.profEmail().value = profile.email ?? '';
    ProfileDOM.profPhone().value = profile.phone ?? '';
    ProfileDOM.profAddress().value = profile.address ?? '';
    ProfileDOM.profSocial().value = profile.socialMedia ?? '';
    ProfileDOM.profDesc().value = profile.description ?? '';
    const descLen = (profile.description ?? '').length;
    if (ProfileDOM.charCount()) ProfileDOM.charCount().textContent = descLen;
}

function populateSidebar(profile) {
    const name = profile.fullName ?? 'Usuario UCE';
    const el = ProfileDOM;
    const image = ProfileDOM.profileImage();

    image.classList.remove('hidden');
    ProfileDOM.avatarInitials().classList.add('hidden');

    if (profile.photoUrl) {
        image.src = profile.photoUrl; // Foto subida por el usuario
    } else {
        image.src = "/assets/icons/perfil.png"; // Tu foto por defecto corregida
    }

    el.displayName().textContent = name;
    el.displayEmail().textContent = profile.email ?? '—';

    const contacts = [
        profile.phone && {icon: '📱', label: profile.phone},
        profile.socialMedia && {icon: '🔗', label: profile.socialMedia},
        profile.address && {icon: '📍', label: profile.address},
    ].filter(Boolean);

    const itemsContainer = ProfileDOM.sidebarContactItems();
    const contactCard = ProfileDOM.sidebarContact();
    if (contacts.length && itemsContainer && contactCard) {
        itemsContainer.innerHTML = contacts
            .map(c => `<div class="flex items-start gap-2 text-sm text-gray-600"><span class="shrink-0">${c.icon}</span><span class="break-all text-xs">${c.label}</span></div>`)
            .join('');
        contactCard.classList.remove('hidden');
    }
}

function readFormPayload() {
    return {
        phone: ProfileDOM.profPhone().value.trim(),
        address: ProfileDOM.profAddress().value.trim(),
        socialMedia: ProfileDOM.profSocial().value.trim(),
        description: ProfileDOM.profDesc().value.trim(),
    };
}

async function loadUserStats(userId) {
    try {
        const [listingsRes, tutoringRes, repRes, revRes] = await Promise.all([
            ProfileAPI.fetchAllListings(),
            ProfileAPI.fetchTutoring(),
            ProfileAPI.fetchReputation(userId),
            ProfileAPI.fetchReviews(userId)
        ]);

        let totalPublicaciones = 0;
        if (listingsRes.ok) {
            const allListings = await listingsRes.json();
            const myProducts = allListings.filter(item => item.ownerId === userId || item.userId === userId);
            totalPublicaciones += myProducts.length;
        }

        let allTutoringOffers = [];
        if (tutoringRes.ok) {
            allTutoringOffers = await tutoringRes.json();
            const myTutorings = allTutoringOffers.filter(t => t.tutorId === userId);
            totalPublicaciones += myTutorings.length;
        }

        if (ProfileDOM.statListings()) ProfileDOM.statListings().textContent = totalPublicaciones;

        if (repRes.ok) {
            const {reputation = 0} = await repRes.json();
            if (ProfileDOM.trustScore()) ProfileDOM.trustScore().textContent = `${reputation.toFixed(1)} / 5.0`;
        }

        if (revRes.ok) {
            const reviews = await revRes.json();
            if (ProfileDOM.statReviews()) ProfileDOM.statReviews().textContent = reviews.length;
        }

        const enrollmentChecks = await Promise.all(
            allTutoringOffers.map(async (t) => {
                try {
                    const check = await ProfileAPI.fetchEnrolled(t.id, userId);
                    return check.ok ? await check.json() : false;
                } catch {
                    return false;
                }
            })
        );

        const totalInscritas = enrollmentChecks.filter(Boolean).length;
        if (ProfileDOM.statTutorings()) ProfileDOM.statTutorings().textContent = totalInscritas;

    } catch (err) {
        console.error('[Profile] Error loading metrics:', err);
    }
}

async function loadProfile(userId) {
    setLoadingState(true);
    try {
        const res = await ProfileAPI.fetchProfile(userId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const profile = await res.json();
        populateForm(profile);
        populateSidebar(profile);
        await loadUserStats(userId);
    } catch (err) {
        console.error('[Profile] Error loading profile:', err);
    } finally {
        setLoadingState(false);
    }
}

async function saveProfile(userId) {
    setSavingState(true);
    try {
        const res = await ProfileAPI.updateProfile(userId, readFormPayload());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast('Perfil actualizado correctamente.', 'success');
        await loadProfile(userId);
    } catch (err) {
        console.error('[Profile] Error saving profile:', err);
        Swal.fire({title: 'Error', text: 'No se pudo actualizar el perfil.', icon: 'error'});
    } finally {
        setSavingState(false);
    }
}

async function uploadPhoto(userId, file) {

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await ProfileAPI.uploadPhoto(
            userId,
            formData
        );

        if (!response.ok) {
            throw new Error();
        }

        showToast("Foto actualizada correctamente.", "success");

        await loadProfile(userId);

    } catch (error) {

        console.error(error);

        Swal.fire({
            title: "Error",
            text: "No se pudo subir la imagen.",
            icon: "error"
        });

    }

}

window.addEventListener('load', async () => {
    const userId = localStorage.getItem('campusMarketUserId');
    if (!userId) {
        window.location.href = '/modules/identity/signin.html';
        return;
    }

    await Clerk.load();
    MarketplaceLayout.mountNavbar('profile', Clerk.user);
    await loadProfile(userId);

    ProfileDOM.form()?.addEventListener('submit', e => {
        e.preventDefault();
        saveProfile(userId);
    });
    ProfileDOM.profDesc()?.addEventListener('input', function () {
        if (ProfileDOM.charCount()) ProfileDOM.charCount().textContent = this.value.length;
    });
    ProfileDOM.cancelBtn()?.addEventListener('click', () => loadProfile(userId));
    ProfileDOM.photoInput()?.addEventListener("change", async function () {

        if (!this.files.length) return;

        await uploadPhoto(userId, this.files[0]);

    });
    ProfileDOM.changePhotoBtn()?.addEventListener("click", () => {

        ProfileDOM.photoInput().click();

    });
});