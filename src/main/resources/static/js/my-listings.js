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

            // Obtener miniatura o primera imagen
            const thumbnail = listing.images && listing.images.length > 0
                ? listing.images.find(img => img.thumbnail)?.url || listing.images[0].url
                : "/images/no-image.png";

            card.innerHTML = `
                <div style="width: 100%; height: 150px; background: #eee; border-radius: 4px; margin-bottom: 10px; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                    <img src="${thumbnail}" alt="${listing.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/250x150?text=Sin+Imagen'">
                </div>
                <h3 style="margin-top: 0; margin-bottom: 5px;">${listing.title}</h3>
                <p style="color: gray; font-size: 14px; margin: 2px 0;">Categoría: ${listing.categoryName}</p>
                <p style="margin: 8px 0; font-size: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 40px;">${listing.description}</p>
                <h2 style="color: #28a745; margin: 8px 0;">$${listing.price.toFixed(2)}</h2>
                <p style="font-weight: bold; color: ${statusColor}; margin: 2px 0;">ESTADO: ${listing.status}</p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    ${listing.status !== 'VENDIDO' ? `<button onclick="openEditModal('${listing.id}', '${listing.title.replace(/'/g, "\\'").replace(/\n/g, ' ')}', '${listing.description.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '')}', ${listing.price})" style="background: #ffc107; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Editar</button>` : ''}
                    ${listing.status === 'BORRADOR' ? `<button onclick="publishListing('${listing.id}')" style="background: #28a745; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Publicar</button>` : ''}
                    ${listing.status === 'PUBLICADA' ? `<button onclick="markAsSold('${listing.id}')" style="background: #6f42c1; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1;">Marcar Vendido</button>` : ''}
                    ${listing.status === 'VENDIDO' ? `<span style="background: #6c757d; color: white; padding: 8px; border-radius: 4px; flex: 1; text-align: center; font-size: 13px;">✅ Vendido</span>` : ''}
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
    const imagesInput = document.getElementById("edit-images");
    const ownerId = localStorage.getItem("campusMarketUserId");

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("price", price);
        
        if (imagesInput.files.length > 0) {
            for (const file of imagesInput.files) {
                formData.append("images", file);
            }
        }

        const response = await fetch(`http://localhost:8080/api/listings/${id}`, {
            method: "PUT",
            headers: {
                "X-User-Id": ownerId
            },
            body: formData
        });

        if (response.ok) {
            alert("Publicación actualizada con éxito");
            closeEditModal();
            // Resetear input de imágenes
            imagesInput.value = "";
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

async function markAsSold(id) {
    if (!confirm("¿Estás seguro de marcar este producto como VENDIDO? Esta acción no se puede deshacer.")) return;

    const ownerId = localStorage.getItem("campusMarketUserId");

    try {
        const response = await fetch(`http://localhost:8080/api/listings/${id}/mark-sold`, {
            method: "POST",
            headers: {
                "X-User-Id": ownerId
            }
        });

        if (response.ok) {
            alert("¡Producto marcado como vendido exitosamente!");
            loadMyListings(); // Recargar lista
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión.");
    }
}
