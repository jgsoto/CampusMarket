window.addEventListener("load", async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = "/signin.html";
        return;
    }

    loadMyOrders();
});

async function loadMyOrders() {
    const container = document.getElementById("orders-container");
    const buyerId = localStorage.getItem("campusMarketUserId");

    if (!buyerId) {
        container.innerHTML = `<p style='color:red;'>Error: No se encontró la sesión. Ve al Dashboard para sincronizar.</p>`;
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/orders/me", {
            headers: { "X-User-Id": buyerId }
        });

        if (!response.ok) throw new Error("Error al obtener tus compras");

        const orders = await response.json();
        container.innerHTML = "";

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="orders-empty">
                    <span>🛍️</span>
                    <p>Aún no has comprado ningún producto.</p>
                    <button class="btn-back" onclick="window.location.href='/dashboard.html'" style="margin-top:10px;">
                        Ver Catálogo
                    </button>
                </div>`;
            return;
        }

        orders.forEach(order => {
            const card = document.createElement("div");
            card.className = "order-card";

            const date = new Date(order.createdAt).toLocaleDateString("es-EC", {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit"
            });

            card.innerHTML = `
                <div class="order-info">
                    <h3>📦 ${order.listingTitle}</h3>
                    <p>📅 ${date}</p>
                    <p style="color:#888; font-size:0.8rem;">ID: ${order.id}</p>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:10px;">
                    <span class="order-amount">$${order.amount.toFixed(2)}</span>
                    <button class="btn-invoice" onclick='openInvoice(${JSON.stringify(order)})'>
                        📄 Ver Factura
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style='color:red;'>Error al cargar tus compras. Intenta de nuevo.</p>`;
    }
}

function openInvoice(order) {
    const date = new Date(order.createdAt).toLocaleDateString("es-EC", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    // Mostrar solo últimos 8 caracteres del ID de orden para mayor legibilidad
    document.getElementById("inv-id").textContent = order.id.slice(-8).toUpperCase();
    document.getElementById("inv-date").textContent = date;
    document.getElementById("inv-product").textContent = order.listingTitle;
    document.getElementById("inv-payment").textContent = order.paymentId || "N/A";
    document.getElementById("inv-amount").textContent = "$" + order.amount.toFixed(2);

    document.getElementById("invoice-modal").style.display = "flex";
}

function closeInvoice() {
    document.getElementById("invoice-modal").style.display = "none";
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener("click", (e) => {
    const modal = document.getElementById("invoice-modal");
    if (e.target === modal) {
        closeInvoice();
    }
});
