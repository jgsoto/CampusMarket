async function submitForm(isPublish) {
    const form = document.getElementById("create-listing-form");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const title = document.getElementById("listing-title").value;
    const desc = document.getElementById("listing-desc").value;
    const price = parseFloat(document.getElementById("listing-price").value);
    const categoryId = document.getElementById("listing-category").value;
    const ownerId = localStorage.getItem("campusMarketUserId");
    
    if (!ownerId) {
        alert("Error de sesión: No se encontró tu ID de usuario. Por favor, vuelve a iniciar sesión.");
        window.location.href = "/signin.html";
        return;
    }
    
    try {
        const response = await fetch("http://localhost:8080/api/listings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                description: desc,
                price: price,
                categoryId: categoryId,
                ownerId: ownerId,
                publish: isPublish
            })
        });
        
        if (!response.ok) {
            throw new Error("El servidor rechazó la petición.");
        }
        
        alert(`¡Éxito! Publicación creada en estado ${isPublish ? 'PUBLICADA' : 'BORRADOR'}.`);
        
        // Redirigir a "Mis Publicaciones"
        window.location.href = "/my-listings.html";
        
    } catch (error) {
        console.error(error);
        alert("Error al crear la publicación.");
    }
}
