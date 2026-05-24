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

        // Logica del botón de compra
        const actionContainer = document.getElementById("purchase-action-container");
        const currentUserId = localStorage.getItem("campusMarketUserId");

        if (product.status === "VENDIDO") {
            actionContainer.innerHTML = `<span style="background: #dc3545; color: white; padding: 8px 15px; border-radius: 5px; font-weight: bold;">AGOTADO (Vendido)</span>`;
        } else if (product.ownerId === currentUserId) {
            actionContainer.innerHTML = `<span style="background: #17a2b8; color: white; padding: 8px 15px; border-radius: 5px; font-weight: bold;">Tu publicación</span>`;
        } else if (product.status === "PUBLICADA") {
            const buyBtn = document.createElement("button");
            buyBtn.textContent = "Comprar Ahora";
            buyBtn.style = "background: #28a745; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; width: 100%; transition: background 0.3s;";
            buyBtn.onmouseover = () => buyBtn.style.background = "#218838";
            buyBtn.onmouseout = () => buyBtn.style.background = "#28a745";
            
            // Redirigir a la página de checkout
            buyBtn.onclick = () => window.location.href = `/checkout.html?id=${productId}`;
            actionContainer.appendChild(buyBtn);
        }

    } catch (error) {
        console.error(error);
        document.getElementById('product-details-container').innerHTML = `
            <p style="color:red;">Error al cargar el producto. ${error.message}</p>
        `;
    }
});

async function handlePurchase(productId, userId) {
    if (!userId) {
        Swal.fire("Inicia sesión", "Debes iniciar sesión para comprar.", "warning")
            .then(() => window.location.href = "/sign-in.html");
        return;
    }

    // Confirmación inicial
    const confirm = await Swal.fire({
        title: '¿Confirmar compra?',
        text: "Serás redirigido a la pasarela de pagos.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    // Simulación de carga (pasarela)
    Swal.fire({
        title: 'Procesando pago...',
        text: 'Simulando comunicación con el banco. Por favor espera.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch(`http://localhost:8080/api/listings/${productId}/purchase`, {
            method: "POST",
            headers: {
                "X-User-Id": userId,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            Swal.fire({
                title: '¡Pago Exitoso!',
                text: 'Transacción: ' + data.transactionId,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.reload(); // Recargar para mostrar como VENDIDO
            });
        } else {
            Swal.fire('Pago Rechazado', data.message || 'Fondos insuficientes.', 'error');
        }
    } catch (error) {
        console.error("Error en purchase:", error);
        Swal.fire('Error', 'Hubo un problema de conexión al procesar el pago.', 'error');
    }
}
