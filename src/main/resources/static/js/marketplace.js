async function loadCatalog() {

    const container = document.getElementById("catalog-container");

    try {

        container.innerHTML = "<p>Cargando productos...</p>";

        const response = await fetch(
            "http://localhost:8080/api/listings"
        );

        if (!response.ok) {
            throw new Error("Error al cargar publicaciones");
        }

        const listings = await response.json();

        container.innerHTML = "";

        if (listings.length === 0) {

            container.innerHTML = `
                <p style="color: gray;">
                    No hay productos disponibles.
                </p>
            `;

            return;
        }

        container.style.display = "grid";
        container.style.gridTemplateColumns =
            "repeat(auto-fill, minmax(280px, 1fr))";

        container.style.gap = "20px";

        for (const listing of listings) {

            let reputation = 0;

            try {

                const reputationResponse = await fetch(
                    `http://localhost:8080/api/reviews/users/${listing.ownerId}/reputation`
                );

                if (reputationResponse.ok) {

                    const reputationData =
                        await reputationResponse.json();

                    reputation = reputationData.reputation || 0;
                }

            } catch (e) {

                console.warn(
                    "No se pudo cargar reputación",
                    e
                );
            }

            const imageUrl =
                listing.images &&
                listing.images.length > 0
                    ? listing.images[0].url
                    : "https://placehold.co/300x200?text=Sin+Imagen";

            const isSold =
                listing.status === "VENDIDO";

            const card = document.createElement("div");

            card.style = `
                background: white;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                transition: 0.2s;
                display: flex;
                flex-direction: column;
                cursor: pointer;
            `;

            card.onmouseenter = () => {
                card.style.transform = "translateY(-4px)";
            };

            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
            };

            const soldBadge = isSold
                ? `
                    <div style="
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #dc3545;
                        color: white;
                        padding: 6px 10px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: bold;
                    ">
                        AGOTADO
                    </div>
                `
                : "";

            card.innerHTML = `

                <div style="
                    position: relative;
                    width: 100%;
                    height: 220px;
                    overflow: hidden;
                ">

                    ${soldBadge}

                    <img
                        src="${imageUrl}"
                        alt="${listing.title}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            opacity: ${isSold ? "0.7" : "1"};
                        "
                    >

                </div>

                <div style="
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                ">

                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">

                        <h3 style="
                            margin: 0;
                            font-size: 18px;
                        ">
                            ${listing.title}
                        </h3>

                        <span style="
                            font-size: 14px;
                            color: #f39c12;
                            font-weight: bold;
                        ">
                            ⭐ ${reputation.toFixed(1)}
                        </span>

                    </div>

                    <p style="
                        margin: 0;
                        color: #777;
                        font-size: 14px;
                    ">
                        ${listing.categoryName}
                    </p>

                    <p style="
                        margin: 0;
                        color: #444;
                        flex: 1;
                    ">
                        ${listing.description}
                    </p>

                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">

                        <h2 style="
                            margin: 0;
                            color: #28a745;
                            font-size: 24px;
                        ">
                            $${listing.price.toFixed(2)}
                        </h2>

                        <span style="
                            font-size: 12px;
                            font-weight: bold;
                            color: ${isSold ? "#dc3545" : "#777"};
                        ">
                            ${listing.status}
                        </span>

                    </div>

                    <button
                        style="
                            padding: 12px;
                            border: none;
                            border-radius: 10px;
                            background: ${isSold ? "#6c757d" : "#007bff"};
                            color: white;
                            font-weight: bold;
                            cursor: pointer;
                        "
                    >
                        Ver producto
                    </button>

                </div>
            `;

            card.onclick = () => {

                window.location.href =
                    `/product-details.html?id=${listing.id}`;
            };

            container.appendChild(card);
        }

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                color: red;
                padding: 20px;
                background: #ffeaea;
                border-radius: 10px;
            ">
                Error al cargar productos.
            </div>
        `;
    }
}

loadCatalog();