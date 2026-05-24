let productData = null;
let productId = null;
let currentUserId = null;

window.addEventListener("load", async () => {
    const params = new URLSearchParams(window.location.search);
    productId = params.get("id");
    currentUserId = localStorage.getItem("campusMarketUserId");

    if (!productId) {
        alert("No se especificó un producto.");
        window.location.href = "/dashboard.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/listings/${productId}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        productData = await res.json();

        const imageUrl = productData.images && productData.images.length > 0
            ? productData.images[0].url
            : "https://placehold.co/400x200?text=Sin+Imagen";

        document.getElementById("product-summary-card").innerHTML = `
            <h2>Resumen del pedido</h2>
            <img src="${imageUrl}" alt="${productData.title}" class="product-summary-img">
            <div class="product-name">${productData.title}</div>
            <div class="product-category">${productData.categoryName}</div>
            <div class="product-desc">${productData.description}</div>
            <div class="price-row">
                <span class="price-label">Total a pagar</span>
                <span class="price-value">$${productData.price.toFixed(2)}</span>
            </div>
        `;

        // Actualizar texto del botón con el precio
        document.getElementById("pay-btn").textContent = `Pagar $${productData.price.toFixed(2)}`;

    } catch (err) {
        console.error(err);
        alert("Error al cargar el producto: " + err.message);
        window.location.href = "/dashboard.html";
    }
});

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = value.match(/.{1,4}/g)?.join(' ') || value;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
    input.value = value;
}

async function handlePayment(event) {
    event.preventDefault();

    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, '');

    // Simulación: si termina en 0000 → rechazado
    const isRejected = cardNumber.endsWith("0000");

    // Mostrar overlay de carga
    document.getElementById("loading-overlay").classList.add("active");
    document.getElementById("pay-btn").disabled = true;

    try {
        // Si la tarjeta es de rechazo, esperamos 2 seg y mostramos error (sin llamar al backend)
        if (isRejected) {
            await delay(2500);
            document.getElementById("loading-overlay").classList.remove("active");
            showError("Tu tarjeta terminada en 0000 fue rechazada (simulación). Intenta con otra tarjeta.");
            return;
        }

        // Llamar al backend
        const response = await fetch(`http://localhost:8080/api/listings/${productId}/purchase`, {
            method: "POST",
            headers: {
                "X-User-Id": currentUserId,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        document.getElementById("loading-overlay").classList.remove("active");

        if (response.ok && data.success) {
            showSuccess(data.transactionId, data.orderId);
        } else {
            showError(data.message || "El banco rechazó la transacción.");
        }

    } catch (err) {
        document.getElementById("loading-overlay").classList.remove("active");
        showError("Error de conexión. Verifica tu internet e intenta de nuevo.");
        console.error(err);
    }
}

function showSuccess(transactionId, orderId) {
    document.getElementById("checkout-view").style.display = "none";
    const screen = document.getElementById("success-screen");
    screen.classList.add("active");

    document.getElementById("success-detail").innerHTML = `
        <div class="success-detail-row">
            <span class="detail-label">Producto</span>
            <span class="detail-value">${productData.title}</span>
        </div>
        <div class="success-detail-row">
            <span class="detail-label">Monto pagado</span>
            <span class="detail-value">$${productData.price.toFixed(2)}</span>
        </div>
        <div class="success-detail-row">
            <span class="detail-label">ID de Transacción</span>
            <span class="txn-badge">${transactionId}</span>
        </div>
        <div class="success-detail-row">
            <span class="detail-label">Estado del producto</span>
            <span class="detail-value" style="color:#dc3545;">VENDIDO</span>
        </div>
    `;
}

function showError(message) {
    document.getElementById("checkout-view").style.display = "none";
    const screen = document.getElementById("error-screen");
    screen.classList.add("active");
    document.getElementById("error-msg").textContent = message;
}

function retryPayment() {
    document.getElementById("error-screen").classList.remove("active");
    document.getElementById("checkout-view").style.display = "block";
    document.getElementById("pay-btn").disabled = false;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
