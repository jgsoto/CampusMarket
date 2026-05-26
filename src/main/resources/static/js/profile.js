window.addEventListener("load", () => {
    initializeProfile();
});

async function initializeProfile() {

    const userId = localStorage.getItem("campusMarketUserId");

    if (!userId) {
        await Swal.fire({
            title: "Inicia sesión",
            text: "Debes iniciar sesión para ver tu perfil.",
            icon: "warning"
        });

        window.location.href = "/signin.html";
        return;
    }

    setupFormListener(userId);

    await Promise.all([
        loadProfile(userId),
        loadReputation(userId),
        loadReviews(userId)
    ]);
}

async function loadProfile(userId) {

    try {

        const response = await fetch(
            `http://localhost:8080/api/users/profile/${userId}`
        );

        if (!response.ok) {
            throw new Error("No se pudo obtener el perfil");
        }

        const profile = await response.json();

        setInputValue("prof-name", profile.fullName);
        setInputValue("prof-email", profile.email);
        setInputValue("prof-phone", profile.phone);
        setInputValue("prof-address", profile.address);
        setInputValue("prof-social", profile.socialMedia);
        setInputValue("prof-desc", profile.description);

    } catch (error) {

        console.error("Error al cargar perfil:", error);

        Swal.fire({
            title: "Error",
            text: "No se pudo cargar la información del perfil.",
            icon: "error"
        });
    }
}

async function loadReputation(userId) {

    const reputationContainer =
        document.getElementById("profile-reputation");

    if (!reputationContainer) return;

    try {

        const response = await fetch(
            `http://localhost:8080/api/reviews/users/${userId}/reputation`
        );

        if (!response.ok) {
            throw new Error("No se pudo obtener la reputación");
        }

        const data = await response.json();

        const reputation =
            typeof data.reputation === "number"
                ? data.reputation
                : 0;

        reputationContainer.innerHTML = `
            <div class="profile-reputation-box">
                <h3>Reputación</h3>
                <p>${reputation.toFixed(1)} / 5</p>
            </div>
        `;

    } catch (error) {

        console.error("Error al cargar reputación:", error);

        reputationContainer.innerHTML = `
            <p>No se pudo cargar la reputación.</p>
        `;
    }
}

async function loadReviews(userId) {

    const reviewsContainer =
        document.getElementById("profile-reviews");

    if (!reviewsContainer) return;

    try {

        const response = await fetch(
            `http://localhost:8080/api/reviews/users/${userId}/reviews`
        );

        if (!response.ok) {
            throw new Error("No se pudieron obtener las reviews");
        }

        const reviews = await response.json();

        reviewsContainer.innerHTML = "";

        if (!reviews.length) {

            reviewsContainer.innerHTML = `
                <p>Este usuario todavía no tiene reviews.</p>
            `;

            return;
        }

        reviews.forEach(review => {

            const reviewCard = document.createElement("div");

            reviewCard.className = "review-card";

            reviewCard.innerHTML = `
                <div class="review-header">
                    <strong>${renderStars(review.rating)}</strong>
                    <span>
                        ${formatDate(review.createdAt)}
                    </span>
                </div>

                <p>
                    ${review.comment || "Sin comentario"}
                </p>
            `;

            reviewsContainer.appendChild(reviewCard);
        });

    } catch (error) {

        console.error("Error al cargar reviews:", error);

        reviewsContainer.innerHTML = `
            <p>No se pudieron cargar las reviews.</p>
        `;
    }
}

function setupFormListener(userId) {

    const form = document.getElementById("profile-form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const payload = {
            phone: getInputValue("prof-phone"),
            address: getInputValue("prof-address"),
            socialMedia: getInputValue("prof-social"),
            description: getInputValue("prof-desc")
        };

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/profile/me",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Id": userId
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error("No se pudo actualizar el perfil");
            }

            await Swal.fire({
                title: "Perfil actualizado",
                text: "Los cambios se guardaron correctamente.",
                icon: "success"
            });

        } catch (error) {

            console.error("Error al actualizar perfil:", error);

            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el perfil.",
                icon: "error"
            });
        }
    });
}

function renderStars(rating) {

    const fullStars = Math.round(rating);

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += i <= fullStars ? "★" : "☆";
    }

    return `${stars} (${rating}/5)`;
}

function formatDate(date) {

    return new Date(date).toLocaleDateString("es-EC", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function setInputValue(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.value = value || "";
}

function getInputValue(id) {

    const element = document.getElementById(id);

    return element ? element.value.trim() : "";
}