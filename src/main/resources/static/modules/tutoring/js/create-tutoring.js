window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/signin.html';
        return;
    }

    const form = document.getElementById('create-tutoring-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('subject').value;
        const description = document.getElementById('description').value;
        const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
        
        const userId = localStorage.getItem('campusMarketUserId');
        if (!userId) {
            alert("Error: No se encontró el ID interno de usuario. Por favor inicia sesión de nuevo.");
            window.location.href = '/signin.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/tutoring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId
                },
                body: JSON.stringify({
                    subject: subject,
                    description: description,
                    hourlyRate: hourlyRate
                })
            });

            if (response.ok) {
                alert('¡Tutoría publicada exitosamente!');
                window.location.href = '/tutoring-catalog.html';
            } else {
                alert('Error al publicar la tutoría');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de red al intentar publicar.');
        }
    });
});
