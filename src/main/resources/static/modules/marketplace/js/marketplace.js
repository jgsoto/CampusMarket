// Función principal para cargar el catálogo
async function loadCatalog() {

    const container = document.getElementById("catalog-container");

    try {
        const response = await fetch("http://localhost:8080/api/listings");

        if (!response.ok) {
            throw new Error("Error al cargar el catálogo");
        }

        const listings = await response.json();

       
        container.innerHTML = "";

      
        if (listings.length === 0) {
            container.innerHTML = "<p>No hay productos disponibles en este momento.</p>";
            return;
        }

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

            const isSold = listing.status === "VENDIDO";
            const opacity = isSold ? "0.6" : "1";
            const badge = isSold 
                ? `<div style="position: absolute; top: 10px; right: 10px; background: red; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 12px; z-index: 10;">AGOTADO</div>` 
                : "";

            card.innerHTML = `
                <div style="position: relative; width: 100%; height: 200px;">
                    ${badge}
                    <img
                        src="${imageUrl}"
                        alt="${listing.title}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 8px;
                            opacity: ${opacity};
                        "
                    >
                </div>

                <h3 style="margin: 0; opacity: ${opacity};">
                    ${listing.title}
                </h3>

                <p style="margin: 0; color: gray; font-size: 14px; opacity: ${opacity};">
                    Categoria: ${listing.categoryName}
                </p>

                <p style="margin: 0; opacity: ${opacity};">
                    ${listing.description}
                </p>

                <h2 style="margin: 0; color: #28a745; opacity: ${opacity};">
                    $${listing.price.toFixed(2)}
                </h2>

                <p style="margin: 0; font-size: 12px; color: ${isSold ? 'red' : '#888'}; font-weight: ${isSold ? 'bold' : 'normal'};">
                    Estado: ${listing.status}
                </p>

                <button
                    onclick="window.location.href='/modules/marketplace/product-details.html?id=${listing.id}'"
                    style="
                        margin-top: 10px;
                        padding: 8px;
                        background-color: ${isSold ? '#6c757d' : '#007bff'};
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                    "
                >
                    Ver Producto
                </button>
            `;

            container.appendChild(card);
        });

    } catch (error) {

        console.error("Fallo al conectar con el backend:", error);

        container.innerHTML = `
            <p style="color:red;">
                Error al cargar los productos.
                Asegurate de que el servidor Java este corriendo.
            </p>
        `;
    }
}


loadCatalog();