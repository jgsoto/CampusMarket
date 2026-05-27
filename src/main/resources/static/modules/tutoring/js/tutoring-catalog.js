window.addEventListener("load", async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = "/modules/identity/signin.html";
        return;
    }

    await loadTutoringOffers();
});

async function loadTutoringOffers() {

    const container = document.getElementById("tutoring-catalog");

    try {

        const response = await fetch("http://localhost:8080/api/tutoring");

        if (!response.ok) {
            throw new Error("No se pudieron cargar las tutorías");
        }

        const offers = await response.json();

        container.innerHTML = "";

        if (!offers.length) {
            container.innerHTML = `
                <p style="text-align: center;">
                    No hay tutorías disponibles actualmente.
                </p>
            `;
            return;
        }

        for (const offer of offers) {

            const reputation = await loadTutorReputation(offer.tutorId);

            const card = createTutoringCard(offer, reputation);

            container.appendChild(card);
        }

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="color: red; text-align: center;">
                Error al cargar las tutorías.
            </p>
        `;
    }
}

async function loadTutorReputation(tutorId) {

    try {

        const response = await fetch(
            `http://localhost:8080/api/reviews/users/${tutorId}/reputation`
        );

        if (!response.ok) {
            return 0;
        }

        const data = await response.json();

        return data.reputation || 0;

    } catch (error) {

        console.error("Error al cargar reputación:", error);

        return 0;
    }
}

function createTutoringCard(offer, reputation) {

    const card = document.createElement("div");

    card.style.cssText = `
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 18px;
        width: 320px;
        background-color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        gap: 12px;
    `;

    card.innerHTML = `
    <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
    ">
        <h3 style="
            margin: 0;
            color: #6f42c1;
            font-size: 1.2rem;
        ">
            ${offer.subject}
        </h3>

        <span style="
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
            background-color:
                ${offer.status === "CLOSED"
        ? "#dc3545"
        : "#28a745"};
        ">
            ${offer.status === "CLOSED"
        ? "Finalizada"
        : "Disponible"}
        </span>
    </div>

    <p style="
        margin-top: 10px;
        color: #555;
        line-height: 1.5;
        min-height: 72px;
    ">
        ${truncateText(offer.description, 120)}
    </p>

    <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
    ">
        <span style="
            font-size: 1.1rem;
            font-weight: bold;
            color: #28a745;
        ">
            $${offer.hourlyRate} / hora
        </span>

        <span style="
            font-size: 0.95rem;
            color: #444;
        ">
            ${renderStars(reputation)} (${reputation.toFixed(1)})
        </span>
    </div>

    <button
        data-id="${offer.id}"
        style="
            background-color:
                ${offer.status === "CLOSED"
        ? "#6c757d"
        : "#6f42c1"};
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.2s ease;
        "
    >
        ${offer.status === "CLOSED"
        ? "Ver detalles y reseñas"
        : "Ver detalles"}
    </button>
`   ;

    const button = card.querySelector("button");

    button.addEventListener("click", () => {
        window.location.href =
            `/modules/tutoring/tutoring-details.html?id=${offer.id}`;
    });

    return card;
}

function renderStars(reputation) {

    const rounded = Math.round(reputation);

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += i <= rounded ? "★" : "☆";
    }

    return stars;
}

function truncateText(text, maxLength) {

    if (!text) {
        return "";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + "...";
}