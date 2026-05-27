window.addEventListener('load', async () => {
    await Clerk.load();

    if (!Clerk.user) {
        window.location.href = '/signin.html';
        return;
    }

    loadTutoringOffers();
});

async function loadTutoringOffers() {
    try {
        const response = await fetch('http://localhost:8080/api/tutoring');
        if (!response.ok) {
            throw new Error('Error al obtener tutorías');
        }

        const offers = await response.json();
        const container = document.getElementById('tutoring-catalog');
        container.innerHTML = '';

        if (offers.length === 0) {
            container.innerHTML = '<p>No hay tutorías disponibles en este momento.</p>';
            return;
        }

        offers.forEach(offer => {
            const card = document.createElement('div');
            card.style.cssText = `
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                width: 300px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                background-color: white;
            `;

            card.innerHTML = `
                <h3 style="margin-top: 0; color: #6f42c1;">${offer.subject}</h3>
                <p style="color: #666; font-size: 0.9em;">
                    ${offer.description.substring(0, 100)}${offer.description.length > 100 ? '...' : ''}
                </p>
                <div style="font-size: 1.2em; font-weight: bold; margin: 10px 0; color: #28a745;">
                    $${offer.hourlyRate} / hora
                </div>
                <button 
                    onclick="window.location.href='/tutoring-details.html?id=${offer.id}'"
                    style="
                        background-color: #6f42c1;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 8px 15px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                    "
                >
                    Ver Detalles
                </button>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('tutoring-catalog').innerHTML = 
            '<p style="color: red;">Error al cargar las tutorías. Intente más tarde.</p>';
    }
}
