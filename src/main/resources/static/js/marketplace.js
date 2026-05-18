// Función principal para cargar el catálogo
async function loadCatalog() {
    const container = document.getElementById("catalog-container");

    try {
        // 1. Hacemos la petición GET a tu API (ISSUE 7)
        const response = await fetch("http://localhost:8080/api/listings");
        
        if (!response.ok) {
            throw new Error("Error al cargar el catálogo");
        }

        const listings = await response.json();

        // 2. Limpiamos el texto de "Cargando..."
        container.innerHTML = "";

        if (listings.length === 0) {
            container.innerHTML = "<p>No hay productos disponibles en este momento.</p>";
            return;
        }

        // 3. Recorremos el Array y creamos el HTML de cada tarjeta
        listings.forEach(listing => {
            const card = document.createElement("div");
            // Diseño súper simple y decente para cumplir por ahora
            card.style = "border: 1px solid #ccc; padding: 15px; border-radius: 8px; width: 250px; background: #f9f9f9;";
            
            card.innerHTML = `
                <h3 style="margin-top: 0;">${listing.title}</h3>
                <p style="color: gray; font-size: 14px;">Categoría: ${listing.categoryName}</p>
                <p>${listing.description}</p>
                <h2 style="color: #28a745;">$${listing.price.toFixed(2)}</h2>
                <p style="font-size: 12px; color: #888;">Estado: ${listing.status}</p>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Fallo al conectar con el backend:", error);
        container.innerHTML = "<p style='color:red;'>Error al cargar los productos. Asegúrate de que el servidor Java esté corriendo.</p>";
    }
}

