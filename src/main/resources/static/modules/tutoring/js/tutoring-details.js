window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/signin.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('id');

    if (!offerId) {
        alert('No se especificó la oferta.');
        window.location.href = '/tutoring-catalog.html';
        return;
    }

    const currentUserId = localStorage.getItem('campusMarketUserId');
    loadTutoringDetails(offerId, currentUserId);
});

async function loadTutoringDetails(offerId, currentUserId) {
    try {
        const response = await fetch(`http://localhost:8080/api/tutoring/${offerId}`);
        if (!response.ok) {
            throw new Error('Error al obtener la oferta');
        }

        const offer = await response.json();

        // Rellenar datos
        document.getElementById('tutoring-subject').textContent = offer.subject;
        document.getElementById('tutoring-price').textContent = `$${offer.hourlyRate} / hora`;
        document.getElementById('tutoring-description').textContent = offer.description;
        
        // Datos de contacto
        document.getElementById('tutor-name').textContent = offer.tutorName || "No registrado";
        document.getElementById('tutor-email').textContent = offer.tutorEmail || "No registrado";
        document.getElementById('tutor-phone').textContent = offer.tutorPhone || "No registrado";
        document.getElementById('tutor-social').textContent = offer.tutorSocialMedia || "No registrado";

        // Lógica de "Esta es mi publicación"
        if (offer.tutorId === currentUserId) {
            document.getElementById('contact-panel').style.display = 'none';
            document.getElementById('owner-actions').style.display = 'block';

            const closeBtn = document.getElementById('close-offer-btn');
            
            if (offer.status === 'CLOSED') {
                closeBtn.textContent = 'Esta oferta está cerrada';
                closeBtn.disabled = true;
                closeBtn.style.background = '#ccc';
            } else {
                closeBtn.onclick = () => closeOffer(offerId, currentUserId);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar detalles de la tutoría.');
    }
}

async function closeOffer(offerId, currentUserId) {
    if (!confirm('¿Estás seguro de que deseas cerrar esta oferta de tutoría? Ya no aparecerá en el catálogo general.')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/tutoring/${offerId}/close`, {
            method: 'POST',
            headers: {
                'X-User-Id': currentUserId
            }
        });

        if (response.ok) {
            alert('Tutoría cerrada exitosamente.');
            window.location.reload();
        } else {
            alert('Error al cerrar la tutoría.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de red al intentar cerrar la tutoría.');
    }
}
