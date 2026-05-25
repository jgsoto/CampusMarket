window.addEventListener("load", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-details-container').innerHTML = "<p style='color:red;'>ID de producto no proporcionado.</p>";
        return;
    }

    try {
        // Hacer la petición GET al endpoint recién creado
        const response = await fetch(`http://localhost:8080/api/listings/${productId}`);
        if (!response.ok) {
            throw new Error("Producto no encontrado o error en el servidor");
        }
        const product = await response.json();

        const container = document.getElementById('product-details-container');
        
        // Procesar la imagen principal o una por defecto
        const imageUrl = product.images && product.images.length > 0
            ? product.images[0].url
            : "https://via.placeholder.com/600x400?text=Sin+Imagen";

        // Renderizar los detalles completos del producto
        container.innerHTML = `
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <img src="${imageUrl}" alt="${product.title}" style="width: 100%; border-radius: 8px; object-fit: cover; max-height: 400px;">
                </div>
                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 15px;">
                    <h2 style="margin: 0;">${product.title}</h2>
                    <p style="margin: 0; color: gray; font-size: 16px;">Categoría: ${product.categoryName}</p>
                    <h1 style="margin: 0; color: #28a745;">$${product.price.toFixed(2)}</h1>
                    <p style="font-size: 14px; color: #555; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">${product.description}</p>
                    <p style="margin: 0; font-size: 14px; color: #888;">Estado: <strong>${product.status}</strong></p>
                    <p style="margin: 0; font-size: 12px; color: #aaa;">Publicado el: ${new Date(product.createdAt).toLocaleString()}</p>
                    
                    <!-- Contenedor dinámico para el botón de compra -->
                    <div id="purchase-action-container" style="margin-top: 15px;"></div>
                </div>
            </div>
        `;

        // Logica del botón de compra/contacto
        const actionContainer = document.getElementById("purchase-action-container");
        const currentUserId = localStorage.getItem("campusMarketUserId");

        if (product.status === "VENDIDO") {
            actionContainer.innerHTML = `<span style="background: #dc3545; color: white; padding: 8px 15px; border-radius: 5px; font-weight: bold;">AGOTADO (Vendido)</span>`;
        } else if (product.ownerId === currentUserId) {
            actionContainer.innerHTML = `<span style="background: #17a2b8; color: white; padding: 8px 15px; border-radius: 5px; font-weight: bold;">Tu publicación</span>`;
        } else if (product.status === "PUBLICADA") {
            actionContainer.innerHTML = `
                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h3 style="margin-top: 0;">Contactar al Vendedor</h3>
                    <p style="margin: 5px 0;"><strong>Vendedor:</strong> ${product.sellerName || 'Desconocido'}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${product.sellerEmail || 'No disponible'}</p>
                    <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${product.sellerPhone || 'No disponible'}</p>
                    <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${product.sellerAddress || 'No disponible'}</p>
                    <p style="margin: 5px 0;"><strong>Redes:</strong> ${product.sellerSocialMedia || 'No disponible'}</p>
                </div>
            `;
        }

    } catch (error) {
        console.error(error);
        document.getElementById('product-details-container').innerHTML = `
            <p style="color:red;">Error al cargar el producto. ${error.message}</p>
        `;
    }
});
