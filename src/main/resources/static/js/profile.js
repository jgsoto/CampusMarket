window.addEventListener("load", async () => {
    const userId = localStorage.getItem("campusMarketUserId");
    if (!userId) {
        Swal.fire("Inicia sesión", "Debes iniciar sesión para ver tu perfil.", "warning")
            .then(() => window.location.href = "/sign-in.html");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/users/profile/${userId}`);
        if (response.ok) {
            const profile = await response.json();
            
            document.getElementById("prof-name").value = profile.fullName || "";
            document.getElementById("prof-email").value = profile.email || "";
            document.getElementById("prof-phone").value = profile.phone || "";
            document.getElementById("prof-address").value = profile.address || "";
            document.getElementById("prof-social").value = profile.socialMedia || "";
            document.getElementById("prof-desc").value = profile.description || "";
        } else {
            console.error("Error fetching profile");
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }

    document.getElementById("profile-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            phone: document.getElementById("prof-phone").value,
            address: document.getElementById("prof-address").value,
            socialMedia: document.getElementById("prof-social").value,
            description: document.getElementById("prof-desc").value
        };

        try {
            const res = await fetch("http://localhost:8080/api/users/profile/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                Swal.fire("Éxito", "Perfil actualizado correctamente.", "success");
            } else {
                Swal.fire("Error", "No se pudo actualizar el perfil.", "error");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire("Error", "Hubo un problema de red.", "error");
        }
    });
});
