window.addEventListener("load", async () => {

    const container =
        document.getElementById("product-details-container");

    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        urlParams.get("id");

    if (!productId) {

        container.innerHTML = `
            <p style="color: red;">
                ID de producto no proporcionado.
            </p>
        `;

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/listings/${productId}`
        );

        if (!response.ok) {

            throw new Error(
                "No se pudo cargar la publicación."
            );
        }

        const product = await response.json();

        const imageUrl =
            product.images &&
            product.images.length > 0
                ? product.images.find(
                img => img.thumbnail
            )?.url || product.images[0].url
                : "";

        const currentUserId =
            localStorage.getItem(
                "campusMarketUserId"
            );

        const isOwner =
            product.ownerId === currentUserId;

        const isSold =
            product.status === "VENDIDO";

        const reputation =
            product.averageRating || 0;

        const totalReviews =
            product.totalReviews || 0;

        container.innerHTML = `
            <div style="
                display: flex;
                gap: 30px;
                flex-wrap: wrap;
                align-items: flex-start;
            ">

                <div style="
                    flex: 1;
                    min-width: 320px;
                ">

                    ${
            imageUrl
                ? `
                                <img
                                    src="${imageUrl}"
                                    alt="${product.title}"
                                    style="
                                        width: 100%;
                                        border-radius: 12px;
                                        object-fit: cover;
                                        max-height: 500px;
                                        border: 1px solid #ddd;
                                    "
                                >
                            `
                : `
                                <div style="
                                    width: 100%;
                                    height: 400px;
                                    border-radius: 12px;
                                    border: 1px solid #ddd;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: #f5f5f5;
                                    color: #777;
                                ">
                                    Sin imagen
                                </div>
                            `
        }

                </div>

                <div style="
                    flex: 1;
                    min-width: 320px;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                ">

                    <div>

                        <p style="
                            margin: 0;
                            color: #777;
                            font-size: 14px;
                        ">
                            ${product.categoryName}
                        </p>

                        <h1 style="
                            margin: 8px 0;
                            font-size: 32px;
                        ">
                            ${product.title}
                        </h1>

                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin-bottom: 10px;
                        ">

                            <span style="
                                font-size: 18px;
                                color: #f5b301;
                                font-weight: bold;
                            ">
                                ★ ${reputation.toFixed(1)}
                            </span>

                            <span style="
                                color: #666;
                                font-size: 14px;
                            ">
                                (${totalReviews} reseñas)
                            </span>

                        </div>

                        <h2 style="
                            margin: 0;
                            color: #28a745;
                            font-size: 36px;
                        ">
                            $${product.price.toFixed(2)}
                        </h2>

                    </div>

                    <div style="
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        padding: 18px;
                        background: #fff;
                    ">

                        <h3 style="
                            margin-top: 0;
                        ">
                            Descripción
                        </h3>

                        <p style="
                            margin: 0;
                            line-height: 1.6;
                            color: #444;
                        ">
                            ${product.description}
                        </p>

                    </div>

                    ${
            !isOwner
                ? `
                                <div
                                    id="seller-contact-panel"
                                    style="
                                        border: 1px solid #ddd;
                                        border-radius: 10px;
                                        padding: 18px;
                                        background: #fff;
                                        display: none;
                                    "
                                >

                                    <h3 style="
                                        margin-top: 0;
                                    ">
                                        Información del vendedor
                                    </h3>

                                    <div style="
                                        display: flex;
                                        flex-direction: column;
                                        gap: 10px;
                                    ">

                                        <p style="margin: 0;">
                                            <strong>Nombre:</strong>
                                            ${product.sellerName || "No disponible"}
                                        </p>

                                        <p style="margin: 0;">
                                            <strong>Email:</strong>
                                            ${product.sellerEmail || "No disponible"}
                                        </p>

                                        <p style="margin: 0;">
                                            <strong>Teléfono:</strong>
                                            ${product.sellerPhone || "No disponible"}
                                        </p>

                                        <p style="margin: 0;">
                                            <strong>Ubicación:</strong>
                                            ${product.sellerAddress || "No disponible"}
                                        </p>

                                        <p style="margin: 0;">
                                            <strong>Redes:</strong>
                                            ${product.sellerSocialMedia || "No disponible"}
                                        </p>

                                    </div>

                                </div>
                            `
                : ""
        }

                    <div style="
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    ">

                        ${
            isSold
                ? `
                                    <div style="
                                        background: #dc3545;
                                        color: white;
                                        padding: 14px;
                                        border-radius: 8px;
                                        text-align: center;
                                        font-weight: bold;
                                    ">
                                        Producto vendido
                                    </div>
                                `
                : isOwner
                    ? `
                                        <div style="
                                            background: #0d6efd;
                                            color: white;
                                            padding: 14px;
                                            border-radius: 8px;
                                            text-align: center;
                                            font-weight: bold;
                                        ">
                                            Esta es tu publicación
                                        </div>
                                    `
                    : `
                                        <button
                                            id="contact-button"
                                            style="
                                                background: #28a745;
                                                color: white;
                                                border: none;
                                                padding: 14px;
                                                border-radius: 8px;
                                                font-size: 16px;
                                                cursor: pointer;
                                                font-weight: bold;
                                            "
                                        >
                                            Contactar vendedor
                                        </button>
                                    `
        }

                    </div>

                    <div style="
                        font-size: 13px;
                        color: #777;
                    ">
                        Publicado el:
                        ${new Date(product.createdAt)
            .toLocaleString()}
                    </div>

                </div>

            </div>
        `;

        const contactButton =
            document.getElementById(
                "contact-button"
            );

        if (contactButton) {

            contactButton.addEventListener(
                "click",
                () => {

                    const panel =
                        document.getElementById(
                            "seller-contact-panel"
                        );

                    if (!panel) {
                        return;
                    }

                    if (panel.style.display === "none") {

                        panel.style.display = "block";

                        contactButton.textContent =
                            "Ocultar información";

                    } else {

                        panel.style.display = "none";

                        contactButton.textContent =
                            "Contactar vendedor";
                    }
                }
            );
        }

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                padding: 20px;
                border: 1px solid #dc3545;
                border-radius: 8px;
                background: #fff5f5;
                color: #dc3545;
            ">
                Error al cargar la publicación.
            </div>
        `;
    }
});