// Función principal para cargar el catálogo
async function loadCatalog() {

    const container = document.getElementById("catalog-container");

    try {

        // Petición al backend
        const response = await fetch("http://localhost:8080/api/listings");

        if (!response.ok) {
            throw new Error("Error al cargar el catálogo");
        }

        // Convertimos la respuesta a JSON
        const listings = await response.json();

        // Limpiamos el contenedor
        container.innerHTML = "";

        // Validamos si no hay productos
        if (listings.length === 0) {

            container.innerHTML =
                "<p>No hay productos disponibles en este momento.</p>";

            return;
        }

        // Recorremos las publicaciones
        listings.forEach(listing => {

            const card = document.createElement("div");

            card.style = `
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 8px;
                width: 250px;
                background: #f9f9f9;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;

            // Imagen principal
            const imageUrl =
                listing.images && listing.images.length > 0
                    ? listing.images[0].url
                    : "https://via.placeholder.com/300x200?text=Sin+Imagen";

            card.innerHTML = `

                <img
                    src="${imageUrl}"
                    alt="${listing.title}"
                    style="
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 8px;
                    "
                >

                <h3 style="margin: 0;">
                    ${listing.title}
                </h3>

                <p style="margin: 0; color: gray; font-size: 14px;">
                    Categoría: ${listing.categoryName}
                </p>

                <p style="margin: 0;">
                    ${listing.description}
                </p>

                <h2 style="margin: 0; color: #28a745;">
                    $${listing.price.toFixed(2)}
                </h2>

                <p style="margin: 0; font-size: 12px; color: #888;">
                    Estado: ${listing.status}
                </p>
            `;

            container.appendChild(card);
        });

    } catch (error) {

        console.error("Fallo al conectar con el backend:", error);

        container.innerHTML = `
            <p style="color:red;">
                Error al cargar los productos.
                Asegúrate de que el servidor Java esté corriendo.
            </p>
        `;
    }
}

// Ejecutamos automáticamente al cargar la página
loadCatalog();