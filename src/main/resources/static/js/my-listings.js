window.addEventListener("load", async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = "/sign-in.html";
        return;
    }

    loadMyListings();

    document.getElementById("edit-listing-form").addEventListener("submit", handleEditSubmit);
});

async function loadMyListings() {
    const container = document.getElementById("my-listings-container");
    const ownerId = localStorage.getItem("campusMarketUserId");

    if (!ownerId) {
        container.innerHTML = "<p style='color:red;'>Error: No se encontró la sesión local. Ve al Dashboard para sincronizar.</p>";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/listings/me", {
            headers: {
                "X-User-Id": ownerId
            }
        });

        if (!response.ok) throw new Error("Fallo al obtener mis publicaciones");

        const listings = await response.json();
        container.innerHTML = "";

        if (listings.length === 0) {
            container.innerHTML = "<p>No tienes publicaciones aún. ¡Crea una!</p>";
            return;
        }

        listings.forEach(listing => {
            const card = document.createElement("div");
            card.style = "border: 1px solid #ccc; padding: 15px; border-radius: 8px; width: 250px; background: #fff;";
            
            // Color de estado
            let statusColor = listing.status === "BORRADOR" ? "orange" : (listing.status === "PUBLICADA" ? "green" : "gray");

            card.innerHTML = `
                <h3 style="margin-top: 0;">${listing.title}</h3>
                <p style="color: gray; font-size: 14px;">Categoría: ${listing.categoryName}</p>
                <p>${listing.description}</p>
                <h2 style="color: #28a745;">$${listing.price.toFixed(2)}</h2>
                <p style="font-weight: bold; color: ${statusColor};">ESTADO: ${listing.status}</p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    <button onclick="openEditModal('${listing.id}', '${listing.title.replace(/'/g, "\\'")}', '${listing.description.replace(/'/g, "\\'")}', ${listing.price})" style="background: #ffc107; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Editar</button>
                    ${listing.status === "BORRADOR" ? `<button onclick="publishListing('${listing.id}')" style="background: #28a745; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Publicar</button>` : ""}
                    <button onclick="deleteListing('${listing.id}')" style="background: #dc3545; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Eliminar</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='color:red;'>Error al cargar tus publicaciones.</p>";
    }
}

function openEditModal(id, title, desc, price) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-desc").value = desc;
    document.getElementById("edit-price").value = price;
    
    document.getElementById("edit-modal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById("edit-id").value;
    const title = document.getElementById("edit-title").value;
    const desc = document.getElementById("edit-desc").value;
    const price = parseFloat(document.getElementById("edit-price").value);
    const ownerId = localStorage.getItem("campusMarketUserId");

    try {
        const response = await fetch(`http://localhost:8080/api/listings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": ownerId
            },
            body: JSON.stringify({
                title: title,
                description: desc,
                price: price
            })
        });

        if (response.ok) {
            alert("Publicación actualizada con éxito");
            closeEditModal();
            loadMyListings(); // Recargar lista
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión al actualizar.");
    }
}

async function deleteListing(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;

    const ownerId = localStorage.getItem("campusMarketUserId");

    try {
        const response = await fetch(`http://localhost:8080/api/listings/${id}`, {
            method: "DELETE",
            headers: {
                "X-User-Id": ownerId
            }
        });

        if (response.ok) {
            alert("Publicación eliminada correctamente.");
            loadMyListings(); // Recargar lista
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión al eliminar.");
    }
}

async function publishListing(id) {
    if (!confirm("¿Quieres publicar esta publicación ahora?")) return;

    const ownerId = localStorage.getItem("campusMarketUserId");

    try {
        const response = await fetch(`http://localhost:8080/api/listings/${id}/publish`, {
            method: "POST",
            headers: {
                "X-User-Id": ownerId
            }
        });

        if (response.ok) {
            alert("¡Publicación publicada con éxito!");
            loadMyListings(); // Recargar lista
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión al publicar.");
    }
}
