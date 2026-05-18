document.getElementById("create-listing-form")?.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
    const title = document.getElementById("listing-title").value;
    const desc = document.getElementById("listing-desc").value;
    const price = parseFloat(document.getElementById("listing-price").value);
    
    // Ahora obtenemos el ID de la categoría directamente de la lista desplegable
    const categoryId = document.getElementById("listing-category").value;
    
    // Obtenemos el UUID real que guardamos en el Dashboard
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
                ownerId: ownerId
            })
        });
        
        if (!response.ok) {
            throw new Error("El servidor rechazó la petición.");
        }
        
        alert("¡Éxito! Publicación creada en estado BORRADOR.");
        
        // Redirigir al dashboard para ver el producto en el catálogo
        window.location.href = "/dashboard.html";
        
    } catch (error) {
        console.error(error);
        alert("Error al crear la publicación.");
    }
});
