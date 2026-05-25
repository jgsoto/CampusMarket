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
    const imagesInput = document.getElementById("listing-images");

    const ownerId = localStorage.getItem("campusMarketUserId");

    if (!ownerId) {
        alert("Error de sesión: No se encontró tu ID de usuario.");
        window.location.href = "/signin.html";
        return;
    }

    try {

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", desc);
        formData.append("price", price);
        formData.append("categoryId", categoryId);
        formData.append("ownerId", ownerId);
        formData.append("publish", isPublish);

        for (const image of imagesInput.files) {
            formData.append("images", image);
        }

        const response = await fetch("http://localhost:8080/api/listings", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            throw new Error("El servidor rechazó la petición.");
        }

        alert(
            `¡Éxito! Publicación creada en estado ${
                isPublish ? "PUBLICADA" : "BORRADOR"
            }.`
        );

        window.location.href = "/my-listings.html";

    } catch (error) {

        console.error(error);

        alert("Error al crear la publicación.");
    }
}